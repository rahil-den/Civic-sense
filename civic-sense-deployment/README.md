# 🌐 Civic Sense — Deployment Website

> The official landing page and showcase website for **[Civic Sense](https://github.com/rahil-den/Civic-sense)** — a community-driven civic issue reporting platform.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white)

---

## ✨ Overview

This is the **deployment / marketing website** for the Civic Sense platform. It showcases the mobile app, highlights the tech stack, introduces the team, and provides links to the GitHub repository. Built with a focus on smooth animations, modern design, and performance.

### Sections

| Section | Description |
|---------|-------------|
| **Hero** | Full-screen landing with animated headline, phone mockup preview, and interactive hover text |
| **App Showcase** | Interactive phone carousel with 4 live screens — Issue Reporting, Tech Stack, Real-time Updates, Community |
| **Team** | Scroll-triggered stacked cards showcasing each contributor with GitHub avatars and LinkedIn links |
| **Footer** | CTA, social links, and branding |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite 7** | Lightning-fast build tool |
| **Tailwind CSS 4** | Utility-first styling with `@theme` design tokens |
| **GSAP + ScrollTrigger** | Scroll-driven and entrance animations |
| **Lucide React** | Icon library (Chevrons, GitHub, LinkedIn) |
| **React Router DOM** | Client-side routing |

---

## 📁 Project Structure

```
civic-sense-deployment/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── hero-sky.jpg              # Hero background image
│   ├── components/
│   │   ├── Navbar.jsx                 # Fixed navbar with smooth scroll nav
│   │   ├── HeroSection.jsx            # Full-screen hero with phone mockup
│   │   ├── AppShowcase.jsx            # Phone carousel with 4 app screens
│   │   ├── AuthorsSection.jsx         # Stacked team cards with scroll animation
│   │   ├── FooterSection.jsx          # CTA + social links footer
│   │   └── NavLink.jsx                # React Router NavLink wrapper
│   ├── lib/
│   │   └── utils.js                   # cn() utility for class merging
│   ├── pages/
│   │   └── Index.jsx                  # Main page assembling all sections
│   ├── App.jsx                        # Router setup
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Tailwind v4 config + custom styles
├── vite.config.js                     # Vite config with @tailwindcss/vite plugin
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn**

### Installation

```bash
cd civic-sense-deployment
npm install
```

### Development

```bash
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement.

### Production Build

```bash
npm run build
npm run preview    # Preview the production build locally
```

---

## 🎨 Design Features

- **Smooth scroll navigation** — No hash changes in the URL
- **GSAP entrance animations** — Using `gsap.fromTo()` + `gsap.context()` for React StrictMode compatibility
- **Scroll-triggered team cards** — Stacked card effect with pinned scrolling
- **Phone mockup carousel** — Swipeable app screen previews with transition animations
- **Hidden scrollbar** — Clean, minimal UI without the default browser scrollbar
- **Responsive design** — Optimized for mobile, tablet, and desktop
- **CSS design tokens** — All colors defined via Tailwind v4 `@theme` block for easy theming

---

## 👥 Team

| Name | Role | Links |
|------|------|-------|
| **Rahil** | Project Lead & Web Designer | [GitHub](https://github.com/rahil-den) · [LinkedIn](https://www.linkedin.com/in/rahil-shaikh-b2b7652b5/) |
| **Talha** | Mobile Dev + Backend for Mobile | [GitHub](https://github.com/Talha201111) · [LinkedIn](https://www.linkedin.com/in/talha-bagban-80b85623a/) |
| **Iyan** | Backend Developer | [GitHub](https://github.com/iyan-devcore) · [LinkedIn](https://www.linkedin.com/in/iyan-dhanani-a24a003a3/) |
| **Kaif** | Backend + Web Dev | [GitHub](https://github.com/KaifCodes20) · [LinkedIn](https://www.linkedin.com/in/kaif-shaikh-a2799236a/) |

---

## 📄 License

This project is part of the [Civic Sense](https://github.com/rahil-den/Civic-sense) platform, licensed under the ISC License.

---

<p align="center">Made with ❤️ for smarter cities</p>
