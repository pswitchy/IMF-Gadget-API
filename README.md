# IMF Gadget API

## Mission Objectives

1.  **Gadget Inventory (/gadgets)**
    *   `GET /gadgets`: Retrieve a list of all gadgets with mission success probability.
    *   `POST /gadgets`: Add a new gadget.
    *   `PATCH /gadgets/{id}`: Update a gadget's information.
    *   `DELETE /gadgets/{id}`: Decommission a gadget (mark as "Decommissioned").
2.  **Self-Destruct Sequence (/gadgets/{id}/self-destruct)**
    *   `POST /gadgets/{id}/self-destruct`: Trigger self-destruct sequence.

## Data Requirements

**Gadgets:**

*   `id` (UUID)
*   `name` (string)
*   `status` (enum: ["Available", "Deployed", "Destroyed", "Decommissioned"])
*   `decommissionedAt` (DateTime, nullable)

## Implemented

*   **Robust Authentication and Authorization (JWT):** API endpoints are protected using JWT authentication. User registration and login are implemented.
*   **GET /gadgets?status={status} filter:** Implemented to find gadgets by status.
*   **Error Handling:** Robust error handling with custom error classes and middleware.
*   **Logging:** Implemented using Winston for request logging and error logging.

## Technologies Used

*   Typescript
*   Node.js
*   Express
*   PostgreSQL
*   Prisma ORM
*   JWT (jsonwebtoken) for authentication
*   bcrypt for password hashing
*   Winston for logging
*   Zod for input validation

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository-link>
    cd imf-gadget-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up PostgreSQL:**
    *   Ensure PostgreSQL is installed and running.
    *   Create a database named `imf_gadgets_db` (or your preferred name).
    *   Update the `.env` file with your database connection URL and JWT secret:

        ```env
        DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"
        JWT_SECRET="your-secret-key"
        PORT=3000 # Optional: Set a specific port
        ```

4.  **Run Prisma migrations:**

    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

5.  **Build and start the server:**

    ```bash
    npm run build
    npm run dev         # For development mode
    npm start         # For production mode (after build)
    ```

    The API will be running at `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

Refer to the `postman_collection.json` for a complete list of endpoints and example requests.

*   **Authentication:**
    *   `POST /auth/register`: Register a new user.
    *   `POST /auth/login`: Login and get a JWT token.

*   **Gadgets (Protected - requires JWT token in `Authorization` header):**
    *   `GET /gadgets`: Get all gadgets.
    *   `GET /gadgets?status={status}`: Get gadgets by status.
    *   `POST /gadgets`: Create a new gadget.
    *   `PATCH /gadgets/{id}`: Update a gadget.
    *   `DELETE /gadgets/{id}`: Decommission a gadget.
    *   `POST /gadgets/{id}/self-destruct`: Trigger self-destruct.

## Postman Documentation

Import the `postman_collection.json` file into Postman to explore and test the API endpoints.  The collection includes example requests for all endpoints, including authentication and protected routes.

## Security Considerations

**Password Hashing:**

This API implements password hashing using `bcrypt` to securely store user passwords.  **Never store plain text passwords in a production environment.**  `bcrypt` uses a salt and a computationally expensive hashing algorithm, making it very difficult for attackers to recover original passwords even if the database is compromised.
