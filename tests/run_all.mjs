/**
 * LESOFEN KINETIKA - MASTER TEST SUITE RUNNER
 * Executes Data Integrity (33 tests), BioLab Rendering (135 tests),
 * and Biomechanics Mathematical Engines (29 tests). Total: 197 tests.
 */

import { execSync } from 'child_process';

console.log("\n=======================================================");
console.log("🚀 EXECUTING LESOFEN KINETIKA FULL TEST SUITE");
console.log("=======================================================\n");

const testSuites = [
  { name: "1. Data Integrity & Anatomy Graph Tests", file: "tests/data_integrity.test.mjs" },
  { name: "2. BioLab Reactive Rendering & Route Tests", file: "tests/biolab_render.test.mjs" },
  { name: "3. Advanced Biomechanics Mathematical Models", file: "tests/biomechanics_models.test.mjs" }
];

let totalFailed = 0;

for (const suite of testSuites) {
  console.log(`\n▶ Running ${suite.name}...`);
  try {
    const output = execSync(`node ${suite.file}`, { encoding: 'utf-8' });
    console.log(output);
  } catch (err) {
    console.error(`❌ Suite failed: ${suite.name}`);
    console.error(err.stdout || err.message);
    totalFailed++;
  }
}

console.log("\n=======================================================");
if (totalFailed === 0) {
  console.log("🏆 ALL 3 TEST SUITES (197/197 TESTS) PASSED SUCCESSFULLY!");
  console.log("=======================================================\n");
  process.exit(0);
} else {
  console.error(`💥 ${totalFailed} TEST SUITE(S) FAILED.`);
  console.log("=======================================================\n");
  process.exit(1);
}
