# CLAUDE.md — secure-node-app

## Project Purpose

This is an **intentionally vulnerable** Node.js/Express application used as a **security training and demonstration tool**. It deliberately implements common web application vulnerabilities to teach developers what to avoid in production code. Every "bad" pattern is intentional and labeled with comments.

> **Do not "fix" vulnerabilities unless explicitly asked.** The vulnerabilities are the point.

---

## Architecture

### Structure
Single-file monolith — all application logic lives in [app.js](app.js). There are no subdirectories for routes, controllers, or models. This is intentional to keep the demonstration minimal and readable.

```
secure-node-app/
├── app.js                        # Entire application — middleware, routes, error handler
├── package.json
├── .github/workflows/
│   └── simple-ci.yml             # GitHub Actions CI (currently uses fake tests)
├── semgrep-results.json          # Full Semgrep SAST output (do not edit)
└── semgrep-sast-results.json     # Semgrep summary output (do not edit)
```

### Runtime
- **Node.js** + **Express 5.x**
- Port: `3000` (or `process.env.PORT`)
- Entry point: `node app.js` / `npm start`

### Middleware stack (in order)
1. `helmet()` — basic HTTP security headers
2. `express.json({ limit: '10kb' })` — JSON body parsing
3. `cors({ origin: '*' })` — intentionally permissive CORS

### Dependencies
| Package | Version | Role |
|---|---|---|
| express | ^5.1.0 | Web framework |
| helmet | ^8.1.0 | HTTP header security |
| express-validator | ^7.2.1 | Imported but intentionally unused |

`mysql` and `cors` are `require()`d in app.js but are not in package.json — they are present in node_modules from legacy installs or manual placement.

---

## Intentional Vulnerabilities (Do Not Fix Uninstructed)

| Endpoint | Vulnerability | CWE |
|---|---|---|
| `GET /view-code` | Source code disclosure | — |
| `GET /echo?input=` | Reflected XSS | CWE-79 |
| `GET /set-cookie` | Insecure cookie (no HttpOnly/Secure/SameSite) | — |
| `GET /cors` | Permissive CORS (`*`) | — |
| `GET /command?cmd=` | Command injection via `exec()` | CWE-78 |
| `GET /eval?expr=` | Code injection via `eval()` | CWE-95 |
| `GET /sql?id=` | SQL injection (simulated) | CWE-89 |

`express-validator` is imported but never used — this is intentional to illustrate "security theater."

---

## Coding Conventions

- **Naming:** camelCase for variables and functions; kebab-case for route paths
- **Error handling:**
  - `try/catch` for async routes (see `/view-code`)
  - Callback-style error handling for `exec()` (see `/command`)
  - Global Express error handler at the bottom of the file
- **Comments:** Vulnerable endpoints are marked with `// Vulnerable endpoint: <reason>`
- **No abstraction:** Keep everything flat in app.js. Do not introduce routers, controllers, or middleware files unless specifically requested.
- **No test framework configured** — `npm test` intentionally exits with code 1

---

## CI/CD

GitHub Actions is configured in [.github/workflows/simple-ci.yml](.github/workflows/simple-ci.yml).

- Triggers on push/PR to `main`
- Currently runs fake `echo` test steps (intentional placeholder)
- Current branch for CI work: `feature/ci-test`
- Several draft workflow files exist as `.txt` files in `.github/workflows/` — these are reference drafts, not active workflows

---

## Approaching Common Tasks

### Debugging
1. Run locally: `npm start` — server logs to stdout on port 3000
2. Curl endpoints directly: `curl "http://localhost:3000/health"`
3. Check `console.error` output — the global error handler logs `err.stack`
4. Semgrep results are pre-generated in `semgrep-results.json` — grep there for CWE or rule IDs before re-running scans

### Adding a New Vulnerable Endpoint
1. Add a comment block: `// Vulnerable endpoint: <vulnerability type>`
2. Place it in app.js between the existing routes and the error handler
3. Follow the existing inline pattern — no separate files
4. If simulating a library (like mysql), use the same mock connection pattern from `/sql`

### Adding a New Secure Endpoint (for comparison/contrast demos)
1. Use `express-validator` (already installed) for input validation
2. Use parameterized queries if demonstrating SQL
3. Set explicit cookie flags: `HttpOnly: true, secure: true, sameSite: 'Strict'`
4. Label it clearly so it contrasts with the vulnerable version

### Running Semgrep
```bash
semgrep --config=auto app.js --json > semgrep-results.json
```
Do not commit Semgrep output changes unless the scan was intentionally re-run.

### Working on CI
- Edit `.github/workflows/simple-ci.yml` directly
- Draft workflows live as `.txt` files — rename and move to activate them
- The CI intentionally uses `exit 0` to always pass; switching to `exit 1` tests failure behavior

### Security Analysis / Reporting
- Reference `semgrep-sast-results.json` for a summarized findings list
- Map findings to OWASP Top 10 or CWE IDs using the inline comments in app.js
- Do not redact or sanitize vulnerability details — this is a training tool

---

## What NOT to Do

- Do not sanitize inputs or fix XSS/injection vulnerabilities unless explicitly instructed
- Do not add authentication or authorization middleware unprompted
- Do not split app.js into multiple files or add route modules — keep it flat
- Do not add a real test suite without being asked
- Do not replace the fake CI steps with real ones without being asked
- Do not commit `semgrep-results.json` changes unless a new scan was intentionally run
