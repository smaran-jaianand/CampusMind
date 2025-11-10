
# Mannan Application: In-Depth Tech Stack

This document provides a comprehensive overview of the technologies, libraries, and architectural choices that power the Mannan application.

---

## 1. Core Framework & Language

### **Next.js (with App Router)**
- **What it is:** A React framework for building full-stack web applications. We use the **App Router**, which is the latest and recommended routing paradigm in Next.js.
- **Why it's used:**
    - **Hybrid Rendering:** It allows us to use both Server Components (for performance and data fetching) and Client Components (for interactivity) seamlessly.
    - **File-based Routing:** Each page in the app corresponds to a file in the `src/app` directory, making the structure intuitive.
    - **Built-in Optimizations:** Provides automatic code-splitting, image optimization (`next/image`), and simplified server-side logic with Server Actions.

### **TypeScript**
- **What it is:** A superset of JavaScript that adds static types. The entire codebase is written in TypeScript (`.ts` and `.tsx` files).
- **Why it's used:**
    - **Error Prevention:** Catches common errors during development, before the code is even run.
    - **Code Quality & Readability:** Types serve as self-documentation, making the code easier to understand and maintain.
    - **Better Tooling:** Enables superior autocompletion and refactoring capabilities in code editors.

---

## 2. Backend & Database

### **Firebase**
- **What it is:** A Backend-as-a-Service (BaaS) platform from Google that provides a suite of tools for building web and mobile applications.
- **Services Used:**
    - **Firebase Authentication:** Manages all user sign-up and login functionality. We have implemented providers for Email/Password, Google Sign-In, and Phone Number verification.
    - **Firebase Firestore:** A flexible, scalable NoSQL database. This will be used to store user-specific data, forum posts, chat history, and more.
    - **Firebase App Hosting:** The `apphosting.yaml` file is configured to deploy the Next.js application directly to Firebase's managed hosting service, which is optimized for web apps.

---

## 3. Generative AI

### **Firebase Genkit**
- **What it is:** An open-source framework for building AI-powered features into applications. It acts as an orchestrator for interacting with large language models (LLMs).
- **How it's used:**
    - **Flows (`src/ai/flows`):** We define our core AI logic in "flows". For example, `generate-initial-response.ts` defines the logic for the main chatbot, and `schedule-tasks.ts` defines the AI-powered scheduler.
    - **Model Integration:** Genkit is configured in `src/ai/genkit.ts` to use the `googleAI` plugin, giving us easy access to Google's powerful **Gemini** family of models.
    - **Structured Output:** We use Zod schemas to define the exact JSON format we expect from the AI, making the output reliable and easy to work with in our frontend code. This is a key feature for building robust AI interactions.

---

## 4. Frontend & Styling

### **React**
- **What it is:** The JavaScript library for building user interfaces that forms the foundation of Next.js.
- **How it's used:** We use modern React patterns, including functional components and hooks (`useState`, `useEffect`, `useContext`) for managing component state and side effects.

### **Tailwind CSS**
- **What it is:** A utility-first CSS framework for rapidly building custom designs directly in the markup.
- **Why it's used:**
    - **Speed:** Allows for fast UI development without writing custom CSS files.
    - **Consistency:** The design system is defined in `tailwind.config.ts`, ensuring a consistent look and feel across the application.
    - **Customization:** It is highly customizable. Our theme colors are defined using CSS variables in `src/app/globals.css`.

### **ShadCN UI**
- **What it is:** A collection of beautifully designed, accessible, and reusable UI components built on top of Tailwind CSS and Radix UI.
- **How it's used:** Provides the building blocks for our interface, such as `Button`, `Card`, `Input`, `Dialog`, and `Form` components. These are located in `src/components/ui`. We can customize them without overriding a third-party library's styles.

### **lucide-react**
- **What it is:** A beautiful and consistent open-source icon library.
- **How it's used:** Provides all the icons used throughout the application, such as the `Bot`, `CalendarDays`, and `Send` icons.

---

## 5. Forms & Validation

### **React Hook Form**
- **What it is:** A performant and flexible library for managing form state, validation, and submission in React.
- **How it's used:** Powers all our forms, like the booking page and login/signup forms, simplifying state management and submission logic.

### **Zod**
- **What it is:** A TypeScript-first schema declaration and validation library.
- **How it's used:**
    - **Form Validation:** We define schemas (e.g., `bookingFormSchema`) to validate user input on the client-side, ensuring data integrity before submission.
    - **AI Output Validation:** It's also used heavily in our Genkit flows to define the structure of the data we expect back from the AI model.

---

## 6. Development & Tooling

### **Package Manager: npm**
- **What it is:** The default package manager for Node.js.
- **How it's used:** The `package.json` file lists all project dependencies and defines the scripts (`dev`, `build`, `start`) used to run and build the application. Dependencies are installed from the npm registry using the `npm install` command.

### **Next.js CLI**
- **What it is:** The command-line interface for Next.js.
- **How it's used:** The scripts in `package.json` use the Next.js CLI to run the development server (`next dev`), create a production build (`next build`), and start the production server (`next start`).
