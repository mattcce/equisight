# equisight

## Development

1. Clone repository: `git@github.com:mattcce/equisight.git`
2. Navigate to repository: `cd equisight`

### Setting up node and build system

`node` version: v22.15.1 (LTS)

**macOS/via `brew`**

1. Install `asdf`: `brew install asdf`
   - Note: for additional configuration options/a more detailed setup guide, see the official docs.
2. Install `asdf-nodejs`: `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`
3. Install required node version: `asdf install nodejs` (must be run while within repo; .tool-versions must be visible to asdf)
4. Install `pnpm`: `brew install pnpm`
5. Install project dependencies: `pnpm install`
