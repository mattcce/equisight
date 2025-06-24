# Getting Started

::: tip Packaging and Deployment Status
This app is presently only available selfhosted.
:::

### Repositories

- [**Frontend**](github.com/mattcce/equisight)
- [**Backend**](github.com/mattcce/equisight-backend)

### Frontend

**Cloning**

1. Clone the frontend repository.
2. Navigate to directory: `cd equisight`.

**Starting up development server**

Minimum `node` version: `v22.16.0` (LTS).

Tested on `node v22.16.0`.

This project uses `pnpm` as its project manager.

1. Install project dependencies: `pnpm install`.
2. Start dev server (default on `localhost:5173`): `pnpm run dev`.

### Backend

**Cloning**

1. Clone the backend repository.
2. Navigate to directory: `cd equisight-backend`.

**Starting up development server**

This project uses `uv` as its project manager.

1. Install project dependencies: `uv sync`.
2. Start dev server (default on `localhost:8000`): `uv run poe dev`.
