# FlePourTous - Online French Course Platform

Welcome to the FlePourTous project! This document will guide you through installing and running the project in a local development environment.

## About

FlePourTous is a web application that allows users to book online French as a Foreign Language (FLE) courses, manage their schedules, and pay through a secure platform.

## Prerequisites

Before you begin, ensure you have the following tools installed on your machine:

-   [Docker](https://www.docker.com/products/docker-desktop/)
-   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)
-   [Git](https://git-scm.com/)

> **Note**: You do **not** need to install PHP, Composer, Node.js, or PNPM on your host machine. Everything is managed inside the Docker containers.

## Installation and Setup

Follow these steps to set up your development environment.

### 1. Clone the Repository

Open a terminal and clone this repository to your local machine:

```bash
git clone https://github.com/your-username/flepourtous.git
cd flepourtous
```

### 2. Configure Environment Variables

The project uses `.env` files to manage secrets and configurations.

-   **For the Backend**: Create a `backend/.env` file based on `backend/.env.example`.
-   **For the Frontend**: Create a `frontend/.env.local` file based on `frontend/.env.example`.

Adjust the values as needed for your local setup.

### 3. Launch the Containers

Use Docker Compose to build the images and start all services (backend, frontend, database).

```bash
docker compose up --build -d
```

-   `--build`: Forces a rebuild of the images if a `Dockerfile` has changed.
-   `-d`: Runs the containers in "detached" mode (in the background).

The first time you run this, it may take a few minutes to download the base images and install dependencies.

> **Database Note**: On the first launch, Docker will automatically import the database structure and initial data from the `db/flepourtous.sql` file. You don't need to do anything!

### 4. You're All Set!

Your development environment is now accessible:

-   **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
-   **Backend (PHP API)**: [http://localhost:8000](http://localhost:8000)
-   **DB Management (PhpMyAdmin)**: [http://localhost:8081](http://localhost:8081)
    -   Server: `db`
    -   Username: `flepourtous`
    -   Password: `1234`

## Useful Commands

-   **Stop the containers**: `docker compose down`
-   **View live logs**: `docker compose logs -f`
-   **Connect to a container** (e.g., the backend): `docker compose exec api bash`

Happy coding! 🚀
