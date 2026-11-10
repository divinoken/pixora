# Pixora — Feature & System Documentation

## 1. Product overview

Pixora is a browser-based photobooth experience. It guides users from a landing screen through camera capture, photo review, a multi-shot gallery, and a themed downloadable photo strip.

The current flow is:

```text
Landing page
    ↓
Start session
    ↓
Choose 1, 2, or 4 shots
    ↓
Live mirrored camera preview
    ↓
Five-second countdown
    ↓
Automatic photo capture
    ↓
Review photo
    ├── Retake
    └── Keep
    ↓
Session gallery
    ├── Select a saved shot
    ├── Take the next shot
    └── When full, view final strip
    ↓
Themed strip preview
    ↓
Download PNG
```

## 2. Current features

### 2.1 Landing page

The landing page provides:

- Pixora branding and camera-style metadata readout.
- A prominent Start button.
- A short description of the available session sizes: 1, 2, or 4 shots.
- A reduced-motion-aware flash transition before entering the camera screen.

Starting a session clears any previous captured photos and selection state.

### 2.2 Camera access and live preview

`src/components/camera/Camera.jsx` requests the user's camera with:

- `facingMode: 'user'` for the front-facing camera when supported.
- An ideal 1280 × 960 video size.
- `autoPlay`, `playsInline`, and `muted` video playback.

The preview:

- Uses a 4:3 viewfinder.
- Uses `object-fit: cover` to fill the viewfinder.
- Is horizontally mirrored for a natural selfie experience.
- Displays a short “Please look at the camera” hint when ready.
- Displays an unavailable-camera message when permission or browser support fails.

The camera stream is stopped during component cleanup.

### 2.3 Session shot selection

The camera screen displays the shot selector after the user starts from the landing page.

Allowed session sizes are exactly:

```text
1 shot
2 shots
4 shots
```

The allowed values are defined centrally in `src/App.jsx`. Invalid or stale values are normalized to 1 shot. The validated value controls:

- The camera readout.
- The maximum number of photos.
- The gallery progress message.
- Whether the session is full.
- When the final strip becomes available.

The selector becomes locked after the first countdown starts. Changing the selection before capture clears any photos and review state from the current session.

### 2.4 Countdown

`src/components/countdown/Countdown.jsx` owns countdown behavior:

- Starts at 5.
- Decrements once per second.
- Renders the active number.
- Renders a flash state at 0.
- Calls `onComplete` when the countdown reaches 0.
- Supports reset through `resetKey`.
- Uses `aria-live="assertive"` and `role="timer"`.

The countdown does not contain camera logic. `App.jsx` coordinates the countdown and camera through the completion callback.

### 2.5 Automatic capture

When the countdown completes:

1. `App.jsx` calls `Camera.capturePhoto()`.
2. The camera waits for usable video data.
3. The current video frame is center-cropped to 4:3.
4. The canvas is horizontally flipped to match the mirrored preview.
5. A JPEG data URL is returned.
6. Pixora opens the review screen.

The captured photo is kept in application state until the user keeps or retakes it.

### 2.6 Photo review

The review screen displays the captured photo with:

- Keep — adds the photo to the current session.
- Retake — discards the photo and returns to the camera countdown.

The removed Compliment / Feedback feature is not part of the current review experience.

### 2.7 Gallery and session management

After a photo is kept, the gallery provides:

- A large preview of the selected shot.
- A filmstrip of all captured shots.
- Clickable shot thumbnails.
- Selected-shot state and shot numbering.
- Session progress, such as `1 of 4 shots taken`.
- Next shot while the session is not full.
- See your strip when the selected number of shots is reached.

The gallery preserves the selected shot while the user reviews the session.

### 2.8 Retake controls

The final strip screen provides:

- Back to shots — return to the gallery.
- Retake last — remove the last saved photo and return to capture.
- Retake all — clear the session and return to capture.

The Pixora header brand is clickable from the camera, review, gallery, and final strip screens. It clears the current session and returns to the landing page.

### 2.9 Final strip preview

The final output screen creates a vertical photobooth strip from the session photos.

The strip:

