/**
 * LESOFEN KINETIKA - Automated Data & Architecture Integrity Test Suite
 * Asserts dataset counts (27 muscles, 40 movements, 8 exercises, 6 insights),
 * 11-region dynamic partitioning, relational integrity, and progressive navigation.
 */

import { MUSCLES } from '../js/data/muscles.js';
import { MOVEMENTS } from '../js/data/movements.js';
import { EXERCISES } from '../js/data/exercises.js';
import { INSIGHTS } from '../js/data/insights.js';
import { graph } from '../js/core/graph.js';
import { state } from '../js/core/state.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log("\n=======================================================");
console.log("🧪 RUNNING LESOFEN KINETIKA DATA & ARCHITECTURE TESTS");
console.log("=======================================================\n");

// 1. DATASET COUNT ASSERTIONS (User Touch-up #4)
console.log("--- 1. Dataset Counts ---");
const musclesCount = graph.getAllMuscles().length;
const movementsCount = graph.getAllMovements().length;
const exercisesCount = graph.getAllExercises().length;
const insightsCount = graph.getAllInsights().length;

assert(musclesCount === 27, `Muscles count is dynamic and equals 27 (found: ${musclesCount})`);
assert(movementsCount === 40, `Movements count is dynamic and equals 40 (found: ${movementsCount})`);
assert(exercisesCount === 8, `Exercises count is dynamic and equals 8 (found: ${exercisesCount})`);
assert(insightsCount === 6, `Insights count is dynamic and equals 6 (found: ${insightsCount})`);

// 2. DYNAMIC REGIONS & PARTITIONING (User Touch-up #1)
console.log("\n--- 2. Dynamic Regional Groups & Partitioning ---");
const totalRegions = graph.getTotalRegionsCount();
assert(totalRegions === 11, `Total distinct regions count is dynamic and equals 11 (found: ${totalRegions})`);

const regionalGroups = graph.getRegionalGroups();
assert(regionalGroups.length === 3, `3 Main body segments defined (Upper, Core, Lower)`);

let totalMusclesInRegions = 0;
const assignedMuscles = new Set();
const duplicateAssignments = [];

regionalGroups.forEach(group => {
  group.regions.forEach(reg => {
    assert(reg.count > 0, `Region '${reg.name}' has non-zero muscles (count: ${reg.count})`);
    totalMusclesInRegions += reg.count;
    reg.muscles.forEach(m => {
      if (assignedMuscles.has(m.id)) {
        duplicateAssignments.push(m.id);
      }
      assignedMuscles.add(m.id);
    });
  });
});

assert(totalMusclesInRegions === musclesCount, `Sum of regional muscle counts (${totalMusclesInRegions}) equals total muscles (${musclesCount})`);
assert(duplicateAssignments.length === 0, `Zero duplicate/overlapping muscle assignments across regions (found: ${duplicateAssignments.join(', ') || 'none'})`);
assert(assignedMuscles.size === musclesCount, `All ${musclesCount} muscles are assigned to a region without orphans`);

// Specifically verify Tibialis Anterior
const baldirMuscles = graph.getMusclesForRegion("Baldır");
const hasTibialis = baldirMuscles.some(m => m.id === "tibialis_anterior");
assert(hasTibialis, `Tibialis Anterior is correctly mapped under 'Baldır & Kaval' region`);

// 3. RELATIONAL GRAPH INTEGRITY
console.log("\n--- 3. Relational Graph Cross-References ---");
const muscleIds = new Set(graph.getAllMuscles().map(m => m.id));
const movementIds = new Set(graph.getAllMovements().map(m => m.id));
const exerciseIds = new Set(graph.getAllExercises().map(e => m => e.id));

// Verify each muscle's actions point to existing movements
let invalidMuscleActions = 0;
graph.getAllMuscles().forEach(m => {
  m.actions.forEach(a => {
    if (!movementIds.has(a.movement)) {
      console.error(`Unknown movement '${a.movement}' in muscle '${m.id}'`);
      invalidMuscleActions++;
    }
  });
});
assert(invalidMuscleActions === 0, `All muscle action references point to valid movements (errors: ${invalidMuscleActions})`);

// Verify movements prime movers point to existing muscles
let invalidMovementMovers = 0;
graph.getAllMovements().forEach(mov => {
  mov.primeMovers.forEach(id => {
    if (!muscleIds.has(id)) {
      console.error(`Unknown muscle ID '${id}' in movement '${mov.id}'`);
      invalidMovementMovers++;
    }
  });
});
assert(invalidMovementMovers === 0, `All movement prime movers point to valid muscles (errors: ${invalidMovementMovers})`);

// 4. PROGRESSIVE DISCLOSURE STATE FLOW
console.log("\n--- 4. Progressive Disclosure State Flow ---");
state.goHome();
assert(state.getState().activeTab === "home", `Initial state: activeTab is 'home'`);
assert(state.getState().breadcrumbs.length === 1, `Initial breadcrumbs count is 1 ('Kinetika')`);

state.openMuscles();
assert(state.getState().activeTab === "anatomy" && state.getState().muscleFlowLevel === 1, `Level 1: Kas Sistemi opened`);

state.selectMuscleRegion("Omuz");
assert(state.getState().muscleFlowLevel === 2 && state.getState().selectedRegion === "Omuz", `Level 2: Omuz Region Hub active`);
assert(state.getState().breadcrumbs.length === 3, `Breadcrumb path length is 3 (Kinetika / Kas Sistemi / Omuz)`);

state.selectMuscle("deltoid_lateral", "Lateral Deltoid");
assert(state.getState().muscleFlowLevel === 3 && state.getState().selectedMuscleId === "deltoid_lateral", `Level 3: Lateral Deltoid detail active`);
assert(state.getState().breadcrumbs.length === 4, `Breadcrumb path length is 4 (Kinetika / Kas Sistemi / Omuz / Lateral Deltoid)`);

state.stepBack();
assert(state.getState().muscleFlowLevel === 2 && state.getState().selectedRegion === "Omuz", `Step back from muscle detail returns to Omuz Hub (Level 2)`);

state.stepBack();
assert(state.getState().muscleFlowLevel === 1, `Step back from Region Hub returns to All Regions (Level 1)`);

state.goHome();
assert(state.getState().activeTab === "home", `goHome() safely returns to Portal Home`);

console.log("\n=======================================================");
console.log(`📊 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
