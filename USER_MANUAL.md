
# Mannan Application User Manual

Welcome to the Mannan developer manual. This document provides a complete overview of the application's structure, making it easier for collaborators to understand and work with the codebase.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Auth)
- **Generative AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation

---

## Project Structure

The project follows a standard Next.js App Router structure. Here is a breakdown of the key directories and files:

```
.
├── src
│   ├── app
│   │   ├── (main)                # Main application pages with shared layout
│   │   │   ├── admin/page.tsx    # Admin dashboard for user management
│   │   │   ├── booking/page.tsx
│   │   │   ├── forum/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── resources/page.tsx
│   │   │   ├── layout.tsx        # Shared layout for the main app (sidebar, header)
│   │   │   └── page.tsx          # Main chat interface page
│   │   ├── actions.ts            # Next.js Server Actions
│   │   ├── globals.css           # Global styles and Tailwind directives
│   │   └── layout.tsx            # Root layout for the entire application
│   │
│   ├── ai
│   │   ├── flows/                # Directory for all Genkit AI flows
│   │   │   ├── generate-initial-response.ts # Main chat logic
│   │   │   └── triage-user-need.ts          # Crisis detection logic
│   │   ├── dev.ts                # Genkit development server entrypoint
│   │   └── genkit.ts             # Genkit configuration and initialization
│   │
│   ├── components
│   │   ├── ui/                   # Auto-generated ShadCN UI components
│   │   ├── chat-interface.tsx    # Core component for the chat UI
│   │   └── logo.tsx              # SVG logo component
│   │
│   ├── hooks
│   │   ├── use-mobile.tsx        # Hook for detecting mobile viewports
│   │   └── use-toast.ts          # Hook for showing toast notifications
│   │
│   └── lib
│       ├── firebase.ts           # Firebase SDK initialization and configuration
│       ├── placeholder-images.json # Data for placeholder images
│       ├── placeholder-images.ts   # Loader for placeholder image data
│       └── utils.ts              # Utility functions (e.g., `cn` for classnames)
│
├── .env                          # Environment variables (including Firebase keys)
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies and scripts
└── USER_MANUAL.md                # This file
```

---

## Detailed Breakdown

### `src/app/`

This directory contains all the routes and core layout of the application, following the Next.js App Router paradigm.

-   **`layout.tsx`**: The root layout that applies to all pages. It includes the `<html>` and `<body>` tags, global font settings, and the `Toaster` component for notifications.
-   **`(main)/`**: This is a route group that shares a common layout (`(main)/layout.tsx`).
    -   **`layout.tsx`**: Defines the main application shell, including the persistent sidebar navigation and the top header for mobile.
    -   **`page.tsx`**: The homepage of the app, which renders the `ChatInterface`.
    -   **`/admin/page.tsx`**: The admin dashboard for managing users and other application data.
    -   **Other pages (`/booking`, `/forum`, etc.)**: Each folder represents a new page in the application, with `page.tsx` as its entry point.
-   **`actions.ts`**: This file contains Next.js Server Actions. These are functions that run only on the server but can be called directly from client components. This is used to securely call the Genkit AI flows without exposing API endpoints.

### `src/ai/`

This is the heart of the application's AI functionality, powered by Genkit.

-   **`genkit.ts`**: Initializes and configures Genkit, specifying the plugins (e.g., `googleAI`) and the default model (`gemini-2.5-flash`).
-   **`flows/`**: This directory holds the AI logic, broken down into specific tasks.
    -   **`generate-initial-response.ts`**: Contains the prompt and flow for handling the main user conversation. The prompt in this file defines the AI's persona, its conversational style, and how it should respond in various scenarios (e.g., simple greetings, expressions of stress). **This is the primary file to edit to change the AI's chat behavior.**
    -   **`triage-user-need.ts`**: Contains the prompt and flow for analyzing user input to detect if they are in crisis. This runs in the background to determine if escalation or special resources are needed.

### `src/components/`

This directory contains all reusable React components.

-   **`ui/`**: Contains the UI components from the ShadCN library (e.g., `Button`, `Card`, `Input`). These are building blocks for the application's interface. It is generally not recommended to modify these files directly unless you are changing the core component library.
-   **`chat-interface.tsx`**: A key client component that manages the state of the chat conversation, handles user input, calls the server action to get an AI response, and displays the conversation history.

### `src/hooks/` & `src/lib/`

These directories contain supporting code.

-   **`hooks/`**: Custom React hooks used throughout the application.
-   **`lib/`**: Utility functions, TypeScript definitions, and data loaders.
    - **`firebase.ts`**: Initializes the Firebase SDK. This file is the central point for accessing Firebase services like Auth and Firestore.
    - `placeholder-images.json` is a good example of how static data is managed.

### Configuration Files

-   **`.env`**: Stores environment variables, including the sensitive API keys for Firebase. **This file should not be committed to version control.**
-   **`tailwind.config.ts`**: Defines the app's design system, including colors, fonts, and spacing, based on the ShadCN theme.
-   **`next.config.ts`**: Configuration for the Next.js framework.
-   **`components.json`**: Configuration for the ShadCN UI library, defining where components are stored and how they are aliased.
-   **`package.json`**: Manages all project dependencies (`dependencies` & `devDependencies`) and defines the `scripts` to run, build, and develop the application.
