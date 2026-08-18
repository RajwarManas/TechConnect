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
