# TCGTracker

A modern web application for tracking your Pokémon trading card collection, monitoring live prices, and discovering card values in real-time.

## Hosted Access

https://tcg-tracker-vert.vercel.app/

## Features

- **Collection Management** - Add, organize, and track cards in your personal collection with condition and variant details
- **Live Price Tracking** - Monitor real-time card prices from multiple marketplaces
- **Price Alerts** - Set custom price alerts to get notified when cards reach your target price
- **Trending Cards** - Discover which cards are gaining the most value this week
- **Card Search** - Browse the entire Pokémon TCG database by set and individual cards
- **Dashboard** - View collection statistics, portfolio value, and recent activity
- **User Authentication** - Secure login and profile management powered by Clerk

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Clerk
- **External APIs**: 
  - TCGdex for card data
  - Cardmarket for pricing data
- **Animations**: Framer Motion
- **UI Libraries**: Next.js, React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tcgtracker.git
   cd tcgtracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/tcgtracker
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed  # If seed file exists
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tcgtracker/
├── app/                 # Next.js app directory
│   ├── (dashboard)/    # Protected dashboard routes
│   ├── actions/        # Server actions for data operations
│   ├── api/            # API routes
│   └── sign-in/        # Authentication pages
├── components/         # Reusable React components
│   ├── cards/         # Card-related components
│   ├── landing/       # Landing page components
│   ├── layout/        # Layout components (Header, Footer)
│   └── nav/           # Navigation components
├── lib/               # Utility functions and helpers
├── prisma/            # Database schema
├── public/            # Static assets
└── styles/            # Global styles
```

## Key Features

### Collection Management
- Add cards to your collection with condition and variant details
- Organize cards by set
- Track quantity of each card variant
- Add personal notes to cards

### Price Tracking
- Real-time price monitoring from Cardmarket
- View 7-day and 30-day price trends
- Historical price charts
- Support for multiple currencies (USD, EUR)

### Price Alerts
- Create alerts for specific cards
- Set target prices (above or below)
- Get notifications when prices change
- View alert history and manage active alerts

### Public Browsing
- Browse all Pokémon TCG sets without logging in
- View individual card details and images
- See trending cards and price changes
- Login required only for collection management


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TCGdex](https://tcgdex.net) for comprehensive Pokémon TCG data
- [Cardmarket](https://www.cardmarket.com) for pricing information
- [Clerk](https://clerk.com) for authentication
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Framer Motion](https://www.framer.com/motion) for animations


## Disclaimer

TCGTracker is an unofficial tool and is not affiliated with The Pokémon Company, Cardmarket, or any other official trading card game companies. All trademarks and logos are the property of their respective owners.
