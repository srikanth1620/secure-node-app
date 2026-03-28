const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents, ExternalHyperlink, UnderlineType,
} = require("docx");
const fs = require("fs");

// ─── Constants ────────────────────────────────────────────────────────────────
const NAVY   = "0F2342";
const TEAL   = "0D9488";
const ORANGE = "F97316";
const RED    = "DC2626";
const GREEN  = "16A34A";
const WHITE  = "FFFFFF";
const LIGHT_GRAY = "F1F5F9";
const SLATE  = "64748B";
const DARK   = "1E293B";
const TEAL_LIGHT = "CCFBF1";
const NAVY_LIGHT  = "DBEAFE";
const ORANGE_LIGHT = "FEF3C7";
const RED_LIGHT   = "FEE2E2";
const GREEN_LIGHT = "DCFCE7";

const PAGE_W  = 12240; // 8.5"
const PAGE_H  = 15840; // 11"
const MARGIN  = 1080;  // 0.75"
const CONTENT_W = PAGE_W - MARGIN * 2; // 10080

// ─── Helper: border object ────────────────────────────────────────────────────
const border = (color = "CCCCCC", size = 1) => ({ style: BorderStyle.SINGLE, size, color });
const allBorders = (color = "CCCCCC", size = 1) => ({
  top: border(color, size), bottom: border(color, size),
  left: border(color, size), right: border(color, size),
});
const noBorders = () => ({
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
});

// ─── Helper: make a cell ──────────────────────────────────────────────────────
function cell(children, opts = {}) {
  return new TableCell({
    children: Array.isArray(children) ? children : [children],
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    borders: opts.borders || allBorders(),
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: opts.valign || VerticalAlign.TOP,
    columnSpan: opts.colspan,
  });
}

// ─── Helper: paragraph shorthands ────────────────────────────────────────────
function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before ?? 60, after: opts.after ?? 60 },
    children: [new TextRun({
      text,
      bold: opts.bold,
      color: opts.color || DARK,
      size: opts.size || 20, // 10pt default
      font: opts.font || "Arial",
      italics: opts.italic,
    })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 36, font: "Arial" })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, color: TEAL, size: 28, font: "Arial" })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, color: DARK, size: 24, font: "Arial" })],
  });
}

function h4(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_4,
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, bold: true, color: SLATE, size: 22, font: "Arial", italics: true })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before ?? 80, after: opts.after ?? 100 },
    indent: opts.indent ? { left: opts.indent } : undefined,
    children: [new TextRun({
      text,
      color: opts.color || DARK,
      size: 20,
      font: "Arial",
      bold: opts.bold,
      italics: opts.italic,
    })],
  });
}

function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level: opts.level || 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, color: opts.color || DARK, size: 20, font: "Arial", bold: opts.bold })],
  });
}

function spacer(lines = 1) {
  return new Paragraph({ children: [new TextRun("")], spacing: { before: 60 * lines, after: 0 } });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ─── Callout / info box ───────────────────────────────────────────────────────
function callout(title, lines, color = NAVY_LIGHT, titleColor = NAVY) {
  const rows = [];
  // Title row
  rows.push(new TableRow({ children: [
    cell(new Paragraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: title, bold: true, color: titleColor, size: 20, font: "Arial" })],
    }), { fill: color, borders: noBorders(), width: CONTENT_W }),
  ]}));
  // Content rows
  lines.forEach(line => {
    rows.push(new TableRow({ children: [
      cell(new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: line, color: DARK, size: 19, font: "Arial" })],
      }), { fill: color, borders: noBorders(), width: CONTENT_W }),
    ]}));
  });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows,
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
  });
}

// ─── Code block ───────────────────────────────────────────────────────────────
function codeBlock(lines) {
  const rows = lines.map(line => new TableRow({ children: [
    cell(new Paragraph({
      spacing: { before: 20, after: 20 },
      children: [new TextRun({ text: line, font: "Courier New", size: 16, color: "D4F1F4" })],
    }), { fill: "1A2B3C", borders: noBorders(), width: CONTENT_W }),
  ]}));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows,
  });
}

// ─── Two-column comparison table ─────────────────────────────────────────────
function compareTable(headers, rows) {
  const hw = Math.floor(CONTENT_W / 2);
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [hw, hw],
    rows: [
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: headers[0], bold: true, color: WHITE, size: 20, font: "Arial" })] }),
          { fill: NAVY, borders: allBorders(NAVY), width: hw }),
        cell(new Paragraph({ children: [new TextRun({ text: headers[1], bold: true, color: WHITE, size: 20, font: "Arial" })] }),
          { fill: TEAL, borders: allBorders(TEAL), width: hw }),
      ]}),
      ...rows.map(([left, right], i) => new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: left, size: 19, font: "Arial", color: DARK })] }),
          { fill: i % 2 === 0 ? WHITE : NAVY_LIGHT, borders: allBorders(), width: hw }),
        cell(new Paragraph({ children: [new TextRun({ text: right, size: 19, font: "Arial", color: DARK })] }),
          { fill: i % 2 === 0 ? WHITE : TEAL_LIGHT, borders: allBorders(), width: hw }),
      ]})),
    ],
  });
}

// ─── Header / Footer ─────────────────────────────────────────────────────────
const docHeader = new Header({
  children: [
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL, space: 1 } },
      alignment: AlignmentType.RIGHT,
      spacing: { before: 0, after: 120 },
      children: [new TextRun({ text: "Secure SDLC Guide  |  Confidential", color: SLATE, size: 17, font: "Arial" })],
    }),
  ],
});

const docFooter = new Footer({
  children: [
    new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: TEAL, space: 1 } },
      spacing: { before: 120, after: 0 },
      children: [
        new TextRun({ text: "© 2026 Security Team  |  ", color: SLATE, size: 17, font: "Arial" }),
        new TextRun({ children: [PageNumber.CURRENT], color: SLATE, size: 17, font: "Arial" }),
      ],
    }),
  ],
});

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

const children = [];

// ─── COVER PAGE ───────────────────────────────────────────────────────────────
children.push(
  spacer(6),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: "Secure Software Development Life Cycle", bold: true, color: NAVY, size: 56, font: "Arial" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text: "A Comprehensive Guide to GitHub-First Pipeline Security", color: TEAL, size: 32, font: "Arial", italics: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 8, color: TEAL, space: 6 } },
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text: "Pull Requests · Approval Gates · Semantic Release · CI/CD Security", color: SLATE, size: 22, font: "Arial" })],
  }),
  spacer(4),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: "Version 1.0  |  March 2026", color: SLATE, size: 20, font: "Arial" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: "Classification: Internal Use", color: RED, size: 20, font: "Arial", bold: true })],
  }),
  pageBreak(),
);

// ─── TABLE OF CONTENTS ────────────────────────────────────────────────────────
children.push(
  new Paragraph({
    spacing: { before: 200, after: 160 },
    children: [new TextRun({ text: "Table of Contents", bold: true, color: NAVY, size: 36, font: "Arial" })],
  }),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
  pageBreak(),
);

