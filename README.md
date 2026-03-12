# SuperteamMY Web

SuperteamMY is a Malaysian Web3 builder community operating within the Solana ecosystem.  
The platform showcases community members, projects, and initiatives built by Malaysian contributors who aim to expand the Solana ecosystem locally and globally.

- Vercel Link : SOON
- Figma Link : https://www.figma.com/design/vYwErAaCnYqLgRAy30qGRt/SUPERTEAM-MY-DESIGNS?t=pR5RTYLmiAGBWKmB-1

## Tech Stack

- Next.js  
- React  
- TypeScript  
- TailwindCSS  
- Supabase  

## Installation

1. Clone the repository:

```bash
git clone https://github.com/irfanfinfon-creator/superteammy-website.git
cd superteammy-website
```

2. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a .env file in the root directory (if not provided) and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_public_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Setup

SQL schemas are provided in the SUPABASESQLSCHEMA folder. Copy each SQL file into the Supabase SQL Editor to automatically create:
- Tables & Row Level Security policies
- Functions
- Triggers (Optional)

NOTE : Setup the database to avoid any complication in running on your local device


## Production Build

Build the project to make sure you there is no problem before start the project on your local device :

```bash
npm run build
```


## Local Development

1. Run the development server:

```bash
npm run dev
```

2. Open your browser at: http://localhost:3000


## Deployment
1. Push repository to GitHub.
2. Import the repository into Vercel.
3. Add environment variables in Vercel.
4. Deploy

---

## I am open for any feedback, inquiry or questions. If you facing any problem, issue or want to check out admin dashboard on Vercel Site, DM me on X : @Irfanfinfon.
