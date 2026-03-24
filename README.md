1- Project Title: BingeBoard
2- Team Members: - Leen Harfoush
                 - Hamza El Hallak
                 - Garen Garo Baghsarian
                 - Laura Malaeb
                
3- Project Topic: Movie/TV Show Tracker              
                A web application where users can browse, series, and manage movies and 
                TV shows.
4- Live Demo:
5- Features: - Browse movies and TV Shows.
             - View detailes pages for each movie/TV Show.
             - Search and filter content.
             - Add/Edit items
             -Resopnsive design.
             -Dark/Light mode toggle.
             
6- Pages:   - AddEditForm.jsx
             - Dashboard.jsx
             - Home.jsx
             - ListView.jsx
             - MovieDetail.jsx
             - Register.jsx
             - TVShowDetail.jsx
             
7- Tech Stack: - React (Vite)
               - Tailwind CSS
               - React Router
               - JavaScript

8- Screenshots of the website application:

9: Contributions:

  1- Leen Harfoush:

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
Contributed to the app's overall visual design, including support for light and dark mode across all pages authored, as well as implementing smooth UI animations and interactive transitions for pages and popups.

  2- Hamza El Hallak:
  Add/Edit Form Page (AddEditForm.jsx):

Developed a dynamic and reusable form component for both adding new items and editing existing ones within the application.
Implemented full client-side validation for all input fields, ensuring data consistency and proper formatting before submission.
The form is powered by React state and updates the local data structure (mock data/localStorage), simulating real CRUD operations.
Supports pre-filled inputs when editing an existing item, providing a seamless user experience.
Integrated navigation logic to redirect users back to the appropriate list or detail view after submission.
Designed the form with responsive layouts and clear input feedback using Tailwind CSS.

TV Show Detail Page (TVShowDetail.jsx):

Built a detailed view page displaying comprehensive information about each TV show, including title, description, rating, and visuals.
Connected the page dynamically to the app’s data source using route parameters, ensuring each show loads its correct data.
Integrated interactive buttons such as “Add to Watchlist” and “Add to Favorites,” fully synchronized with the dashboard via localStorage.
Implemented “Recently Viewed” tracking, automatically logging visited shows to enhance user engagement.
Ensured consistency in UI/UX with the Movie Detail page, maintaining a unified design system across the app.

Watch Trailer Button:

Implemented a dedicated “Watch Trailer” button that enhances user interaction by allowing quick access to external trailer content.
Configured the button to open trailers (e.g., YouTube links) in a new tab for a seamless viewing experience without disrupting app navigation.
Added visual feedback and hover animations to improve interactivity and responsiveness.
Ensured accessibility by clearly labeling the button and maintaining consistent styling across all detail pages.

  Website Logo:

Designed and integrated the application’s logo as a key branding element within the Navbar and across the platform.
Implemented click functionality on the logo to redirect users to the homepage, improving navigation usability.
Optimized the logo asset for performance and fast loading, while maintaining visual clarity.
 And finally, we all actively supported one another thorughout the project.
 When challenges arose, we collaborated and shared assistance when needed, ensuring a cohesive final product.
