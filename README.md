# Aceable Event Log Management App

This is a full-stack web application built as part of the Aceable Software Engineer Assignment. The app allows users to:

- Upload log files.
- Perform flexible **case-insensitive** and **partial-match** search over fields like `serialno`, `account-id`, `instance-id`, `status`, etc.
- View results in a clean, styled table.

## Tech Stack

- **Backend**: Django + Django REST Framework (Python)
- **Frontend**: React + CSS
- **Containerization**: Docker & Docker Compose


## Run the Project Using Docker (Recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- WSL 2 (on Windows) must be properly set up


### Steps to Run the Project Locally

1. **Clone the Repository**

git clone https://github.com/Kanisk2125/aceable-assignment.git

cd aceable-assignment

2. **Build and Start the App with Docker**

docker-compose up --build

This will:

 -Build both frontend and backend containers

 -Install all dependencies

 -Start the app on the respective ports

3. **Access the App**

Frontend (React): http://localhost:3000

Backend API (Django): http://localhost:8000
