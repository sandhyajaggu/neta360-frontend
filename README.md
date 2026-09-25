# Neta360 – Frontend

Marketing website for **Neta360 – Political CRM & Constituency Intelligence**, built with React + Vite.
The whole site works in **Telugu (default) and English**.

## Run locally

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Build for production:

```bash
npm run build      # output goes to dist/
npm run preview    # test the production build locally
```

Requires Node.js 18 or newer.

## Project structure

```
neta360-frontend/
├── index.html                    # page shell, fonts, favicon
├── public/favicon.png
├── src/
│   ├── main.jsx                  # entry point
│   ├── App.jsx                   # page layout, modal + toast state
│   ├── assets/                   # logo-mark.png, logo-word.png, hero-leader.jpg
│   ├── i18n/
│   │   ├── LanguageContext.jsx   # language state + t() helper (saved in localStorage)
│   │   ├── te.json               # all Telugu text
│   │   └── en.json               # all English text
│   ├── components/
│   │   ├── Header.jsx            # logo, menu, language toggle, login, demo button
│   │   ├── Hero.jsx              # headline, tags, leader photo, feature cards
│   │   ├── Modules.jsx           # 7 module cards
│   │   ├── preview/
│   │   │   ├── ProductPreview.jsx
│   │   │   ├── LaptopDashboard.jsx
│   │   │   ├── PhoneApp.jsx
│   │   │   └── Benefits.jsx
│   │   ├── WhoAndStats.jsx       # "who can use it" + trust numbers
│   │   ├── CtaBanner.jsx         # green banner with crowds
│   │   ├── Crowd.jsx             # crowd silhouettes with flags
│   │   ├── Footer.jsx            # contact details + social links
│   │   ├── DemoModal.jsx         # "Book a demo" form with validation
│   │   ├── Toast.jsx
│   │   ├── Icon.jsx, FooterIcons.jsx, Brand.jsx, Html.jsx
│   ├── services/api.js           # sends demo requests to the backend
│   ├── utils/crowd.js            # draws the crowd SVG
│   └── styles/global.css         # all styles (colours as CSS variables at the top)
```

## Common changes

- **Edit any text:** change the same key in both `src/i18n/te.json` and `src/i18n/en.json`.
- **Change the hero photo:** replace `src/assets/hero-leader.jpg` (keep the leader on the right; about 1000 × 976 px or larger).
- **Change the logo:** replace `src/assets/logo-mark.png` and `src/assets/logo-word.png` (transparent PNGs), and `public/favicon.png`.
- **Change contact details:** edit `CONTACT` at the top of `src/components/Footer.jsx`.
- **Change colours:** edit the CSS variables in `:root` at the top of `src/styles/global.css`.
- **Dashboard sample numbers:** edit the arrays at the top of `LaptopDashboard.jsx` and `PhoneApp.jsx`.

## Connect the demo form to the backend

1. Copy `.env.example` to `.env` and set your API address:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
2. The form sends `POST {VITE_API_URL}/demo-requests` with JSON:
   ```json
   { "name": "Ravi", "phone": "9876543210", "constituency": "Kandukur", "role": "MLA / MP", "language": "te" }
   ```
3. Allow the website's domain in your backend's CORS settings.

Without `VITE_API_URL` the form still validates and shows the success message, so the site works as a demo.

## Deploy

**Netlify:** connect the repository; `netlify.toml` already sets the build command (`npm run build`) and publish folder (`dist`). Add `VITE_API_URL` under Site settings → Environment variables.

**Any static host / VPS:** run `npm run build` and upload the `dist/` folder.
