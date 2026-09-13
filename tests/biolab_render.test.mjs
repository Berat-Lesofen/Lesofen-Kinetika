/**
 * LESOFEN KINETIKA - Automated Biomechanics Lab Render & Simulation Test Suite
 * Asserts automatic rendering, zero blank states, 4 simulator models, 
 * reactive state synchronization, and exercise/movement/muscle route mappings.
 */

import { state } from '../js/core/state.js';
import { graph } from '../js/core/graph.js';
import { BiomechanicsLab } from '../js/components/bioLab.js';

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
console.log("🧪 RUNNING BIOMECHANICS LAB RENDER & SIMULATION TESTS");
console.log("=======================================================\n");

// Mock DOM Container
const mockContainer = {
  innerHTML: '',
  querySelector: () => null,
  querySelectorAll: () => []
};

// 1. INITIALIZATION & BLANK SCREEN PREVENTION
console.log("--- 1. Initialization and Zero-Blank Check ---");
const lab = new BiomechanicsLab(mockContainer);
assert(mockContainer.innerHTML.length > 500, `Container is automatically populated on init (length: ${mockContainer.innerHTML.length} chars)`);
assert(mockContainer.innerHTML.includes('LABORATUVARI'), 'Contains main header and badge');
assert(mockContainer.innerHTML.includes('simTabLateral') && mockContainer.innerHTML.includes('simTabBench'), 'Contains all 4 simulator selector tabs');

// 2. ALL 4 SIMULATORS RENDER VALID KINEMATIC MODELS
console.log("\n--- 2. All 4 Simulator Kinematic Models Render Check ---");
const simulators = [
  { key: 'lateral_raise', name: 'Lateral Raise (Omuz)', expectedSnippet: 'Kinematik' },
  { key: 'biceps_curl', name: 'Biceps Curl (Dirsek)', expectedSnippet: 'Dirsek Fleksiyon' },
  { key: 'squat_lever', name: 'Squat Kaldıracı (Kalça/Diz)', expectedSnippet: 'Squat Eklem' },
  { key: 'bench_mechanics', name: 'Bench Press (Göğüs/İtiş)', expectedSnippet: 'Mekanik Modeli' }
];

simulators.forEach(sim => {
  lab.state.activeSim = sim.key;
  const html = lab.renderActiveSimulator();
  assert(html.length > 500, `Simulator '${sim.name}' rendered non-empty content (${html.length} chars)`);
  assert(html.includes('<svg'), `Simulator '${sim.name}' contains SVG kinematic visualization`);
  assert(html.includes(sim.expectedSnippet), `Simulator '${sim.name}' contains expected kinematic text`);
  assert(html.includes('aspect-'), `Simulator '${sim.name}' uses responsive aspect-ratio SVG`);
});

// 3. REACTIVE STATE SYNCHRONIZATION VIA state.openBioLab
console.log("\n--- 3. Reactive State Synchronization Check ---");
state.openBioLab('bench_mechanics', 'Flat Barbell Bench Press Mekaniği');
assert(state.getState().activeTab === 'biolab', 'activeTab switched to biolab');
assert(state.getState().activeBioSim === 'bench_mechanics', 'activeBioSim set to bench_mechanics in state');
assert(lab.state.activeSim === 'bench_mechanics', 'BiomechanicsLab synced activeSim from state');

// 3b. CANVAS BINDING & RENDERER INSTANTIATION CHECK
console.log("\n--- 3b. Canvas Binding & Renderer Instantiation Check ---");
const mockGrad = { addColorStop: () => {} };
const mockCtx = new Proxy({}, {
  get: (target, prop) => {
    if (prop === 'measureText') return () => ({ width: 50 });
    if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return () => mockGrad;
    return () => {};
  }
});
const mockCanvas = {
  getContext: () => mockCtx,
  getBoundingClientRect: () => ({ width: 600, height: 450 }),
  parentElement: { clientWidth: 600, clientHeight: 450 }
};

Object.entries(lab.models).forEach(([key, model]) => {
  model.setCanvas(mockCanvas);
  assert(model.canvas === mockCanvas, `Model '${key}' canvas property attached`);
  assert(model.renderer !== null, `Model '${key}' renderer successfully instantiated`);
  assert(typeof model.renderer.render === 'function', `Model '${key}' renderer has render method`);
  assert(typeof model.resize === 'function', `Model '${key}' has resize method`);
  model.resize();
  model.render();
  assert(true, `Model '${key}' resize() and render() execute cleanly without throwing`);
});
assert(mockContainer.innerHTML.includes('Mekanik Modeli'), 'DOM rendered Bench Press simulator content');

