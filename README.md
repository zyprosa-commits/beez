# Letterwood

A full-screen, character-led A–Z learning adventure. Pip is an original animated purple creature, and each letter has one continuous 12-chapter episode.

## Develop

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci --cache /workspace/.npm
npm run dev -- --port 5173
```

Build with `npm run build`; serve the production build with `npm run preview`.

## Episode flow

Meet the letter → say it → bubble hunt → coloring → tracing → movement → sorting → memory → growing chant collection → free drawing → review → Pip’s growth celebration. Completing all chapters advances to the next letter. Each episode suggests about 60 minutes of play, conversation, and creativity; this is recommended pacing, not enforced screen time or an hour of recorded animation.

Progress, completed chapters, pictures, drawing strokes, stars, and collected verses are saved under `pip-episodes-v1` in localStorage. No account or backend is needed. The pause screen offers voice muting and calmer movement. OS reduced-motion settings are respected.

## Character and audio

Pip has articulated 3D limbs, floppy ears, expressive eyes, a tooth, a growing collection of accessories, and hop, wave, and dance actions. A modeled 3D island provides the background. One shared renderer draws the character instances; an illustrated fallback appears if WebGL is unavailable.

There are 158 bundled neural speech clips with consistent pitch/tempo character processing. Actual audio amplitude drives mouth movement. There are no synthetic button tones or browser system voices. The chant collection adds a verse per letter and can play collected verses in order. These are spoken rhythmic chants, not professionally performed singing.

Voice generation is optional: `scripts/generate-voice.py` documents dependencies and model location. MP3s and the manifest are already included, so ordinary installs/builds need no voice model, API key, or backend. See `public/audio/VOICE-CREDITS.txt` for the public-domain LJ Speech model attribution. Google Fonts are optional; system fonts provide a fallback.
