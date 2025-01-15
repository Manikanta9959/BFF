# Docker Setup for Fullstack App

This project uses Docker Compose to run a fullstack application consisting of three services:
- **Backend** (Python FastAPI)
- **Frontend** (React)
- **Database** (MySQL)

## Prerequisites

Ensure that you have the following installed on your machine:
- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
Start the containers: From the root of your project, run the following command to start all services (Backend, Frontend, and Database):
docker compose up -d --build
This command will:
Build the Docker images for both the backend and frontend from the respective Dockerfiles.
Set up the MySQL database and initialize it using the init.sql file if available.

To run specific service
docker compose up -d --build {service_name}


Access the services:
Frontend: Visit http://localhost:3000 in your browser.
Backend: Access the API at http://localhost:8000.
Database: The MySQL database is available at localhost:3307.

Stop the containers: To stop the services, press Ctrl+C or run the following in your terminal:
docker compose down

View Logs (optional): To see logs from any container, you can use:
docker compose logs <container_name>
Example: docker compose logs backend

### Notes:
1. Replace `<your-repo-url>` with your actual repository URL.
2. This `README.md` now includes everything in a single document for easier setup.