// ─── 1. EXECUTIVE SUMMARY ────────────────────────────────────────────────────
children.push(
  h1("1. Executive Summary"),
  body("Modern software delivery demands that security is not an afterthought — it is an engineering discipline embedded throughout every phase of development. This guide defines the Secure Software Development Life Cycle (Secure SDLC) with a focus on GitHub-native tooling, CI/CD pipeline security, pull request governance, approval gates, and automated release practices."),
  body("Organizations that adopt Secure SDLC principles consistently see:"),
  bullet("80% reduction in critical vulnerabilities reaching production"),
  bullet("30× lower cost to remediate defects found in requirements vs. production"),
  bullet("Faster compliance certification (SOC 2, ISO 27001, PCI-DSS)"),
  bullet("Reduced mean time to detect (MTTD) and mean time to respond (MTTR)"),
  spacer(),
  callout("Key Principle", [
    "Security is everyone's responsibility. Secure SDLC moves security left — embedding it",
    "at every phase so that developers, not just security engineers, own secure outcomes.",
  ], TEAL_LIGHT, TEAL),
  pageBreak(),
);

// ─── 2. SDLC vs SECURE SDLC ──────────────────────────────────────────────────
children.push(
  h1("2. Traditional SDLC vs. Secure SDLC"),
  h2("2.1 What is the Traditional SDLC?"),
  body("The Software Development Life Cycle (SDLC) is a structured process for planning, creating, testing, and delivering software. Traditional SDLC models — Waterfall, Agile, and iterative — focus on functional delivery: meeting requirements, shipping features, and maintaining systems. Security is typically addressed at the end of the cycle, if at all, as a separate audit or penetration test before release."),
  spacer(),
  h2("2.2 What is Secure SDLC?"),
  body("Secure SDLC integrates security practices, tools, and checkpoints into every phase of traditional SDLC. Rather than a security review at the end, security requirements are captured at inception, threat models are built during design, static analysis runs on every commit, and runtime monitoring provides continuous assurance in production."),
  spacer(),
  h2("2.3 Side-by-Side Comparison"),
  compareTable(
    ["Traditional SDLC", "Secure SDLC"],
    [
      ["Security reviewed at the end (pentest before release)", "Security integrated at every phase from day one"],
      ["Security is the security team's responsibility", "Security is every developer's responsibility"],
      ["Vulnerabilities found late — expensive to fix", "Vulnerabilities found early — cheap to fix"],
      ["Manual code reviews for functionality", "Automated SAST + security-focused peer reviews"],
      ["Dependencies updated on best-effort basis", "Automated SCA with enforced patching SLAs"],
      ["No formal threat model", "STRIDE threat model produced at design phase"],
      ["Secrets stored in config files or environment", "Secrets managed in Vault / GitHub Secrets"],
      ["Manual deployment, ad-hoc approvals", "Gated pipeline with required approvals and automated checks"],
      ["No formal release process", "Semantic release with signed artifacts and SBOM"],
      ["Compliance audit once per year", "Continuous compliance via automated policy-as-code"],
    ]
  ),
  spacer(),
  h2("2.4 Phase-by-Phase Security Additions"),
  compareTable(
    ["SDLC Phase", "Security Addition (Secure SDLC)"],
    [
      ["Requirements: gather features", "Add abuse cases, security requirements, compliance mapping"],
      ["Design: architect the system", "STRIDE threat modeling, attack surface analysis, trust boundaries"],
      ["Development: write code", "SAST, secure coding standards, secret scanning, SCA"],
      ["Testing: validate functionality", "DAST, fuzz testing, pen testing, security regression suite"],
      ["Deployment: release to production", "IaC scanning, image signing, secrets injection, approval gates"],
      ["Maintenance: bug fixes, updates", "CVE patching SLAs, SIEM monitoring, incident response"],
    ]
  ),
  pageBreak(),
);

// ─── 3. GITHUB SECURITY FEATURES ─────────────────────────────────────────────
children.push(
  h1("3. GitHub Security Features"),
  body("GitHub provides a rich set of native security controls that form the foundation of a Secure SDLC when using GitHub as your source control and CI/CD platform."),
  spacer(),

  h2("3.1 Branch Protection Rules"),
  body("Branch protection rules prevent direct pushes to critical branches and enforce quality and security gates before code merges."),
  spacer(),
  codeBlock([
    "# .github/branch-protection.yml (via GitHub API or Terraform)",
    "# Recommended settings for 'main' and 'release/*' branches:",
    "",
    "required_status_checks:",
    "  strict: true   # Branch must be up-to-date before merge",
    "  contexts:",
    "    - 'ci/sast'",
    "    - 'ci/sca'",
    "    - 'ci/unit-tests'",
    "    - 'ci/secret-scan'",
    "",
    "enforce_admins: true              # Applies rules to admins too",
    "required_pull_request_reviews:",
    "  required_approving_review_count: 2",
    "  dismiss_stale_reviews: true     # Re-review required after new commits",
    "  require_code_owner_reviews: true",
    "  require_last_push_approval: true",
    "",
    "restrictions:                     # Only specific teams can push",
    "  teams: [release-engineers]",
    "",
    "required_conversation_resolution: true",
    "required_signatures: true         # Signed commits only",
    "allow_force_pushes: false",
    "allow_deletions: false",
  ]),
  spacer(),

  h2("3.2 CODEOWNERS"),
  body("CODEOWNERS automatically assigns reviewers based on file ownership, ensuring security-sensitive areas always get reviewed by the right team."),
  spacer(),
  codeBlock([
    "# .github/CODEOWNERS",
    "",
    "# Global fallback — all changes reviewed by core team",
    "*                       @org/core-engineering",
    "",
    "# Security-critical paths require security team review",
    "/src/auth/**            @org/security-team @org/auth-team",
    "/src/crypto/**          @org/security-team",
    "/src/payments/**        @org/security-team @org/payments-team",
    "",
    "# Infrastructure and secrets reviewed by platform team",
    "/infra/**               @org/platform-team @org/security-team",
    "/terraform/**           @org/platform-team",
    "/.github/workflows/**   @org/platform-team @org/security-team",
    "",
    "# Dependency changes require security review",
    "package.json            @org/security-team",
    "package-lock.json       @org/security-team",
    "Dockerfile              @org/platform-team @org/security-team",
  ]),
  spacer(),

  h2("3.3 Signed Commits"),
  body("Commit signing (GPG or SSH) ensures code authenticity — every commit can be traced to a verified identity, preventing spoofing and supply chain compromise."),
  spacer(),
  codeBlock([
    "# Developer workstation setup",
    "git config --global commit.gpgsign true",
    "git config --global gpg.format ssh",
    "git config --global user.signingkey ~/.ssh/id_ed25519.pub",
    "",
    "# Verify a commit signature",
    "git log --show-signature -1",
    "",
    "# Enforce signed commits in GitHub Actions",
    "- name: Verify commit signatures",
    "  uses: actions/checkout@v4",
    "  with:",
    "    ref: ${{ github.sha }}",
    "- run: |",
    "    git verify-commit HEAD || {",
    "      echo '::error::Unsigned commit detected. All commits must be GPG-signed.'",
    "      exit 1",
    "    }",
  ]),
  spacer(),

  h2("3.4 GitHub Advanced Security (GHAS)"),
  body("GitHub Advanced Security provides three integrated security products available on GitHub Enterprise and public repositories:"),
  spacer(),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2500, 4000, 3580],
    rows: [
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Feature", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, borders: allBorders(NAVY), width: 2500 }),
        cell(new Paragraph({ children: [new TextRun({ text: "What it does", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, borders: allBorders(NAVY), width: 4000 }),
        cell(new Paragraph({ children: [new TextRun({ text: "When it runs", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, borders: allBorders(NAVY), width: 3580 }),
      ]}),
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Code Scanning (CodeQL)", size: 19, font: "Arial", bold: true, color: TEAL })] }), { fill: WHITE, width: 2500 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Static analysis for security vulnerabilities, CWE mapping, SARIF output", size: 19, font: "Arial" })] }), { fill: WHITE, width: 4000 }),
        cell(new Paragraph({ children: [new TextRun({ text: "On push, PR, and scheduled", size: 19, font: "Arial" })] }), { fill: WHITE, width: 3580 }),
      ]}),
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Secret Scanning", size: 19, font: "Arial", bold: true, color: TEAL })] }), { fill: LIGHT_GRAY, width: 2500 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Detects 200+ secret patterns (API keys, tokens, certificates) in code and history", size: 19, font: "Arial" })] }), { fill: LIGHT_GRAY, width: 4000 }),
        cell(new Paragraph({ children: [new TextRun({ text: "On push (blocks high-confidence secrets before merge)", size: 19, font: "Arial" })] }), { fill: LIGHT_GRAY, width: 3580 }),
      ]}),
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Dependabot", size: 19, font: "Arial", bold: true, color: TEAL })] }), { fill: WHITE, width: 2500 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Automated PRs for vulnerable and outdated dependencies; alerts on known CVEs", size: 19, font: "Arial" })] }), { fill: WHITE, width: 4000 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Continuous (daily CVE feed), PRs raised automatically", size: 19, font: "Arial" })] }), { fill: WHITE, width: 3580 }),
      ]}),
    ],
  }),
  spacer(),
  codeBlock([
    "# .github/workflows/codeql.yml",
    "name: CodeQL Analysis",
    "on:",
    "  push:",
    "    branches: [main, release/*]",
    "  pull_request:",
    "    branches: [main]",
    "  schedule:",
    "    - cron: '0 2 * * 1'  # Weekly Monday 2am",
    "",
    "jobs:",
    "  analyze:",
    "    runs-on: ubuntu-latest",
    "    permissions:",
    "      security-events: write",
    "      contents: read",
    "    strategy:",
    "      matrix:",
    "        language: [javascript, python]",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - uses: github/codeql-action/init@v3",
    "        with:",
    "          languages: ${{ matrix.language }}",
    "          queries: security-extended,security-and-quality",
    "      - uses: github/codeql-action/autobuild@v3",
    "      - uses: github/codeql-action/analyze@v3",
    "        with:",
    "          category: '/language:${{ matrix.language }}'",
    "          fail-on: error  # Fail pipeline on critical findings",
  ]),
  pageBreak(),
);

