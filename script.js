let currentPet = 'lumie';

const pets = {
  lumie: {
    name: 'LUMIE',
    kind: 'cute carbon based lifeform',
    arrival: 'Lumie has arrived! She looks around curiously.',
    moods: {
      full: '*wags tail happily* :)',
      hungry: '*still looks hungry...*',
      empty: '*stares at you expectantly*',
      working: '*zooooom*',
    },
    faces: {
      sad: `
  /\\_____/\\
 (  o   o  )
  =  ---  =     "..."
  (  ___  )
   \\_____/
  __|| ||__
 (__)   (__)`.trim(),
      happy: `
  /\\_____/\\
 (  ^   ^  )
  =  ___  =     ":D"
  (       )
   \\_____/
  __|| ||__
 (__)   (__)`.trim(),
      work: `
  /\\_____/\\
 (  *   *  )
  = \\___/ =     "!!!"
  (       )
   \\_____/
  __|| ||__
 (__)   (__)`.trim(),
    },
    feedMessages: [
      'Lumie gobbles up the food!',
      'Lumie munches happily.',
      'Nom nom nom...',
      'Lumie says thank you!',
    ],
    fullMessage: 'Lumie is too full to eat!',
    hungryMessage: 'Lumie is very hungry!',
    workMessagesFed: earns => [
      `Lumie is well-fed and crushed it at work! +$${earns}!`,
      `Full tummy = big energy! Lumie earned $${earns}!`,
      `Lumie hustled extra hard — $${earns} earned!`,
      `Happy Lumie is a productive Lumie! +$${earns}.`,
    ],
    workMessagesHungry: earns => [
      `Lumie went to work and earned $${earns}!`,
      `Lumie hustled hard — $${earns} earned!`,
      `Lumie completed a job! +$${earns}.`,
      `Lumie brought home $${earns}. Good girl!`,
    ],
  },
  grouchie: {
    name: 'GROUCHIE',
    kind: 'grumpy robot',
    arrival: 'Grouchie boots up, scans the room, and judges the furniture.',
    moods: {
      full: '*battery reserves acceptable. enthusiasm denied.*',
      hungry: '*fuel deficit detected. obviously.*',
      empty: '*awaiting control panel input. do not poke chassis.*',
      working: '*servos grinding with professional resentment*',
    },
    faces: {
      sad: `
   .--------.
  / [o] [o] \\
 |    ___    |    "hmph"
 |  _|___|_  |
  \\________/
   /|  || |\\
  /_|__||_|_\\`.trim(),
      happy: `
   .--------.
  / [^] [^] \\
 |    ___    |    "adequate"
 |  _|___|_  |
  \\________/
   /|  || |\\
  /_|__||_|_\\`.trim(),
      work: `
   .--------.
  / [>] [<] \\
 |  __===__  |    "PROCESSING"
 |  _|___|_  |
  \\________/
   /|  || |\\
  /_|__||_|_\\`.trim(),
    },
    feedMessages: [
      'Grouchie accepts fuel pellets with a suspicious beep.',
      'Grouchie refuels. It does not say thank you.',
      'Input received: nutrients. Output: grudging compliance.',
      'Grouchie charges quietly and radiates judgment.',
    ],
    fullMessage: 'Grouchie rejects surplus fuel. Inefficient.',
    hungryMessage: 'Grouchie emits a low-battery grumble.',
    workMessagesFed: earns => [
      `Grouchie calculates optimal profits and earns $${earns}. Naturally.`,
      `With sufficient fuel, Grouchie completes the task. +$${earns}.`,
      `Grouchie outperforms expectations and remains unimpressed. +$${earns}.`,
      `Maximum efficiency achieved. Grouchie earned $${earns}.`,
    ],
    workMessagesHungry: earns => [
      `Grouchie works through the fuel warning and earns $${earns}.`,
      `Grouchie completes a job while complaining in binary. +$${earns}.`,
      `Suboptimal fuel, acceptable output: $${earns} earned.`,
      `Grouchie brings home $${earns} and a bad attitude.`,
    ],
  },
};

const petStats = {
  lumie: { hunger: 0, money: 0, working: false },
  grouchie: { hunger: 0, money: 0, working: false },
};

const petDisplay = document.getElementById('pet-display');
const petName = document.getElementById('pet-name');
const petKind = document.getElementById('pet-kind');
const hungerBar = document.getElementById('hunger-bar');
const hungerPct = document.getElementById('hunger-pct');
const petMood = document.getElementById('pet-mood');
const moneyDisplay = document.getElementById('money-display');
const log = document.getElementById('log');
const workBtn = document.getElementById('work-btn');
const feedBtn = document.getElementById('feed-btn');
const petActionButtons = document.getElementById('pet-action-buttons');
const lumieBtn = document.getElementById('lumie-btn');
const grouchieBtn = document.getElementById('grouchie-btn');

function pet() {
  return pets[currentPet];
}

function stats() {
  return petStats[currentPet];
}

