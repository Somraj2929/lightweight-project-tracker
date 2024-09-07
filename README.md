# Project Tracker Application

This is a **Project Tracker Application** built with **Next.js** for the frontend, **Go** for the backend, and **MongoDB** as the database. It allows users to manage projects, track progress with monthly graphs, and engage in live chat rooms. The backend is responsible for handling user authentication, project management, and real-time chat server operations.

## Features

### Frontend

- **Login and Signup:** User authentication via JWT.
- **Project Management:** View and manage projects, including details of all ongoing and completed projects.
- **Monthly Graphs:** Visual representation of project activity and progress over time.
- **Live Chat Rooms:** Join or create chat rooms to collaborate in real-time.
- **Frontend Hosting:** The frontend is hosted on [Vercel](https://vercel.com).

### Backend

- **User Signup & Login:** Authentication with JWT tokens.
- **Project Management:** Handle creation and updates to project information.
- **Live Chat Server:** Real-time chat functionality managed with WebSockets.
- **Chat Data Storage:** Stores chat logs and project data in MongoDB.
- **Authentication Middleware:** Ensures that users are properly authenticated for protected routes.
- **Backend Hosting:** The backend is hosted on [DigitalOcean](https://www.digitalocean.com) using PaaS with Docker containers.

### Database

- **MongoDB:** Stores all data related to projects, users, and chat logs.

### Monitoring

- **New Relic:** Performance monitoring of the backend with New Relic, ensuring smooth operations and tracking system performance.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Go](https://golang.org/dl/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Docker](https://www.docker.com/get-started)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Somraj2929/lightweight-project-tracker.git
   ```
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Run the application locally:
   ```bash
   npm run dev
   ```
4. Access the frontend at `http://localhost:3000`.

### Backend Setup

1. Clone the backend repository:
   ```bash
   git clone https://github.com/Somraj2929/lightweight-project-tracker.git
   ```
2. Build and run the backend application with Docker:
   ```bash
   cd backend
   docker build -t project-tracker-backend .
   docker run -p 8080:8080 project-tracker-backend
   ```
3. The backend will be available at `http://localhost:8080`.

### Environment Variables

Make sure to set up the following environment variables for both frontend and backend:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token
- `NEW_RELIC_LICENSE_KEY`: New Relic monitoring key for backend

### Deployment

- **Frontend:** Hosted on Vercel. Use the following command to deploy:
  ```bash
  vercel --prod
  ```
- **Backend:** Hosted on DigitalOcean. Use Docker images for deployment.

### Monitoring Backend

Ensure that New Relic is set up to monitor backend performance. Add the New Relic Go agent to your backend, and configure it with your license key.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributions

Feel free to submit a pull request or open an issue to suggest improvements or report bugs!
