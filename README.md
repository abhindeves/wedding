# Forever Captured - Wedding Photo Sharing App

This is a Next.js application designed to be a beautiful and private space for sharing photos from a wedding celebration. Guests can log in, view a gallery of photos from different events, upload their own pictures, and see the event schedule.

## Features

- **Guest Authentication**: A simple password-protected login system for guests.
- **Photo Gallery**: A beautiful, masonry-style grid to display all the event photos.
- **Filtering & Sorting**: Users can filter the gallery by who uploaded the photo and sort by the upload date.
- **Photo Upload**: An easy-to-use drag-and-drop interface for guests to upload their own photos.
- **Event Schedule**: A dedicated page displaying the schedule of all wedding-related events.
- **Responsive Design**: The application is fully responsive and works beautifully on desktops, tablets, and mobile devices.

## Tech Stack

- [Next.js](https://nextjs.org/) – React Framework
- [React](https://react.dev/) – UI Library
- [TypeScript](https://www.typescriptlang.org/) –- Language
- [Tailwind CSS](https://tailwindcss.com/) –- CSS Framework
- [ShadCN UI](https://ui.shadcn.com/) –- Component Library
- [Lucide React](https://lucide.dev/guide/packages/lucide-react) –- Icons
- [Genkit](https://firebase.google.com/docs/genkit) - AI Toolkit

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 20 or later) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1. **Install project dependencies:**
   Open your terminal in the project's root directory and run the following command to install all the necessary packages.

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   The project may use environment variables for configuration. If there is a `.env.local.example` file, copy it to a new file named `.env.local` and fill in the required values.

   ```bash
   cp .env.local.example .env.local
   ```

### Running the Development Server

Once the installation is complete, you can start the development server.

```bash
npm run dev
```

This will start the Next.js application in development mode with Turbopack. By default, it will be available at [http://localhost:9002](http://localhost:9002).

Open the URL in your web browser, and you should see the application running. The login password is `password123` as defined in `src/components/auth/login-form.tsx`.

## Available Scripts

In the `package.json` file, you will find several scripts for managing the application:

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the application in production mode (requires a build first).
- `npm run lint`: Lints the code to check for errors and style issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
- `npm run genkit:dev`: Starts the Genkit development server for AI flows.
- `npm run genkit:watch`: Starts the Genkit development server in watch mode.

Enjoy exploring and developing the application!