- Uses a vertical layout with one 4:3 photo per row.
- Adds numbered photo captions.
- Adds a PIXORA footer.
- Keeps the selected photo order.
- Supports five visual themes:
  - Classic
  - Noir
  - Blush
  - Film maroon
  - Sage

Theme controls use radio semantics and update the preview immediately.

The Noir theme also applies a monochrome filter to photos in the final strip preview. The same filter is baked into the downloaded PNG using explicit canvas pixel processing for mobile browser compatibility; review previews, gallery shots, and stored photos remain unchanged.

### 2.10 Download

The final strip can be exported as a PNG using a canvas. Images are cover-fitted into the strip slots and rendered at 2× scale for improved output quality. The export mirrors the final preview's outer padding, image frame borders, row gaps, caption spacing, and footer placement. On mobile browsers that support file sharing, Save strip opens the native share sheet so the user can choose Photos/library; other browsers use the standard file download fallback.

Downloads use the local date in this format:

```text
pixora-strip-YYYY-MM-DD.png
```

For example:

```text
pixora-strip-2026-11-10.png
```

Duplicate filename behavior is left to the browser.

## 3. User flow details

### New session

```text
Landing
  ↓ Start
Camera screen
  ↓ Choose 1, 2, or 4
  ↓ Start
Countdown
  ↓
Review
```

### Keep a photo

```text
Review
  ↓ Keep
Gallery
  ├── Next shot, if the session is not full
  └── See your strip, if the session is full
```

### Retake a photo

```text
Review
  ↓ Retake
Camera screen
  ↓ Start
New countdown and capture
```

### Return home

```text
Any session screen
  ↓ Click PIXORA
Clear session state
  ↓
Landing page
```

## 4. Application architecture

```text
src/
├── App.jsx
├── components/
│   ├── PhotoboothShell.jsx
│   ├── camera/
│   │   └── Camera.jsx
│   └── countdown/
│       └── Countdown.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── CameraScreen.jsx
│   ├── ReviewScreen.jsx
│   ├── GalleryScreen.jsx
│   └── FinalStripScreen.jsx
└── index.css
```

### App.jsx

The application coordinator owns:

- Current screen state: landing, camera, review, gallery, or strip.
- Session-size validation.
- Countdown state and reset keys.
- Captured photo state.
- Saved shots and selected shot state.
- Session reset, retake, and navigation handlers.

### PhotoboothShell.jsx

The shared shell provides:

- Sprocket decorations.
- The Pixora header.
- Current screen readout.
- Shared page and main-content layout.
- Clickable Pixora home navigation.

### Camera.jsx

The camera component owns:

- Browser camera access.
- Stream lifecycle.
- Camera status.
- Live preview.
- Mirrored canvas capture.
- Camera error messaging.

### Countdown.jsx

The countdown component owns only countdown timing and completion notification.

### Page components

- `LandingPage.jsx` — entry point and session start.
- `CameraScreen.jsx` — shot selector, viewfinder, and countdown start.
- `ReviewScreen.jsx` — keep or retake decision.
- `GalleryScreen.jsx` — saved-shot collection and progress.
- `FinalStripScreen.jsx` — themes, strip preview, and PNG download.

## 5. State and communication

The capture communication path is:

```text
CameraScreen
    ↓ starts
Countdown
    ↓ onComplete
App.jsx
    ↓ capturePhoto()
Camera.jsx
    ↓ photo data URL
App.jsx
    ↓
ReviewScreen
```

The session path is:

```text
ReviewScreen
    ↓ Keep
App.jsx
    ↓ add shot
GalleryScreen
    ↓ session full
FinalStripScreen
```

## 6. Design system

Pixora uses a light editorial photobooth style with:

- Warm white paper surfaces.
- Deep ink typography.
- Deep maroon accent color: `#762636`.
- Warm blush photo-box color: `#f3e4dc`.
- Fraunces display typography.
- Inter body typography.
- IBM Plex Mono interface metadata.
- Rounded viewfinder and control surfaces.
- Film-inspired sprocket details and numbered frames.

The primary color tokens are defined in `src/index.css`. Final strip themes are defined in `src/pages/FinalStripScreen.jsx`.

