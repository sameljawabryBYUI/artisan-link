# ArtisanLink Copilot Instructions

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript / React
- Styling: Tailwind CSS
- Database: MongoDB
- Authentication: GitHub OAuth

## Core Data Models

- **User:** _id, githubId, name, role (buyer/artisan), avatarUrl
- **Product:** _id, artisanId, title, description, price, imageUrl
- **Order:** _id, buyerId, productId, status, createdAt

## Project Guidelines

- All shared UI components (Buttons, Inputs) should use Tailwind classes based on our design language document.
- Ensure all API routes protect artisan-only actions (like creating products) using our RoleGuard authentication.