// ─── 4. PULL REQUEST WORKFLOW ─────────────────────────────────────────────────
children.push(
  h1("4. Pull Request Workflow"),
  body("Pull Requests (PRs) are the primary control point for code quality and security in a GitHub-based workflow. A well-structured PR process is a critical security gate."),
  spacer(),

  h2("4.1 PR Template"),
  body("A PR template enforces consistency and prompts authors to self-assess security impact before requesting review."),
  spacer(),
  codeBlock([
    "# .github/pull_request_template.md",
    "",
    "## Summary",
    "<!-- What does this PR do? Why? Link to issue/ticket -->",
    "",
    "## Type of Change",
    "- [ ] Bug fix (non-breaking)",
    "- [ ] New feature",
    "- [ ] Breaking change",
    "- [ ] Security fix",
    "- [ ] Dependency update",
    "",
    "## Security Checklist",
    "- [ ] No secrets, API keys, or credentials committed",
    "- [ ] Input validation added for all user-controlled inputs",
    "- [ ] Authentication/authorization logic reviewed",
    "- [ ] No new SQL queries without parameterization",
    "- [ ] Dependencies updated and free of known CVEs",
    "- [ ] Error messages do not expose internal state",
    "- [ ] Logging added — no PII/secrets in logs",
    "- [ ] Threat model updated if new data flows introduced",
    "",
    "## Testing",
    "- [ ] Unit tests pass",
    "- [ ] Security regression tests pass",
    "- [ ] Tested locally / in dev environment",
    "",
    "## Deployment Notes",
    "<!-- Any infra changes, env vars, migration scripts needed? -->",
    "",
    "## References",
    "<!-- Ticket, ADR, threat model link -->",
  ]),
  spacer(),

  h2("4.2 PR Size and Scope"),
  body("Large PRs are a security risk — reviewers cannot effectively catch vulnerabilities in 1,000-line diffs. Enforce PR size limits."),
  spacer(),
  callout("Best Practice: PR Size Limits", [
    "Ideal PR size: <400 lines changed. Maximum: 800 lines.",
    "Use Danger or GitHub Actions to block oversized PRs automatically.",
    "Security-sensitive files (auth, crypto, payments) require separate, focused PRs.",
  ], ORANGE_LIGHT, ORANGE),
  spacer(),
  codeBlock([
    "# .github/workflows/pr-size-check.yml",
    "name: PR Size Check",
    "on: [pull_request]",
    "jobs:",
    "  size-check:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - name: Check PR size",
    "        uses: actions/github-script@v7",
    "        with:",
    "          script: |",
    "            const { data } = await github.rest.pulls.get({",
    "              owner: context.repo.owner,",
    "              repo: context.repo.repo,",
    "              pull_number: context.issue.number",
    "            });",
    "            const additions = data.additions + data.deletions;",
    "            if (additions > 800) {",
    "              core.setFailed(`PR too large: ${additions} lines. Split into smaller PRs.`);",
    "            }",
  ]),
  spacer(),

  h2("4.3 Required Reviewers and CODEOWNERS"),
  body("GitHub enforces CODEOWNERS automatically — if a changed file matches a CODEOWNERS pattern, the designated owner is added as a required reviewer and the PR cannot merge without their approval."),
  spacer(),
  compareTable(
    ["Without CODEOWNERS", "With CODEOWNERS"],
    [
      ["Anyone can approve any PR", "Only designated owners can approve sensitive files"],
      ["Security changes may be reviewed by non-security engineers", "Auth/crypto changes always reviewed by security team"],
      ["No audit trail of who owns what", "Ownership documented and version-controlled"],
      ["Workflow changes approved by developers", "Pipeline changes require platform + security team approval"],
    ]
  ),
  spacer(),

  h2("4.4 Draft PRs and Work-in-Progress"),
  body("Draft PRs allow developers to get early feedback without triggering full review workflows. Security checks still run on draft PRs — this is intentional to surface issues early."),
  spacer(),
  codeBlock([
    "# Enforce SAST and secret scanning on draft PRs too",
    "on:",
    "  pull_request:",
    "    types: [opened, synchronize, reopened, ready_for_review]",
    "    # types: [ready_for_review]  <-- WRONG: skips security checks on drafts",
  ]),
  pageBreak(),
);

