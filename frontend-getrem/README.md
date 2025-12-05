# GetRem Frontend

A React + TypeScript frontend application for the GetRem appointment reminder system.

## Features

- **Clients Management**: Create, read, update, and delete clients
- **Appointments Management**: Full CRUD operations for appointments
- **Calendar View**: Visual calendar with appointment scheduling
- **Treatments Management**: Track medical treatments
- **Payments Management**: Record and track payments

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Backend Connection

The frontend is configured to connect to the backend API running on `http://localhost:8080` via Vite proxy.

Make sure the backend is running before starting the frontend.

## Project Structure

```
src/
├── components/          # React components
│   ├── Clients/         # Client management components
│   ├── Appointments/    # Appointment management components
│   ├── Calendar/        # Calendar view component
│   ├── Treatments/     # Treatment management components
│   ├── Payments/        # Payment management components
│   └── Layout.tsx       # Main layout with navigation
├── services/            # API service layer
│   └── api.ts          # API client functions
├── types/               # TypeScript type definitions
│   └── index.ts        # All type definitions
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## Technologies Used

- React 19
- TypeScript
- React Router DOM
- Axios
- date-fns
- Vite