function randomFrom(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function renderPet(face) {
  const currentStats = stats();
  petDisplay.textContent = face || (currentStats.hunger >= 50 ? pet().faces.happy : pet().faces.sad);
}

function updateHunger() {
  const currentPetStats = stats();
  hungerBar.style.width = currentPetStats.hunger + '%';
  hungerPct.textContent = currentPetStats.hunger + '%';
  if (currentPetStats.hunger >= 50) {
    hungerBar.classList.add('fed');
    petMood.textContent = pet().moods.full;
  } else {
    hungerBar.classList.remove('fed');
    if (currentPetStats.hunger === 0) {
      petMood.textContent = pet().moods.empty;
    } else {
      petMood.textContent = pet().moods.hungry;
    }
  }
  renderPet();
}

function updatePetControls() {
  const isGrouchie = currentPet === 'grouchie';
  petActionButtons.hidden = isGrouchie;
  lumieBtn.classList.toggle('active', currentPet === 'lumie');
  grouchieBtn.classList.toggle('active', isGrouchie);
  lumieBtn.setAttribute('aria-pressed', currentPet === 'lumie');
  grouchieBtn.setAttribute('aria-pressed', isGrouchie);
}

function switchPet(nextPet) {
  if (currentPet === nextPet) return;
  stopProgram();
  currentPet = nextPet;
  petName.textContent = pet().name;
  petKind.textContent = pet().kind;
  moneyDisplay.textContent = '$' + stats().money;
  updatePetControls();
  updateHunger();
  addLog(pet().arrival);
}

function addLog(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

function feedCurrentPet() {
  const currentPetStats = stats();
  if (currentPetStats.hunger >= 100) {
    addLog(pet().fullMessage);
    return;
  }
  currentPetStats.hunger = Math.min(100, currentPetStats.hunger + 20);
  updateHunger();
  addLog(randomFrom(pet().feedMessages));
}

function workCurrentPet() {
  const currentPetStats = stats();
  if (currentPetStats.working) return;
  currentPetStats.working = true;
  workBtn.disabled = true;

  petDisplay.textContent = pet().faces.work;
  petMood.textContent = pet().moods.working;

  petDisplay.classList.remove('jump');
  void petDisplay.offsetWidth;
  petDisplay.classList.add('jump');

  const earns = currentPetStats.hunger >= 50 ? 20 : 10;
  currentPetStats.money += earns;
  moneyDisplay.textContent = '$' + currentPetStats.money;

  const msgs = currentPetStats.hunger >= 50 ? pet().workMessagesFed(earns) : pet().workMessagesHungry(earns);
  addLog(randomFrom(msgs));

  if (currentPetStats.hunger > 0) {
    currentPetStats.hunger = Math.max(0, currentPetStats.hunger - 10);
  }

  setTimeout(() => {
    petDisplay.classList.remove('jump');
    updateHunger();
    currentPetStats.working = false;
    workBtn.disabled = false;
  }, 600);
}

feedBtn.addEventListener('click', feedCurrentPet);
workBtn.addEventListener('click', workCurrentPet);
lumieBtn.addEventListener('click', () => switchPet('lumie'));
grouchieBtn.addEventListener('click', () => switchPet('grouchie'));

setInterval(() => {
  const currentPetStats = stats();
  if (currentPetStats.hunger > 0) {
    currentPetStats.hunger = Math.max(0, currentPetStats.hunger - 5);
    updateHunger();
    if (currentPetStats.hunger <= 10) addLog(pet().hungryMessage);
  }
}, 30000);

// ── Instruction panel ──────────────────────────────────────────
// Reads commands (one per line) and loops through them once per
// second until STOP is pressed or a command cannot be understood.
const instructionInput = document.getElementById('instruction-input');
const instructionList = document.getElementById('instruction-list');
const runBtn = document.getElementById('run-btn');
const stopBtn = document.getElementById('stop-btn');

const STEP_MS = 1000;
let programTimer = null;
let programLines = [];

// Map a typed line to an action. Grouchie has no direct buttons, so
// the control panel calls the same actions directly for every pet.
function executeCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (cmd.includes('work')) {
    workCurrentPet();
    return true;
  }
  if (cmd.includes('feed') || cmd.includes('fuel') || cmd.includes('charge')) {
    feedCurrentPet();
    return true;
  }

  addLog(`Syntax error: unknown command "${raw.trim()}". Program stopped.`);
  return false;
}

// Re-draw the program tape, marking the active line. Pass -1 to
// clear all highlighting.
function renderProgram(activeIndex) {
  instructionList.innerHTML = '';
  programLines.forEach((line, i) => {
    const div = document.createElement('div');
    div.className = 'program-line';
    if (i === activeIndex) div.classList.add('active');
    div.textContent = line.trim();
    instructionList.appendChild(div);
  });
}

function stopProgram(clearHighlight = true) {
  if (programTimer) {
    clearInterval(programTimer);
    programTimer = null;
  }
  runBtn.disabled = false;
  stopBtn.disabled = true;
  instructionInput.disabled = false;
  if (clearHighlight) renderProgram(-1);
}

runBtn.addEventListener('click', () => {
  if (programTimer) return; // already running
  programLines = instructionInput.value.split('\n').filter(l => l.trim() !== '');
  if (programLines.length === 0) {
    addLog('No instructions to run!');
    return;
  }
  runBtn.disabled = true;
  stopBtn.disabled = false;
  instructionInput.disabled = true;

  let counter = 0;

  function runNextCommand() {
    renderProgram(counter);
    const commandWorked = executeCommand(programLines[counter]);
    if (!commandWorked) {
      stopProgram(false);
      return;
    }
    counter = (counter + 1) % programLines.length;
  }

  addLog('Instruction loop started. Press STOP to end it.');
  programTimer = setInterval(runNextCommand, STEP_MS);
  runNextCommand();
});

stopBtn.disabled = true;

stopBtn.addEventListener('click', () => {
  if (!programTimer) return;
  stopProgram();
  addLog('Instruction loop stopped.');
});

// ── Info overlay ───────────────────────────────────────────────
const infoBtn = document.getElementById('info-btn');
const infoOverlay = document.getElementById('info-overlay');
const infoCloseBtn = document.getElementById('info-close-btn');

infoBtn.addEventListener('click', () => infoOverlay.classList.toggle('hidden'));
infoCloseBtn.addEventListener('click', () => infoOverlay.classList.add('hidden'));

updatePetControls();
updateHunger();
