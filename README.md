# Cats Through Time

A visually spectacular, emotionally compelling scrolling narrative website about humanity's 10,000-year relationship with cats — from ancient Egypt to the internet age.

## Live Demo

Visit the live site: [Cats Through Time](https://jackhacksman.github.io/cats-through-time/)

## Overview

This immersive single-page experience tells the story of cats and humans through eight distinct eras:

1. **Bastet & Ancient Egypt** — Cats as gods, temple cats, mummified cats, the cult of Bastet
2. **Roman Empire & Spread** — Cats travel with traders across Europe
3. **Medieval Dark Ages** — The persecution era and its tragic consequences
4. **Renaissance & Redemption** — Ship cats, farm cats, the pragmatic alliance
5. **Victorian Era** — The birth of cat fancy and first cat shows
6. **20th Century** — Cats in war and media (Felix, Tom, Garfield)
7. **The Internet Age** — LOLcats, Grumpy Cat, Nyan Cat
8. **Today & Forever** — 600 million domestic cats worldwide

## Features

- Parallax scrolling with smooth transitions between eras
- Scroll-triggered animations using Intersection Observer
- Cinematic typography with Google Fonts (Cinzel, Cormorant Garamond, Inter)
- Dark/moody color palette that transitions through eras
- Lazy-loaded images for optimal performance
- Mobile responsive design
- Optional ambient sound with mute button
- Keyboard navigation support (Arrow keys, Page Up/Down, Home/End)
- Progress bar showing scroll position
- Navigation dots for quick section access

## Tech Stack

- Pure HTML5, CSS3, and vanilla JavaScript
- No frameworks or build tools required
- Google Fonts for typography
- Images from Unsplash, Wikimedia Commons, and Pexels

## Project Structure

```
cats-through-time/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles including animations
├── js/
│   └── main.js         # JavaScript for interactivity
├── assets/             # Local assets (if any)
└── README.md           # This file
```

## Local Development

Simply open `index.html` in a modern web browser. No server required.

For the best experience, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then visit `http://localhost:8000`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML structure
- ARIA labels for navigation
- Keyboard navigation support
- Respects `prefers-reduced-motion` for users who prefer less animation
- High contrast mode support

## Image Credits

All images are sourced from free/open sources:
- [Unsplash](https://unsplash.com)
- [Wikimedia Commons](https://commons.wikimedia.org)
- [Pexels](https://www.pexels.com)

## License

This project is open source and available under the MIT License.

---

*Created with love for cats everywhere*
