/**
 * Node.js CLI Test Runner for Biomechanics Model Lab
 */

import { runAllTests } from './unit-tests.js';

console.log('====================================================');
console.log('🧪 BIOMECHANICS MODEL LAB — UNIT TEST RUNNER');
console.log('====================================================\n');

const results = runAllTests();
let passedCount = 0;
let failedCount = 0;

for (const res of results) {
  if (res.passed) {
    passedCount++;
    console.log(`  ✅ PASS: ${res.name}`);
  } else {
    failedCount++;
    console.error(`  ❌ FAIL: ${res.name}`);
    console.error(`     Error: ${res.error}\n`);
  }
}

console.log('\n----------------------------------------------------');
console.log(`Total Tests: ${results.length} | Passed: ${passedCount} | Failed: ${failedCount}`);
console.log('----------------------------------------------------');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL UNIT TESTS PASSED WITH 100% SUCCESS!\n');
  process.exit(0);
}
