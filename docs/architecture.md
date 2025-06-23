# Architecture Overview

EquiSight is a Progressive Web Application (PWA) developed using **Svelte** and **SvelteKit** (frontend) and **Python** (backend).

## High-Level Overview

EquiSight follows a clear separation of concerns between frontend presentation and backend processing, designed to serve retail investors across varying experience levels while maintaining scalability and performance.

![EquiSight system context diagram](./assets/architecture.svg)

The application implements a traditional client-server architecture with a clear separation between presentation and business logic layers. This architectural decision was made to optimize for the specific requirements of financial data processing and analysis.

### Design Philosophy

This architecture was motivated by the following concerns and considerations.

1. **Resource Optimization**: Shared computational resources reduce redundant API calls and processing overhead, which is especially important as this uses public APIs
2. **Scalability**: Server-side processing allows for better resource management, especially with potentially computationally-intensive analyses programs, which may not be feasible to run on handheld or consumer devices
3. **Security**: Requests to access protected user data is authenticated at the source (the backend), limiting attack vectors that target the frontend.

## Frontend

The frontend serves as a presentation layer with intentionally limited responsibilities:

- **Data Visualization**: Rendering charts, tables, and analytical results
- **User Interface**: Providing intuitive navigation and interaction patterns
- **Communication Gateway**: Facilitate requests to backend services

The decision to maintain a thin frontend is driven by the nature of the user base. Retail investors require:

- **Consistent Experience**: Server-side processing ensures identical results across devices and browsers
- **Reduced Client Load**: Complex financial calculations don't burden user devices
- **Simplified Maintenance**: Business logic centralization reduces deployment complexity

### Development Ecosystem

EquiSight's frontend is developed entirely in **Svelte** and **TypeScript**. TypeScript offers type safety, while Svelte offers an extremely simple manner of constructing reusable web components.

**SvelteKit** is a framework that has first-class integration with Svelte; it provides a complete build system for the frontend, enabling the building of web applications.

Accompanying these technologies are:

- **Prettier** for consistent code formatting,
- **ESLint** for linting and code standards,
- **Vite**, used by SvelteKit under the hood to build the web application, and
- **Vitest**, for frontend unit and integration testing.

Other tools used in the development ecosystem include:

- **`git`**, for version control,
- **`husky`**, for git hooks,
- **`asdf`**, for managing project runtimes,
- **`node`**, the JS runtime,
- **`pnpm`**, for package management.

## Backend

The backend handles the application's computational and data management workload.

### Data Management

- **User Data Persistence**: Account information, watchlists, and historical analyses
- **Session Management**: Authentication and authorization
- **Data Caching**: Strategic caching of frequently accessed financial data to reduce burden on public APIs

### External API Integration

- **Market Data Aggregation**: Real-time and historical financial data retrieval
- **API Rate Limit Management**: Coordinating requests across multiple users to prevent throttling
- **Data Normalization**: Standardizing data formats from various external sources

### Analysis Engine

- **Computational Processing**: Executing user-requested financial analyses
- **Algorithm Execution**: Running complex investment calculations and risk assessments
- **Result Caching**: Storing computation results to avoid redundant processing

### Development Ecosystem

EquiSight's backend is developed in **Python**, using the **FastAPI** framework.

Alongside these are:

- **`ruff`**, for formatting and linting, and
- **`pytest`**, for testing.

Other tools used in the development ecosystem include:

- **`git`**, for version control,
- **`pre-commit`**, for git hooks,
- **`uv`**, for managing Python packages and runtime, and
- **`poe`**, for scripts.

## Documentation

Developer-facing documentation is written and generated with **VitePress**, a static site generator used primarily for generating documentation. Documentation is written internally with Markdown files.

- **`markdown`** and **`markdownlint-cli`** are used to lint Markdown files.
- **`d2`** is used to generate diagrams using the declarative diagramming paradigm.
