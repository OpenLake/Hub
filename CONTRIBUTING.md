# Contributing to OpenLake Hub

Welcome to the **OpenLake Hub** project! We appreciate your interest in contributing.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone** your fork locally.
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Set up environment**:
    Copy `.env.example` to `.env` and adjust if necessary.
    ```bash
    cp .env.example .env
    ```

## Development

-   **Run locally**:
    ```bash
    npm run start:dev
    ```
-   **Run tests**:
    ```bash
    npm run test
    ```
-   **Linting**:
    ```bash
    npm run lint
    ```

## Code Style

-   We use **Prettier** and **ESLint**. Please ensure your code format matches the project standards.
-   Follow the existing directory structure: `src/<module>/...`.
-   Use **NestJS** idioms (Dependency Injection, Decorators, Modules).

## Pull Requests

1.  Create a new branch for your feature or fix.
2.  Commit your changes with clear messages.
3.  Push to your fork and submit a Pull Request.
4.  Ensure CI passes.

## License

By contributing, you agree that your code will be licensed under the MIT License.
