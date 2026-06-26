let hunger = 0;
let money = 0;
let working = false;

const petDisplay = document.getElementById('pet-display');
const hungerBar = document.getElementById('hunger-bar');
const hungerPct = document.getElementById('hunger-pct');
const petMood = document.getElementById('pet-mood');
const moneyDisplay = document.getElementById('money-display');
const log = document.getElementById('log');
const workBtn = document.getElementById('work-btn');
const feedBtn = document.getElementById('feed-btn');

const SAD_PET = `
  /\\_____/\\
 (  o   o  )
  =  ---  =     "..."
  (  ___  )
   \\_____/
  __|| ||__
 (__)   (__)`.trim();

const HAPPY_PET = `
  /\\_____/\\
 (  ^   ^  )
  =  ___  =     ":D"
  (       )
   \\_____/
  __|| ||__
 (__)   (__)`.trim();

const WORK_PET = `
  /\\_____/\\
 (  *   *  )
  = \\___/ =     "!!!"
  (       )
   \\_____/
  __|| ||__
 (__)   (__)`.trim();

function renderPet(face) {
  petDisplay.textContent = face || (hunger >= 50 ? HAPPY_PET : SAD_PET);
}

function updateHunger() {
  hungerBar.style.width = hunger + '%';
  hungerPct.textContent = hunger + '%';
  if (hunger >= 50) {
    hungerBar.classList.add('fed');
    petMood.textContent = '*wags tail happily* :)';
  } else {
    hungerBar.classList.remove('fed');
    if (hunger === 0) {
      petMood.textContent = '*stares at you expectantly*';
    } else {
      petMood.textContent = '*still looks hungry...*';
    }
  }
  renderPet();
}

function addLog(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

function addMoney(amount) {
  money += amount;
  moneyDisplay.textContent = '$' + money;
}

feedBtn.addEventListener('click', () => {
  if (hunger >= 100) {
    addLog('Lumie is too full to eat!');
    return;
  }
  hunger = Math.min(100, hunger + 20);
  updateHunger();
  const msgs = [
    'Lumie gobbles up the food!',
    'Lumie munches happily.',
    'Nom nom nom...',
    'Lumie says thank you!',
  ];
  addLog(msgs[Math.floor(Math.random() * msgs.length)]);
});

workBtn.addEventListener('click', () => {
  if (working) return;
  working = true;
  workBtn.disabled = true;

  petDisplay.textContent = WORK_PET;
  petMood.textContent = '*zooooom*';

  petDisplay.classList.remove('jump');
  void petDisplay.offsetWidth;
  petDisplay.classList.add('jump');

  const earns = hunger >= 50 ? 20 : 10;
  addMoney(earns);

  const msgs = hunger >= 50 ? [
    `Lumie is well-fed and crushed it at work! +$${earns}!`,
    `Full tummy = big energy! Lumie earned $${earns}!`,
    `Lumie hustled extra hard — $${earns} earned!`,
    `Happy Lumie is a productive Lumie! +$${earns}.`,
  ] : [
    `Lumie went to work and earned $${earns}!`,
    `Lumie hustled hard — $${earns} earned!`,
    `Lumie completed a job! +$${earns}.`,
    `Lumie brought home $${earns}. Good girl!`,
  ];
  addLog(msgs[Math.floor(Math.random() * msgs.length)]);

  if (hunger > 0) {
    hunger = Math.max(0, hunger - 10);
  }

  setTimeout(() => {
    petDisplay.classList.remove('jump');
    updateHunger();
    working = false;
    workBtn.disabled = false;
  }, 600);
});

setInterval(() => {
  if (hunger > 0) {
    hunger = Math.max(0, hunger - 5);
    updateHunger();
    if (hunger <= 10) addLog('Lumie is very hungry!');
  }
}, 30000);

updateHunger();

// ── Instruction panel ──────────────────────────────────────────
// Reads commands (one per line) and steps through them, one per
// second, highlighting the current line — like a program counter.
const instructionInput = document.getElementById('instruction-input');
const instructionList = document.getElementById('instruction-list');
const runBtn = document.getElementById('run-btn');
const stopBtn = document.getElementById('stop-btn');

const STEP_MS = 1000;
let programTimer = null;
let programLines = [];

// Map a typed line to an action. Reuses the existing buttons so all
// the animation, earnings and logging behaviour stays in one place.
function executeCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (cmd.includes('hardkor')) {
    addMoney(1000);
    addLog('Hardkor command activated! +$1000!');
  } else if (cmd.includes('work')) {
    workBtn.click();
  } else if (cmd.includes('feed')) {
    feedBtn.click();
  } else {
    addLog(`Unknown command: "${raw.trim()}"`);
  }
}

// Re-draw the program tape, marking the active line and dimming the
// lines that have already run. Pass -1 to clear all highlighting.
function renderProgram(activeIndex) {
  instructionList.innerHTML = '';
  programLines.forEach((line, i) => {
    const div = document.createElement('div');
    div.className = 'program-line';
    if (i === activeIndex) div.classList.add('active');
    else if (activeIndex > -1 && i < activeIndex) div.classList.add('done');
    div.textContent = line.trim();
    instructionList.appendChild(div);
  });
}

function stopProgram() {
  if (programTimer) {
    clearInterval(programTimer);
    programTimer = null;
  }
  runBtn.disabled = false;
  instructionInput.disabled = false;
  renderProgram(-1);
}

runBtn.addEventListener('click', () => {
  if (programTimer) return; // already running
  programLines = instructionInput.value.split('\n').filter(l => l.trim() !== '');
  if (programLines.length === 0) {
    addLog('No instructions to run!');
    return;
  }
  runBtn.disabled = true;
  instructionInput.disabled = true;

  let counter = 0;
  renderProgram(counter);
  executeCommand(programLines[counter]);

  programTimer = setInterval(() => {
    counter++;
    if (counter >= programLines.length) {
      stopProgram();
      addLog('Instruction sequence complete! ✓');
      return;
    }
    renderProgram(counter);
    executeCommand(programLines[counter]);
  }, STEP_MS);
});

stopBtn.addEventListener('click', () => {
  if (!programTimer) return;
  stopProgram();
  addLog('Instructions stopped.');
});

// ── Info overlay ───────────────────────────────────────────────
const infoBtn = document.getElementById('info-btn');
const infoOverlay = document.getElementById('info-overlay');
const infoCloseBtn = document.getElementById('info-close-btn');

infoBtn.addEventListener('click', () => infoOverlay.classList.toggle('hidden'));
infoCloseBtn.addEventListener('click', () => infoOverlay.classList.add('hidden'));
