# Media Upload Backend

This is the backend for a media upload application. It provides APIs for user authentication (via Google OAuth), media file uploads, and media file management. The backend is built using **Node.js**, **Express.js**, and **PostgreSQL**, with media files stored in **AWS S3**.

---

## Features

- **Google Authentication**: Users can log in using their Google accounts.
- **Media Upload**: Users can upload media files (images/videos) to AWS S3.
- **Media Management**: Users can view their uploaded media files.
- **Secure**: Uses JWT for authentication and follows best practices for handling sensitive data.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **File Storage**: AWS S3
- **Authentication**: Google OAuth, JWT
- **Hosting**: Render (Backend), Netlify (Frontend)

---

## Prerequisites

Before running the backend, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (or a cloud-hosted PostgreSQL instance)
- [AWS S3 Bucket](https://aws.amazon.com/s3/) (for file storage)
- [Google OAuth Client ID](https://console.cloud.google.com/) (for authentication)

---

## Setup

### 1. Clone the Repository

bash
git clone https://github.com/your-username/media-upload-backend.git
cd media-upload-backend


### 2. Install Dependencies

bash
npm install


### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

plaintext
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name


### 4. Set Up PostgreSQL Database

Run the following SQL commands to create the required tables:

sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "googleId" VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255)
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  "userId" INT,
  "fileUrl" VARCHAR(255),
  FOREIGN KEY ("userId") REFERENCES users(id)
);


### 5. Run the Backend

bash
npm start


The backend will start on `http://localhost:5001`.

---

## API Endpoints

### Authentication

- **POST `/api/auth/google`**
  - Log in or sign up using Google OAuth.
  - Request Body:
    json
    {
      "token": "google_id_token"
    }
    
  - Response:
    json
    {
      "token": "jwt_token",
      "user": {
        "id": 1,
        "googleId": "123456789",
        "email": "user@example.com",
        "name": "John Doe"
      }
    }
    

### Media Upload

- **POST `/api/media/upload`**
  - Upload a media file to AWS S3.
  - Request:
    - Headers: `Authorization: Bearer <jwt_token>`
    - Body: `multipart/form-data` with a file field named `file`.
  - Response:
    json
    {
      "fileUrl": "https://s3.amazonaws.com/your-bucket/filename.jpg"
    }
    

### Media Management

- **GET `/api/media`**
  - Fetch all media files uploaded by the logged-in user.
  - Headers: `Authorization: Bearer <jwt_token>`
  - Response:
    json
    [
      {
        "id": 1,
        "userId": 1,
        "fileUrl": "https://s3.amazonaws.com/your-bucket/filename.jpg"
      }
    ]
    

---

## Deployment

### Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New > Web Service**.
3. Connect your GitHub repository.
4. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add the environment variables from your `.env` file.
6. Click **Create Web Service**.

---

## Environment Variables

| Variable               | Description                          |
|------------------------|--------------------------------------|
| `DATABASE_URL`         | PostgreSQL connection string         |
| `JWT_SECRET`           | Secret key for JWT signing           |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID               |
| `AWS_ACCESS_KEY_ID`    | AWS access key for S3                |
| `AWS_SECRET_ACCESS_KEY`| AWS secret key for S3                |
| `AWS_REGION`           | AWS region for S3                    |
| `S3_BUCKET_NAME`       | Name of the S3 bucket                |

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   bash
   git checkout -b feature/your-feature-name
   
3. Commit your changes:
   bash
   git commit -m "Add your feature"
   
4. Push to the branch:
   bash
   git push origin feature/your-feature-name
   
5. Open a pull request.

---


## Contact

For questions or feedback, reach out to [Chirag Vij](mailto:chiragvij20102002@gmail.com).



---
