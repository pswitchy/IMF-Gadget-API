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

## Bonus Points Implemented

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

**HTTPS for Production:**

**It is absolutely critical to deploy this API over HTTPS in a production environment.** HTTPS encrypts all communication between clients and the server, protecting sensitive data such as login credentials, JWT tokens, and gadget information from eavesdropping and man-in-the-middle attacks.

**Without HTTPS, your API is vulnerable to serious security breaches.** Ensure your deployment platform (Heroku, Render, Railway, etc.) is properly configured to use HTTPS with a valid SSL/TLS certificate.

**Further Security Enhancements (Beyond Scope of this Basic API):**

*   **Input Validation and Sanitization:**  While basic input validation is implemented with Zod, more comprehensive validation and sanitization should be considered for production.
*   **Rate Limiting:** Implement rate limiting to protect against brute-force attacks and denial-of-service attempts.
*   **Regular Security Audits:**  Conduct regular security audits and penetration testing to identify and address potential vulnerabilities.
*   **Database Security:** Secure your PostgreSQL database with strong credentials, network firewalls, and regular backups.
*   **JWT Best Practices:**  Consider JWT refresh tokens for longer sessions and implement proper token revocation mechanisms if needed.

## Deployment

This API is designed to be deployed on platforms like Heroku, Render, or Railway.

**Deployment Steps (General - may vary based on platform):**

1.  **Create an account** on your chosen platform (e.g., Heroku, Render, Railway).
2.  **Install the platform's CLI** if required.
3.  **Create a new application** on the platform.
4.  **Connect your GitHub repository** to the application.
5.  **Set environment variables** on the platform:
    *   `DATABASE_URL`: Your PostgreSQL database connection string (provided by the platform's database addon or your external database).
    *   `JWT_SECRET`:  A strong, randomly generated secret key for JWT signing.
    *   `PORT`: (Optional, but often automatically configured by the platform).
6.  **Configure a Procfile** (already included in the repository root):
    ```
    web: node dist/server.js
    ```
7.  **Deploy the application.**  This is usually done by pushing your code to the platform's Git repository or using the platform's CLI.
8.  **Set up a PostgreSQL addon** (if the platform provides one) or connect to an external PostgreSQL database.
9.  **Ensure HTTPS is enabled** for your deployed application. This is usually automatically handled by modern deployment platforms.

Refer to the specific documentation of your chosen deployment platform for detailed instructions.

## Contributing

[Add contribution guidelines if applicable]

## License

[Add license information if applicable]