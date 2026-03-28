const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Security Team";
pres.title = "Secure SDLC";

// ─── Color Palette ───────────────────────────────────────────────────────────
const C = {
  navy:    "0F2342",   // primary dark
  navyMid: "1A3A5C",   // mid navy
  teal:    "0D9488",   // accent teal
  tealLt:  "14B8A6",   // light teal
  orange:  "F97316",   // highlight
  white:   "FFFFFF",
  offWhite:"F1F5F9",
  slate:   "64748B",
  slateLight: "CBD5E1",
  dark:    "0A1628",
  cardBg:  "EFF6FF",
  green:   "16A34A",
  red:     "DC2626",
  yellow:  "D97706",
};

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12
});

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Left accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.45, h: 5.625,
    fill: { color: C.teal }, line: { color: C.teal }
  });

  // Top-right decorative shapes
  s.addShape(pres.shapes.OVAL, {
    x: 8.0, y: -0.8, w: 3.2, h: 3.2,
    fill: { color: C.navyMid, transparency: 30 }, line: { color: C.teal, width: 1.5 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: 8.8, y: 0.2, w: 2.0, h: 2.0,
    fill: { color: C.teal, transparency: 70 }, line: { color: C.tealLt, width: 1 }
  });

  // Bottom-left decorative
  s.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 4.2, w: 1.8, h: 1.8,
    fill: { color: C.teal, transparency: 80 }, line: { color: C.teal, width: 1 }
  });

  // Badge / pill
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.75, y: 1.05, w: 2.4, h: 0.38,
    fill: { color: C.teal }, line: { color: C.teal }, rectRadius: 0.05
  });
  s.addText("ENTERPRISE SECURITY", {
    x: 0.75, y: 1.05, w: 2.4, h: 0.38,
    fontSize: 9, bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
    fontFace: "Calibri"
  });

  // Main title
  s.addText("Secure SDLC", {
    x: 0.7, y: 1.6, w: 8.5, h: 1.3,
    fontSize: 56, bold: true, color: C.white, align: "left", valign: "middle",
    fontFace: "Calibri", charSpacing: 1
  });

  // Subtitle
  s.addText("Building Security Into Every Phase of the\nSoftware Development Life Cycle", {
    x: 0.7, y: 2.95, w: 7.5, h: 1.0,
    fontSize: 18, color: C.slateLight, align: "left", valign: "top",
    fontFace: "Calibri"
  });

  // Bottom bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.15, w: 10, h: 0.48,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Shift Left · Automate · Monitor · Respond", {
    x: 0.7, y: 5.15, w: 9, h: 0.48,
    fontSize: 11, color: C.tealLt, align: "left", valign: "middle", italic: true,
    fontFace: "Calibri", margin: 0
  });
  s.addText("2026", {
    x: 0, y: 5.15, w: 9.7, h: 0.48,
    fontSize: 11, color: C.slateLight, align: "right", valign: "middle",
    fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — What is SDLC? + How Secure SDLC Adds Value
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText("SDLC vs Secure SDLC", {
    x: 0.5, y: 0, w: 9, h: 1.0,
    fontSize: 28, bold: true, color: C.white, align: "left", valign: "middle",
    fontFace: "Calibri", margin: 0
  });

  // ── Left half: What is SDLC ──
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.1, w: 4.35, h: 0.38,
    fill: { color: C.navyMid }, line: { color: C.navyMid }
  });
  s.addText("Traditional SDLC", {
    x: 0.35, y: 1.1, w: 4.35, h: 0.38,
    fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle",
    fontFace: "Calibri", margin: 0
  });

  const sdlcPhases = [
    { name: "1. Requirements", desc: "Gather business & functional needs" },
    { name: "2. Design",       desc: "Architect the system and interfaces" },
    { name: "3. Implementation", desc: "Write code and unit tests" },
    { name: "4. Testing",     desc: "QA functional correctness" },
    { name: "5. Deployment",  desc: "Release to production environment" },
    { name: "6. Maintenance", desc: "Bug fixes and feature updates" },
  ];

  sdlcPhases.forEach((p, i) => {
    const y = 1.55 + i * 0.64;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.35, y, w: 4.35, h: 0.57,
      fill: { color: i % 2 === 0 ? C.white : "EEF2FF" },
      line: { color: C.slateLight, width: 0.5 }
    });
    s.addText(p.name, {
      x: 0.5, y: y + 0.04, w: 4.1, h: 0.24,
      fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    s.addText(p.desc, {
      x: 0.5, y: y + 0.28, w: 4.1, h: 0.22,
      fontSize: 9.5, color: C.slate, fontFace: "Calibri", margin: 0
    });
  });

  // Security audit tag at bottom of left half
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 5.0, w: 4.35, h: 0.32,
    fill: { color: C.red, transparency: 20 }, line: { color: C.red }
  });
  s.addText("Security added only at the end — too late, too expensive", {
    x: 0.35, y: 5.0, w: 4.35, h: 0.32,
    fontSize: 9.5, color: C.red, bold: true, align: "center", valign: "middle",
    fontFace: "Calibri", margin: 0
  });

  // ── Divider ──
  s.addShape(pres.shapes.LINE, {
    x: 5.0, y: 1.1, w: 0, h: 4.22,
    line: { color: C.slateLight, width: 1, dashType: "dash" }
  });

  // ── Right half: How Secure SDLC adds value ──
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.1, w: 4.35, h: 0.38,
    fill: { color: C.teal }, line: { color: C.teal }
  });
  s.addText("+ Security at Every Phase", {
    x: 5.3, y: 1.1, w: 4.35, h: 0.38,
    fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle",
    fontFace: "Calibri", margin: 0
  });

  const secureAdditions = [
    { name: "1. Requirements", add: "Abuse cases · compliance · risk appetite" },
    { name: "2. Design",       add: "Threat modeling · STRIDE · trust boundaries" },
    { name: "3. Implementation", add: "SAST · secure coding · secrets scanning" },
    { name: "4. Testing",     add: "DAST · pen testing · fuzz testing" },
    { name: "5. Deployment",  add: "IaC scanning · hardening · image signing" },
    { name: "6. Maintenance", add: "SIEM · patching SLAs · IR playbooks" },
  ];

  secureAdditions.forEach((p, i) => {
    const y = 1.55 + i * 0.64;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y, w: 4.35, h: 0.57,
      fill: { color: i % 2 === 0 ? C.white : "F0FDF4" },
      line: { color: C.slateLight, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y, w: 0.05, h: 0.57,
      fill: { color: C.teal }, line: { color: C.teal }
    });
    s.addText(p.name, {
      x: 5.42, y: y + 0.04, w: 4.1, h: 0.24,
      fontSize: 11, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    s.addText(p.add, {
      x: 5.42, y: y + 0.28, w: 4.1, h: 0.22,
      fontSize: 9.5, color: C.teal, fontFace: "Calibri", margin: 0
    });
  });

  // Value tag at bottom of right half
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 5.0, w: 4.35, h: 0.32,
    fill: { color: C.teal, transparency: 15 }, line: { color: C.teal }
  });
  s.addText("30× cheaper to fix early · fewer breaches · faster compliance", {
    x: 5.3, y: 5.0, w: 4.35, h: 0.32,
    fontSize: 9.5, color: C.teal, bold: true, align: "center", valign: "middle",
    fontFace: "Calibri", margin: 0
  });

  // Footer
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Secure SDLC  |  SDLC vs Secure SDLC", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9, color: C.slateLight, align: "right", valign: "middle",
    fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 (original) — What is Secure SDLC?
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText("What is Secure SDLC?", {
    x: 0.5, y: 0, w: 9, h: 1.0,
    fontSize: 28, bold: true, color: C.white, align: "left", valign: "middle",
    fontFace: "Calibri", margin: 0
  });

  // Intro text box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.15, w: 9.2, h: 0.95,
    fill: { color: C.white }, line: { color: C.slateLight, width: 0.5 },
    shadow: makeShadow()
  });
  s.addText("Secure SDLC integrates security practices at every phase of software development — not as an afterthought, but as a foundational requirement. It reduces breach risk, lowers remediation costs, and ensures compliance.", {
    x: 0.5, y: 1.2, w: 9.0, h: 0.85,
    fontSize: 13, color: C.dark, align: "left", valign: "middle", fontFace: "Calibri"
  });

  // Three pillars
  const pillars = [
    { title: "Shift Left", body: "Find and fix vulnerabilities early in development when they cost 30× less to fix than in production.", color: C.teal },
    { title: "Automate Security", body: "Embed SAST, DAST, and SCA tools in CI/CD pipelines so every commit is checked automatically.", color: C.orange },
    { title: "Continuous Risk Management", body: "Treat security as an ongoing process with monitoring, threat intelligence, and regular reassessment.", color: C.navyMid },
  ];

  pillars.forEach((p, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.25, w: 2.95, h: 3.05,
      fill: { color: C.white }, line: { color: p.color, width: 2 },
      shadow: makeShadow()
    });
    // Color header bar
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.25, w: 2.95, h: 0.55,
      fill: { color: p.color }, line: { color: p.color }
    });
    s.addText(p.title, {
      x: x + 0.08, y: 2.25, w: 2.8, h: 0.55,
      fontSize: 14, bold: true, color: C.white, valign: "middle", fontFace: "Calibri", margin: 0
    });
    s.addText(p.body, {
      x: x + 0.12, y: 2.85, w: 2.72, h: 2.35,
      fontSize: 12, color: C.dark, valign: "top", fontFace: "Calibri", wrap: true
    });
  });

  // Footer
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.teal }, line: { color: C.teal }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — The 6 Phases Overview (visual cycle)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("The Secure SDLC Phases", {
    x: 0.5, y: 0.25, w: 9, h: 0.7,
    fontSize: 30, bold: true, color: C.white, align: "center", fontFace: "Calibri"
  });
  s.addText("Security is woven into every phase — not bolted on at the end", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 13, color: C.tealLt, align: "center", fontFace: "Calibri", italic: true
  });

  const phases = [
    { num: "1", name: "Requirements", color: C.teal,    x: 0.25, y: 1.45 },
    { num: "2", name: "Design",       color: C.orange,  x: 3.45, y: 1.45 },
    { num: "3", name: "Development",  color: "7C3AED",  x: 6.65, y: 1.45 },
    { num: "4", name: "Testing",      color: C.green,   x: 0.25, y: 3.25 },
    { num: "5", name: "Deployment",   color: "0EA5E9",  x: 3.45, y: 3.25 },
    { num: "6", name: "Maintenance",  color: C.red,     x: 6.65, y: 3.25 },
  ];

  const descriptions = [
    "Security requirements, abuse cases, compliance mapping",
    "Threat modeling, secure architecture, attack surface review",
    "Secure coding standards, peer reviews, SAST scanning",
    "DAST, penetration testing, fuzz testing, SCA",
    "Hardened configs, secrets management, IaC scanning",
    "Vulnerability management, patching, incident response",
  ];

  phases.forEach((p, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: p.x, y: p.y, w: 3.05, h: 1.65,
      fill: { color: C.navyMid }, line: { color: p.color, width: 2 },
      shadow: makeShadow()
    });
    // Number circle
    s.addShape(pres.shapes.OVAL, {
      x: p.x + 0.12, y: p.y + 0.18, w: 0.45, h: 0.45,
      fill: { color: p.color }, line: { color: p.color }
    });
    s.addText(p.num, {
      x: p.x + 0.12, y: p.y + 0.18, w: 0.45, h: 0.45,
      fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle",
      fontFace: "Calibri", margin: 0
    });
    s.addText(p.name, {
      x: p.x + 0.65, y: p.y + 0.2, w: 2.3, h: 0.45,
      fontSize: 15, bold: true, color: C.white, valign: "middle", fontFace: "Calibri", margin: 0
    });
    s.addText(descriptions[i], {
      x: p.x + 0.12, y: p.y + 0.72, w: 2.82, h: 0.85,
      fontSize: 10.5, color: C.slateLight, valign: "top", fontFace: "Calibri", wrap: true
    });
  });

  // Bottom arrow connector hint
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.teal }, line: { color: C.teal }
  });
  s.addText("Each phase feeds into the next — and security findings loop back to earlier phases", {
    x: 0.3, y: 5.35, w: 9.4, h: 0.28,
    fontSize: 10, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Phase 1: Requirements
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Left panel
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.2, h: 5.625,
    fill: { color: C.teal }, line: { color: C.teal }
  });
  s.addText("Phase 1", {
    x: 0.15, y: 0.3, w: 2.9, h: 0.5,
    fontSize: 13, color: "B2F5EA", align: "left", fontFace: "Calibri", italic: true, margin: 0
  });
  s.addText("Require-\nments", {
    x: 0.15, y: 0.75, w: 2.9, h: 1.5,
    fontSize: 36, bold: true, color: C.white, align: "left", fontFace: "Calibri", margin: 0
  });
  s.addText("Security starts before a single line of code is written.", {
    x: 0.2, y: 2.35, w: 2.8, h: 1.0,
    fontSize: 12, color: "B2F5EA", align: "left", fontFace: "Calibri", italic: true
  });

  // Number badge
  s.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fill: { color: "0D7468" }, line: { color: C.white, width: 2 }
  });
  s.addText("1", {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fontSize: 28, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });

  // Right content
  const items = [
    { title: "Security Requirements", body: "Define CIA (Confidentiality, Integrity, Availability) requirements. Document authentication, authorization, encryption, and audit logging needs." },
    { title: "Abuse Cases & Misuse Stories", body: "Complement user stories with 'As an attacker, I can...' scenarios to identify what must be prevented." },
    { title: "Compliance & Regulatory Mapping", body: "Map requirements to applicable standards: OWASP, PCI-DSS, HIPAA, SOC 2, ISO 27001." },
    { title: "Risk Appetite Definition", body: "Establish acceptable risk thresholds and define security acceptance criteria for features." },
  ];

  items.forEach((item, i) => {
    const y = 0.2 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 6.4, h: 1.18,
      fill: { color: C.white }, line: { color: C.slateLight, width: 0.5 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 0.06, h: 1.18,
      fill: { color: C.teal }, line: { color: C.teal }
    });
    s.addText(item.title, {
      x: 3.55, y: y + 0.1, w: 6.1, h: 0.32,
      fontSize: 13, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    s.addText(item.body, {
      x: 3.55, y: y + 0.42, w: 6.1, h: 0.68,
      fontSize: 11, color: C.slate, fontFace: "Calibri", wrap: true, margin: 0
    });
  });

  // Footer
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Secure SDLC  |  Phase 1: Requirements", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9, color: C.slateLight, align: "right", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Phase 2: Design
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.2, h: 5.625,
    fill: { color: C.orange }, line: { color: C.orange }
  });
  s.addText("Phase 2", {
    x: 0.15, y: 0.3, w: 2.9, h: 0.5,
    fontSize: 13, color: "FDE68A", align: "left", fontFace: "Calibri", italic: true, margin: 0
  });
  s.addText("Design", {
    x: 0.15, y: 0.75, w: 2.9, h: 1.0,
    fontSize: 40, bold: true, color: C.white, align: "left", fontFace: "Calibri", margin: 0
  });
  s.addText("A secure architecture is the foundation of a secure product.", {
    x: 0.2, y: 1.8, w: 2.8, h: 1.2,
    fontSize: 12, color: "FDE68A", align: "left", fontFace: "Calibri", italic: true
  });
  s.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fill: { color: "C2610C" }, line: { color: C.white, width: 2 }
  });
  s.addText("2", {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fontSize: 28, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });

  const items = [
    { title: "Threat Modeling (STRIDE)", body: "Systematically identify Spoofing, Tampering, Repudiation, Info Disclosure, DoS, and Elevation of Privilege threats using data flow diagrams." },
    { title: "Secure Architecture Patterns", body: "Apply Defense in Depth, Least Privilege, Fail Secure, and Zero Trust principles. Define trust boundaries explicitly." },
    { title: "Attack Surface Analysis", body: "Enumerate all entry points, exit points, and data stores. Minimize the attack surface by removing unnecessary features and interfaces." },
    { title: "Security Design Review", body: "Conduct formal security architecture reviews with checklists before proceeding to development." },
  ];

  items.forEach((item, i) => {
    const y = 0.2 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 6.4, h: 1.18,
      fill: { color: C.white }, line: { color: C.slateLight, width: 0.5 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 0.06, h: 1.18,
      fill: { color: C.orange }, line: { color: C.orange }
    });
    s.addText(item.title, {
      x: 3.55, y: y + 0.1, w: 6.1, h: 0.32,
      fontSize: 13, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    s.addText(item.body, {
      x: 3.55, y: y + 0.42, w: 6.1, h: 0.68,
      fontSize: 11, color: C.slate, fontFace: "Calibri", wrap: true, margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Secure SDLC  |  Phase 2: Design", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9, color: C.slateLight, align: "right", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Phase 3: Development
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.2, h: 5.625,
    fill: { color: "7C3AED" }, line: { color: "7C3AED" }
  });
  s.addText("Phase 3", {
    x: 0.15, y: 0.3, w: 2.9, h: 0.5,
    fontSize: 13, color: "DDD6FE", align: "left", fontFace: "Calibri", italic: true, margin: 0
  });
  s.addText("Develop-\nment", {
    x: 0.15, y: 0.75, w: 2.9, h: 1.5,
    fontSize: 36, bold: true, color: C.white, align: "left", fontFace: "Calibri", margin: 0
  });
  s.addText("Secure code is written, not audited into existence.", {
    x: 0.2, y: 2.4, w: 2.8, h: 1.2,
    fontSize: 12, color: "DDD6FE", align: "left", fontFace: "Calibri", italic: true
  });
  s.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fill: { color: "5B21B6" }, line: { color: C.white, width: 2 }
  });
  s.addText("3", {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fontSize: 28, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });

  const items = [
    { title: "Secure Coding Standards", body: "Enforce language-specific secure coding guidelines (CERT C, SEI, OWASP). Prohibit dangerous functions and patterns by policy." },
    { title: "SAST — Static Analysis", body: "Run automated static analysis (Semgrep, SonarQube, Checkmarx) on every commit to catch injection, XSS, hardcoded secrets, and logic errors." },
    { title: "Secrets & Dependency Management", body: "Use a vault for secrets, never commit credentials. Run SCA (Snyk, OWASP Dependency-Check) to flag vulnerable third-party libraries." },
    { title: "Security-Focused Code Reviews", body: "Mandate peer review with a security checklist. Require a second reviewer for authentication, crypto, and authorization code." },
  ];

  items.forEach((item, i) => {
    const y = 0.2 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 6.4, h: 1.18,
      fill: { color: C.white }, line: { color: C.slateLight, width: 0.5 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 0.06, h: 1.18,
      fill: { color: "7C3AED" }, line: { color: "7C3AED" }
    });
    s.addText(item.title, {
      x: 3.55, y: y + 0.1, w: 6.1, h: 0.32,
      fontSize: 13, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    s.addText(item.body, {
      x: 3.55, y: y + 0.42, w: 6.1, h: 0.68,
      fontSize: 11, color: C.slate, fontFace: "Calibri", wrap: true, margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Secure SDLC  |  Phase 3: Development", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9, color: C.slateLight, align: "right", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Phase 4: Testing
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.2, h: 5.625,
    fill: { color: C.green }, line: { color: C.green }
  });
  s.addText("Phase 4", {
    x: 0.15, y: 0.3, w: 2.9, h: 0.5,
    fontSize: 13, color: "BBFFD8", align: "left", fontFace: "Calibri", italic: true, margin: 0
  });
  s.addText("Testing", {
    x: 0.15, y: 0.75, w: 2.9, h: 1.0,
    fontSize: 40, bold: true, color: C.white, align: "left", fontFace: "Calibri", margin: 0
  });
  s.addText("Validate security controls before code reaches users.", {
    x: 0.2, y: 1.8, w: 2.8, h: 1.2,
    fontSize: 12, color: "BBFFD8", align: "left", fontFace: "Calibri", italic: true
  });
  s.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fill: { color: "15803D" }, line: { color: C.white, width: 2 }
  });
  s.addText("4", {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fontSize: 28, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });

  const items = [
    { title: "DAST — Dynamic Analysis", body: "Run automated scanners (OWASP ZAP, Burp Suite) against the running application to discover injection flaws, auth issues, and misconfigurations." },
    { title: "Penetration Testing", body: "Conduct manual and automated pen tests before each major release. Scope should include network, API, web, and mobile surfaces." },
    { title: "Fuzz Testing", body: "Use fuzzing tools (AFL, Honggfuzz) to send unexpected inputs and uncover crashes, memory corruption, and input validation failures." },
    { title: "Security Regression Testing", body: "Maintain a suite of security test cases to ensure previously fixed vulnerabilities cannot be reintroduced by new code." },
  ];

  items.forEach((item, i) => {
    const y = 0.2 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 6.4, h: 1.18,
      fill: { color: C.white }, line: { color: C.slateLight, width: 0.5 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 0.06, h: 1.18,
      fill: { color: C.green }, line: { color: C.green }
    });
    s.addText(item.title, {
      x: 3.55, y: y + 0.1, w: 6.1, h: 0.32,
      fontSize: 13, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    s.addText(item.body, {
      x: 3.55, y: y + 0.42, w: 6.1, h: 0.68,
      fontSize: 11, color: C.slate, fontFace: "Calibri", wrap: true, margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Secure SDLC  |  Phase 4: Testing", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9, color: C.slateLight, align: "right", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Phase 5: Deployment
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.2, h: 5.625,
    fill: { color: "0EA5E9" }, line: { color: "0EA5E9" }
  });
  s.addText("Phase 5", {
    x: 0.15, y: 0.3, w: 2.9, h: 0.5,
    fontSize: 13, color: "BAE6FD", align: "left", fontFace: "Calibri", italic: true, margin: 0
  });
  s.addText("Deploy-\nment", {
    x: 0.15, y: 0.75, w: 2.9, h: 1.5,
    fontSize: 36, bold: true, color: C.white, align: "left", fontFace: "Calibri", margin: 0
  });
  s.addText("Release securely — not just quickly.", {
    x: 0.2, y: 2.4, w: 2.8, h: 1.0,
    fontSize: 12, color: "BAE6FD", align: "left", fontFace: "Calibri", italic: true
  });
  s.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fill: { color: "0369A1" }, line: { color: C.white, width: 2 }
  });
  s.addText("5", {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fontSize: 28, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });

  const items = [
    { title: "Hardened Configuration", body: "Apply CIS Benchmarks for servers, containers, and cloud resources. Disable unused services, ports, and default credentials before go-live." },
    { title: "Secrets & Key Management", body: "Use HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault. Rotate credentials on deployment. Never store secrets in environment files in source control." },
    { title: "Infrastructure as Code (IaC) Scanning", body: "Scan Terraform, CloudFormation, and Kubernetes manifests with Checkov or tfsec before applying to production." },
    { title: "Deployment Pipeline Security", body: "Sign container images, verify checksums, enforce gated approvals for production deployments, and maintain a full deployment audit trail." },
  ];

  items.forEach((item, i) => {
    const y = 0.2 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 6.4, h: 1.18,
      fill: { color: C.white }, line: { color: C.slateLight, width: 0.5 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 0.06, h: 1.18,
      fill: { color: "0EA5E9" }, line: { color: "0EA5E9" }
    });
    s.addText(item.title, {
      x: 3.55, y: y + 0.1, w: 6.1, h: 0.32,
      fontSize: 13, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    s.addText(item.body, {
      x: 3.55, y: y + 0.42, w: 6.1, h: 0.68,
      fontSize: 11, color: C.slate, fontFace: "Calibri", wrap: true, margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Secure SDLC  |  Phase 5: Deployment", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9, color: C.slateLight, align: "right", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Phase 6: Maintenance
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.2, h: 5.625,
    fill: { color: C.red }, line: { color: C.red }
  });
  s.addText("Phase 6", {
    x: 0.15, y: 0.3, w: 2.9, h: 0.5,
    fontSize: 13, color: "FECACA", align: "left", fontFace: "Calibri", italic: true, margin: 0
  });
  s.addText("Mainte-\nnance", {
    x: 0.15, y: 0.75, w: 2.9, h: 1.5,
    fontSize: 36, bold: true, color: C.white, align: "left", fontFace: "Calibri", margin: 0
  });
  s.addText("Security doesn't stop at launch — it evolves with threats.", {
    x: 0.2, y: 2.4, w: 2.8, h: 1.2,
    fontSize: 12, color: "FECACA", align: "left", fontFace: "Calibri", italic: true
  });
  s.addShape(pres.shapes.OVAL, {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fill: { color: "991B1B" }, line: { color: C.white, width: 2 }
  });
  s.addText("6", {
    x: 0.2, y: 4.6, w: 0.9, h: 0.9,
    fontSize: 28, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });

  const items = [
    { title: "Continuous Monitoring (SIEM)", body: "Deploy SIEM solutions (Splunk, Elastic SIEM) with alerts for anomalous authentication, privilege escalation, and data exfiltration patterns." },
    { title: "Vulnerability & Patch Management", body: "Track CVEs, assess CVSS scores, and enforce SLAs: critical patches within 24h, high within 7 days, medium within 30 days." },
    { title: "Incident Response Planning", body: "Maintain and regularly test an IR playbook. Assign roles, establish communication trees, and conduct tabletop exercises quarterly." },
    { title: "Security Retrospectives", body: "After incidents or near-misses, conduct root cause analysis. Feed lessons learned back into requirements, design, and coding standards." },
  ];

  items.forEach((item, i) => {
    const y = 0.2 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 6.4, h: 1.18,
      fill: { color: C.white }, line: { color: C.slateLight, width: 0.5 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.4, y, w: 0.06, h: 1.18,
      fill: { color: C.red }, line: { color: C.red }
    });
    s.addText(item.title, {
      x: 3.55, y: y + 0.1, w: 6.1, h: 0.32,
      fontSize: 13, bold: true, color: C.navy, fontFace: "Calibri", margin: 0
    });
    s.addText(item.body, {
      x: 3.55, y: y + 0.42, w: 6.1, h: 0.68,
      fontSize: 11, color: C.slate, fontFace: "Calibri", wrap: true, margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Secure SDLC  |  Phase 6: Maintenance", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9, color: C.slateLight, align: "right", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Threat Modeling (STRIDE)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Threat Modeling with STRIDE", {
    x: 0.5, y: 0, w: 9, h: 1.0,
    fontSize: 28, bold: true, color: C.white, align: "left", valign: "middle", fontFace: "Calibri", margin: 0
  });

  s.addText("Systematically identify threats before they become vulnerabilities", {
    x: 0.5, y: 1.05, w: 9, h: 0.4,
    fontSize: 13, color: C.tealLt, align: "left", fontFace: "Calibri", italic: true
  });

  const stride = [
    { letter: "S", word: "Spoofing",             threat: "Impersonating another user or system",          control: "MFA, strong authentication, certificate pinning", color: C.teal },
    { letter: "T", word: "Tampering",             threat: "Modifying data in transit or at rest",          control: "Digital signatures, integrity checks, TLS", color: C.orange },
    { letter: "R", word: "Repudiation",            threat: "Denying actions with no audit trail",           control: "Immutable audit logs, digital signatures", color: "7C3AED" },
    { letter: "I", word: "Information Disclosure", threat: "Exposing data to unauthorized parties",         control: "Encryption at rest/transit, access controls", color: C.green },
    { letter: "D", word: "Denial of Service",      threat: "Making systems unavailable",                   control: "Rate limiting, WAF, CDN, auto-scaling", color: "0EA5E9" },
    { letter: "E", word: "Elevation of Privilege", threat: "Gaining unauthorized elevated permissions",     control: "Least privilege, RBAC, input validation", color: C.red },
  ];

  stride.forEach((item, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = 0.35 + col * 4.85;
    const y = 1.55 + row * 1.3;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.6, h: 1.2,
      fill: { color: C.navyMid }, line: { color: item.color, width: 1.5 },
      shadow: makeShadow()
    });
    // Letter badge
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.1, y: y + 0.35, w: 0.5, h: 0.5,
      fill: { color: item.color }, line: { color: item.color }
    });
    s.addText(item.letter, {
      x: x + 0.1, y: y + 0.35, w: 0.5, h: 0.5,
      fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
    });
    s.addText(item.word, {
      x: x + 0.7, y: y + 0.08, w: 3.8, h: 0.35,
      fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0
    });
    s.addText(`Threat: ${item.threat}`, {
      x: x + 0.7, y: y + 0.42, w: 3.8, h: 0.3,
      fontSize: 9, color: C.slateLight, fontFace: "Calibri", margin: 0
    });
    s.addText(`Control: ${item.control}`, {
      x: x + 0.7, y: y + 0.72, w: 3.8, h: 0.4,
      fontSize: 9, color: C.tealLt, fontFace: "Calibri", margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.teal }, line: { color: C.teal }
  });
  s.addText("Also consider: PASTA, VAST, Attack Trees, LINDDUN for privacy threats", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9.5, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 11 — OWASP Integration
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText("OWASP Integration", {
    x: 0.5, y: 0, w: 9, h: 1.0,
    fontSize: 28, bold: true, color: C.white, align: "left", valign: "middle", fontFace: "Calibri", margin: 0
  });

  // OWASP Top 10 table
  s.addText("OWASP Top 10 — Key Risks to Address in Every Project", {
    x: 0.4, y: 1.1, w: 5.4, h: 0.38,
    fontSize: 13, bold: true, color: C.navy, fontFace: "Calibri"
  });

  const top10 = [
    ["A01", "Broken Access Control"],
    ["A02", "Cryptographic Failures"],
    ["A03", "Injection"],
    ["A04", "Insecure Design"],
    ["A05", "Security Misconfiguration"],
    ["A06", "Vulnerable & Outdated Components"],
    ["A07", "Identification & Authentication Failures"],
    ["A08", "Software & Data Integrity Failures"],
    ["A09", "Security Logging & Monitoring Failures"],
    ["A10", "Server-Side Request Forgery (SSRF)"],
  ];

  top10.forEach((row, i) => {
    const col = i < 5 ? 0 : 1;
    const rowIdx = i % 5;
    const x = 0.4 + col * 4.6;
    const y = 1.55 + rowIdx * 0.68;
    const bg = rowIdx % 2 === 0 ? C.white : "F8FAFC";
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.4, h: 0.62,
      fill: { color: bg }, line: { color: C.slateLight, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.62, h: 0.62,
      fill: { color: i === 0 ? C.red : i < 3 ? C.orange : C.teal }, line: { color: "EEEEEE" }
    });
    s.addText(row[0], {
      x, y, w: 0.62, h: 0.62,
      fontSize: 11, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
    });
    s.addText(row[1], {
      x: x + 0.68, y, w: 3.65, h: 0.62,
      fontSize: 11, color: C.dark, valign: "middle", fontFace: "Calibri", margin: 0
    });
  });

  // Right panel - OWASP resources
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.85, y: 1.1, w: 3.85, h: 4.05,
    fill: { color: C.navy }, line: { color: C.teal, width: 1.5 },
    shadow: makeShadow()
  });
  s.addText("OWASP Resources", {
    x: 5.95, y: 1.18, w: 3.65, h: 0.38,
    fontSize: 14, bold: true, color: C.tealLt, fontFace: "Calibri"
  });

  const resources = [
    { name: "OWASP ASVS", desc: "Application Security Verification Standard — 3 levels of verification rigor" },
    { name: "OWASP Testing Guide", desc: "Comprehensive manual testing methodology (400+ test cases)" },
    { name: "OWASP SAMM", desc: "Software Assurance Maturity Model — assess and improve your security program" },
    { name: "OWASP Cheat Sheets", desc: "Concise best-practice guides for 80+ security topics" },
    { name: "OWASP Dependency-Check", desc: "SCA tool to identify vulnerable third-party components" },
  ];

  resources.forEach((r, i) => {
    s.addText(r.name, {
      x: 6.0, y: 1.65 + i * 0.72, w: 3.5, h: 0.28,
      fontSize: 11, bold: true, color: C.white, fontFace: "Calibri", margin: 0
    });
    s.addText(r.desc, {
      x: 6.0, y: 1.9 + i * 0.72, w: 3.55, h: 0.38,
      fontSize: 9.5, color: C.slateLight, fontFace: "Calibri", wrap: true, margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 12 — Security Tools by Phase
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText("Security Tools by Phase", {
    x: 0.5, y: 0, w: 9, h: 1.0,
    fontSize: 28, bold: true, color: C.white, align: "left", valign: "middle", fontFace: "Calibri", margin: 0
  });

  const toolRows = [
    { phase: "Requirements", color: C.teal,    tools: "Threat Dragon, IriusRisk, Microsoft TMT, Confluence (Risk Registry)" },
    { phase: "Design",       color: C.orange,  tools: "OWASP Threat Dragon, Miro (DFDs), draw.io, PlantUML, Microsoft TMT" },
    { phase: "Development",  color: "7C3AED",  tools: "Semgrep, SonarQube, Checkmarx, Snyk Code, GitLeaks, Bandit (Python), ESLint security" },
    { phase: "Testing",      color: C.green,   tools: "OWASP ZAP, Burp Suite Pro, Nuclei, Nessus, Metasploit, AFL++, SQLMap" },
    { phase: "Deployment",   color: "0EA5E9",  tools: "Checkov, tfsec, Trivy, Grype, AWS Inspector, Azure Defender, Vault (HashiCorp)" },
    { phase: "Maintenance",  color: C.red,     tools: "Splunk, Elastic SIEM, PagerDuty, Wazuh, Snyk SCA, OWASP Dependency-Check, TheHive" },
  ];

  toolRows.forEach((row, i) => {
    const y = 1.12 + i * 0.73;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.35, y, w: 9.3, h: 0.66,
      fill: { color: i % 2 === 0 ? C.white : "F8FAFC" },
      line: { color: C.slateLight, width: 0.5 },
      shadow: i % 2 === 0 ? makeShadow() : { type: "outer", color: "000000", blur: 2, offset: 1, angle: 135, opacity: 0.05 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.35, y, w: 1.65, h: 0.66,
      fill: { color: row.color }, line: { color: row.color }
    });
    s.addText(row.phase, {
      x: 0.38, y, w: 1.6, h: 0.66,
      fontSize: 11, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
    });
    s.addText(row.tools, {
      x: 2.1, y, w: 7.4, h: 0.66,
      fontSize: 11, color: C.dark, valign: "middle", fontFace: "Calibri", margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("Choose tools that integrate with your CI/CD pipeline for maximum coverage and automation", {
    x: 0.3, y: 5.35, w: 9.4, h: 0.28,
    fontSize: 9.5, color: C.slateLight, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE — Pipeline Security
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // Header
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText("Pipeline Security", {
    x: 0.5, y: 0, w: 7, h: 1.0,
    fontSize: 28, bold: true, color: C.white, align: "left", valign: "middle",
    fontFace: "Calibri", margin: 0
  });
  // Badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.6, y: 0.3, w: 2.1, h: 0.4,
    fill: { color: C.teal }, line: { color: C.teal }
  });
  s.addText("CI/CD · DevSecOps", {
    x: 7.6, y: 0.3, w: 2.1, h: 0.4,
    fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle",
    fontFace: "Calibri", margin: 0
  });

  // ── Pipeline flow row ──
  const stages = [
    { label: "Source\nControl", color: C.teal },
    { label: "Build", color: "7C3AED" },
    { label: "Test", color: C.green },
    { label: "Artifact\nRegistry", color: C.orange },
    { label: "Staging", color: "0EA5E9" },
    { label: "Production", color: C.red },
  ];

  stages.forEach((st, i) => {
    const x = 0.3 + i * 1.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.1, w: 1.38, h: 0.55,
      fill: { color: st.color }, line: { color: st.color }
    });
    s.addText(st.label, {
      x, y: 1.1, w: 1.38, h: 0.55,
      fontSize: 9.5, bold: true, color: C.white, align: "center", valign: "middle",
      fontFace: "Calibri", margin: 0
    });
    if (i < stages.length - 1) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 1.38, y: 1.3, w: 0.22, h: 0.15,
        fill: { color: C.slateLight }, line: { color: C.slateLight }
      });
    }
  });

  // ── Security gates (below each stage) ──
  const gates = [
    { stage: "Source Control",  checks: ["Branch protection rules", "Signed commits (GPG)", "CODEOWNERS enforcement", "Secret scanning (GitLeaks)"] },
    { stage: "Build",           checks: ["SAST (Semgrep / Sonar)", "Dependency audit (SCA)", "License compliance check", "No hardcoded secrets"] },
    { stage: "Test",            checks: ["DAST (OWASP ZAP)", "Security unit/integration tests", "Fuzz testing (AFL++)", "Security regression gate"] },
    { stage: "Artifact Registry", checks: ["Container image signing", "Vulnerability scan (Trivy)", "SBOM generation", "Provenance attestation"] },
    { stage: "Staging",         checks: ["Pen test (automated)", "Config drift detection", "OWASP baseline scan", "Compliance assertion"] },
    { stage: "Production",      checks: ["Immutable infra (IaC)", "Runtime protection (RASP)", "WAF / DDoS mitigation", "Continuous monitoring"] },
  ];

  gates.forEach((g, i) => {
    const x = 0.3 + i * 1.6;
    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.75, w: 1.38, h: 3.4,
      fill: { color: C.navyMid }, line: { color: stages[i].color, width: 1 },
      shadow: makeShadow()
    });
    g.checks.forEach((chk, j) => {
      // Bullet dot
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.1, y: 1.88 + j * 0.78, w: 0.12, h: 0.12,
        fill: { color: stages[i].color }, line: { color: stages[i].color }
      });
      s.addText(chk, {
        x: x + 0.28, y: 1.82 + j * 0.78, w: 1.04, h: 0.65,
        fontSize: 8.5, color: C.slateLight, fontFace: "Calibri", wrap: true, margin: 0
      });
    });
  });

  // ── Bottom key principles ──
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.2, w: 10, h: 0.42,
    fill: { color: C.navyMid }, line: { color: C.teal, width: 1 }
  });
  const principles = ["Fail fast on security gates", "Every gate is automated & enforced", "Audit trail for every deployment", "Secrets never touch code"];
  principles.forEach((p, i) => {
    const x = 0.2 + i * 2.45;
    s.addShape(pres.shapes.OVAL, {
      x, y: 5.29, w: 0.16, h: 0.16,
      fill: { color: C.teal }, line: { color: C.teal }
    });
    s.addText(p, {
      x: x + 0.22, y: 5.22, w: 2.15, h: 0.38,
      fontSize: 9.5, color: C.tealLt, valign: "middle", fontFace: "Calibri", margin: 0
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 13 — DevSecOps Principles
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: C.dark }, line: { color: C.dark }
  });
  s.addText("DevSecOps Principles", {
    x: 0.5, y: 0, w: 9, h: 1.0,
    fontSize: 28, bold: true, color: C.white, align: "left", valign: "middle", fontFace: "Calibri", margin: 0
  });
  s.addText("Security as code, culture, and shared responsibility", {
    x: 0.5, y: 1.05, w: 9, h: 0.38,
    fontSize: 13, color: C.tealLt, align: "center", fontFace: "Calibri", italic: true
  });

  // Pipeline visual
  const pipelineSteps = ["Plan", "Code", "Build", "Test", "Release", "Deploy", "Operate", "Monitor"];
  const stepColors = [C.teal, "7C3AED", C.orange, C.green, C.teal, "0EA5E9", C.orange, C.red];

  pipelineSteps.forEach((step, i) => {
    const x = 0.3 + i * 1.18;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.55, w: 1.05, h: 0.48,
      fill: { color: stepColors[i] }, line: { color: stepColors[i] }
    });
    s.addText(step, {
      x, y: 1.55, w: 1.05, h: 0.48,
      fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
    });
    if (i < pipelineSteps.length - 1) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 1.05, y: 1.73, w: 0.13, h: 0.12,
        fill: { color: C.slateLight }, line: { color: C.slateLight }
      });
    }
  });

  // Security badge under pipeline
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 2.1, w: 9.4, h: 0.28,
    fill: { color: C.teal, transparency: 20 }, line: { color: C.tealLt }
  });
  s.addText("Security gates embedded at every stage — automated, measurable, enforced", {
    x: 0.3, y: 2.1, w: 9.4, h: 0.28,
    fontSize: 10, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });

  // 4 principle cards
  const principles = [
    { title: "Security as Code", body: "Define security policies, configurations, and controls as version-controlled code (OPA, Sentinel, Conftest)." },
    { title: "Shared Responsibility", body: "Every engineer owns security — not just the security team. Training, secure defaults, and tooling enable this." },
    { title: "Fail Fast, Fix Fast", body: "Automated gates block insecure code immediately. Developers get actionable feedback in seconds, not weeks." },
    { title: "Metrics & Visibility", body: "Track MTTR for vulnerabilities, DAST coverage, secrets leak rate, and SLA compliance on a security dashboard." },
  ];

  principles.forEach((p, i) => {
    const x = 0.3 + (i % 2) * 4.85;
    const y = 2.5 + Math.floor(i / 2) * 1.45;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.6, h: 1.3,
      fill: { color: C.navyMid }, line: { color: C.teal, width: 1 },
      shadow: makeShadow()
    });
    s.addText(p.title, {
      x: x + 0.15, y: y + 0.1, w: 4.3, h: 0.38,
      fontSize: 13, bold: true, color: C.tealLt, fontFace: "Calibri", margin: 0
    });
    s.addText(p.body, {
      x: x + 0.15, y: y + 0.5, w: 4.3, h: 0.72,
      fontSize: 11, color: C.slateLight, fontFace: "Calibri", wrap: true, margin: 0
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.teal }, line: { color: C.teal }
  });
  s.addText("DevSecOps culture: security champions, gamified training, bug bounty programs", {
    x: 0.3, y: 5.35, w: 9, h: 0.28,
    fontSize: 9.5, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 14 — Cost of Security: Shift Left ROI
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText("The Business Case: Cost of Fixing Vulnerabilities", {
    x: 0.5, y: 0, w: 9, h: 1.0,
    fontSize: 24, bold: true, color: C.white, align: "left", valign: "middle", fontFace: "Calibri", margin: 0
  });

  // Bar chart data
  const chartData = [{
    name: "Relative Cost to Fix",
    labels: ["Requirements", "Design", "Development", "Testing", "Deployment", "Post-Release"],
    values: [1, 5, 10, 15, 30, 100]
  }];

  s.addChart(pres.charts.BAR, chartData, {
    x: 0.4, y: 1.1, w: 5.5, h: 4.1, barDir: "col",
    chartColors: [C.green, C.teal, C.orange, C.orange, C.red, C.red],
    chartArea: { fill: { color: C.white }, roundedCorners: false },
    catAxisLabelColor: "334155",
    valAxisLabelColor: "64748B",
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelColor: "1E293B",
    showLegend: false,
    showTitle: false,
    valAxisMinVal: 0,
  });

  // Key stats
  const stats = [
    { num: "30×", label: "More expensive", sub: "to fix in production vs requirements" },
    { num: "85%", label: "Of breaches", sub: "exploited known vulnerabilities with available patches" },
    { num: "$4.8M", label: "Average cost", sub: "of a data breach (IBM 2024)" },
    { num: "6×", label: "ROI", sub: "of investing in secure SDLC vs reactive remediation" },
  ];

  stats.forEach((stat, i) => {
    const y = 1.1 + i * 1.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.1, y, w: 3.65, h: 0.88,
      fill: { color: C.white }, line: { color: C.slateLight, width: 0.5 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.1, y, w: 0.06, h: 0.88,
      fill: { color: C.teal }, line: { color: C.teal }
    });
    s.addText(stat.num, {
      x: 6.2, y: y + 0.08, w: 1.0, h: 0.72,
      fontSize: 26, bold: true, color: C.navy, fontFace: "Calibri", margin: 0, valign: "middle"
    });
    s.addText(stat.label, {
      x: 7.22, y: y + 0.06, w: 2.45, h: 0.32,
      fontSize: 12, bold: true, color: C.dark, fontFace: "Calibri", margin: 0
    });
    s.addText(stat.sub, {
      x: 7.22, y: y + 0.4, w: 2.45, h: 0.4,
      fontSize: 10, color: C.slate, fontFace: "Calibri", margin: 0, wrap: true
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.35, w: 10, h: 0.28,
    fill: { color: C.dark }, line: { color: C.dark }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 15 — Summary & Conclusion (dark)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Right decorative
  s.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -0.5, w: 3.5, h: 3.5,
    fill: { color: C.navyMid }, line: { color: C.teal, width: 1.5 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: 8.2, y: 0.3, w: 2.0, h: 2.0,
    fill: { color: C.teal, transparency: 80 }, line: { color: C.tealLt, width: 1 }
  });

  // Left accent
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.45, h: 5.625,
    fill: { color: C.teal }, line: { color: C.teal }
  });

  s.addText("Key Takeaways", {
    x: 0.65, y: 0.3, w: 8, h: 0.55,
    fontSize: 14, color: C.tealLt, fontFace: "Calibri", italic: true, margin: 0
  });
  s.addText("Building Security In,\nNot Bolting On", {
    x: 0.65, y: 0.82, w: 7.5, h: 1.3,
    fontSize: 36, bold: true, color: C.white, fontFace: "Calibri", margin: 0
  });

  const takeaways = [
    "Security requirements must be defined before the first sprint begins",
    "Threat modeling in design phase eliminates entire vulnerability classes early",
    "Automated SAST/SCA in CI/CD provides continuous security without slowing delivery",
    "Penetration testing and DAST validate controls before every production release",
    "Hardened deployments and secrets management prevent infrastructure-level breaches",
    "Continuous monitoring and incident response complete the security lifecycle",
  ];

  takeaways.forEach((t, i) => {
    s.addShape(pres.shapes.OVAL, {
      x: 0.68, y: 2.2 + i * 0.53, w: 0.22, h: 0.22,
      fill: { color: C.teal }, line: { color: C.teal }
    });
    s.addText(t, {
      x: 0.98, y: 2.18 + i * 0.53, w: 8.7, h: 0.28,
      fontSize: 11.5, color: C.slateLight, fontFace: "Calibri", margin: 0, valign: "middle"
    });
  });

  // Bottom CTA bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.1, w: 10, h: 0.525,
    fill: { color: C.teal }, line: { color: C.teal }
  });
  s.addText("Start Today: Pick one phase, embed one tool, measure the impact", {
    x: 0.3, y: 5.1, w: 9.4, h: 0.525,
    fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", margin: 0
  });
}

// ─── Write file ──────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "Secure-SDLC.pptx" })
  .then(() => console.log("✅ Secure-SDLC.pptx created successfully"))
  .catch(err => { console.error("❌ Error:", err); process.exit(1); });