// ─── 5. APPROVAL GATES ────────────────────────────────────────────────────────
children.push(
  h1("5. Approval Gates"),
  body("Approval gates are mandatory checkpoints in the pipeline that enforce policy compliance before code advances to the next stage. They are the enforcement mechanism that makes Secure SDLC a reality."),
  spacer(),

  h2("5.1 Required Status Checks"),
  body("Required status checks are CI/CD jobs that must pass before a PR can be merged. They are configured at the branch protection level."),
  spacer(),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2800, 3500, 3080],
    rows: [
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Check Name", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 2800 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Purpose", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 3500 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Tool", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 3080 }),
      ]}),
      ...([
        ["ci/sast", "Static application security testing — catch code flaws", "Semgrep, CodeQL, SonarQube"],
        ["ci/secret-scan", "Detect secrets and credentials in code", "GitLeaks, GHAS Secret Scanning"],
        ["ci/sca", "Identify vulnerable dependencies", "Snyk, Dependabot, OWASP Dep-Check"],
        ["ci/unit-tests", "Functional correctness including security tests", "Jest, pytest, JUnit"],
        ["ci/lint", "Code style and security anti-pattern enforcement", "ESLint (security plugin), Bandit"],
        ["ci/pr-size", "Block oversized PRs that hide security issues", "Custom GitHub Action"],
        ["ci/iac-scan", "Catch misconfigurations in Terraform/K8s", "Checkov, tfsec"],
        ["ci/commit-sign", "Verify GPG/SSH commit signatures", "Custom git verify step"],
      ].map(([name, purpose, tool], i) => new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: name, font: "Courier New", size: 17, bold: true, color: TEAL })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 2800 }),
        cell(new Paragraph({ children: [new TextRun({ text: purpose, size: 19, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 3500 }),
        cell(new Paragraph({ children: [new TextRun({ text: tool, size: 19, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 3080 }),
      ]}))),
    ],
  }),
  spacer(),

  h2("5.2 Environment Protection Rules"),
  body("GitHub Environment Protection Rules add manual approval requirements and deployment policies for each environment (staging, production)."),
  spacer(),
  codeBlock([
    "# Settings > Environments > production > Protection Rules",
    "",
    "Required reviewers:",
    "  - @org/release-engineers   (1 required)",
    "  - @org/security-team       (1 required)",
    "",
    "Wait timer: 5 minutes   # Cool-down period before auto-deploy",
    "",
    "Deployment branches: release/* and main only",
    "",
    "Required checks before deployment:",
    "  - ci/sast",
    "  - ci/dast-staging",
    "  - ci/pen-test-smoke",
    "  - ci/compliance-check",
  ]),
  spacer(),
  codeBlock([
    "# .github/workflows/deploy-production.yml",
    "jobs:",
    "  deploy-production:",
    "    runs-on: ubuntu-latest",
    "    environment: production   # Triggers environment protection rules",
    "    needs: [sast, dast, sca, compliance]",
    "    steps:",
    "      - name: Deploy to Production",
    "        run: ./scripts/deploy.sh production",
    "      - name: Post-deploy smoke test",
    "        run: ./scripts/smoke-test.sh",
  ]),
  spacer(),

  h2("5.3 Manual Approval Gates in GitHub Actions"),
  body("For critical deployments, require human approval mid-pipeline using GitHub Environments — the pipeline pauses and sends notifications to approvers."),
  spacer(),
  codeBlock([
    "# Full example: gated production deployment",
    "name: Production Release",
    "",
    "on:",
    "  push:",
    "    tags: ['v*.*.*']",
    "",
    "jobs:",
    "  security-scan:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - name: SAST",
    "        run: semgrep --config auto --error",
    "      - name: Container scan",
    "        run: trivy image --exit-code 1 --severity HIGH,CRITICAL $IMAGE",
    "",
    "  staging-deploy:",
    "    needs: security-scan",
    "    environment: staging",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - run: ./scripts/deploy.sh staging",
    "",
    "  integration-tests:",
    "    needs: staging-deploy",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - name: DAST scan",
    "        run: zap-baseline.py -t https://staging.example.com -r dast-report.html",
    "      - name: Upload DAST report",
    "        uses: actions/upload-artifact@v4",
    "        with:",
    "          name: dast-report",
    "          path: dast-report.html",
    "",
    "  production-approval:    # PAUSES here — waits for human approval",
    "    needs: integration-tests",
    "    environment: production   # Protected environment requires approvers",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - run: echo 'Production deployment approved — proceeding'",
    "",
    "  production-deploy:",
    "    needs: production-approval",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - run: ./scripts/deploy.sh production",
  ]),
  pageBreak(),
);

