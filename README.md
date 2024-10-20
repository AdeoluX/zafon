# Express Authentication and Role-Based Access Control (RBAC) API

This project is an Express-based REST API that provides authentication, session management, and role-based access control (RBAC). The API uses JWT tokens for authentication, Redis for session management, and MongoDB as the database.

## Features

- User Authentication: Sign-up and sign-in functionality for users and admins.
- Session Management: Uses Redis to store session data.
- Role-Based Access Control (RBAC): Admins and regular users have different permissions.
- Testing: Comprehensive testing with `supertest` and `jest`.

## Technologies Used

- Node.js: JavaScript runtime
- Express.js: Web framework for building the API
- TypeScript: Statically typed JavaScript for scalability and reliability
- JWT (JSON Web Token): Token-based authentication
- MongoDB: NoSQL database
- Redis: Session store
- Jest: Testing framework
- Supertest: HTTP assertions for testing API endpoints
- Faker.js: Generate fake data for testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker (optional, for containerized development)
- MongoDB
- Redis

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AdeoluX/gomoneyAssessment.git
cd express-auth-rbac
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables. Create a `.env` file in the root of your project and add the following:

```env
PORT=3445
MONGO_URI=mongodb://localhost:27017/express_auth_rbac
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
TOKEN_SECRET=
NODE_ENV=
```

4. For testing purposes, create a `.env.test` file to store the environment variables used specifically for testing:

```env
PORT=3445
DATABASE_URL=mongodb://localhost:27017/test_auth_rbac
REDIS_URL=redis://localhost:6379
JWT_SECRET=test_jwt_secret
TOKEN_SECRET=
NODE_ENV=
```

### Running the Server

To start the server in development mode:

```bash
yarn dev
```

The server will start at `http://localhost:3445`.

To start the server in production mode:

```bash
yarn start
```

Ensure all environment variables are correctly set in your `.env` file for production.

### Running Tests

The project includes a suite of automated tests using `jest` and `supertest`. The tests will use the `test.env` file for environment variables.

To run the tests:

```bash
yarn test
```

This command will:

- Execute the test suite using `jest` and `supertest`.
- Use the environment variables from `test.env` to run tests.

### Docker Setup

The project uses Docker for containerized development. A `docker-compose.yml` file is provided to help you get started quickly.

To start the containers:

```bash
docker-compose up
```

To run the tests in a Docker container:

```bash
docker-compose run test
```

### Seeding the Database

To seed the MongoDB database with initial data, run the following command:

```bash
yarn seed
```

This command will insert predefined data such as users or admin roles into your MongoDB instance.

Ensure that your `.env` or `.env.test` file contains the correct `DATABASE_URL` for connecting to the database, and the seed script is properly defined in your project.

### API Endpoints

#### Auth Routes

- POST `/api/v1/auth/sign-up` - Register a new user or admin
- POST `/api/v1/auth/sign-in` - Log in an existing user

#### Team Routes

- POST `/api/v1/team` - Create a new team (Admin only)
- GET `/api/v1/team/:id?` - Get all teams (Admin and User)
- PUT `/api/v1/team/:id` - Update a team (Admin)
- DELETE `/api/v1/team/:id` - Delete a team (Admin)

#### Fixture Routes

- POST `/api/v1/fixture` - Create a new fixture (Admin only)
- GET `/api/v1/fixture/:id?` - Get all fixtures (Admin and User)
- PUT `/api/v1/fixture/:id` - Update a fixture (Admin)
- DELETE `/api/v1/fixture/:id` - Delete a fixture (Admin)
- POST `/api/v1/fixture/generate-link/:fixtureId` - Generate a link for a fixture (Admin)
- GET `/api/v1/fixture/links/:fixtureId` - Get links for a fixture (Admin and User)
- GET `/api/v1/fixture/links/:link` - Access a fixture via a generated link (Admin and User)

### Project Structure

The project follows a modular folder structure:

```
src/
│
├── controller/       # Handles API requests and responses
├── models/           # Mongoose models (e.g., User, Team)
├── routes/           # Defines API routes
├── middleware/       # Authentication and other middlewares
├── services/         # Business logic and services
├── utils/            # Utility functions (e.g., JWT handling)
├── config/           # Configuration files (e.g., Redis)
└── validations/      # Input validation schemas and logic
```
