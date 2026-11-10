import { useState } from 'react';
import PhotoboothShell from '../components/PhotoboothShell';

const THEMES = [
  { id: 'classic', label: 'Classic', paper: '#FFFFFF', mat: '#F5F3EE', caption: '#7A7468', rule: '#C4BEB0', footer: '#5B564C', swatch: '#FFFFFF', imageFilter: 'none', exportFilter: 'none' },
  { id: 'noir', label: 'Noir', paper: '#171310', mat: '#2B241D', caption: '#A8A196', rule: '#5B564C', footer: '#F5F3EE', swatch: '#171310', imageFilter: 'grayscale(1) contrast(1.08)', exportFilter: 'noir' },
  { id: 'blush', label: 'Blush', paper: '#F9DDD8', mat: '#FDF1EE', caption: '#A9584A', rule: '#D9A79D', footer: '#8A3B2E', swatch: '#F4B8AE', imageFilter: 'none', exportFilter: 'none' },
  { id: 'film', label: 'Maroon', paper: '#762636', mat: '#F3E4DC', caption: '#762636', rule: '#C88A96', footer: '#FFFFFF', swatch: '#762636', imageFilter: 'none', exportFilter: 'none' },
  { id: 'sage', label: 'Sage', paper: '#DCE5D8', mat: '#F0F5EE', caption: '#5F7A5A', rule: '#A9BEA3', footer: '#3F5B3A', swatch: '#A9BEA3', imageFilter: 'none', exportFilter: 'none' },
];

const pad = (n) => String(n).padStart(2, '0');

