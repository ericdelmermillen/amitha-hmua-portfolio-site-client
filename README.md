# Amitha Millen-Suwanta Makeup Artist Portfolio Client


# Description:

This project is the frontend for a full-stack web application developed for Amitha Millen-Suwanta, a makeup artist based in Toronto, Ontario, Canada. The application showcases her portfolio and includes a custom content management system (CMS) for managing and uploading content seamlessly. The project employs server-side filtering via URL query params and pagination of results to allow for quick loading of content.

# Project Inspiration

The design for the front end of this project is loosely based on a SquareSpace site used by another makeup artist suggested by the client:

https://www.robertweirbeauty.com/

Departing from the original UI of the inspiration site, this project includes a dark/light mode, a stationary nav which hides and show relative to the user scroll, a floating (^) button when the user is not logged (scroll to the top button) or a (+) button when the user is logged in (post new photo shoot button).

Additionaly, features were added to allow the app's content to be managed by the admin user.


# Features:

• Portfolio Showcase: Display Amitha's work with an attractive and responsive design.
• Custom Content Management System (CMS): Manage images and text, including posting, editing, and reordering content via the React drag-and-drop API.
• User Authentication: Secure login and registration with JWT authentication.
• File Uploads: Upload and manage images via AWS S3.
• SEO Optimized: Open Graph meta tags for better social media sharing.


# Technologies Used:

Frontend:

Vite: A fast build tool for modern web projects.
React: A JavaScript library for building user interfaces.
React Router DOM: For routing and navigation.
React Toastify: For notifications.
React Datepicker: For date selection.
Sass: For styling.
Compressor.js: For image compression.
Date-fns: For date manipulation.
JWT Decode: For decoding JWT tokens.
Dev Tools:

ESLint: For linting JavaScript and JSX code.
ESLint Plugins: For React, React Hooks, and React Refresh.
Vite Plugin React: For integrating React with Vite.
Installation
Prerequisites
Node.js and npm installed


# Frontend Setup:

Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/amitha-hmua-portfolio-site-client.git
cd amitha-hmua-portfolio-site-client
Install dependencies:

bash
Copy code
npm install
Create a .env file in the root directory with the following environment variables:


# Sample dotenv

env
Copy code
# Port configuration for the client
VITE_PORT=5173

# API endpoint for the server
VITE_API_BASE_URL=http://localhost:8080/api

# API endpoint to get temporary signed URL to post to S3 Bucket
VITE_AWS_SIGNED_URL_ROUTE=http://localhost:8080/api/auth/getsignedURL

# AWS S3 configuration for file storage
VITE_AWS_SHOOTS_DIRNAME=shootimages
VITE_AWS_BIO_DIRNAME=bioimages
Start the development server:

bash
Copy code
npm run dev
Build the project for production:

bash
Copy code
npm run build
Preview the production build locally:

bash
Copy code
npm run preview
Usage
Access the development server at http://localhost:5173.


# User Login:

As this app is not intended for visitors who have accounts, the login is accessible through navigating to /login and can not be accessed via the UI.

A user must first be created via the appropriate endpoint on the server using a client like PostMan or Thunder Client. In production, this endpoint is commented out to prevent new users from being created.


# Admin Tools:

Once logged in, the admin user will see admin tools including an Edit and Delete icon on each shoot on the main page, a create shoot icon floating in the bottom right corner, and a reorder shoots button at the bottom of the page which allows for reordering the content in the app via drag and drop functionality.

Content is added via the create shoot button (+): in the Add Shoot page new photo tags, photographers and models can be added to the database or selected for inclusion in a new shoot.
Additionally, the Bio page is editable when the admin user is logged in, allowing for updating the Bio Page hero image and Bio Text.


# Endpoint for creating a user:

/api/auth/createuser


# Deployment:

Build the project using npm run build.

Deploy the contents of the dist directory to your hosting provider.

Update the .env file with production environment variables.


# Endpoint Documentation:

https://flannel-modem-15e.notion.site/Amitha-HMUA-Portfolio-Site-API-Calls-4c8b143053284c47801a2adbfe60299f


## Contact

For any questions, feedback, or support, please reach out to:

- **Email:** ericdelmermillen@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/eric-delmer-millen/
- 
- **Twitter:** @EricDelmer