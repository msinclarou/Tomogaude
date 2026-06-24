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
  money += earns;
  moneyDisplay.textContent = '$' + money;

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
