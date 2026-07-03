```markdown
# AI-Autonomous-Agency- Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `AI-Autonomous-Agency-` repository, a TypeScript project built with the Vite framework. You'll learn about file naming, import/export styles, commit message conventions, and testing patterns, enabling you to contribute code that aligns with the project's standards.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `userProfile.ts`, `dataFetcher.test.ts`

### Import Style
- Use **alias-based imports** for modules.
  - Example:
    ```typescript
    import { fetchData } from '@/utils/dataFetcher';
    ```

### Export Style
- Use **named exports** for all modules.
  - Example:
    ```typescript
    // utils/dataFetcher.ts
    export function fetchData() { /* ... */ }
    ```

### Commit Messages
- Follow the **conventional commit** format.
- Use the `feat` prefix for new features.
- Keep commit messages concise (average ~67 characters).
  - Example:
    ```
    feat: add user authentication middleware
    ```

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- Test files use the pattern: `*.test.*`
  - Example: `userProfile.test.ts`
- The specific testing framework is unknown, but tests should be placed alongside or near the code they validate, following the naming convention above.

## Commands
| Command | Purpose |
|---------|---------|
| /commit-convention | Show commit message guidelines |
| /file-naming       | Show file naming conventions   |
| /import-style      | Show import/export examples    |
| /test-pattern      | Show test file naming pattern  |
```
