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
