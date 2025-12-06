# Docker Setup Guide

This guide explains how to run the GetRem application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your configuration:**
   ```bash
   # Required: Email configuration
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   
   # Optional: Database credentials (defaults provided)
   DB_ROOT_PASSWORD=rootpassword
   DB_NAME=getrem
   DB_USER=getrem
   DB_PASSWORD=getrempassword
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:3306

## Services

### Database (MySQL)
- **Container:** `getrem-db`
- **Port:** 3306 (configurable via `DB_PORT`)
- **Data:** Persisted in Docker volume `mysql_data`

### Backend (Spring Boot)
- **Container:** `getrem-backend`
- **Port:** 8080 (configurable via `BACKEND_PORT`)
- **Health Check:** http://localhost:8080/actuator/health
- **Dependencies:** Waits for database to be healthy

### Frontend (React + Nginx)
- **Container:** `getrem-frontend`
- **Port:** 3000 (configurable via `FRONTEND_PORT`)
- **Proxy:** API requests to `/api` are proxied to backend
- **Dependencies:** Waits for backend to be ready

## Environment Variables

### Required Variables
- `MAIL_USERNAME`: Email address for sending notifications
- `MAIL_PASSWORD`: Email app password (not regular password)

### Optional Variables
- `DB_ROOT_PASSWORD`: MySQL root password (default: `rootpassword`)
- `DB_NAME`: Database name (default: `getrem`)
- `DB_USER`: Database user (default: `getrem`)
- `DB_PASSWORD`: Database password (default: `getrempassword`)
- `DB_PORT`: Database port (default: `3306`)
- `BACKEND_PORT`: Backend port (default: `8080`)
- `FRONTEND_PORT`: Frontend port (default: `3000`)
- `JPA_DDL_AUTO`: JPA DDL mode (default: `update`)
- `JPA_SHOW_SQL`: Show SQL queries (default: `false`)

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Rebuild services
```bash
docker-compose up -d --build
```

### Remove everything (including volumes)
```bash
docker-compose down -v
```

### Access database
```bash
docker exec -it getrem-db mysql -u getrem -p
# Password: getrempassword (or your DB_PASSWORD)
```

### Access backend container
```bash
docker exec -it getrem-backend sh
```

### Access frontend container
```bash
docker exec -it getrem-frontend sh
```

## Troubleshooting

### Backend won't start
1. Check database is running: `docker-compose ps database`
2. Check backend logs: `docker-compose logs backend`
3. Verify database connection string in logs
4. Ensure database is healthy: `docker-compose ps database` should show "healthy"

### Frontend can't connect to backend
1. Check backend is running: `docker-compose ps backend`
2. Verify backend health: `curl http://localhost:8080/actuator/health`
3. Check nginx configuration in `frontend-getrem/nginx.conf`
4. Verify network connectivity: `docker network inspect getrem_getrem-network`

### Database connection issues
1. Ensure database container is healthy
2. Check database credentials in `.env`
3. Verify database is accessible: `docker exec -it getrem-db mysql -u getrem -p`
4. Check database logs: `docker-compose logs database`

### Email not working
1. Verify `MAIL_USERNAME` and `MAIL_PASSWORD` are set in `.env`
2. For Gmail, use an App Password (not regular password)
3. Check backend logs for email errors: `docker-compose logs backend | grep -i mail`

## Development

### Rebuild after code changes
```bash
# Backend changes
docker-compose up -d --build backend

# Frontend changes
docker-compose up -d --build frontend
```

### Hot reload (development)
For development with hot reload, run services individually:
- Backend: Use Maven/IDE directly
- Frontend: Use `npm run dev`
- Database: Use `docker-compose up database`

## Production Considerations

1. **Security:**
   - Change all default passwords
   - Use strong database passwords
   - Secure email credentials
   - Enable SSL/TLS for database connections

2. **Performance:**
   - Adjust JVM memory settings in Dockerfile if needed
   - Configure database connection pool
   - Enable Nginx caching for static assets

3. **Monitoring:**
   - Set up health checks
   - Monitor container logs
   - Use Docker monitoring tools

4. **Backup:**
   - Regularly backup MySQL volume: `docker run --rm -v getrem_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz /data`

## Network Architecture

```
┌─────────────┐
│  Frontend   │ (Nginx + React)
│  Port 3000  │
└──────┬──────┘
       │ /api proxy
       │
┌──────▼──────┐
│   Backend   │ (Spring Boot)
│  Port 8080  │
└──────┬──────┘
       │ JDBC
       │
┌──────▼──────┐
│  Database   │ (MySQL)
│  Port 3306  │
└─────────────┘
```

All services communicate through the `getrem-network` Docker network.

