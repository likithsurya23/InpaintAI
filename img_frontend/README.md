# AI Image Inpainting - Simple & Clean

Remove unwanted objects from images using AI.

## 🚀 Quick Start

```bash
# Install
npm install

# Run
npm run dev

# Build
npm run build
```

## ⚙️ Setup

1. Copy `.env.example` to `.env`
2. Set your backend URL:
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📁 Simple Structure

```
src/
├── theme.js          ← Everything (theme + config)
├── api/              ← API calls
├── components/       ← UI components
└── pages/            ← Pages
```

## 🎨 Using Theme

```javascript
import { theme, config, messages } from './theme'

// Use theme
<div className={theme.bg.page}>
  <h1 className={theme.text.main}>Title</h1>
  <button className={theme.button.primary}>Click</button>
</div>

// Use config
const url = config.apiUrl
const max = config.maxFileSize

// Use messages
alert(messages.error.network)
```

## 🎨 Theme Classes

### Backgrounds
- `theme.bg.page` - Main page
- `theme.bg.card` - Cards
- `theme.bg.section` - Sections

### Text
- `theme.text.main` - Main text
- `theme.text.secondary` - Secondary text
- `theme.text.accent` - Blue accent

### Buttons
- `theme.button.primary` - Blue button
- `theme.button.secondary` - Outlined button

### Common
- `theme.card` - Card style
- `theme.input` - Input style
- `theme.border` - Border color

## 📝 Features

- ✅ AI-powered inpainting
- ✅ Dark/Light mode
- ✅ Simple & clean code
- ✅ Easy to customize

## 🎯 That's It!

Everything is in `/src/theme.js`. Simple and easy!

---

Made with ❤️ by Likith D
