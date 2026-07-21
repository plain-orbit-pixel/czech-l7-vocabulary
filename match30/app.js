const WORDS = [
  {czech:"voda",english:"water",category:"Drinks",image:"assets/beverage_voda.png"},
  {czech:"káva",english:"coffee",category:"Drinks",image:"assets/beverage_kava.png"},
  {czech:"čaj",english:"tea",category:"Drinks",image:"assets/beverage_caj.png"},
  {czech:"mléko",english:"milk",category:"Dairy",image:"assets/dairy_mleko.png"},
  {czech:"chléb",english:"bread",category:"Bread",image:"assets/bread_chleb.png"},
  {czech:"rohlík",english:"bread roll",category:"Bread",image:"assets/bread_rohlik.png"},
  {czech:"sýr",english:"cheese",category:"Dairy",image:"assets/dairy_syr.png"},
  {czech:"máslo",english:"butter",category:"Dairy",image:"assets/dairy_maslo.png"},
  {czech:"vejce",english:"eggs",category:"Animal products",image:"assets/meat_vejce.png"},
  {czech:"kuřecí maso",english:"chicken",category:"Meat",image:"assets/meat_kureci_maso.png"},
  {czech:"jablko",english:"apple",category:"Fruit",image:"assets/fruit_jablko.png"},
  {czech:"banán",english:"banana",category:"Fruit",image:"assets/fruit_banan.png"},
  {czech:"pomeranč",english:"orange",category:"Fruit",image:"assets/fruit_pomeranc.png"},
  {czech:"brambory",english:"potatoes",category:"Vegetables",image:"assets/vegetable_brambory.png"},
  {czech:"rajčata",english:"tomatoes",category:"Vegetables",image:"assets/vegetable_rajcata.png"},
  {czech:"cibule",english:"onion",category:"Vegetables",image:"assets/vegetable_cibule.png"},
  {czech:"mrkev",english:"carrot",category:"Vegetables",image:"assets/vegetable_mrkev.png"},
  {czech:"pivo",english:"beer",category:"Drinks",image:"assets/beverage_pivo.png"},
  {czech:"víno",english:"wine",category:"Drinks",image:"assets/beverage_vino.png"},
  {czech:"čokoláda",english:"chocolate",category:"Sweets",image:"assets/sweet_cokolada.png"},
  {czech:"jogurt",english:"yogurt",category:"Dairy",image:"assets/dairy_jogurt.png"},
  {czech:"paprika",english:"bell pepper",category:"Vegetables",image:"assets/vegetable_paprika.png"},
  {czech:"okurka",english:"cucumber",category:"Vegetables",image:"assets/vegetable_okurka.png"},
  {czech:"salát",english:"lettuce",category:"Vegetables",image:"assets/vegetable_salat.png"},
  {czech:"jahody",english:"strawberries",category:"Fruit",image:"assets/fruit_jahody.png"},
  {czech:"hruška",english:"pear",category:"Fruit",image:"assets/fruit_hruska.png"},
  {czech:"citron",english:"lemon",category:"Fruit",image:"assets/fruit_citron.png"},
  {czech:"šunka",english:"ham",category:"Meat",image:"assets/meat_sunka.png"},
  {czech:"klobása",english:"sausage",category:"Meat",image:"assets/meat_klobasa.png"},
  {czech:"džus",english:"juice",category:"Drinks",image:"assets/beverage_dzus.png"}
];

const $ = id => document.getElementById(id);
const screens = ["homeScreen", "quizScreen", "spellingScreen", "resultScreen", "studyScreen"];
let session = [];
let index = 0;
let score = 0;
let mistakes = [];
let answered = false;
let currentMode = "matching";

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showScreen(id) {
  screens.forEach(name => $(name).hidden = name !== id);
  $("homeButton").hidden = id === "homeScreen";
  window.scrollTo({top: 0, behavior: "smooth"});
}

function loadStats() {
  const best = Number(localStorage.getItem("l7-match-best") || 0);
  const mastered = JSON.parse(localStorage.getItem("l7-match-mastered") || "[]");
  $("bestScore").textContent = best ? `${best}%` : "—";
  $("masteredCount").textContent = `${mastered.length}/30`;
}

