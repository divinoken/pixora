# 📸 Pixora — Feature & System Documentation

## 1. Project Overview

Pixora is a web-based photobooth application that uses the user's camera to provide a guided photo-taking experience.

The core experience is:

```text
Open Pixora
    ↓
Camera Permission
    ↓
Live Camera Preview
    ↓
Countdown
    ↓
Capture Photo
    ↓
Compliment / Feedback
    ↓
Review Photo
    ↓
Keep or Retake
    ↓
Photo Collection
    ↓
Download / Share
```

---

# 2. Core Features

## 2.1 Camera Access

Pixora requests permission to access the user's camera.

### Expected flow

```text
Open Pixora
    ↓
Request Camera Permission
    ↓
┌───────────────┐
│ Allow         │
│ Block         │
└───────────────┘
```

If the user allows access, Pixora continues to the live camera preview.

If access is denied, Pixora should display a message such as:

> Camera permission is required to use Pixora.

A **Try Again** button should allow the user to attempt the permission process again.

---

## 2.2 Live Camera Preview

After camera permission is granted, Pixora displays the webcam's live video feed.

```text
Webcam
   ↓
Media Stream
   ↓
<video>
   ↓
Live Preview
```

The user should be able to see themselves before taking the photo.

---

## 2.3 Countdown

Before capturing a photo, Pixora displays a countdown.

Example:

```text
5
↓
4
↓
3
↓
2
↓
1
↓
0
```

The countdown gives the user time to prepare for the photo.

### Current React responsibilities

`Countdown.jsx` is responsible for:

- Storing the countdown number
- Decreasing the number
- Detecting when the countdown reaches `0`
- Notifying the parent component when the countdown finishes

---

## 2.4 Automatic Photo Capture

When the countdown reaches `0`, Pixora should automatically capture the current camera frame.

```text
Countdown reaches 0
        ↓
Capture function
        ↓
Camera frame captured
        ↓
Photo created
```

The Countdown component should **not directly contain the camera logic**.

Instead:

```text
Countdown.jsx
      ↓
App.jsx
      ↓
Camera.jsx
```

This keeps each component focused on its own responsibility.

---

## 2.5 Compliment / User Feedback

After a photo is captured, Pixora can display a short compliment or encouraging message.

Possible messages:

- "Looking great! ✨"
- "Nice shot! 📸"
- "You nailed it! 🔥"
- "That one's a keeper! 😎"
- "Great pose! ✨"

These can eventually be randomized.

---

## 2.6 Photo Review

After capturing a photo, the user should be able to review it before deciding what to do.

Basic controls:

```text
        Photo
          ↓
   ┌──────┴──────┐
   ↓             ↓
  ✅             🔄
 Keep          Retake
```

### Keep

Accepts the current photo.

### Retake

Discards or replaces the current photo and starts another countdown.

---

## 2.7 Retake

When the user selects **Retake**:

```text
Retake
  ↓
Countdown
  ↓
5 → 4 → 3 → 2 → 1 → 0
  ↓
📸 New Photo
```

The same camera can be reused for another capture.

---

# 3. Multiple Photos

Pixora can eventually support multiple photos in a single session.

Example:

```text
Photo 1
   ↓
Review
   ↓
Photo 2
   ↓
Review
   ↓
Photo 3
   ↓
Review
```

This enables a photobooth-style session.

---

# 4. Photo Collection / Session

After multiple photos have been taken, Pixora can display them as a collection.

Example:

```text
Pixora Session

┌──────┐  ┌──────┐  ┌──────┐
│ 📸 1 │  │ 📸 2 │  │ 📸 3 │
└──────┘  └──────┘  └──────┘
```

The session represents the photos taken during the current photobooth experience.

---

# 5. Save / Download

Pixora should eventually allow the user to save the selected photo to their device.

Example:

```text
[ Download Photo ]
```

A future implementation can also allow downloading an entire photo layout or collage.

---

# 6. Photo Editing

Photo editing is a future feature.

Potential tools:

- Filters
- Brightness
- Contrast
- Crop
- Rotate

Possible flow:

```text
Captured Photo
      ↓
   Editing
      ↓
┌─────────────────┐
│ Filter          │
│ Brightness      │
│ Contrast        │
│ Crop            │
│ Rotate          │
└─────────────────┘
```

---

# 7. Photo Layout / Collage

Pixora can eventually combine multiple photos into a single photobooth layout.

### Vertical layout

```text
┌───────────────┐
│    PHOTO 1    │
├───────────────┤
│    PHOTO 2    │
├───────────────┤
│    PHOTO 3    │
└───────────────┘
```

### Grid layout

```text
┌─────────┬─────────┐
│ PHOTO 1 │ PHOTO 2 │
├─────────┼─────────┤
│ PHOTO 3 │ PHOTO 4 │
└─────────┴─────────┘
```

This can eventually become one of Pixora's main photobooth features.

---

# 8. Sharing

A future version can provide ways to share the final photo or collage.

Possible destinations can include:

- Device sharing
- Social media
- Messaging applications

Sharing should be considered after the core camera and photo workflow is stable.

---

# 9. Application Architecture

The current component structure is:

```text
App.jsx
│
├── Camera.jsx
│
└── Countdown.jsx
```

A possible future structure:

```text
src/
│
├── App.jsx
│
├── components/
│   │
│   ├── Camera/
│   │   └── Camera.jsx
│   │
│   ├── Countdown/
│   │   └── Countdown.jsx
│   │
│   ├── PhotoReview/
│   │   └── PhotoReview.jsx
│   │
│   ├── PhotoGallery/
│   │   └── PhotoGallery.jsx
│   │
│   └── PhotoEditor/
│       └── PhotoEditor.jsx
│
└── ...
```

