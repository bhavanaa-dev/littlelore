# LittleLore — Mini Virtual Library

A cozy digital space to discover, explore, and enjoy books.

**Live Demo:** [LittleLore](https://littlelore-frontend.vercel.app/)

---

## About the Project

LittleLore is a full-stack virtual library application designed to make discovering and exploring books simple and enjoyable.

Built with React, Node.js, Express, Prisma, and PostgreSQL, LittleLore brings together frontend development, backend API integration, and database management to create a digital library experience.

The project focuses on building a functional, user-friendly application while gaining hands-on experience with modern full-stack development concepts.

---

## Features

- Browse a curated collection of books.
- Explore books through an organized library interface.
- Discover book information.
- Interact with a responsive React-based interface.
- Retrieve book data through backend API integration.
- Store and manage application data using PostgreSQL.
- Access the application through a deployed web interface.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI development |
| Vite | Frontend development and build tool |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | Backend server and REST APIs |
| PostgreSQL | Relational database |
| Prisma ORM | Database queries and schema management |
| Git | Version control |
| GitHub | Source code hosting |
| Vercel | Frontend deployment |
| Render | Backend deployment |
| Neon | Cloud PostgreSQL hosting |

---

## Full-Stack Concepts Used

### 1. Client–Server Architecture
- Separation of frontend and backend responsibilities.
- Communication between the client and server.
- Independent frontend and backend services.

### 2. RESTful API Development
- Creating and consuming API endpoints.
- HTTP request and response handling.
- Data exchange between frontend and backend.
- Backend routing and API integration.

### 3. Frontend–Backend Integration
- Connecting React components to backend APIs.
- Configuring API base URLs.
- Handling asynchronous data-fetching operations.
- Integrating frontend functionality with server-side data.

### 4. Database Management
- Relational database concepts.
- PostgreSQL data persistence.
- Structured data storage and retrieval.
- Database schema management.

### 5. Prisma ORM
- Database operations using Prisma Client.
- Schema definition and management.
- Database migrations.
- Prisma Client generation and database connectivity.

### 6. Asynchronous JavaScript
- Handling asynchronous API requests.
- Working with promises and async operations.
- Retrieving and displaying data from the backend.

### 7. Environment Configuration
- Managing environment variables.
- Configuring database connectivity.
- Using environment-specific API URLs.
- Separating development and production configuration.

### 8. Deployment and Production Configuration
- Deploying frontend and backend independently.
- Connecting a cloud-hosted backend to a managed database.
- Configuring production environment variables.
- Understanding development versus production environments.

### 9. Version Control
- Tracking code changes using Git.
- Managing source code with GitHub.
- Committing and pushing project updates.

---

## Application Architecture

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
                Prisma ORM
                   |
                   v
           PostgreSQL Database
                  (Neon)
```

The frontend communicates with the Express backend through HTTP requests. The backend uses Prisma ORM to interact with the PostgreSQL database.

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/bhavanaa-dev/littlelore.git
cd littlelore
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory.

Add your PostgreSQL connection string:

```env
DATABASE_URL="your_postgresql_connection_string"
```

Replace the placeholder with your actual database connection string.

**Important:** Never commit environment files containing credentials or secrets.

### 4. Set Up the Database

Navigate to the backend directory:

```bash
cd backend
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate dev
```

Seed the database with the existing book catalog:

```bash
node prisma/seed.js
```

### 5. Run the Application

Return to the project root:

```bash
cd ..
```

Start the frontend and backend using the npm workspace scripts configured in the root `package.json`.

---

## Deployment

LittleLore is deployed using cloud hosting services.

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon |

### Live Application

[https://littlelore-frontend.vercel.app/](https://littlelore-frontend.vercel.app/)

The frontend uses the `VITE_API_URL` environment variable to communicate with the deployed backend.

The backend uses `DATABASE_URL` to connect to the Neon PostgreSQL database.

---

## Learning Outcomes

Building LittleLore provided hands-on experience with:

- Developing a full-stack web application.
- Designing and integrating REST APIs.
- Connecting frontend and backend services.
- Managing relational databases using PostgreSQL.
- Using Prisma ORM for database operations and migrations.
- Handling asynchronous API requests.
- Managing environment variables and application configuration.
- Deploying frontend and backend services independently.
- Using Git and GitHub for version control.

---

## Future Enhancements

- Advanced book search and filtering.
- Personalized reading lists and bookshelf improvements.
- Enhanced book details and reading previews.
- Additional library categories and discovery features.
- Further UI and user experience improvements.

---

## Author

**Bhavana S.**

Built with curiosity, creativity, and a love for books.

*LittleLore — Every book opens a little world.*