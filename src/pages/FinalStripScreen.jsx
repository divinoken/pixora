function FinalStripScreen({ shots, onBackToGallery, onRetakeLast, onRetakeAll }) {
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const drawSpacedText = (context, text, centerX, y, spacing) => {
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
  };

  const handleDownloadPng = async () => {
    const stripWidth = 300;
    const padding = 20;
    const imageWidth = stripWidth - padding * 2;
    const imageHeight = Math.round((imageWidth * 3) / 4);
    const captionHeight = 26;
    const spacing = 14;
    const rowHeight = imageHeight + captionHeight + spacing;
    const footerHeight = 44;

    const canvas = document.createElement('canvas');
    canvas.width = stripWidth;
    canvas.height = padding * 2 + shots.length * rowHeight + footerHeight;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    try {
      const images = await Promise.all(shots.map((shot) => loadImage(shot.src)));

      images.forEach((img, index) => {
        const y = padding + index * rowHeight;

        context.fillStyle = '#f5f3ee';
        context.fillRect(padding - 6, y - 6, imageWidth + 12, imageHeight + 12);
        context.drawImage(img, padding, y, imageWidth, imageHeight);

        context.fillStyle = '#7a7468';
        context.font = '11px monospace';
        context.textAlign = 'center';
        context.fillText(String(index + 1).padStart(2, '0'), stripWidth / 2, y + imageHeight + 18);
      });

      const footerY = padding + shots.length * rowHeight;
      context.strokeStyle = '#c4beb0';
      context.lineWidth = 1;
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(padding, footerY);
      context.lineTo(stripWidth - padding, footerY);
      context.stroke();
      context.setLineDash([]);

      context.fillStyle = '#5b564c';
      context.font = 'bold 12px monospace';
      drawSpacedText(context, 'PIXORA', stripWidth / 2, footerY + 26, 2.5);

      const link = document.createElement('a');
      link.download = 'pixora-strip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate strip image:', error);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340..600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .pxr-sprockets {
          display: flex;
          justify-content: space-between;
          padding: 0 24px;
        }
        .pxr-sprockets span {
          width: 6px;
          height: 10px;
          border-radius: 2px;
          background: #D8D3C7;
        }

        .pxr-strip {
          background: #FFFFFF;
          padding: 12px;
          box-shadow: 0 20px 44px rgba(23, 19, 16, 0.16);
          border-radius: 2px;
          width: min(300px, 76vw);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pxr-strip-frame {
          background: #f5f3ee;
          padding: 10px 10px 8px;
        }
        .pxr-strip-frame img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          background: #EDEAE3;
        }
        .pxr-strip-caption {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #7A7468;
          text-align: center;
          margin: 6px 0 0;
        }
        .pxr-strip-footer {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 500;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: #5B564C;
          text-align: center;
          margin: 2px 0 0;
          padding-top: 10px;
          border-top: 1px dashed #C4BEB0;
        }

        .pxr-btn-primary {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          padding: 13px 28px;
          border-radius: 999px;
          border: none;
          background: #171310;
          color: #FFFFFF;
          cursor: pointer;
          transition: background 160ms ease, transform 160ms ease;
        }
        .pxr-btn-primary:hover {
          background: #2B241D;
        }
        .pxr-btn-primary:active {
          transform: scale(0.97);
        }
        .pxr-btn-primary:focus-visible {
          outline: 2px solid #D6472C;
          outline-offset: 2px;
        }

        .pxr-btn-secondary {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          padding: 13px 28px;
          border-radius: 999px;
          border: 1px solid #D8D3C7;
          background: #FFFFFF;
          color: #171310;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
        }
        .pxr-btn-secondary:hover {
          border-color: #171310;
        }
        .pxr-btn-secondary:active {
          transform: scale(0.97);
        }
      `}</style>

      <div className="pxr-sprockets" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={`t-${i}`} />
        ))}
      </div>

      <div style={styles.corners}>
        <span style={styles.brandMark}>PIXORA</span>
        <span style={styles.exif}>STRIP OF {shots.length}</span>
      </div>
      <div style={styles.divider} />

      <main style={styles.content}>
        <span style={styles.eyebrow}>FINAL PREVIEW</span>
        <h2 style={styles.title}>Your Pixora strip</h2>

        <div className="pxr-strip">
          {shots.map((shot, index) => (
            <div key={shot.id} className="pxr-strip-frame">
              <img src={shot.src} alt={`Final shot ${index + 1}`} />
              <p className="pxr-strip-caption">
                {String(index + 1).padStart(2, '0')}
              </p>
            </div>
          ))}
          <p className="pxr-strip-footer">PIXORA</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" className="pxr-btn-secondary" onClick={onBackToGallery}>
            Back to gallery
          </button>
          <button type="button" className="pxr-btn-secondary" onClick={onRetakeLast}>
            Retake last
          </button>
          <button type="button" className="pxr-btn-secondary" onClick={onRetakeAll}>
            Retake all
          </button>
          <button type="button" className="pxr-btn-primary" onClick={handleDownloadPng}>
            Download PNG
          </button>
        </div>
      </main>

      <div className="pxr-sprockets" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={`b-${i}`} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '28px 0',
    boxSizing: 'border-box',
  },
  corners: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 28px 16px',
  },
  divider: {
    height: 1,
    background: '#ECE9E1',
    margin: '0 28px',
  },
  brandMark: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: '0.14em',
    color: '#171310',
  },
  exif: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.08em',
    color: '#9A9488',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 24px 8px',
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.16em',
    color: '#D6472C',
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontOpticalSizing: 'auto',
    fontWeight: 480,
    fontSize: 'clamp(26px, 4vw, 36px)',
    color: '#171310',
    margin: '0 0 24px',
  },
};

export default FinalStripScreen;