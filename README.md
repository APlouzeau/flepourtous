# FlePourTous - Online French Course Platform

Welcome to the FlePourTous project! This document will guide you through installing and running the project in a local development environment.

## About

FlePourTous is a web application that allows users to book online French as a Foreign Language (FLE) courses, manage their schedules, and pay through a secure platform.

## Prerequisites

Before you begin, ensure you have the following tools installed on your machine:

-   [Docker](https://www.docker.com/products/docker-desktop/)
-   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)
-   [Git](https://git-scm.com/)
-   [Make](https://www.gnu.org/software/make/) (optional, for convenience commands - usually pre-installed on Linux, macOS, and WSL)

> **Note**: You do **not** need to install PHP, Composer, Node.js, or PNPM on your host machine. Everything is managed inside the Docker containers.

## Quick Start

### Option 1: Using Make (Recommended)

```bash
# Clone the repository
git clone https://github.com/APlouzeau/flepourtous.git
cd flepourtous

# Configure environment files (see Configuration section below)
cp backend/.env.example backend/.env
# Edit backend/.env with your values
# Add Google service account files (see Configuration section)

# One-command setup for new developers
make first-install
```

### Option 2: Manual Setup

Follow the detailed steps below if you prefer manual installation or don't have Make installed.

## Installation and Setup

### 1. Clone the Repository

Open a terminal and clone this repository to your local machine:

```bash
git clone https://github.com/APlouzeau/flepourtous.git
cd flepourtous
```

### 2. Configure Environment Variables and Service Files

The project uses `.env` files and Google service account files to manage secrets and configurations.

#### Backend Configuration (Required)

Create `backend/.env` based on `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

**Important**: Edit `backend/.env` and fill in the required values, especially:

-   `MAIL_USERNAME` and `MAIL_PASSWORD` for email functionality
-   `STRIPE_SECRET_KEY` for payment processing
-   `GOOGLE_CALENDAR_ID` and `GOOGLE_TOKEN` for calendar integration
-   Database credentials (defaults should work for development)

#### Google Service Account Files (Required for Calendar Features)

Add the following files to `backend/config/`:

-   `service-account-key.json` - Google service account credentials for calendar API
-   `credentials.json` - Google OAuth credentials

These files are required for the Google Calendar integration features.

#### Frontend Configuration (Recommended)

Create `frontend/.env` or `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env
```

**Important**: Edit `frontend/.env` and configure:

-   `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)
-   `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Stripe public key for payments
-   `JWT_SECRET` - JWT secret for authentication (should match backend)

### 3. Launch the Environment

#### For New Developers (First Time)

```bash
# Install dependencies locally for IDE support
cd frontend && pnpm install && cd ..
cd backend && composer install && cd ..

# Start the Docker environment
docker compose up --build -d
```

#### For Daily Development

```bash
# Start containers (dependencies already installed in images)
docker compose up -d

# Or rebuild if you changed Dockerfiles
docker compose up --build -d
```

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

## Development Workflow

### Using Make Commands (Recommended)

```bash
make help             # Show all available commands
make first-install    # Complete setup for new developers
make dependencies     # Install dependencies locally for IDE
make dev              # Start development environment
make logs             # View all service logs
make logs-frontend    # View frontend logs only
make logs-backend     # View backend logs only
make status           # Check service status and URLs
make restart          # Restart all services
make down             # Stop all services
make clean            # Clean containers and volumes
make clean-all        # Complete cleanup (images, cache, etc.)
make update           # Update dependencies
```

### Manual Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f
docker compose logs -f frontend
docker compose logs -f backend

# Check service status
docker compose ps

# Access container shell
docker compose exec backend bash
docker compose exec frontend sh

# Rebuild after code changes
docker compose up --build -d
```

### IDE Setup

For optimal development experience with IntelliSense and linting:

1. **Frontend**: Run `make dependencies` or manually `cd frontend && pnpm install`
2. **Backend**: Run `make dependencies` or manually `cd backend && composer install`

This installs dependencies locally for your IDE while Docker uses its own optimized dependencies.

## Configuration Files Checklist

Before running the project, ensure you have:

✅ **Backend**:

-   `backend/.env` (from `.env.example`)
-   `backend/config/service-account-key.json`
-   `backend/config/credentials.json`

✅ **Frontend**:

-   `frontend/.env` (from `.env.example`) - recommended for full functionality

## Troubleshooting

### Environment Variables Not Loading

If you modify `backend/.env` after starting containers, you need to restart them:

```bash
make restart
# or manually:
docker compose down && docker compose up -d
```

### Missing Google Service Files

If you see errors related to Google Calendar or authentication:

1. Ensure `service-account-key.json` and `credentials.json` are in `backend/config/`
2. Verify the Google service account has proper permissions
3. Check that `GOOGLE_CALENDAR_ID` and `GOOGLE_TOKEN` are set in `backend/.env`

### Port Conflicts

If ports are already in use, modify the port mappings in `compose.yml`:

```yaml
ports:
    - "3001:3000" # Change 3000 to 3001 for frontend
    - "8001:80" # Change 8000 to 8001 for backend
```

### Performance Issues

Our optimized setup installs dependencies during image build for faster startup:

-   Dependencies are pre-installed in Docker images
-   Local dependencies are only for IDE support
-   Hot reload works seamlessly

### Clean Start

If you encounter persistent issues:

```bash
make clean-all        # Complete cleanup
make first-install    # Fresh installation
```

## Architecture

### Services

-   **Frontend**: Next.js application with TypeScript and Tailwind CSS
-   **Backend**: PHP 8.4 with Apache, using Composer for dependencies
-   **Database**: MariaDB 10.6 with automatic schema import
-   **PhpMyAdmin**: Web interface for database management

### Optimization Features

-   ✅ **Fast Startup**: Dependencies pre-installed in Docker images
-   ✅ **Hot Reload**: Code changes reflected immediately
-   ✅ **IDE Support**: Local dependencies for IntelliSense
-   ✅ **Volume Protection**: Dependencies isolated from host filesystem
-   ✅ **Multi-stage Builds**: Optimized Docker images for dev/prod

Happy coding! 🚀

---

**Need Help?** Check the troubleshooting section above or review the Docker logs with `make logs`.