// ─── 6. PIPELINE SECURITY ─────────────────────────────────────────────────────
children.push(
  h1("6. Pipeline Security"),
  body("A secure CI/CD pipeline is the operational backbone of Secure SDLC. Every stage of the pipeline — from source control to production — must have defined security gates that are automated, enforced, and auditable."),
  spacer(),

  h2("6.1 Pipeline Overview"),
  compareTable(
    ["Traditional Pipeline", "Secure Pipeline"],
    [
      ["Lint → Build → Test → Deploy", "Secret scan → SAST → SCA → Build → Test → DAST → IaC scan → Approve → Sign → Deploy"],
      ["Security scan runs occasionally", "Security gates block every merge and every deployment"],
      ["Secrets in environment variables", "Secrets injected from Vault/GitHub Secrets at runtime"],
      ["Container images pulled from public registries", "Images scanned, signed, and pulled from private registries"],
      ["Anyone can trigger a production deploy", "Production requires approval from 2+ authorized engineers"],
      ["No SBOM or artifact provenance", "SLSA-compliant provenance and SBOM generated on every release"],
    ]
  ),
  spacer(),

  h2("6.2 Stage 1 — Source Control Security"),
  body("Security controls at the source control stage prevent bad code from ever entering the repository."),
  spacer(),
  callout("Controls at this stage:", [
    "* Branch protection rules (required reviews, status checks, no force push)",
    "* CODEOWNERS for security-sensitive paths",
    "* Signed commits enforced",
    "* Push protection: blocks secrets before they land in git history",
    "* GitLeaks / GHAS secret scanning runs on every push",
  ], NAVY_LIGHT, NAVY),
  spacer(),
  codeBlock([
    "# .github/workflows/secret-scan.yml",
    "name: Secret Scanning",
    "on: [push, pull_request]",
    "",
    "jobs:",
    "  gitleaks:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "        with:",
    "          fetch-depth: 0  # Full history scan",
    "      - uses: gitleaks/gitleaks-action@v2",
    "        env:",
    "          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}",
    "          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}",
  ]),
  spacer(),

  h2("6.3 Stage 2 — Build Security (SAST + SCA)"),
  h3("6.3.1 Static Application Security Testing (SAST)"),
  body("SAST tools analyze source code without executing it, finding injection flaws, insecure patterns, and logic errors."),
  spacer(),
  codeBlock([
    "# .github/workflows/sast.yml",
    "name: SAST",
    "on: [push, pull_request]",
    "",
    "jobs:",
    "  semgrep:",
    "    runs-on: ubuntu-latest",
    "    container:",
    "      image: semgrep/semgrep",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - name: Run Semgrep",
    "        run: |",
    "          semgrep \\",
    "            --config=p/owasp-top-ten \\",
    "            --config=p/cwe-top-25 \\",
    "            --config=p/nodejs \\",
    "            --config=p/secrets \\",
    "            --error \\",
    "            --sarif \\",
    "            --output=semgrep.sarif",
    "      - name: Upload SARIF",
    "        uses: github/codeql-action/upload-sarif@v3",
    "        with:",
    "          sarif_file: semgrep.sarif",
  ]),
  spacer(),
  h3("6.3.2 Software Composition Analysis (SCA)"),
  body("SCA scans third-party and open-source dependencies for known CVEs, license violations, and supply chain risks."),
  spacer(),
  codeBlock([
    "# .github/workflows/sca.yml",
    "name: SCA — Dependency Security",
    "on: [push, pull_request]",
    "",
    "jobs:",
    "  snyk:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - uses: snyk/actions/node@master",
    "        env:",
    "          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}",
    "        with:",
    "          args: >",
    "            --severity-threshold=high",
    "            --fail-on=upgradable",
    "            --sarif-file-output=snyk.sarif",
    "      - uses: github/codeql-action/upload-sarif@v3",
    "        with:",
    "          sarif_file: snyk.sarif",
    "",
    "  dependabot-config:",
    "    # .github/dependabot.yml",
    "    # (see section 6.3.3)",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - run: echo 'Dependabot managed separately'",
  ]),
  spacer(),
  codeBlock([
    "# .github/dependabot.yml",
    "version: 2",
    "updates:",
    "  - package-ecosystem: npm",
    "    directory: /",
    "    schedule:",
    "      interval: daily",
    "    open-pull-requests-limit: 10",
    "    reviewers:",
    "      - org/security-team",
    "    labels:",
    "      - security",
    "      - dependencies",
    "    ignore:",
    "      - dependency-name: '*'",
    "        update-types: ['version-update:semver-patch']  # Auto-merge patches",
    "",
    "  - package-ecosystem: docker",
    "    directory: /",
    "    schedule:",
    "      interval: weekly",
    "",
    "  - package-ecosystem: github-actions",
    "    directory: /",
    "    schedule:",
    "      interval: weekly",
  ]),
  spacer(),

  h2("6.4 Stage 3 — Test Security (DAST + Fuzz)"),
  h3("6.4.1 Dynamic Application Security Testing (DAST)"),
  body("DAST runs against the live application in a staging environment, simulating real attacker behaviour against running services."),
  spacer(),
  codeBlock([
    "# .github/workflows/dast.yml",
    "name: DAST — OWASP ZAP",
    "on:",
    "  workflow_run:",
    "    workflows: [Deploy to Staging]",
    "    types: [completed]",
    "",
    "jobs:",
    "  zap-scan:",
    "    runs-on: ubuntu-latest",
    "    if: ${{ github.event.workflow_run.conclusion == 'success' }}",
    "    steps:",
    "      - name: ZAP Baseline Scan",
    "        uses: zaproxy/action-baseline@v0.12.0",
    "        with:",
    "          target: 'https://staging.example.com'",
    "          rules_file_name: '.zap/rules.tsv'",
    "          cmd_options: '-a -j'",
    "          fail_action: true",
    "      - name: ZAP Full Scan (scheduled only)",
    "        if: github.event_name == 'schedule'",
    "        uses: zaproxy/action-full-scan@v0.10.0",
    "        with:",
    "          target: 'https://staging.example.com'",
  ]),
  spacer(),

  h2("6.5 Stage 4 — Artifact Security"),
  body("Before an artifact is promoted to staging or production, it must be scanned for vulnerabilities, cryptographically signed, and have an SBOM attached."),
  spacer(),
  codeBlock([
    "# .github/workflows/artifact-security.yml",
    "jobs:",
    "  container-scan:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - name: Build image",
    "        run: docker build -t myapp:${{ github.sha }} .",
    "",
    "      - name: Scan with Trivy",
    "        uses: aquasecurity/trivy-action@master",
    "        with:",
    "          image-ref: 'myapp:${{ github.sha }}'",
    "          exit-code: '1'",
    "          severity: 'HIGH,CRITICAL'",
    "          ignore-unfixed: true",
    "          format: 'sarif'",
    "          output: 'trivy.sarif'",
    "",
    "      - name: Generate SBOM (Syft)",
    "        run: |",
    "          syft myapp:${{ github.sha }} -o spdx-json > sbom.spdx.json",
    "",
    "      - name: Sign image (Cosign)",
    "        run: |",
    "          cosign sign --key env://COSIGN_PRIVATE_KEY \\",
    "            myapp:${{ github.sha }}",
    "        env:",
    "          COSIGN_PRIVATE_KEY: ${{ secrets.COSIGN_PRIVATE_KEY }}",
    "",
    "      - name: Attest SBOM",
    "        run: |",
    "          cosign attest --key env://COSIGN_PRIVATE_KEY \\",
    "            --predicate sbom.spdx.json \\",
    "            --type spdxjson \\",
    "            myapp:${{ github.sha }}",
  ]),
  spacer(),

  h2("6.6 Stage 5 — IaC and Infrastructure Scanning"),
  body("Infrastructure as Code (Terraform, CloudFormation, Kubernetes manifests) must be scanned before apply — misconfigurations are vulnerabilities."),
  spacer(),
  codeBlock([
    "# .github/workflows/iac-security.yml",
    "name: IaC Security",
    "on:",
    "  pull_request:",
    "    paths:",
    "      - 'terraform/**'",
    "      - 'k8s/**'",
    "      - 'infra/**'",
    "",
    "jobs:",
    "  checkov:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - name: Checkov IaC Scan",
    "        uses: bridgecrewio/checkov-action@master",
    "        with:",
    "          directory: terraform/",
    "          framework: terraform",
    "          soft_fail: false",
    "          output_format: sarif",
    "          output_file_path: checkov.sarif",
    "",
    "  tfsec:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - uses: aquasecurity/tfsec-action@v1.0.0",
    "        with:",
    "          soft_fail: false",
  ]),
  pageBreak(),
);

// ─── 7. SECRETS MANAGEMENT ───────────────────────────────────────────────────
children.push(
  h1("7. Secrets Management"),
  body("Secrets — API keys, database passwords, TLS certificates, OAuth tokens — are the most targeted asset in supply chain attacks. Mismanaging them is the leading cause of breaches."),
  spacer(),

  h2("7.1 Core Principles"),
  bullet("Never store secrets in source code, config files, or .env files committed to git", { bold: false }),
  bullet("Secrets must be rotated regularly and immediately upon suspected compromise"),
  bullet("All secret access must be logged and auditable"),
  bullet("Use least-privilege: each service should only access the secrets it needs"),
  bullet("Prefer short-lived dynamic credentials over long-lived static secrets"),
  spacer(),

  h2("7.2 GitHub Secrets"),
  body("GitHub Secrets provide encrypted storage for CI/CD secrets, scoped to repository, environment, or organization level."),
  spacer(),
  compareTable(
    ["Scope", "Use Case"],
    [
      ["Repository secrets", "Secrets used in all workflows in a repo (e.g., SNYK_TOKEN, SONAR_TOKEN)"],
      ["Environment secrets", "Secrets that differ per environment (e.g., DB_PASSWORD for staging vs. production)"],
      ["Organization secrets", "Shared secrets accessible to selected repos (e.g., SIGNING_KEY)"],
    ]
  ),
  spacer(),
  codeBlock([
    "# Using secrets in GitHub Actions — correct patterns",
    "",
    "jobs:",
    "  deploy:",
    "    environment: production   # Scoped environment secrets",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      # ✅ Correct: reference via ${{ secrets.NAME }}",
    "      - name: Deploy",
    "        env:",
    "          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}",
    "          API_KEY: ${{ secrets.PROD_API_KEY }}",
    "        run: ./deploy.sh",
    "",
    "      # ❌ Never do this:",
    "      # run: ./deploy.sh --password mypassword123",
    "      # run: echo ${{ secrets.DB_PASSWORD }}  # Leaks to logs",
    "",
    "      # ✅ Mask secrets in logs",
    "      - run: echo '::add-mask::${{ secrets.DB_PASSWORD }}'",
  ]),
  spacer(),

  h2("7.3 HashiCorp Vault Integration"),
  body("For production systems, use HashiCorp Vault to provide dynamic, short-lived credentials rather than static secrets."),
  spacer(),
  codeBlock([
    "# .github/workflows/vault-secrets.yml",
    "jobs:",
    "  deploy:",
    "    runs-on: ubuntu-latest",
    "    permissions:",
    "      id-token: write   # Required for OIDC authentication to Vault",
    "    steps:",
    "      - name: Get secrets from Vault",
    "        uses: hashicorp/vault-action@v3",
    "        with:",
    "          url: https://vault.example.com",
    "          method: jwt",
    "          role: github-actions-prod",
    "          secrets: |",
    "            secret/data/prod/db password | DB_PASSWORD ;",
    "            secret/data/prod/api key | API_KEY",
    "",
    "      - name: Use dynamic DB credentials",
    "        run: |",
    "          # Vault issues short-lived (1h TTL) database credentials",
    "          echo 'Credentials expire in 1 hour — no rotation needed'",
  ]),
  pageBreak(),
);