function startSession(cards) {
  currentMode = "matching";
  session = shuffle(cards);
  index = 0;
  score = 0;
  mistakes = [];
  showScreen("quizScreen");
  renderQuestion();
}

function startSpellingSession(cards) {
  currentMode = "spelling";
  session = shuffle(cards);
  index = 0;
  score = 0;
  mistakes = [];
  showScreen("spellingScreen");
  renderSpellingQuestion();
}

function selectedLength() {
  return Number(document.querySelector('input[name="length"]:checked').value);
}

function makeChoices(correct) {
  const sameCategory = shuffle(WORDS.filter(w => w.category === correct.category && w.czech !== correct.czech));
  const other = shuffle(WORDS.filter(w => w.category !== correct.category && w.czech !== correct.czech));
  return shuffle([correct, ...sameCategory.slice(0, 2), ...other].slice(0, 4));
}

function renderQuestion() {
  answered = false;
  const card = session[index];
  $("progressText").textContent = `${index + 1} / ${session.length}`;
  $("scoreText").textContent = `Score: ${score}`;
  $("progressBar").style.width = `${(index / session.length) * 100}%`;
  $("categoryBadge").textContent = card.category;
  $("quizImage").src = card.image;
  $("quizImage").alt = `Picture question ${index + 1}`;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("nextButton").hidden = true;
  $("nextButton").textContent = index === session.length - 1 ? "See results" : "Next picture";
  $("answers").replaceChildren(...makeChoices(card).map(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.textContent = choice.czech;
    button.dataset.word = choice.czech;
    button.addEventListener("click", () => checkAnswer(button, card));
    return button;
  }));
}

function checkAnswer(button, correct) {
  if (answered) return;
  answered = true;
  const isCorrect = button.dataset.word === correct.czech;
  document.querySelectorAll(".answer").forEach(option => {
    option.disabled = true;
    if (option.dataset.word === correct.czech) option.classList.add("correct");
  });
  if (isCorrect) {
    score++;
    $("feedback").textContent = `Správně! ${correct.czech} = ${correct.english}`;
    $("feedback").classList.add("good");
  } else {
    button.classList.add("wrong");
    mistakes.push(correct);
    $("feedback").textContent = `Correct: ${correct.czech} = ${correct.english}`;
    $("feedback").classList.add("bad");
  }
  $("scoreText").textContent = `Score: ${score}`;
  $("progressBar").style.width = `${((index + 1) / session.length) * 100}%`;
  $("nextButton").hidden = false;
}

function nextQuestion() {
  if (!answered) return;
  index++;
  if (index < session.length) renderQuestion();
  else showResults();
}

function renderSpellingQuestion() {
  answered = false;
  const card = session[index];
  $("spellingProgressText").textContent = `${index + 1} / ${session.length}`;
  $("spellingScoreText").textContent = `Score: ${score}`;
  $("spellingProgressBar").style.width = `${(index / session.length) * 100}%`;
  $("spellingCategoryBadge").textContent = card.category;
  $("spellingImage").src = card.image;
  $("spellingImage").alt = `Spelling picture ${index + 1}`;
  $("spellingInput").value = "";
  $("spellingInput").disabled = false;
  $("spellingInput").className = "";
  $("spellingForm").querySelector('button[type="submit"]').disabled = false;
  $("hintButton").hidden = false;
  $("hintButton").textContent = "Show hint";
  $("spellingFeedback").textContent = "";
  $("spellingFeedback").className = "feedback";
  $("spellingNextButton").hidden = true;
  $("spellingNextButton").textContent = index === session.length - 1 ? "See results" : "Next picture";
  setTimeout(() => $("spellingInput").focus(), 50);
}

function normalizeSpelling(value) {
  return value.trim().toLocaleLowerCase("cs-CZ").replace(/\s+/g, " ");
}

