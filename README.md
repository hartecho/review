# Subsource Review Platform

**Live demo:** https://subsource.vercel.app/

## Overview

Subsource is a centralized review platform where users can discover, rate, and review commercial contractors and related businesses. It leverages Nuxt 3’s server‑side rendering for top‑tier performance and SEO, structured JSON‑LD metadata, secure Google login for frictionless authentication, and a built‑in blog for company news and insights. Administrators have access to dashboards for creating and editing blog posts, managing user profiles, moderating reviews, and updating business listings.

## Tech Stack

- **Frontend:**  
    - Nuxt 3 (Vue 3 w/ SSR)  
    - Pinia (state management)  
    - @nuxt/image (optimized images)  
    - @nuxtjs/google‑fonts  
- **Authentication & Security:**  
    - nuxt‑vue3‑google‑signin (Google OAuth)  
    - google‑auth‑library  
    - jsonwebtoken & bcrypt (JWT‑based sessions)  
    - vue‑recaptcha‑v3 (reCAPTCHA v3 anti‑spam)  
- **Backend & API:**  
    - Node.js & Nuxt Server Routes  
    - Mongoose & MongoDB Atlas  
- **DevOps & Deployment:**  
    - Vercel (CI/CD pipeline)  
    - GitHub (version control)  

## Key Features

- **Server‑side rendering** for fast load times and SEO  
- **Modular, auto‑imported components**  
- **JSON‑LD structured metadata** for rich search snippets  
- **WCAG‑compliant responsive design**  
- **Google OAuth login**  
- **JWT‑secured API routes**  
- **User reviews & ratings** with interactive charts  
- **reCAPTCHA v3** to block spam  
- **Blog** section with markdown‑based posts and SEO metadata  
- **Admin dashboards** to:  
    - Create, edit, and delete blog posts  
    - Manage user profiles and permissions  
    - Moderate and respond to reviews  
    - Update business information and listings  
- **Auto‑deploy** on push to `main`  

## Getting Started

### Prerequisites

- Node.js v16 or higher  
- npm, yarn, or pnpm  
- MongoDB Atlas account  
- Google OAuth credentials  
- reCAPTCHA v3 site key  

### Installation & Running Locally

    git clone https://github.com/hartecho/subsource.git
    cd subsource
    npm install

Create a `.env` file in the project root with:

    DB_URI=your_mongodb_connection_string
    GOOGLE_CLIENT_ID=your_google_oauth_client_id
    GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
    JWT_SECRET=your_jwt_secret
    RECAPTCHA_SITE_KEY=your_recaptcha_site_key
    RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

Start the development server:

    npm run dev

### Build & Production

    npm run build
    npm run start

## Deployment

This repository is linked to Vercel. Any push to `main` triggers the CI/CD pipeline and publishes the latest version at https://subsource.vercel.app/.

## License

© 2025 HARTECHO LLC. All rights reserved.

## Contact

Thomas Hart  
Email: thomas@hartecho.com  
