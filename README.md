# React + Vite
Hello
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Contributions

Leen Harfoush - 202403506

Responsible for the full implementation of the user authentication flow, dashboard experience, and profile management system.

Register Page (Register.jsx)
Built the complete registration form with client-side validation — enforcing email format, minimum password length (6 characters), and password confirmation matching.
On successful registration, user data is persisted to localStorage and the user is redirected to the dashboard.

Dashboard Page (Dashboard.jsx)
Developed the main dashboard layout featuring three fully functional sections: Watchlist, Favorites, and Recently Viewed.
All three sections are driven by localStorage, staying in sync with actions taken across the app.
Implemented collapsible sections with smooth expand/collapse animations and a slide-in/out profile panel toggle.
Wired up the add-to-watchlist and add-to-favorites buttons inside MovieDetails.jsx and TVShowDetails.jsx so items correctly appear in their respective dashboard sections.
Implemented guest user restrictions for Favorites and Watchlist actions — when a non-authenticated user attempts to add items, a popup prompts them to join/log in and redirects them to the login page.
Implemented Recently Viewed tracking — any movie or show page visited automatically gets logged and displayed on the dashboard.

Profile Component (Profile.jsx)
Built a fully interactive profile panel supporting profile picture upload (with live preview), and username/email editing
Profile picture updates are reflected in real time across the app, including in the Navbar
Email changes trigger a password verification modal before saving, preventing unauthorized updates
Password changes follow a two-step verification flow — users must confirm their current credentials before setting a new password
Includes a Rate Us feature with an interactive star rating widget
Implemented access control for guest users — if a user attempts to edit their profile without being logged in, a popup prompts them to sign up/log in and redirects them to the login page

UI & Theming
Contributed to the app's overall visual design, including support for light and dark mode across all pages authored, as well as implementing smooth UI animations and interactive transitions for pages and popups

