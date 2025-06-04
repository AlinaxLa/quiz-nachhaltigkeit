
// Nachhaltigkeits-Quizspiel Logik
let spieler = [];
let aktuellerSpielerIndex = 0;
let fragenPool = [];
let timerId = null;
let countdown = 15;
let countdownInterval = null;
let frageDaten = null;

// Fragen laden aus JSON
fetch('sustainability_questions.json')
  .then(response => response.json())
  .then(data => frageDaten = data)
  .catch(error => console.error("Fragen konnten nicht geladen werden:", error));

function spielStarten() {
  const namenInput = document.getElementById("spielernamen").value;
  spieler = namenInput.split(",").map(name => name.trim()).filter(n => n);
  aktuellerSpielerIndex = 0;

  const schwierigkeit = document.getElementById("schwierigkeit").value;

  // Fragen aus allen Kategorien dieser Schwierigkeit sammeln
  fragenPool = [];
  if (frageDaten) {
    for (let kategorie in frageDaten) {
      if (frageDaten[kategorie][schwierigkeit]) {
        fragenPool = fragenPool.concat(frageDaten[kategorie][schwierigkeit].map(f => ({ text: f, kategorie })));
      }
    }
  }

  if (fragenPool.length === 0) {
    alert("Keine Fragen gefunden!");
    return;
  }

  shuffleArray(fragenPool);
  document.getElementById("setup").style.display = "none";
  document.getElementById("spielbereich").style.display = "block";
  zeigeNeueAufgabe();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function zeigeNeueAufgabe() {
  if (fragenPool.length === 0) {
    spielStarten(); // Neu mischen, Endlosmodus
    return;
  }

  const frageObj = fragenPool.pop();
  const spielerName = spieler[aktuellerSpielerIndex];
  document.getElementById("spielername").textContent = `🎲 ${spielerName}, your turn! (${frageObj.kategorie})`;

  const card = document.getElementById("card");
  card.classList.remove("animate-border");
  void card.offsetWidth;
  card.textContent = frageObj.text;
  card.classList.add("animate-border");

  aktuellerSpielerIndex = (aktuellerSpielerIndex + 1) % spieler.length;

  clearTimeout(timerId);
  clearInterval(countdownInterval);
  startCountdown();
}

function startCountdown() {
  countdown = 15;
  updateCountdownAnzeige();

  countdownInterval = setInterval(() => {
    countdown--;
    updateCountdownAnzeige();
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      explodiere();
    }
  }, 1000);
}

function updateCountdownAnzeige() {
  document.getElementById("timer").textContent = `⏳ ${countdown}`;
}

function explodiere() {
  document.getElementById("timer").style.display = "none";
  const explosion = document.getElementById("explosion");
  explosion.style.display = "block";
  setTimeout(() => {
    explosion.style.display = "none";
    document.getElementById("timer").style.display = "block";
    zeigeNeueAufgabe();
  }, 1500);
}

function zurueckZumStart() {
  clearTimeout(timerId);
  clearInterval(countdownInterval);
  document.getElementById("spielbereich").style.display = "none";
  document.getElementById("setup").style.display = "block";
}

function spielerHinzufuegen() {
  const neuerName = prompt("Add new player:");
  if (neuerName) {
    spieler.push(neuerName.trim());
    alert(`${neuerName} was added!`);
  }
}
