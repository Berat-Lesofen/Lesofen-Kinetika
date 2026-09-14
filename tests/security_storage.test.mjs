/**
 * LESOFEN KINETIKA - SECURITY & STORAGE UNIT TESTS
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log("====================================================");
console.log("🔒 SECURITY & STORAGE HARDENING — UNIT TEST RUNNER");
console.log("====================================================\n");

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

async function run() {
  await test("vercel.json contains all 8 required security headers", () => {
    const vercelPath = path.join(rootDir, 'vercel.json');
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    assert(vercelConfig.headers && vercelConfig.headers.length > 0, "headers array must exist");
    
    const headers = vercelConfig.headers[0].headers;
    const headerKeys = new Set(headers.map(h => h.key));

    const requiredHeaders = [
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "Permissions-Policy",
      "Referrer-Policy",
      "Cross-Origin-Opener-Policy",
      "Cross-Origin-Resource-Policy",
      "X-Frame-Options",
      "X-Content-Type-Options"
    ];

    for (const req of requiredHeaders) {
      assert(headerKeys.has(req), `Missing required header: ${req}`);
    }

    const csp = headers.find(h => h.key === "Content-Security-Policy").value;
    assert(csp.includes("object-src 'none'"), "CSP must include object-src 'none'");
    assert(csp.includes("base-uri 'self'"), "CSP must include base-uri 'self'");
    assert(csp.includes("frame-ancestors 'none'"), "CSP must include frame-ancestors 'none'");
    assert(csp.includes("https://cdn.tailwindcss.com"), "CSP must allow tailwindcdn");
    assert(csp.includes("https://fonts.googleapis.com"), "CSP must allow google fonts css");
    assert(csp.includes("https://fonts.gstatic.com"), "CSP must allow google fonts fonts");
  });

  await test("index.html contains meta CSP, referrer, and X-Content-Type-Options tags", () => {
    const htmlPath = path.join(rootDir, 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    assert(htmlContent.includes('<meta name="referrer" content="strict-origin-when-cross-origin">'), "Missing referrer meta");
    assert(htmlContent.includes('<meta http-equiv="X-Content-Type-Options" content="nosniff">'), "Missing X-Content-Type-Options meta");
    assert(htmlContent.includes('<meta http-equiv="Content-Security-Policy"'), "Missing Content-Security-Policy meta");
    assert(!htmlContent.includes('frame-ancestors'), "meta CSP must not include frame-ancestors (unsupported in meta)");
  });

  await test("Header.js contains escapeHtml helper and sanitizes search input", () => {
    const headerPath = path.join(rootDir, 'js', 'components', 'header.js');
    const headerContent = fs.readFileSync(headerPath, 'utf8');

    assert(headerContent.includes('function escapeHtml'), "escapeHtml helper function must exist");
    assert(headerContent.includes('escapeHtml(q)'), "search query must be passed through escapeHtml");
  });

  await test("AgendaStorage rejects invalid keys and prototype pollution", async () => {
    const storageMock = {};
    global.window = {
      localStorage: {
        getItem: (k) => storageMock[k] || null,
        setItem: (k, v) => { storageMock[k] = v; },
        removeItem: (k) => { delete storageMock[k]; }
      }
    };

    const { agendaStorage } = await import('../js/agenda/storage.js');

    // Test prototype pollution attempts
    agendaStorage.setSplitForDate('__proto__', 'PUSH');
    assert.strictEqual(agendaStorage.getSplitForDate('__proto__'), null);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(Object.prototype, 'PUSH'), false);

    agendaStorage.setSplitForDate('constructor', 'PUSH');
    assert.strictEqual(agendaStorage.getSplitForDate('constructor'), null);

    agendaStorage.setSplitForDate('prototype', 'PUSH');
    assert.strictEqual(agendaStorage.getSplitForDate('prototype'), null);

    // Test invalid date keys
    agendaStorage.setSplitForDate('<script>alert(1)</script>', 'PUSH');
    assert.strictEqual(agendaStorage.getSplitForDate('<script>alert(1)</script>'), null);

    agendaStorage.setSplitForDate('2026/01/01', 'PUSH');
    assert.strictEqual(agendaStorage.getSplitForDate('2026/01/01'), null);

    // Test invalid split ID
    agendaStorage.setSplitForDate('2026-09-15', 'INVALID_SPLIT');
    assert.strictEqual(agendaStorage.getSplitForDate('2026-09-15'), null);

    agendaStorage.setSplitForDate('2026-09-15', '<img src=x onerror=alert(1)>');
    assert.strictEqual(agendaStorage.getSplitForDate('2026-09-15'), null);

    // Test valid entry
    agendaStorage.setSplitForDate('2026-09-15', 'PUSH');
    assert.strictEqual(agendaStorage.getSplitForDate('2026-09-15'), 'PUSH');

    // Test removal
    agendaStorage.removeSplit('2026-09-15');
    assert.strictEqual(agendaStorage.getSplitForDate('2026-09-15'), null);
  });

  await test("AgendaStorage safely sanitizes contaminated localStorage JSON", async () => {
    const contaminatedPayload = JSON.stringify({
      "2026-09-15": "PULL",
      "__proto__": { "polluted": true },
      "invalid-date": "PUSH",
      "2026-09-16": "<evil>",
      "2026-09-17": "LEGS"
    });

    global.window.localStorage.getItem = () => contaminatedPayload;

    const { agendaStorage } = await import('../js/agenda/storage.js?' + Date.now());
    
    const allData = agendaStorage.getAllData();
    assert.strictEqual(allData['2026-09-15'], 'PULL');
    assert.strictEqual(allData['2026-09-17'], 'LEGS');
    assert.strictEqual(allData['invalid-date'], undefined);
    assert.strictEqual(allData['2026-09-16'], undefined);
    assert.strictEqual(Object.prototype.polluted, undefined);
  });

  console.log("\n----------------------------------------------------");
  console.log(`Total Tests: ${passed} | Passed: ${passed} | Failed: 0`);
  console.log("----------------------------------------------------");
  console.log("🔒 ALL SECURITY HARDENING TESTS PASSED!\n");
}

run();
