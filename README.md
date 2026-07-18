# Умен дом · Smart home wiki

Практическо ръководство (wiki) за **Home Assistant OS + Shelly + глас на български**.

На български, с onboarding: избираш гласова стратегия (ATOM Echo / Voice PE / хибрид), дали ще тестваш първо (macOS / Windows / Linux или без тест), бюджет и брой стаи. Планът се наглася полу-динамично според избора.

## English

A small public wiki for a Bulgarian-voice smart home stack: permanent **Home Assistant OS** on a mini PC, Shelly relays, and either M5Stack ATOM Echo, Home Assistant Voice Preview Edition, or both. Optional VM-based test path before you buy the server.

**Safety:** 220 V wiring is for a qualified electrician only.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Deploy: Vercel + this repo.

## What you get

- **Onboarding** (first visit) → preferences in `localStorage`
- **Full plan** (`/`) — mini PC + HAOS + Shelly + your voice strategy
- **Test plan** (`/test`) — temporary HAOS VM on the OS you chose (or empty state if skipped)
- **Help** (`/help`) — longer articles with diagrams
- Checklists persist per plan; reopen onboarding via **Настройки**

## Diagrams

Illustrative SVGs in [`public/images/`](public/images/) are original to this project (architecture, devices, pipeline). Product names/links point to official vendors (Home Assistant, M5Stack, Shelly). Always verify current prices and stock on retailer pages.

## Stack

Next.js (App Router), React, localStorage checklists — no backend required.
