# React Product Dashboard

A robust, feature-rich E-commerce Dashboard built with **React**, **TypeScript**, and **Material UI (MUI)**. This project demonstrates modern frontend architecture using **Zustand** for client state, **TanStack Query** for server state, and a component-driven design.

##  How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
3.  **Login Credentials**:
    -   **Username**: `emilys`
    -   **Password**: `emilyspass`
    -   *(Or any valid user from [dummyjson.com/users](https://dummyjson.com/users))*

---

##  Architecture & Tech Stack

### Core Stack
-   **Vite**: Blazing fast build tool and dev server.
-   **React + TypeScript**: Type-safe component development.
-   **Material UI (MUI v5)**: Comprehensive UI component library for layout, inputs, and feedback.
-   **React Hook Form + Zod**: Enterprise-grade form validation (used in Login and Product Forms).

### State Management
-   **Client State (Zustand)**:
    -   `useCartStore`: Manages cart items, totals, and persistence (via `persist` middleware to `localStorage`).
    -   `useAuthStore`: Handles user session and authentication status.
-   **Server State (TanStack Query / React Query)**:
    -   `useProducts`: Handles data fetching, caching, pagination, search, and filtering.
    -   Automatic background refotching and optimistic updates for mutations.

### Animation
-   **Framer Motion**: Used for staggered grid entries and smooth drawer interactions.

---

##  The Pivot: Tailwind vs. MUI

**Why we switched to Material UI:**

Initially, the project aimed to use **Tailwind CSS v4 (Alpha)**. However, we encountered significant stability issues:
1.  **Build Failures**: Incompatibility with the current PostCSS ecosystem caused immediate build errors.
2.  **Tooling Maturity**: The v4 alpha lacked reliable integration with standard Vite plugins at the time of development.

**The Solution:**
We pivoted to **Material UI (MUI)**. This decision provided:
-   **Stability**: A battle-tested library with zero configuration issues.
-   **Velocity**: Rapid development of complex components like the `Drawer` (Sidebar/Cart), `Dialog` (Modals), and `Data Grid` layouts without reinventing the wheel.
-   **Consistency**: A unified design system (inputs, buttons, typography) out of the box.

---

##  Completed Features

### 1. Authentication
-   Secure Login Page with Form Validation.
-   Protected Route wrappers for dashboard access.
-   User profile persistence.

### 2. Dashboard & Data
-   **Responsive Layout**: Collapsible Sidebar (Drawer) and fixed Header (AppBar).
-   **Data Grid**: Responsive Product Cards with Hover effects.
-   **Advanced Filtering**: Server-side Search (Debounced) and Category monitoring.

### 3. Cart System
-   **Slide-out Drawer**: Accessible from anywhere via the AppBar Badge.
-   **Full State Management**: Add, Remove, Update Quantity.
-   **Persistence**: Cart items survive page reloads.
-   **Checkout Flow**: Confirmation Dialog -> Clearing of State -> Success Feedback.

### 4. CRUD Operations
-   **Create**: Add new products with Image Preview (local).
-   **Read**: Paginated interactions.
-   **Update**: Edit existing product details.
-   **Optimistic Updates**: UI updates immediately before server confirmation.

### 5. Polish
-   **Staggered Animations**: Cards cascade in on load.
-   **Image Upload**: Preview functionality in forms.
-   **Feedback**: Snackbar notifications for all major actions.

---

##  Known Limitations

-   **Data Persistence**: This project uses [DummyJSON](https://dummyjson.com) as a backend.
    -   **Important**: DummyJSON is a *read-only* API for mutations. While it returns a "success" response with the simulated new/updated object, **changes are not actually saved to their database**.
    -   We use **Optimistic Updates** to verify the UI flow, but if you refresh the page after Adding/Editing a product, those specific changes will vanish (unlike the Cart, which we persist locally).

---


