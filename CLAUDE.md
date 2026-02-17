# UZEURO Website

## Project
Marketing website for UZEURO (European Union-related organization). Membership, events, publications, webinars, contact.

## Tech Stack
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + GSAP animations + Three.js (3D)
- **UI:** Radix UI components
- **Routing:** React Router v7
- **Forms:** React Hook Form + Zod
- **Backend:** Cloudflare Workers + D1 Database
- **Build:** Vite, deployed to Cloudflare

## Structure
- `src/pages/` — страницы (Home, About, Events, Membership, Publications, Webinars, Contact, Admin)
- `src/sections/` — модульные секции страниц
- `src/components/` — переиспользуемые компоненты (Header, Footer, UI)
- `src/services/` — API-клиент
- `api/` — бэкенд на Cloudflare Workers
- `api/migrations/` — SQL миграции для D1

## Commands
- `npm run dev` — запуск dev-сервера
- `npm run build` — сборка