const STRIP_LAYOUT = {
  width: 300,
  padding: 14,
  framePaddingTop: 6,
  framePaddingX: 6,
  rowGap: 10,
  captionPaddingTop: 5,
  captionPaddingBottom: 6,
  captionFontSize: 10,
  captionLineHeight: 12,
  footerMarginTop: 2,
  footerPaddingTop: 10,
  footerFontSize: 10,
  footerLineHeight: 12,
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function drawSpacedText(context, text, centerX, y, spacing) {
  const chars = text.split('');
  const widths = chars.map((ch) => context.measureText(ch).width);
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + spacing * (chars.length - 1);
  let x = centerX - totalWidth / 2;
  context.textAlign = 'left';
  chars.forEach((ch, i) => {
    context.fillText(ch, x, y);
    x += widths[i] + spacing;
  });
  context.textAlign = 'center';
}

function drawExportImage(context, img, source, destination, filter) {
  if (filter === 'none') {
    context.drawImage(
      img,
      source.x,
      source.y,
      source.width,
      source.height,
      destination.x,
      destination.y,
      destination.width,
      destination.height,
    );
    return;
  }

  const filteredCanvas = document.createElement('canvas');
  filteredCanvas.width = destination.width * 2;
  filteredCanvas.height = destination.height * 2;
  const filteredContext = filteredCanvas.getContext('2d', { willReadFrequently: true });

  if (!filteredContext) {
    throw new Error('Image filter processing is unavailable in this browser.');
  }

  filteredContext.drawImage(
    img,
    source.x,
    source.y,
    source.width,
    source.height,
    0,
    0,
    filteredCanvas.width,
    filteredCanvas.height,
  );

  const imageData = filteredContext.getImageData(
    0,
    0,
    filteredCanvas.width,
    filteredCanvas.height,
  );
  const contrastFactor = 1.08;

  for (let index = 0; index < imageData.data.length; index += 4) {
    const grayscale =
      imageData.data[index] * 0.299
      + imageData.data[index + 1] * 0.587
      + imageData.data[index + 2] * 0.114;
    const contrasted = Math.max(0, Math.min(255, (grayscale - 128) * contrastFactor + 128));
    imageData.data[index] = contrasted;
    imageData.data[index + 1] = contrasted;
    imageData.data[index + 2] = contrasted;
  }

  filteredContext.putImageData(imageData, 0, 0);
  context.drawImage(filteredCanvas, destination.x, destination.y, destination.width, destination.height);
}

function FinalStripScreen({ shots, onBackToGallery, onRetakeLast, onRetakeAll, onBrandClick }) {
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  const handleDownloadPng = async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);
    setExportError('');

    const scale = 2;
    const stripWidth = STRIP_LAYOUT.width;
    const padding = STRIP_LAYOUT.padding;
    const frameWidth = stripWidth - padding * 2;
    const imageWidth = frameWidth - STRIP_LAYOUT.framePaddingX * 2;
    const imageHeight = Math.round((imageWidth * 3) / 4);
    const frameHeight =
      STRIP_LAYOUT.framePaddingTop
      + imageHeight
      + STRIP_LAYOUT.captionPaddingTop
      + STRIP_LAYOUT.captionLineHeight
      + STRIP_LAYOUT.captionPaddingBottom;
    const rowHeight = frameHeight + STRIP_LAYOUT.rowGap;
    const footerHeight =
      STRIP_LAYOUT.footerMarginTop
      + STRIP_LAYOUT.footerPaddingTop
      + 1
      + STRIP_LAYOUT.footerLineHeight;
    const stripHeight =
      padding * 2
      + shots.length * frameHeight
      + shots.length * STRIP_LAYOUT.rowGap
      + footerHeight;

    const canvas = document.createElement('canvas');
    canvas.width = stripWidth * scale;
    canvas.height = stripHeight * scale;
    const context = canvas.getContext('2d');

    try {
      if (!context) {
        throw new Error('Canvas export is unavailable in this browser.');
      }

      context.scale(scale, scale);
      context.fillStyle = theme.paper;
      context.fillRect(0, 0, stripWidth, stripHeight);

      const images = await Promise.all(shots.map((shot) => loadImage(shot.src)));

      images.forEach((img, index) => {
        const frameY = padding + index * rowHeight;
        const imageX = padding + STRIP_LAYOUT.framePaddingX;
        const imageY = frameY + STRIP_LAYOUT.framePaddingTop;

        context.fillStyle = theme.mat;
        context.fillRect(padding, frameY, frameWidth, frameHeight);

        // Cover-fit each photo into the 4:3 slot.
        const sourceRatio = img.width / img.height;
        const slotRatio = imageWidth / imageHeight;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;
        if (sourceRatio > slotRatio) {
          sw = img.height * slotRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / slotRatio;
          sy = (img.height - sh) / 2;
        }
        drawExportImage(
          context,
          img,
          { x: sx, y: sy, width: sw, height: sh },
          { x: imageX, y: imageY, width: imageWidth, height: imageHeight },
          theme.exportFilter,
        );

        context.fillStyle = theme.caption;
        context.font = `${STRIP_LAYOUT.captionFontSize}px monospace`;
        context.textAlign = 'center';
        context.fillText(
          pad(index + 1),
          stripWidth / 2,
          imageY + imageHeight + STRIP_LAYOUT.captionPaddingTop + STRIP_LAYOUT.captionFontSize,
        );
      });

      const footerY = padding + shots.length * rowHeight + STRIP_LAYOUT.footerMarginTop;
      context.strokeStyle = theme.rule;
      context.lineWidth = 1;
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(padding, footerY);
      context.lineTo(stripWidth - padding, footerY);
      context.stroke();
      context.setLineDash([]);

      context.fillStyle = theme.footer;
      context.font = `500 ${STRIP_LAYOUT.footerFontSize}px monospace`;
      drawSpacedText(
        context,
        'PIXORA',
        stripWidth / 2,
        footerY + STRIP_LAYOUT.footerPaddingTop + 1 + STRIP_LAYOUT.footerFontSize,
        1.4,
      );

      const now = new Date();
      const dateStamp = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
      ].join('-');

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('The browser could not create the strip image.'));
          }
        }, 'image/png');
      });
      const filename = `pixora-strip-${dateStamp}.png`;
      const file = new File([blob], filename, { type: 'image/png' });
      const canShareFile = typeof navigator.share === 'function'
        && typeof navigator.canShare === 'function'
        && navigator.canShare({ files: [file] });

      if (canShareFile) {
        await navigator.share({
          files: [file],
          title: 'Pixora photo strip',
        });
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = objectUrl;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Failed to export strip image:', error);
        setExportError('Could not export the strip. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const stripVars = {
    '--n': shots.length,
    '--strip-padding': `${STRIP_LAYOUT.padding}px`,
    '--strip-frame-padding': `${STRIP_LAYOUT.framePaddingTop}px ${STRIP_LAYOUT.framePaddingX}px 0`,
    '--strip-gap': `${STRIP_LAYOUT.rowGap}px`,
    '--strip-caption-padding': `${STRIP_LAYOUT.captionPaddingTop}px 0 ${STRIP_LAYOUT.captionPaddingBottom}px`,
    '--strip-caption-font-size': `${STRIP_LAYOUT.captionFontSize}px`,
    '--strip-caption-line-height': `${STRIP_LAYOUT.captionLineHeight}px`,
    '--strip-footer-margin-top': `${STRIP_LAYOUT.footerMarginTop}px`,
    '--strip-footer-padding-top': `${STRIP_LAYOUT.footerPaddingTop}px`,
    '--strip-footer-font-size': `${STRIP_LAYOUT.footerFontSize}px`,
    '--strip-footer-line-height': `${STRIP_LAYOUT.footerLineHeight}px`,
    '--strip-paper': theme.paper,
    '--strip-mat': theme.mat,
    '--strip-caption': theme.caption,
    '--strip-rule': theme.rule,
    '--strip-footer': theme.footer,
  };

  return (
    <PhotoboothShell readout={`STRIP OF ${shots.length}`} onBrandClick={onBrandClick}>
      <div className="pxr-stage">
        <div className="pxr-strip" style={stripVars}>
          {shots.map((shot, index) => (
            <figure key={shot.id} className="pxr-strip-frame">
              <img
                src={shot.src}
                alt={`Final shot ${index + 1}`}
                style={{ filter: theme.imageFilter }}
              />
              <figcaption className="pxr-strip-caption">{pad(index + 1)}</figcaption>
            </figure>
          ))}
          <p className="pxr-strip-footer">PIXORA</p>
        </div>

        <div className="pxr-panel">
          <div className="pxr-heading">
            <span className="pxr-eyebrow">Final preview</span>
            <h1 className="pxr-title">Your Pixora strip</h1>
          </div>

          <div className="pxr-heading">
            <div className="pxr-swatches" role="radiogroup" aria-label="Strip theme">
              {THEMES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={option.id === themeId}
                  aria-label={`${option.label} theme`}
                  title={option.label}
                  className="pxr-swatch"
                  style={{ background: option.swatch }}
                  onClick={() => setThemeId(option.id)}
                />
              ))}
            </div>
            <p className="pxr-note">Theme · {theme.label}</p>
          </div>

          <div className="pxr-stack">
            <button
              type="button"
              className="pxr-btn pxr-btn--primary"
              onClick={handleDownloadPng}
              disabled={isExporting}
            >
              {isExporting ? 'Preparing strip…' : 'Save strip'}
            </button>
            {exportError && <p className="pxr-error" role="alert">{exportError}</p>}
            <button type="button" className="pxr-btn pxr-btn--ghost" onClick={onBackToGallery}>
              Back to shots
            </button>
            <button type="button" className="pxr-btn pxr-btn--ghost" onClick={onRetakeLast}>
              Retake last
            </button>
            <button type="button" className="pxr-btn pxr-btn--ghost" onClick={onRetakeAll}>
              Retake all
            </button>
          </div>
        </div>
      </div>
    </PhotoboothShell>
  );
}

export default FinalStripScreen;