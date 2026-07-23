# Contributing

## Getting Started

**Prerequisites**: [Bun](https://bun.sh) (1.2+) and [Rust](https://www.rust-lang.org/tools/install) (1.96.0+).

```bash
git clone https://github.com/overnoir/desktop.git
cd desktop
bun install
cp .env.example .env
bun run tauri:dev
```

## Workflow

1. Create a branch from `dev`
2. Make your changes
3. Open a pull request to `dev`

Branch naming: `feat/description`, `fix/description`, `chore/description`.

## Commits

```
feat(scope): description
fix(scope): description
chore(scope): description
refactor(scope): description
docs: description
```

## Pull Requests

- Fill out the PR template completely
- `bun run lint:fix` must pass
- At least one maintainer review required

## Code Style

ESLint + Prettier handle formatting automatically. TypeScript strict mode is enforced.

## Reporting Issues

- **Bug**: Use the [bug report form](https://github.com/overnoir/desktop/issues/new/choose)
- **Security**: See [SECURITY.md](SECURITY.md)