// ─── 8. SEMANTIC RELEASE ─────────────────────────────────────────────────────
children.push(
  h1("8. Semantic Release"),
  body("Semantic Release automates the entire release process — version bumping, changelog generation, artifact publishing, and release notes — based on Conventional Commits. It eliminates human error in the release process and creates an auditable, traceable release history."),
  spacer(),

  h2("8.1 Conventional Commits"),
  body("Conventional Commits is a specification for commit messages that enables automated tooling to determine the release type (patch, minor, major)."),
  spacer(),
  codeBlock([
    "# Commit message format:",
    "# <type>(<scope>): <description>",
    "#",
    "# Types:",
    "#   feat:     New feature         -> minor version bump (1.x.0)",
    "#   fix:      Bug fix             -> patch version bump (1.0.x)",
    "#   docs:     Documentation only",
    "#   style:    Formatting, no logic change",
    "#   refactor: Code restructure, no feature/fix",
    "#   perf:     Performance improvement",
    "#   test:     Adding/updating tests",
    "#   build:    Build system or dependencies",
    "#   ci:       CI configuration",
    "#   chore:    Maintenance tasks",
    "#   BREAKING CHANGE: footer -> major version bump (x.0.0)",
    "",
    "# Examples:",
    "feat(auth): add OAuth2 PKCE flow",
    "fix(api): sanitize HTML in response headers",
    "feat!: remove legacy /v1 API endpoints",
    "fix(crypto): upgrade to AES-256-GCM from AES-128-CBC",
    "",
    "# Breaking change (major bump):",
    "refactor(api)!: change authentication header format",
    "#",
    "# BREAKING CHANGE: Authorization header now requires 'Bearer ' prefix",
  ]),
  spacer(),

  h2("8.2 Semantic Release Configuration"),
  spacer(),
  codeBlock([
    "// .releaserc.json",
    "{",
    '  "branches": ["main", {"name": "beta", "prerelease": true}],',
    '  "plugins": [',
    '    "@semantic-release/commit-analyzer",',
    '    "@semantic-release/release-notes-generator",',
    '    ["@semantic-release/changelog", {',
    '      "changelogFile": "CHANGELOG.md"',
    '    }],',
    '    ["@semantic-release/npm", {',
    '      "npmPublish": false',
    '    }],',
    '    ["@semantic-release/exec", {',
    '      "generateNotesCmd": "echo ${nextRelease.version} > VERSION",',
    '      "publishCmd": "./scripts/release.sh ${nextRelease.version}"',
    '    }],',
    '    ["@semantic-release/git", {',
    '      "assets": ["CHANGELOG.md", "package.json", "VERSION"],',
    '      "message": "chore(release): ${nextRelease.version} [skip ci]"',
    '    }],',
    '    "@semantic-release/github"',
    '  ]',
    "}",
  ]),
  spacer(),

  h2("8.3 Semantic Release Pipeline"),
  spacer(),
  codeBlock([
    "# .github/workflows/release.yml",
    "name: Semantic Release",
    "on:",
    "  push:",
    "    branches: [main]",
    "",
    "jobs:",
    "  release:",
    "    runs-on: ubuntu-latest",
    "    environment: release   # Manual approval gate",
    "    permissions:",
    "      contents: write",
    "      issues: write",
    "      pull-requests: write",
    "      id-token: write   # For OIDC signing",
    "",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "        with:",
    "          fetch-depth: 0",
    "          persist-credentials: false",
    "",
    "      - name: Security pre-flight",
    "        run: |",
    "          semgrep --config auto --error",
    "          trivy image --exit-code 1 myapp:latest",
    "",
    "      - name: Run semantic release",
    "        env:",
    "          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}",
    "          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}",
    "        run: npx semantic-release",
    "",
    "      - name: Generate SBOM",
    "        run: |",
    "          syft . -o spdx-json > sbom-${{ env.NEXT_VERSION }}.spdx.json",
    "",
    "      - name: Sign release artifacts (Cosign)",
    "        run: |",
    "          cosign sign-blob --key env://COSIGN_KEY \\",
    "            --output-signature app-${{ env.NEXT_VERSION }}.sig \\",
    "            dist/app-${{ env.NEXT_VERSION }}.tar.gz",
    "        env:",
    "          COSIGN_KEY: ${{ secrets.COSIGN_PRIVATE_KEY }}",
    "",
    "      - name: Attest build provenance (SLSA)",
    "        uses: actions/attest-build-provenance@v1",
    "        with:",
    "          subject-path: dist/",
  ]),
  spacer(),

  h2("8.4 Release Security Checklist"),
  compareTable(
    ["Release Activity", "Security Control"],
    [
      ["Version bump", "Automated by semantic-release — no manual editing of version files"],
      ["Changelog generation", "Generated from signed conventional commits — tamper-evident"],
      ["Artifact publishing", "Signed with Cosign — verifiable by consumers"],
      ["SBOM attached", "SPDX/CycloneDX SBOM attached to GitHub Release"],
      ["Build provenance", "SLSA-compliant provenance via GitHub Actions attestation"],
      ["Container image", "Signed and pushed to private registry with digest pinning"],
      ["Release approval", "Manual gate in GitHub Environment before any publishing"],
    ]
  ),
  pageBreak(),
);

// ─── 9. SUPPLY CHAIN SECURITY (SLSA) ─────────────────────────────────────────
children.push(
  h1("9. Supply Chain Security and SLSA"),
  body("Supply chain attacks (e.g., SolarWinds, XZ Utils) target the build and distribution process rather than the application itself. The SLSA (Supply-chain Levels for Software Artifacts) framework provides a graduated set of controls."),
  spacer(),

  h2("9.1 SLSA Levels"),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1440, 3960, 4680],
    rows: [
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Level", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 1440 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Requirements", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 3960 }),
        cell(new Paragraph({ children: [new TextRun({ text: "How to Achieve (GitHub)", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 4680 }),
      ]}),
      ...([
        ["L1", "Provenance exists (build process documented)", "GitHub Actions generates basic provenance automatically"],
        ["L2", "Provenance is authenticated and service-generated", "Use actions/attest-build-provenance — signed by GitHub OIDC"],
        ["L3", "Build environment hardened, no repo access to build system", "Isolated runners, hermetic builds, pinned actions"],
        ["L4", "Two-party review, hermetic reproducible builds", "Branch protection (2 reviewers) + reproducible builds"],
      ].map(([level, req, how], i) => new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: level, bold: true, size: 19, font: "Arial", color: TEAL })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 1440 }),
        cell(new Paragraph({ children: [new TextRun({ text: req, size: 19, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 3960 }),
        cell(new Paragraph({ children: [new TextRun({ text: how, size: 19, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 4680 }),
      ] }))),
    ],
  }),
  spacer(),

  h2("9.2 Pinning Dependencies and Actions"),
  body("Use digest pinning for GitHub Actions and container images to prevent supply chain attacks via tag mutation."),
  spacer(),
  codeBlock([
    "# ❌ Vulnerable: tag can be moved by attacker",
    "- uses: actions/checkout@v4",
    "- uses: actions/setup-node@v4",
    "",
    "# ✅ Secure: pinned to immutable SHA digest",
    "- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2",
    "- uses: actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af  # v4.1.0",
    "",
    "# Use Dependabot to keep pinned actions up to date:",
    "# .github/dependabot.yml — github-actions ecosystem (see Section 6.3.2)",
  ]),
  pageBreak(),
);