## 7. Accessibility and resilience

Current accessibility behaviors include:

- Semantic buttons for all actions.
- Accessible labels for camera, shot thumbnails, theme controls, and Pixora home navigation.
- `aria-pressed` for selected gallery shots.
- Radio semantics for strip themes.
- `role="timer"` and `aria-live` for the countdown.
- Reduced-motion handling for the landing flash.
- Camera permission and unsupported-browser messaging.

Potential improvements include:

- Add a visible keyboard focus style for every interactive control.
- Add a dedicated retry button for camera permission recovery.
- Announce gallery progress and successful photo saves to assistive technology.
- Add automated accessibility checks.

## 8. Technology stack

- React
- JavaScript
- JSX
- Vite
- Browser Media Capture and Streams API
- Canvas API
- React Hooks
- ESLint
- Vitest configuration

Important browser APIs:

```text
navigator.mediaDevices.getUserMedia()
HTMLVideoElement
HTMLCanvasElement
CanvasRenderingContext2D
HTMLAnchorElement.download
```

## 9. Current implementation status

### Complete

- [x] Landing page and session start.
- [x] Camera permission request.
- [x] Camera stream cleanup.
- [x] Live camera preview.
- [x] Mirrored selfie preview.
- [x] Mirrored captured image.
- [x] Camera unavailable state.
- [x] Five-second countdown.
- [x] Automatic capture at countdown completion.
- [x] Photo review.
- [x] Keep and retake flow.
- [x] Validated 1, 2, and 4-shot sessions.
- [x] Session locking after countdown start.
- [x] Gallery and selected-shot preview.
- [x] Next-shot flow.
- [x] Retake last and retake all.
- [x] Final vertical strip generation.
- [x] Five strip themes.
- [x] PNG download.
- [x] Date-based download filename.
- [x] Clickable Pixora home navigation.
- [x] Maroon and blush visual palette.

### Known project validation notes

- Production builds pass.
- Targeted lint for changed components passes.
- The repository currently has no test files for Vitest to execute.
- Full lint still includes a pre-existing `react-hooks/set-state-in-effect` issue in `src/components/countdown/Countdown.jsx`.

## 10. Roadmap and future ideas

Future ideas are intentionally separate from the implemented feature list.

### Capture improvements

- Add a configurable countdown duration.
- Add a pause or cancel action during countdown.
- Add front/rear camera switching when multiple cameras are available.
- Add camera device selection.
- Add flash or shutter sound preferences.
- Add exposure and white-balance guidance where browser APIs allow it.

### Photo editing

- Filters with preview thumbnails.
- Brightness, contrast, saturation, and warmth controls.
- Crop and rotate tools.
- Undo and reset editing actions.
- Preserve the original capture while editing a derived copy.

### Layouts and export

- Horizontal and grid strip layouts.
- Custom spacing and border controls.
- Optional date, event, or custom text on the strip.
- JPEG and WebP export options.
- Print-friendly output dimensions.
- Share through the Web Share API when supported.

### Session experience

- Session history in browser storage.
- Restore an unfinished session after accidental refresh.
- Optional photo deletion from the gallery.
- Reorder photos before exporting.
- Custom session names.
- QR code download handoff for mobile devices.

### Product and platform

- Installable PWA support.
- Offline-friendly shell and asset caching.
- Analytics for capture completion and export success, with user consent.
- Optional cloud gallery storage with explicit privacy controls.
- Localization for interface text.
- Automated visual regression and accessibility testing.

## 11. Product principles

Pixora should continue to follow these principles:

### Keep responsibilities clear

Camera, countdown, session coordination, gallery, and export logic should remain independently understandable.

### Prefer validated state

User-facing limits such as shot counts should have one source of truth and be validated before they affect the flow.

### Preserve user control

Users should be able to retake, return home, restart a session, and choose a final visual theme without losing control of the current screen.

### Design for graceful failure

Permission failures, unavailable cameras, failed image loading, and unsupported browser features should produce clear messages instead of silent failure.

### Keep future features optional

Editing, sharing, cloud storage, and advanced camera controls should not complicate the core capture flow until they have a clear user benefit.
