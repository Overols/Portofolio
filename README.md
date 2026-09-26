# Muhammad Ridho Prakoso — Personal Portfolio

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Private-lightgrey)]()

> Personal portfolio of **Muhammad Ridho Prakoso** — Full-Stack Software Developer & AI Analyst.  
> Showcasing full-stack systems, applied machine learning, computer vision, and collaborative research projects.

---


## Tech Stack

| Category          | Technologies                                      |
|-------------------|---------------------------------------------------|
| Framework         | React 18, React Router                            |
| Build tool        | Vite 8                                            |
| Styling           | Tailwind CSS, Radix UI, class-variance-authority  |
| Animations        | Framer Motion, custom CSS transitions             |
| Icons             | Lucide React                                      |
| Forms             | Web3Forms (no backend required)                   |
| Other             | Three.js (available), React Query, Zod            |

---

## Project Structure

```
Portofolio/
├── public/
│   └── papers/                 # Research papers (PDFs)
├── src/
│   ├── assets/                 # Images, profile photo, certification images
│   ├── components/
│   │   ├── about/              # AboutMe, Stats, Certifications
│   │   ├── contact/            # Contact form
│   │   ├── portfolio/          # Project cards & filters
│   │   ├── skills/             # Skills grid
│   │   ├── ui/                 # Shared UI primitives
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── lib/
│   │   ├── projects.js         # Project data
│   │   ├── skills.js           # Skills data
│   │   ├── certifications.js   # Certification groups
│   │   └── utils.js
│   ├── pages/
│   │   └── Home.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

### Adding / Editing Content

| Content         | File                              |
|-----------------|-----------------------------------|
| Projects        | `src/lib/projects.js`             |
| Skills          | `src/lib/skills.js`               |
| Certifications  | `src/lib/certifications.js`       |
| Bio & stats     | `src/components/about/AboutMe.jsx` + `StatsRow.jsx` |
| Social links    | `Footer.jsx` & `ContactSection.jsx` |

Certification images are auto-loaded from `src/assets/certifications/`. Name files using the slug of the certificate title (e.g. `ai-fundamentals.jpg`).

---

## Selected Projects

| Project | Category | Highlights |
|---------|----------|------------|
| **SR-Exam** | Full-Stack | Exam scheduling & proctoring platform; QA + Scrum Master in PKM-KC research team |
| **Spec2Price** | Machine Learning | Ensemble (ExtraTrees) laptop price prediction — Test R² 0.9047 · [Live](https://spec2price.streamlit.app/) |
| **ASL Hand Gesture Recognition** | Computer Vision | HOG + LBP + Hu Moments + SVM · 98.79% accuracy · real-time webcam |
| **CheckShop** | Machine Learning | Sentiment analysis (BERT 94.4% macro F1) · [Live](https://checkshopapplications.streamlit.app/) |

Research papers are available under `/public/papers/`.

---

## Connect

- **LinkedIn**: [muhammadridhoprakoso](https://www.linkedin.com/in/muhammadridhoprakoso/)
- **GitHub**: [Overols](https://github.com/Overols)
- **Instagram**: [@_ridhoprakoso](https://www.instagram.com/_ridhoprakoso/)

---

## License

This repository is personal and currently private. Feel free to use it as inspiration, but please do not redistribute the content (bio, photos, papers, certificates) without permission.

---

**Built with React + Vite + Tailwind CSS**  
© 2026 Muhammad Ridho Prakoso