state.openBioLab('squat_lever', 'Squat Kaldıracı');
assert(lab.state.activeSim === 'squat_lever', 'BiomechanicsLab synced activeSim to squat_lever');
assert(mockContainer.innerHTML.includes('Squat Eklem'), 'DOM rendered Squat Lever content');

state.openBioLab('biceps_curl', 'Biceps Curl Mekaniği');
assert(lab.state.activeSim === 'biceps_curl', 'BiomechanicsLab synced activeSim to biceps_curl');
assert(mockContainer.innerHTML.includes('Dirsek Fleksiyon'), 'DOM rendered Biceps Curl content');

state.openBioLab('lateral_raise', 'Lateral Raise Mekaniği');
assert(lab.state.activeSim === 'lateral_raise', 'BiomechanicsLab synced activeSim to lateral_raise');
assert(mockContainer.innerHTML.includes('Kinematik'), 'DOM rendered Lateral Raise content');

// 4. EXERCISE LAB -> BIOLAB ROUTE MAPPING FOR ALL 8 EXERCISES
console.log("\n--- 4. All 8 Exercises BioLab Route Check ---");
const allExercises = graph.getAllExercises();
assert(allExercises.length === 8, `Total exercises count is 8 (found: ${allExercises.length})`);

allExercises.forEach(ex => {
  let sim = 'lateral_raise';
  if (ex.id.includes('curl') || ex.id.includes('pulldown')) sim = 'biceps_curl';
  else if (ex.id.includes('squat') || ex.id.includes('deadlift') || ex.id.includes('thrust')) sim = 'squat_lever';
  else if (ex.id.includes('bench')) sim = 'bench_mechanics';
  
  state.openBioLab(sim, `${ex.name} Mekaniği`);
  assert(lab.state.activeSim === sim, `Exercise '${ex.name}' routes cleanly to '${sim}'`);
  assert(mockContainer.innerHTML.length > 500, `Exercise '${ex.name}' renders valid simulation DOM`);
});

// 5. ALL 40 MOVEMENTS -> BIOLAB ROUTE MAPPING
console.log("\n--- 5. All 40 Movements BioLab Route Check ---");
const allMovements = graph.getAllMovements();
assert(allMovements.length === 40, `Total movements count is 40 (found: ${allMovements.length})`);

allMovements.forEach(m => {
  let sim = 'lateral_raise';
  if (m.id.includes('elbow') || m.id.includes('supination') || m.id.includes('pronation')) sim = 'biceps_curl';
  else if (m.id.includes('knee') || m.id.includes('hip') || m.id.includes('ankle') || m.id.includes('spine') || m.id.includes('lomber')) sim = 'squat_lever';
  else if (m.id.includes('bench') || m.id.includes('adduction') || m.id.includes('press')) sim = 'bench_mechanics';

  state.openBioLab(sim, `${m.name} Mekaniği`);
  assert(['lateral_raise', 'biceps_curl', 'squat_lever', 'bench_mechanics'].includes(lab.state.activeSim), `Movement '${m.name}' routes to valid simulator '${lab.state.activeSim}'`);
});

// 6. ALL 27 MUSCLES -> BIOLAB ROUTE MAPPING
console.log("\n--- 6. All 27 Muscles BioLab Route Check ---");
const allMuscles = graph.getAllMuscles();
assert(allMuscles.length === 27, `Total muscles count is 27 (found: ${allMuscles.length})`);

allMuscles.forEach(m => {
  let sim = 'lateral_raise';
  if (m.id.includes('biceps') || m.id.includes('brachialis') || m.id.includes('forearm')) sim = 'biceps_curl';
  else if (m.id.includes('quadriceps') || m.id.includes('gluteus') || m.id.includes('hamstring') || m.id.includes('calves') || m.id.includes('gastrocnemius') || m.id.includes('soleus') || m.id.includes('tibialis') || m.id.includes('erector')) sim = 'squat_lever';
  else if (m.id.includes('pectoralis') || m.id.includes('triceps')) sim = 'bench_mechanics';

  state.openBioLab(sim, `${m.name} Mekaniği`);
  assert(['lateral_raise', 'biceps_curl', 'squat_lever', 'bench_mechanics'].includes(lab.state.activeSim), `Muscle '${m.name}' routes to valid simulator '${lab.state.activeSim}'`);
});

console.log("\n=======================================================");
console.log(`📊 BIOLAB TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) process.exit(1);
