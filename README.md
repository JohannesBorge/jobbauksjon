# Reverse Job Auction App

A prototype for a reverse job auction application where individuals bid to complete tasks for the lowest possible price.

## Features

- Real-time bid list with user profiles and bid amounts
- Bid submission form
- Admin panel for accepting bids
- Simulated real-time bidding competition

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd jobbauksjon
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy your application

## Project Structure

- `src/app/page.tsx` - Main application page
- `src/components/` - Reusable components
  - `BidList.tsx` - Displays the list of bids
  - `BidForm.tsx` - Form for submitting new bids
- `src/types/` - TypeScript type definitions
- `src/data/` - Mock data and utilities

## License

MIT
