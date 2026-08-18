# TechConnect

A full-stack student networking and collaboration platform built for college tech students to discover developers, find project collaborators, and connect with potential hackathon teammates.

## Live Project

**[Visit TechConnect](https://tech-connect-liard.vercel.app/)**

## Overview

TechConnect helps students find people with relevant technical skills and collaborate on projects without relying on informal college groups or scattered social platforms.

Users can create profiles, showcase their skills, discover other developers, create projects, and send or manage project join requests.

## Features

### Authentication
- Custom email-based user authentication
- JWT-based authentication and token refresh
- Protected routes and authenticated API requests
- User registration and logout

### Developer Profiles
- Create and update developer profiles
- Add technical skills
- Add college, branch, graduation year, availability, and collaboration preferences
- GitHub, LinkedIn, and portfolio links
- Browse developers using:
  - Search
  - Skill filtering
  - College/availability filters
  - Looking-for filters
  - Sorting
  - Pagination

### Projects
- Create and manage collaboration projects
- Define required technical skills
- Set maximum project members
- Browse available projects
- Search, filter, sort, and paginate projects
- Join projects through a request-based workflow

### Join Requests
- Send requests to join projects
- Project owners can accept or reject requests
- View received project join requests
- View your submitted join requests

### Dashboard
- Overview of personal projects
- Join-request information
- Profile and project statistics

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Python
- Django
- Django REST Framework
- SimpleJWT
- Django Filters
- drf-spectacular

### Database

- PostgreSQL
- Neon PostgreSQL

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL

## Architecture

```text
React + Vite
     │
     │ REST API / JWT
     ▼
Django + Django REST Framework
     │
     ▼
PostgreSQL
     │
     ▼
Neon

The frontend communicates with the Django REST API through Axios. JWT access tokens are used for authenticated requests, with refresh-token handling for expired access tokens.

Backend Highlights
Custom Django user model with email authentication
RESTful API architecture using Django REST Framework
JWT authentication
Relational PostgreSQL data model
Many-to-many relationships for:
Users ↔ Skills
Projects ↔ Skills
Projects ↔ Members
Search, filtering, ordering, and pagination
Production CORS configuration
API documentation with drf-spectacular
Environment-based configuration for production deployment
Local Development
1. Clone the repository
git clone https://github.com/RajwarManas/TechConnect.git
cd TechConnect
2. Backend setup
cd backend
python -m venv venv

Activate the virtual environment:

Windows

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Configure the required environment variables:

SECRET_KEY=your_secret_key
DEBUG=True


ALLOWED_HOSTS=127.0.0.1,localhost


DB_NAME=your_database
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
DB_SSLMODE=disable

Run migrations:

python manage.py migrate

Start the backend:

python manage.py runserver
3. Frontend setup
cd frontend
npm install

Create a .env file:

VITE_API_URL=http://127.0.0.1:8000/api/

Start the development server:

npm run dev
Production

The application is deployed using:

Component	Platform
Frontend	Vercel
Backend	Render
PostgreSQL Database	Neon

Production environment variables are configured separately on the respective deployment platforms.

Project Structure
TechConnect/
│
├── backend/
│   ├── accounts/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   │
│   ├── config/
│   │   └── settings/
│   │
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── routes/
    │   └── utils/
    │
    ├── package.json
    └── vite.config.js
API

The backend exposes REST APIs for:

Authentication
User profiles
Skills
Projects
Join requests
Dashboard data

API documentation is available through the Django REST Framework / OpenAPI documentation configured with drf-spectacular.

Project Goals

TechConnect was built to demonstrate practical full-stack development skills including:

REST API design
Authentication and authorization
Relational database modeling
Many-to-many relationships
Search and filtering
Pagination
Frontend state management
Production deployment
Frontend-backend integration
PostgreSQL database management
Status

Deployed and functional.

The live application is available here:

https://tech-connect-liard.vercel.app/