The exact directory structure can evolve as the application grows.

---

# 10. Component Responsibilities

## App.jsx

Main coordinator of the application.

Responsibilities:

- Render major components
- Connect components
- Manage high-level application flow
- Pass functions/data between components when necessary

---

## Camera.jsx

Responsible for camera-related functionality.

Responsibilities:

- Request camera access
- Handle camera permission
- Start camera stream
- Display live video
- Capture image
- Handle camera-related errors

---

## Countdown.jsx

Responsible only for countdown functionality.

Responsibilities:

- Store countdown state
- Decrease countdown
- Stop at `0`
- Notify the parent when countdown finishes

The Countdown component should not directly control the camera.

---

# 11. Component Communication

Pixora uses the parent component to coordinate communication.

Example:

```text
                    App.jsx
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
        Countdown.jsx       Camera.jsx
             │                   │
             │                   │
       Countdown logic      Camera logic
             │
             ↓
       Countdown reaches 0
             │
             ↓
        onComplete()
             │
             ↓
           App.jsx
             │
             ↓
       Camera captures
```

This avoids tightly coupling the Countdown and Camera components.

---

# 12. Current Countdown Communication

The parent can create a function:

```jsx
function handleCountdownComplete() {
  console.log("Countdown finished!");
}
```

Then pass it to Countdown:

```jsx
<Countdown onComplete={handleCountdownComplete} />
```

Countdown receives the function:

```jsx
function Countdown({ onComplete }) {
```

When the countdown reaches `0`:

```jsx
onComplete();
```

The communication becomes:

```text
Countdown
    ↓
onComplete()
    ↓
App.jsx
    ↓
handleCountdownComplete()
```

This communication has already been successfully tested.

---

# 13. Development Phases

## Phase 1 — Camera

- [x] Camera component
- [x] Camera permission request
- [x] Live camera preview
- [x] Permission-denied handling
- [x] Try Again flow

---

## Phase 2 — Countdown & Capture

- [x] Countdown component
- [x] Countdown state
- [x] Countdown interval
- [x] Countdown completion communication
- [ ] Stop countdown at `0`
- [ ] Connect countdown completion to camera
- [ ] Capture photo automatically

---

## Phase 3 — Photo Review

- [ ] Display captured photo
- [ ] Keep button
- [ ] Retake button
- [ ] Compliment / feedback
- [ ] Restart countdown after retake

---

## Phase 4 — Photobooth Session

- [ ] Multiple photos
- [ ] Session state
- [ ] Photo collection
- [ ] Select photos
- [ ] Remove/retry photos

---

## Phase 5 — Final Output

- [ ] Photo layouts
- [ ] Collage generation
- [ ] Basic editing
- [ ] Filters
- [ ] Download
- [ ] Sharing

---

# 14. Full Pixora User Flow

```text
                    PIXORA
                       │
                       ↓
                 Open Application
                       │
                       ↓
              Camera Permission
                 /           \
              Deny           Allow
               │               │
               ↓               ↓
          Try Again       Live Preview
                               │
                               ↓
                           Countdown
                               │
                     5 → 4 → 3 → 2 → 1
                               │
                               ↓
                          📸 Capture
                               │
                               ↓
                          Compliment
                               │
                               ↓
                         Review Photo
                         /          \
                    Retake          Keep
                       │              │
                       ↓              ↓
                   Countdown      Save Photo
                       │              │
                       │              ↓
                       │        Photo Collection
                       │              │
                       └──────→ More Photos
                                      │
                                      ↓
                                Final Session
                                      │
                                      ↓
                              Layout / Collage
                                      │
                                      ↓
                              Download / Share
```

---

# 15. Development Principles

Pixora should follow these principles as development continues:

### Separation of Concerns

Each component should have a clear responsibility.

```text
Camera → Camera
Countdown → Countdown
Review → Review
Gallery → Gallery
```

### Reusability

Components should be designed so they can be reused when possible.

### Maintainability

Keep related logic together and avoid putting the entire application into one component.

### Gradual Development

Build and test one feature at a time instead of implementing the entire system simultaneously.

### User Feedback

The application should clearly communicate:

- Camera permission status
- Camera errors
- Countdown state
- Photo capture
- Photo review state
- Successful actions

---

# 16. Current Development Checkpoint

Pixora has currently reached the following point:

```text
Camera
   ↓
Permission
   ↓
Live Preview
   ↓
Countdown
   ↓
Countdown reaches 0
   ↓
App.jsx receives completion event
   ↓
[ NEXT ]
   ↓
Stop timer at 0
   ↓
Trigger camera capture
```

The **next development task** is therefore:

> Make the countdown stop at `0`, then connect the completed countdown to the camera capture function.

---

# 17. Technology Stack

The current project is being developed using:

- React
- JavaScript
- JSX
- Vite
- Browser Media APIs
- React Hooks

Important React Hooks currently used:

```text
useState
useEffect
useRef
```

Important JavaScript/browser concepts currently used:

```text
functions
arrow functions
callbacks
scope
setInterval
clearInterval
objects
destructuring
browser camera APIs
```

---

# 18. Long-Term Pixora Vision

The goal is to develop Pixora into a complete browser-based photobooth experience:

```text
Camera
   ↓
Countdown
   ↓
Capture
   ↓
Compliment
   ↓
Review
   ↓
Retake / Keep
   ↓
Multiple Photos
   ↓
Photo Layout
   ↓
Editing
   ↓
Final Photo
   ↓
Download / Share
```

The system should remain modular so new features can be added without making the existing Camera or Countdown components unnecessarily complicated.