// ─── 10. SECURITY TESTING STRATEGY ───────────────────────────────────────────
children.push(
  h1("10. Security Testing Strategy"),
  spacer(),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1800, 2400, 2400, 3480],
    rows: [
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Type", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 1800 }),
        cell(new Paragraph({ children: [new TextRun({ text: "When", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 2400 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Tools", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 2400 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Finds", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 3480 }),
      ]}),
      ...([
        ["SAST", "Every commit/PR", "Semgrep, CodeQL, SonarQube", "Injection flaws, insecure patterns, secrets in code"],
        ["SCA", "Every commit/PR + daily", "Snyk, Dependabot, OWASP DC", "Vulnerable dependencies, license issues"],
        ["DAST", "Post-staging deploy", "OWASP ZAP, Burp Suite", "Runtime injection, auth bypass, config issues"],
        ["IAST", "During integration tests", "Contrast Security, Seeker", "Real-time runtime vulnerabilities"],
        ["Fuzz Testing", "Nightly / pre-release", "AFL++, LibFuzzer, OSS-Fuzz", "Memory corruption, input handling crashes"],
        ["Container Scan", "Build and nightly", "Trivy, Grype, Snyk Container", "Vulnerable OS packages, misconfigurations"],
        ["IaC Scan", "PR with infra changes", "Checkov, tfsec, Terrascan", "Cloud misconfigs, excessive permissions"],
        ["Pen Testing", "Pre-major release", "Manual + Metasploit, Burp", "Business logic, auth flaws, complex chains"],
        ["Secret Scanning", "Every push", "GitLeaks, GHAS", "Committed credentials, API keys, tokens"],
      ].map(([type, when, tools, finds], i) => new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: type, bold: true, size: 19, font: "Arial", color: TEAL })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 1800 }),
        cell(new Paragraph({ children: [new TextRun({ text: when, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 2400 }),
        cell(new Paragraph({ children: [new TextRun({ text: tools, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 2400 }),
        cell(new Paragraph({ children: [new TextRun({ text: finds, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 3480 }),
      ] }))),
    ],
  }),
  pageBreak(),
);

// ─── 11. COMPLIANCE AND AUDIT ─────────────────────────────────────────────────
children.push(
  h1("11. Compliance and Audit Trails"),
  body("A Secure SDLC built on GitHub provides a comprehensive, tamper-evident audit trail that satisfies most compliance frameworks automatically."),
  spacer(),

  h2("11.1 GitHub as Audit Record"),
  bullet("Every commit is attributed to an authenticated, signed identity"),
  bullet("PR history records who reviewed, who approved, and what checks passed"),
  bullet("Deployment logs link every production release to the PR, commit, and approver"),
  bullet("GitHub Audit Log (Enterprise) captures all admin and access events"),
  bullet("Environment protection rules record who approved each deployment with timestamp"),
  spacer(),

  h2("11.2 Compliance Mapping"),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2000, 3580, 4500],
    rows: [
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Framework", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 2000 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Relevant Control", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 3580 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Secure SDLC Implementation", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 4500 }),
      ]}),
      ...([
        ["SOC 2 CC8.1", "Change management procedures", "Branch protection + 2-reviewer PRs + approval gates"],
        ["SOC 2 CC6.1", "Logical and physical access controls", "CODEOWNERS + environment protection rules"],
        ["PCI-DSS 6.3.2", "Code review for custom code", "Mandatory PR reviews + SAST gates"],
        ["PCI-DSS 6.3.3", "Security patches deployed timely", "Dependabot + automated patching SLAs"],
        ["ISO 27001 A.14", "Secure development policy", "This Secure SDLC policy document + enforcement"],
        ["HIPAA §164.312", "Audit controls", "GitHub Audit Log + deployment trail"],
        ["NIST SSDF PW.7", "Review and analyze code", "SAST + security-focused PR reviews"],
      ].map(([fw, ctrl, impl], i) => new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: fw, bold: true, size: 18, font: "Courier New", color: TEAL })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 2000 }),
        cell(new Paragraph({ children: [new TextRun({ text: ctrl, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 3580 }),
        cell(new Paragraph({ children: [new TextRun({ text: impl, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 4500 }),
      ] }))),
    ],
  }),
  pageBreak(),
);

// ─── 12. SECURITY METRICS AND KPIs ───────────────────────────────────────────
children.push(
  h1("12. Security Metrics and KPIs"),
  body("Measure what matters. Security metrics enable objective assessment of programme effectiveness and drive continuous improvement."),
  spacer(),

  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3000, 3000, 4080],
    rows: [
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Metric", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 3000 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Target", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 3000 }),
        cell(new Paragraph({ children: [new TextRun({ text: "How to Measure", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 4080 }),
      ]}),
      ...([
        ["MTTD (Mean Time to Detect)", "< 24 hours for critical", "SIEM alert timestamps vs. exploit timestamps"],
        ["MTTR (Mean Time to Remediate)", "Critical < 24h, High < 7 days", "Time from CVE alert to merged fix PR"],
        ["Vulnerability Escape Rate", "< 2% reach production", "Production incidents / total vulns found"],
        ["SAST Coverage", "> 95% of repos scanned", "GHAS code scanning dashboard"],
        ["Secret Leak Rate", "0 per quarter target", "GitLeaks / GHAS alerts per quarter"],
        ["Dependabot PR Merge Time", "< 72 hours for security PRs", "PR open → merged timestamp for Dependabot PRs"],
        ["PR Security Checklist Completion", "> 98%", "GitHub required fields completion rate"],
        ["Failed Security Gates per Release", "Trending downward", "CI/CD failure rate on security jobs over time"],
        ["Signed Commits %", "100%", "Git log analysis: signed vs unsigned commits"],
        ["IaC Scan Pass Rate", "> 98% before apply", "Checkov/tfsec pass rate in CI pipeline"],
      ].map(([metric, target, how], i) => new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: metric, size: 18, font: "Arial", bold: true })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 3000 }),
        cell(new Paragraph({ children: [new TextRun({ text: target, size: 18, font: "Arial", color: GREEN })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 3000 }),
        cell(new Paragraph({ children: [new TextRun({ text: how, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 4080 }),
      ] }))),
    ],
  }),
  pageBreak(),
);

