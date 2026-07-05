# Stock Watchlists
<table>
  <tr>
    <td><img width="100%" alt="Screenshot 1" src="https://github.com/user-attachments/assets/66ea7ee5-2bd3-4777-86f7-552f3ed276c1" /></td>
    <td><img width="100%" alt="Screenshot 2" src="https://github.com/user-attachments/assets/76f98e1f-a054-4cbd-a346-931504bd2745" /></td>
  </tr>
  <tr>
    <td><img width="100%" alt="Screenshot 3" src="https://github.com/user-attachments/assets/c11c69dd-090c-4088-a1ab-ac4dab801237" /></td>
    <td><img width="100%" alt="Screenshot 4" src="https://github.com/user-attachments/assets/587b3d05-c0da-4300-babe-75b0bc2caa5d" /></td>
  </tr>
</table>


This is a frontend app for building stock watchlists and reviewing key indicators and historical data for each symbol.  
Users sign in with Google, then manage their watchlists and open detailed stock analytics views.

## Overview

The app is designed to help users organize symbols they care about and review market/fundamental information in one place.

- Create, select, and delete watchlists
- Search stocks and add them to a list
- Compare stocks in a table view
- Open stock detail modals with multiple charts

Routing is controlled by authentication state:

- `/login`: Login page
- `/home`: Main app page after login
- `/`: Redirects to `/login` or `/home` based on token existence

## Features

- Google OAuth login
- Logout
- Multiple watchlist management
- Stock search, add, and remove operations
- Stock detail modal tabs:
  - Basic indicators
  - Price history chart
  - Dividend chart
  - Cashflow chart
  - Performance chart

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: React 19, styled-components
- Chart: Recharts
- HTTP Client: axios
- Auth: OAuth
- Lint: ESLint

## Prerequisites

- Node.js 18 or later (recommended)
- npm

## Environment Variables

Create a `.env.local` file in the project root and configure the following values:

```bash
NEXT_PUBLIC_ENDPOINT_BASE=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

- `NEXT_PUBLIC_ENDPOINT_BASE`: Base URL of the backend API
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID

## Run Locally

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open in your browser

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Project Structure (Main Parts)

```text
app/
  home/page.tsx                # Main page after login
  login/page.tsx               # Login page
  page.tsx                     # Redirect by auth state
  components/
    templates/
      LoginTemplate.tsx
      StockListTemplate.tsx
    organisms/
      Header.tsx
      stock-modal/
        StockDetailModal.tsx
        StockPriceChart.tsx
        StockDividendChart.tsx
        StockCashflowChart.tsx
        StockPerformanceChart.tsx
  api-interface/
    stock.ts
    stockList.ts
  constants/
    endpointConstants.ts
  hooks/
    useGet.tsx
    usePost.tsx
    usePut.tsx
    useDelete.tsx
```
