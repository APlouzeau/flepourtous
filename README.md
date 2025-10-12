# FlePourTous - Online French Course Platform

Welcome to the FlePourTous project! This document will guide you through installing and running the project in a local development environment.

## About

FlePourTous is a web application that allows users to book online French as a Foreign Language (FLE) courses, manage their schedules, and pay through a secure platform.

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have the following tools installed:

-   [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose
-   [Git](https://git-scm.com/)
-   [Make](https://www.gnu.org/software/make/) (optional but recommended)

> **Windows Users**: We **strongly recommend** using [WSL2 for significantly better performance](#-windows-users-wsl2-setup-recommended) (5-10x faster builds and development experience).
>
> _Alternative: Windows users without WSL2 can use the [manual installation steps](#-manual-installation-alternative) instead of `make` commands._

> **Note**: You do **not** need PHP, Composer, Node.js, or npm locally. Everything runs in Docker containers.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/APlouzeau/flepourtous.git
cd flepourtous

# 2. Complete setup (dependencies + Docker build + launch)
make first-install
```

That's it! 🎉 Your development environment is ready.

### Access Your Application

After `make first-install` completes successfully:

-   **Frontend**: [http://localhost:3000](http://localhost:3000) ⭐
-   **Backend API**: [http://localhost:8000](http://localhost:8000)
-   **PhpMyAdmin**: [http://localhost:8081](http://localhost:8081) 🗄️
-   **Database**: `localhost:3307` (for external connections)

### Available Commands

```bash
# Development commands
make help           # Show all available commands
make dev            # Start development environment
make status         # Check services status
make restart        # Restart all services
make logs           # View logs from all services
make logs-backend   # View backend logs only
make logs-frontend  # View frontend logs only

# Utility commands
make shell-backend  # Access backend container shell
make shell-frontend # Access frontend container shell
make clean          # Clean containers and volumes
make clean-all      # Complete cleanup (images, cache, etc.)

# Database commands
make db-backup      # Backup database
```

### Troubleshooting

If you encounter issues:

1. **Clean and reinstall**:

    ```bash
    make clean-all
    make first-install
    ```

2. **Check service status**:

    ```bash
    make status
    ```

3. **View logs**:
    ```bash
    make logs
    ```

### Testing the Complete Installation

To verify everything works correctly, you can test the complete installation process:

```bash
# Complete cleanup and fresh install
make clean-all
make first-install

# Check all services are running
make status

# Expected output should show all containers running:
# - backend (port 8000)
# - frontend (port 3000)
# - database (port 3307)
# - phpmyadmin (port 8081)
```

If any service fails to start, check the logs:

```bash
make logs-backend   # For backend issues
make logs-frontend  # For frontend issues
```

---

## 🔧 Advanced Configuration (Optional)

The application works out-of-the-box for development, but you can customize various settings:

### Environment Variables

The default `.env` file is configured for local development. For production or custom setups, modify `backend/.env`:

```bash
# Database (configured for Docker by default)
DB_HOST=db
DB_NAME=flepourtous
DB_USER=flepourtous
DB_PSW=1234
DB_PORT=3306

# App URLs (configured for local development)
URI=http://localhost:8000/
URI_FRONT=http://localhost:3000/
COOKIE_DOMAIN=localhost

# Google Calendar Integration (optional)
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_TOKEN=your_google_token

# Email Configuration (for production)
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_PORT=465

# Stripe Payment (for production)
STRIPE_SECRET_KEY=your_stripe_key
```

### Google Services (Optional)

For Google Calendar integration, add these files:

-   `backend/config/credentials.json` - Google OAuth credentials
-   `backend/config/service-account-key.json` - Service account key

### Docker Network Setup

The application automatically creates a Docker network called `web`. If you encounter network issues:

```bash
# Recreate the network
docker network rm web
docker network create web
make restart
```

---

## 🔍 Windows Users: WSL2 Setup (Recommended)

For Windows users, we **strongly recommend** using WSL2 for significantly better performance and a smoother development experience.

### Why WSL2?

Docker on Windows native can be **5-10x slower** than WSL2, especially for:

-   Build times (minutes vs seconds)
-   File system operations
-   Hot reload responsiveness
-   Overall development workflow

### Complete WSL2 Setup Guide

#### 1. Install WSL2 + Ubuntu

1. **Open Microsoft Store**
2. **Search "Ubuntu"** and install **"Ubuntu 22.04 LTS"** (or latest version)
3. **Launch Ubuntu** from Start Menu
4. **Create a user account** when prompted (username + password)

#### 2. Install Docker Desktop with WSL2

1. **Download Docker Desktop** for Windows from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **During installation**: Make sure "Use WSL 2 based engine" is checked
3. **After installation**: Open Docker Desktop Settings
    - Go to **Settings > Resources > WSL Integration**
    - ✅ Enable "Enable integration with my default WSL distro"
    - ✅ Enable "Ubuntu-22.04" (or your installed distro)
    - Click **"Apply & Restart"**

#### 3. Setup VS Code for WSL

1. **Install VS Code** on Windows
2. **Install the "WSL" extension** by Microsoft
3. **Connect to WSL**:
    - Click the **blue button** in bottom-left corner of VS Code
    - Select **"Connect to WSL"**
    - OR open Ubuntu terminal and run: `code .`

#### 4. Clone and Run the Project in WSL

```bash
# In your WSL Ubuntu terminal:
git clone https://github.com/APlouzeau/flepourtous.git
cd flepourtous

# Configure environment (see Configuration section below)
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# One command to rule them all!
make first-install
```

#### 5. Access Your Application

-   **Frontend**: [http://localhost:3000](http://localhost:3000)
-   **Backend**: [http://localhost:8000](http://localhost:8000)
-   **PhpMyAdmin**: [http://localhost:8081](http://localhost:8081)
-   **Database**: `localhost:3307`

### WSL2 Performance Benefits

**Typical build times:**

| Operation        | Windows Native | WSL2        |
| ---------------- | -------------- | ----------- |
| First `make dev` | 5-8 minutes    | 1-2 minutes |
| `make restart`   | 2-3 minutes    | 30 seconds  |
| Hot reload       | 10-30 seconds  | 1-3 seconds |

### WSL2 Tips

-   **File location**: Keep your project files in WSL filesystem (`/home/username/`) for best performance
-   **RAM usage**: WSL2 uses RAM more efficiently than Docker Desktop alone
-   **Git credentials**: May need to set up Git credentials in WSL separately
-   **VS Code**: Use "Open Folder in WSL" for full integration

---

## 📋 Manual Installation (Alternative)

If you prefer manual setup or don't have Make installed:

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

-   `MAIL_USERNAME` and `MAIL_PASSWORD` for email functionality (remember to quote passwords with spaces: `MAIL_PASSWORD="your password"`)
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
cd frontend && npm install && cd ..
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
-   **Database (Direct Connection)**: `localhost:3307`
    -   Server: `db` (from containers) or `localhost:3307` (from host)
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

1. **Frontend**: Run `make dependencies` or manually `cd frontend && npm install`
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

### .env File Parsing Errors

If you see parsing errors like "Failed to parse dotenv file", check your `.env` file for:

-   **Passwords with spaces**: Must be quoted (`MAIL_PASSWORD="your password"`)
-   **Special characters**: May need quoting or escaping
-   **No empty lines**: Between variable definitions

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
    - "8082:80" # Change 8081 to 8082 for phpMyAdmin
    - "3308:3306" # Change 3307 to 3308 for database
```

**Note**: The database already uses port `3307` instead of `3306` to avoid conflicts with local MySQL installations (especially on macOS).

### Performance Issues (Windows)

If you're experiencing slow performance:

1. **Use WSL2** (see WSL2 setup section above) - this usually solves 90% of performance issues
2. **Check Docker Desktop settings**: Ensure adequate RAM/CPU allocation
3. **Clean Docker cache**: Run `make clean-all` periodically

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
