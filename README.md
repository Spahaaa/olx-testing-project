# OLX Testing Project (SE302)

Playwright-based end-to-end tests for OLX.ba — course project.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npm run install:browsers
```

3. Run tests:

```bash
npm test
```

Useful scripts

- `npm test` — run the Playwright test suite
- `npm run test:headed` — run tests with headed browsers
- `npm run test:report` — open Playwright HTML report

Notes

- The project uses TypeScript for page objects and tests. If you add new TS files, ensure `tsconfig.json` stays in the project root.
- Configure CI to run `npm ci` and `npx playwright install` before test execution.

Evidence & packaging (quick commands)

- After installing Node and Playwright browsers, run the full suite and collect evidence:

```powershell
npm run test:ci
npm run collect:evidence
```

- To convert the markdown report to PDF (requires `md-to-pdf` via npx) run:

```powershell
npm run report:pdf
```

- To produce a submission ZIP:

```powershell
npm run package:zip
```

Notes: These scripts use PowerShell helpers in the `scripts/` folder and assume a Windows environment. If you run on Linux/macOS, adapt the commands or run the Playwright reporter and zipping commands natively.