// ─── 13. INCIDENT RESPONSE ────────────────────────────────────────────────────
children.push(
  h1("13. Incident Response Integration"),
  body("Secure SDLC does not end at deployment. The maintenance phase requires an operational incident response capability that feeds lessons learned back into the development process."),
  spacer(),

  h2("13.1 Security Incident Workflow"),
  bullet("DETECT: SIEM alert, bug bounty report, or automated scan fires", { bold: true }),
  bullet("TRIAGE: Assess severity (CVSS), assign owner, notify stakeholders within SLA"),
  bullet("CONTAIN: Disable feature flag, revoke compromised credentials, firewall rule"),
  bullet("INVESTIGATE: Root cause analysis — which commit, which PR, what was missed?"),
  bullet("REMEDIATE: Fix code, open PR with security label, fast-track through approval gates"),
  bullet("RECOVER: Deploy fix, verify with DAST scan, monitor for recurrence"),
  bullet("RETROSPECTIVE: Update SAST rules, PR checklist, training — close the loop"),
  spacer(),

  h2("13.2 GitHub in Incident Response"),
  bullet("Use GitHub Security Advisories to track and disclose vulnerabilities privately"),
  bullet("Create an incident branch with environment protection rules to fast-track approved fixes"),
  bullet("Use GitHub Issues with the 'security-incident' label for internal tracking"),
  bullet("Revoke compromised tokens/secrets immediately via GitHub Settings > Developer Settings"),
  bullet("Enable GitHub's push protection to block future pushes of identified secrets"),
  spacer(),

  callout("Security Retrospective Rule", [
    "Every security incident must result in at least ONE automated control improvement —",
    "a new SAST rule, a new PR checklist item, or a new required status check.",
    "Incidents that cannot trigger automation must be added to the threat model.",
  ], RED_LIGHT, RED),
  pageBreak(),
);

// ─── 14. MATURITY MODEL ROADMAP ───────────────────────────────────────────────
children.push(
  h1("14. Secure SDLC Maturity Model Roadmap"),
  body("Adopting Secure SDLC is a journey. The following roadmap provides a phased approach to reaching full maturity."),
  spacer(),

  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1440, 2880, 2880, 2880],
    rows: [
      new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: "Phase", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 1440 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Level 1 — Foundational (0-3 months)", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: TEAL, width: 2880 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Level 2 — Managed (3-9 months)", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: NAVY, width: 2880 }),
        cell(new Paragraph({ children: [new TextRun({ text: "Level 3 — Optimised (9-18 months)", bold: true, color: WHITE, size: 19, font: "Arial" })] }), { fill: "1A3A5C", width: 2880 }),
      ]}),
      ...([
        ["Source", "Branch protection on main", "CODEOWNERS on all repos", "Signed commits enforced org-wide"],
        ["Code Review", "2 approvers required", "Security checklist in PR template", "Security champions in every team"],
        ["SAST", "CodeQL enabled", "Semgrep custom rules", "Zero SAST findings in main policy"],
        ["SCA", "Dependabot alerts on", "Dependabot auto-PRs", "Patching SLAs enforced in pipeline"],
        ["Secrets", "GHAS secret scanning", "Vault for production secrets", "Zero-trust, dynamic credentials"],
        ["Pipeline", "Required status checks", "DAST on staging deploy", "Full SLSA L2 provenance"],
        ["Release", "Manual release process", "Semantic-release automated", "Signed artifacts + SBOM on release"],
        ["Compliance", "Manual audit evidence", "Policy-as-code (OPA)", "Continuous compliance dashboard"],
      ].map(([phase, l1, l2, l3], i) => new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: phase, bold: true, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 1440 }),
        cell(new Paragraph({ children: [new TextRun({ text: l1, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? TEAL_LIGHT : "E0FAF5", width: 2880 }),
        cell(new Paragraph({ children: [new TextRun({ text: l2, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY, width: 2880 }),
        cell(new Paragraph({ children: [new TextRun({ text: l3, size: 18, font: "Arial" })] }), { fill: i % 2 === 0 ? NAVY_LIGHT : "D0E8FF", width: 2880 }),
      ] }))),
    ],
  }),
  spacer(),

  h2("14.1 Start Today"),
  body("The highest-impact, lowest-effort actions to begin immediately:"),
  spacer(),

  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [480, CONTENT_W - 480],
    rows: [
      ...([
        ["1.", "Enable GitHub branch protection on main with 2 required reviewers and required status checks"],
        ["2.", "Add .github/CODEOWNERS to protect auth, crypto, infra, and workflow files"],
        ["3.", "Enable GHAS secret scanning with push protection"],
        ["4.", "Enable Dependabot alerts and security updates"],
        ["5.", "Add a PR template with a security checklist"],
        ["6.", "Run CodeQL on every PR — fix all Critical and High findings first"],
        ["7.", "Add Semgrep to CI with the owasp-top-ten and cwe-top-25 rulesets"],
        ["8.", "Set up GitHub Environments with approval requirements for production"],
        ["9.", "Implement conventional commits and semantic-release on your main repos"],
        ["10.", "Schedule a monthly threat model review and security retrospective"],
      ].map(([num, action], i) => new TableRow({ children: [
        cell(new Paragraph({ children: [new TextRun({ text: num, bold: true, color: TEAL, size: 20, font: "Arial" })] }), { fill: i % 2 === 0 ? TEAL_LIGHT : "E0FAF5", width: 480 }),
        cell(new Paragraph({ children: [new TextRun({ text: action, size: 19, font: "Arial" })] }), { fill: i % 2 === 0 ? TEAL_LIGHT : "E0FAF5", width: CONTENT_W - 480 }),
      ] }))),
    ],
  }),
  spacer(),
  pageBreak(),
);

// ─── 15. CONCLUSION ───────────────────────────────────────────────────────────
children.push(
  h1("15. Conclusion"),
  body("Secure SDLC is not a product or a tool — it is an engineering culture and a set of enforceable practices woven into every phase of how software is conceived, built, released, and maintained."),
  spacer(),
  body("GitHub provides an unparalleled platform for operationalising Secure SDLC: branch protection and CODEOWNERS enforce access control; GHAS provides SAST, secret scanning, and SCA natively; GitHub Actions enables automated security gates at every pipeline stage; Environments provide approval gates with full audit trails; and semantic-release creates traceable, signed, SBOM-backed releases."),
  spacer(),
  callout("The Core Commitment", [
    "Every vulnerability prevented in development costs 30x less than one found in production.",
    "Every automated security gate is a developer empowered to ship securely without friction.",
    "Every signed release is a supply chain attack made harder.",
    "",
    "Shift left. Automate everything. Trust, but verify. Ship securely.",
  ], TEAL_LIGHT, TEAL),
  spacer(),

  h2("References and Further Reading"),
  bullet("OWASP SAMM: https://owaspsamm.org"),
  bullet("SLSA Framework: https://slsa.dev"),
  bullet("GitHub Security Documentation: https://docs.github.com/en/code-security"),
  bullet("Conventional Commits: https://www.conventionalcommits.org"),
  bullet("NIST SSDF: https://csrc.nist.gov/Projects/ssdf"),
  bullet("CIS GitHub Benchmark: https://www.cisecurity.org/benchmark/github"),
  bullet("Semantic Release: https://semantic-release.gitbook.io"),
  bullet("Sigstore / Cosign: https://docs.sigstore.dev"),
);

// ═══════════════════════════════════════════════════════════════════════════════
// ASSEMBLE DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }, {
          level: 1,
          format: LevelFormat.BULLET,
          text: "\u25E6",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 20, color: DARK } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 400, after: 160 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 4 } } },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 },
      },
      {
        id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: SLATE, italics: true },
        paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 3 },
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
    },
    headers: { default: docHeader },
    footers: { default: docFooter },
    children,
  }],
});

Packer.toBuffer(doc)
  .then(buffer => {
    fs.writeFileSync("Secure-SDLC-Guide.docx", buffer);
    console.log("✅ Secure-SDLC-Guide.docx created successfully");
    console.log(`   File size: ${(buffer.length / 1024).toFixed(1)} KB`);
  })
  .catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
  });
