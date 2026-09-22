LittleLore — Mini Virtual Library
LittleLore is a full-stack virtual library built to make discovering and exploring books simple, engaging, and enjoyable. It provides a digital space for book lovers to browse a curated collection through a clean and intuitive interface.
Live Demo: https://littlelore-frontend.vercel.app/
Features
Browse a curated collection of books.
Explore books through an organized library interface.
Discover and access book information.
React-based interactive user interface.
Backend API integration for book data.
Cloud-hosted frontend, backend, and database.
Tech Stack
Technology	Purpose
React	Frontend UI
Vite	Frontend development and build
JavaScript	Application logic
Node.js	Backend runtime
Express.js	REST API and server
PostgreSQL	Relational database
Prisma ORM	Database access and migrations
Git & GitHub	Version control
Vercel	Frontend deployment
Render	Backend deployment
Neon	Cloud PostgreSQL hosting
Full-Stack Concepts Used
1. Client–Server Architecture
Separation of frontend and backend responsibilities, with the React frontend communicating with the Express server.
2. RESTful API Development
Creating and consuming API endpoints, handling HTTP requests and responses, and transferring data between application layers.
3. Frontend–Backend Integration
Connecting the frontend to backend APIs, configuring API base URLs, and handling data-fetching operations.
4. Relational Database Management
Using PostgreSQL to store structured application data and understanding relational database fundamentals.
5. ORM and Database Migrations
Using Prisma ORM for database queries, schema management, client generation, and migrations.
6. Asynchronous JavaScript
Working with asynchronous operations and API requests to retrieve and display application data.
7. Environment Configuration
Using environment variables to manage database connections and API configuration across development and production environments.
8. Production Deployment
Deploying the frontend and backend independently, connecting a cloud-hosted backend to a managed PostgreSQL database, and configuring production services.
9. Version Control
Using Git and GitHub to track changes, manage source code, and maintain the project repository.
Application Architecture
```text
                 User
                  |
                  v
         React + Vite Frontend
               (Vercel)
                  |
              REST API
                  |
                  v
          Node.js + Express
               (Render)
                  |
                Prisma
                  |
                  v
          PostgreSQL (Neon)
```
Running Locally
Prerequisites
Node.js and npm
PostgreSQL
Git
1. Clone the repository
```bash
git clone https://github.com/bhavanaa-dev/littlelore.git
cd littlelore
```
2. Install dependencies
```bash
npm install
```
3. Configure environment variables
Create a `.env` file inside the `backend/` directory and add your PostgreSQL connection string:
```env
DATABASE_URL="your_postgresql_connection_string"
```
Never commit credentials or environment files containing secrets.
4. Set up the database
```bash
cd backend
npx prisma generate
npx prisma migrate dev
node prisma/seed.js
```
5. Start the application
Return to the project root and use the npm workspace scripts defined in `package.json` to start the frontend and backend.
Deployment
Component	Platform
Frontend	Vercel
Backend	Render
Database	Neon
The frontend uses `VITE_API_URL` to communicate with the deployed backend, while the backend uses `DATABASE_URL` to connect to the PostgreSQL database.
Learning Outcomes
Building LittleLore provided hands-on experience in full-stack web development, REST API integration, relational database management, Prisma ORM, environment configuration, Git workflows, and cloud deployment.
The project helped me understand how the frontend, backend, and database work together to deliver a complete web application.
Author
Bhavana S.
Built as a project to explore full-stack development and create a cozy digital space for book lovers.
LittleLore — Every book opens a little world.
