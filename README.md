# Letterwood

A playful alphabet learning app with Pip the fox, 26 letter lessons, spoken letter recognition, picture matching, achievement milestones, and local progress saving.

## Develop

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci --cache /workspace/.npm
npm run dev -- --port 5173
```

Build with `npm run build`; serve the production build with `npm run preview`.

Progress is stored in the current browser's localStorage. Spoken lessons use the browser's speech synthesis voices; availability varies by browser and operating system. Google Fonts are optional; system fonts provide a fallback. The app needs no API keys or backend.


## Character and interface

Pip is an articulated Three.js character with soft lighting, glossy eyes, blinking, breathing, tail movement, and speech-driven gestures. One shared WebGL renderer draws visible character instances to canvases. A fallback illustration is shown when WebGL is unavailable. Reduced-motion preferences are respected.

The floating navigation opens alphabet activities, listening games, and achievements. The missing-rainbow story includes three guided missions, spoken instructions, gentle retries, and saved completion.

Speech uses the best available English device voice, preferring natural voices when installed. Animation follows utterance start, word-boundary, pause, resume, end, and error events; mouth motion is stylized rather than phoneme-accurate lip sync. Sound can be muted, and closing an activity cancels its narration. Voice quality depends on the browser and installed voices; no remote voice service or credentials are required.