function checkSpelling(event) {
  event.preventDefault();
  if (answered) return;
  const card = session[index];
  const typed = normalizeSpelling($("spellingInput").value);
  if (!typed) return;
  answered = true;
  const isCorrect = typed === normalizeSpelling(card.czech);
  $("spellingInput").disabled = true;
  $("spellingForm").querySelector('button[type="submit"]').disabled = true;
  $("hintButton").hidden = true;
  if (isCorrect) {
    score++;
    $("spellingInput").classList.add("correct-input");
    $("spellingFeedback").textContent = `Správně! ${card.czech} = ${card.english}`;
    $("spellingFeedback").classList.add("good");
  } else {
    mistakes.push(card);
    $("spellingInput").classList.add("wrong-input");
    $("spellingFeedback").textContent = `Exact spelling: ${card.czech} (${card.english})`;
    $("spellingFeedback").classList.add("bad");
  }
  $("spellingScoreText").textContent = `Score: ${score}`;
  $("spellingProgressBar").style.width = `${((index + 1) / session.length) * 100}%`;
  $("spellingNextButton").hidden = false;
}

function nextSpellingQuestion() {
  if (!answered) return;
  index++;
  if (index < session.length) renderSpellingQuestion();
  else showResults();
}

function showResults() {
  const percent = Math.round((score / session.length) * 100);
  const uniqueMistakes = [...new Map(mistakes.map(w => [w.czech, w])).values()];
  const mastered = new Set(JSON.parse(localStorage.getItem("l7-match-mastered") || "[]"));
  session.filter(w => !uniqueMistakes.some(m => m.czech === w.czech)).forEach(w => mastered.add(w.czech));
  localStorage.setItem("l7-match-mastered", JSON.stringify([...mastered]));
  const best = Math.max(percent, Number(localStorage.getItem("l7-match-best") || 0));
  localStorage.setItem("l7-match-best", String(best));

  $("resultScore").textContent = `${score}/${session.length}`;
  $("resultEmoji").textContent = percent === 100 ? "🏆" : percent >= 80 ? "🎯" : "📚";
  $("resultTitle").textContent = percent === 100 ? "Perfect session!" : percent >= 80 ? "Almost exam-ready" : "Keep practising";
  $("resultMessage").textContent = percent === 100 ? "You matched every picture correctly." : `You scored ${percent}%. Review the missed pictures, then retry them.`;
  $("mistakePanel").hidden = uniqueMistakes.length === 0;
  $("mistakeList").replaceChildren(...uniqueMistakes.map(word => {
    const row = document.createElement("div");
    row.className = "mistake-item";
    row.innerHTML = `<img src="${word.image}" alt=""><div><strong>${word.czech}</strong><span>${word.english}</span></div>`;
    return row;
  }));
  $("retryButton").onclick = () => currentMode === "spelling" ? startSpellingSession(uniqueMistakes) : startSession(uniqueMistakes);
  showScreen("resultScreen");
  loadStats();
}

function speak(word) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "cs-CZ";
  utterance.rate = .82;
  speechSynthesis.speak(utterance);
}

function renderStudyGrid() {
  $("studyGrid").replaceChildren(...WORDS.map(word => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "study-card";
    button.innerHTML = `<img src="${word.image}" alt="${word.english}"><span><strong>${word.czech}</strong><small>${word.english}</small></span>`;
    button.addEventListener("click", () => speak(word.czech));
    return button;
  }));
}

$("startButton").addEventListener("click", () => startSession(shuffle(WORDS).slice(0, selectedLength())));
$("spellingStartButton").addEventListener("click", () => startSpellingSession(shuffle(WORDS).slice(0, selectedLength())));
$("studyButton").addEventListener("click", () => showScreen("studyScreen"));
$("nextButton").addEventListener("click", nextQuestion);
$("spellingForm").addEventListener("submit", checkSpelling);
$("spellingNextButton").addEventListener("click", nextSpellingQuestion);
$("hintButton").addEventListener("click", () => {
  const card = session[index];
  const characters = [...card.czech.replace(/\s/g, "")].length;
  $("hintButton").textContent = `${card.english} · starts with “${card.czech[0]}” · ${characters} letters`;
});
$("newSessionButton").addEventListener("click", () => showScreen("homeScreen"));
$("homeButton").addEventListener("click", () => showScreen("homeScreen"));

"áčďéěíňóřšťúůýž".split("").forEach(letter => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "accent-key";
  button.textContent = letter;
  button.addEventListener("click", () => {
    const input = $("spellingInput");
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    input.value = input.value.slice(0, start) + letter + input.value.slice(end);
    input.focus();
    input.setSelectionRange(start + 1, start + 1);
  });
  $("accentKeys").appendChild(button);
});

renderStudyGrid();
loadStats();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}
