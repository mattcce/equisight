# Architecture Overview

EquiSight is a Progressive Web Application (PWA) developed using **Svelte** and **SvelteKit** (frontend) and **Python** (backend).

## Frontend

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

- `markdown` and `markdownlint-cli` are used to lint Markdown files.
