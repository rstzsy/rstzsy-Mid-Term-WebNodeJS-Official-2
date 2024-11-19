# Mid-Term-WebNodeJS Project

This project is a Node.js-based web application that connects to MongoDB as its database. The project is containerized using Docker and managed with Docker Compose, featuring a backend API, a frontend, and NGINX for reverse proxy.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Available Routes](#available-routes)
7. [Environment Variables](#environment-variables)
8. [Managing Docker Containers](#managing-docker-containers)
9. [Troubleshooting](#troubleshooting)
10. [Clean Up](#clean-up)

---

## Overview

The application allows users to:
- Register and log in.
- View and manage products.
- Add items to a shopping cart.

---

## Features

- **Authentication**: User login and registration.
- **Product Management**: Admin can add, edit, and delete products.
- **Shopping Cart**: Users can add products to their cart.
- **Database**: Uses MongoDB for storing user and product data.
- **Scalable Backend**: Load-balanced backend services with NGINX.

---

## Prerequisites

Before starting, ensure you have:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/) (version 1.29 or higher)

---

## Installation

### **Step 1: Clone the Repository**
```bash
git clone <repository-url>
cd Mid-Term-WebNodeJS
`````

### Step 2: Install Dependencies
Navigate to the backend directory and install required libraries:
```bash
cd backend
npm install
`````

### Step 3: Set Up Environment Variables
Create a `.env` file in the `backend` directory with the following content:
```bash
PORT=3000
DB_URI=mongodb://mongo:27017/MidTerm
`````

### Step 4: Build and Start Containers
Navigate to the production directory and use Docker Compose to build and start services:
```bash
cd ../production
docker-compose up -d
`````

## Usage
### Access the Application
- Open http://localhost:3000 in your browser to access the frontend.
### Testing MongoDB Connection
To verify MongoDB is working, enter the MongoDB shell:
```bash
docker exec -it <mongo-container-name> mongosh
`````
Then run the following commands:
```bash
use MidTerm;
db.products.find();
`````

## Available Routes
### Public Routes
- `/`Login Page
- `/`register - User Registration
- `/`homepageUser - User Homepage
- `/`product - Product Listing
### Admin Routes
- `/` index - Admin Dashboard
- `/` productRouterAdmin - Admin Product Management

### Environment Variables
The following environment variables are required:
- `PORT`: Port number for the backend service.
- `DB_URI`: MongoDB connection URI (e.g., mongodb://mongo:27017/MidTerm).
Define these variables in a `.env` file in the `backend` directory or pass them directly via Docker Compose.


## Managing Docker Containers
### View Running Containers
```bash
docker ps
`````
### Stop Services
```bash
docker-compose down
`````
### Rebuild and Restart Services
```bash
docker-compose build
docker-compose up -d
`````


## Troubleshooting
### Common Issues
- MongoDB Not Connecting: Check the MongoDB logs:
```bash
docker logs <mongo-container-name>
Ensure the DB_URI is correctly set.
`````


- Port Conflicts: Change the ports in the `docker-compose.yml` file if` 3000`, `3002`, or `3004` are already in use.

- Frontend or Backend Not Loading: Verify all services are running:
```bash
docker-compose ps
`````


## Clean Up
To remove containers, networks, and volumes:
```bash
docker-compose down -v
`````

## Testing
### Run Unit Tests
To run unit tests (if implemented), navigate to the `backend` directory:
```bash
npm test
`````
### Verify Endpoints
Use a tool like Postman or cURL to test API endpoints.

## Contributing
If you wish to contribute:

1. Fork the repository.
2. Create a feature branch (git checkout -b feature-name).
3. Commit your changes (git commit -m "Add feature").
4. Push to the branch (git push origin feature-name).
5. Create a pull request.


