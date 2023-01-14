import { testData } from "./test-data.js";

console.dir(testData.questions);
console.dir(testData.prepareRandomQuestions());

const questionsForTest = testData.prepareRandomQuestions();

const startInput = document.getElementById("startInput");

const startBtn = document.getElementById("startBtn");
const testBtn = document.getElementById("testBtn");
const resultBtn = document.getElementById("endBtn");

const startBlock = document.getElementsByClassName("start_block");
const testBlock = document.getElementsByClassName("test_block");
const resultBlock = document.getElementsByClassName("result_block");

const testForm = document.getElementsByClassName("test_form");

let student = {};
let resultObj = {};

const resultAnswers = [];

function insertBefore(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

// const arrayShuffle = (arr) => {
//   let currentIndex = arr.length,
//     temporaryValue,
//     randomIndex;

//   while (0 !== currentIndex) {
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     temporaryValue = arr[currentIndex];
//     arr[currentIndex] = arr[randomIndex];
//     arr[randomIndex] = temporaryValue;
//   }

//   return arr;
// };

const createCheckboxElement = (question, answers) => {
  return `
        <h2 class="test_title">${question}</h2>
        <div class="variantes">
            <div class="variant">
                <input id="var1" name="${question}" value="${answers[0]}" type="checkbox" />
                <label for="${question}">${answers[0]}</label>
            </div>
            <div class="variant">
                <input id="var2" name="${question}" value="${answers[1]}" type="checkbox" />
                <label for="${question}">${answers[1]}</label>
            </div>
            <div class="variant">
                <input id="var3" name="${question}" value="${answers[2]}" type="checkbox" />
                <label for="${question}">${answers[2]}</label>
            </div>
            <div class="variant">
                <input id="var4" name="${question}" value="${answers[3]}" type="checkbox" />
                <label for="${question}">${answers[3]}</label>
            </div>
        </div>`;
};

const createSelectElement = (question, answers) => {
  return `
    <h2 class="test_title">${question}</h2>
        <select name="${question}">
            <option value="${answers[0]}">${answers[0]}</option>
            <option value="${answers[1]}">${answers[1]}</option>
            <option value="${answers[2]}">${answers[2]}</option>
            <option value="${answers[3]}">${answers[3]}</option>
        </select>
    </div>`;
};

const createRadioElement = (question, answers) => {
  return `
        <h2 class="test_title">${question}</h2>
        <div class="variantes">
            <div class="variant">
                <input type="radio" id="contact1" name="${question}" value="${answers[0]}" />
                <label for="${question}">${answers[0]}</label>
            </div>
            <div class="variant">
                <input type="radio" id="contact2" name="${question}" value="${answers[1]}" />
                <label for="${question}">${answers[1]}</label>
            </div>
            <div class="variant">
                <input type="radio" id="contact3" name="${question}" value="${answers[2]}" />
                <label for="${question}">${answers[2]}</label>
            </div>
            <div class="variant">
                <input type="radio" id="contact4" name="${question}" value="${answers[3]}" />
                <label for="${question}">${answers[3]}</label>
            </div>
        </div>`;
};

const createInputElement = (question) => {
  return `
        <h2 class="test_title">${question}</h2>
        <input type="text" placeholder="Answer..." name="${question}" required />
    `;
};

const createTestBlock = (arr) => {
  let questionNum = 1;
  return arr.map((el) => {
    let shuffledAnswers = el.answers; //arrayShuffle(el.answers);
    const child = document.createElement("form");
    child.className = "test_item";
    child.id = questionNum;

    switch (el.type) {
      case "checkbox":
        child.innerHTML = createCheckboxElement(el.question, shuffledAnswers);
        break;
      case "select":
        child.innerHTML = createSelectElement(el.question, shuffledAnswers);
        break;
      case "radio":
        child.innerHTML = createRadioElement(el.question, shuffledAnswers);
        break;
      case "input":
        child.innerHTML = createInputElement(el.question, shuffledAnswers);
        break;
    }

    insertBefore(child, testForm[0].firstElementChild);
    questionNum++;
  });
};

startBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let name = startInput.value;
  let arr = name.split(" ");

  student = {
    group: arr[0],
    surname: arr[1] || "",
    name: arr[2] || "",
  };

  createTestBlock(questionsForTest);

  startBlock[0].style.display = "none";
  testBlock[0].style.display = "flex";
});

testBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let results = [];
  let points = 0;

  questionsForTest.map((el, index) => {
    let form = document.getElementById(`${index + 1}`);
    let formData = new FormData(form);

    results.push({
      question: el.question,
      answers: [],
    });

    for (let [question, answer] of formData) {
      results[index].answers.push(answer);
    }
  });

  for (let i = 0; i < results.length; i++) {
    let correctSort = questionsForTest[i].correctAnswers.sort();
    let resSort = results[i].answers.sort();

    if (JSON.stringify(correctSort) === JSON.stringify(resSort)) points += 1;
  }

  resultObj = {
    ...student,
    points,
  };

  var madeBy = document.getElementsByClassName("result_score1");
  var score = document.getElementsByClassName("result_score2");
  madeBy[0].innerHTML = `Виконав: ${resultObj.group} ${resultObj.surname} ${resultObj.name}`;
  score[0].innerHTML = `Оцінка: ${resultObj.points}/10`;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/");
  xhr.setRequestHeader("score", resultObj.points);
  xhr.setRequestHeader(
    "author",
    `${resultObj.group} ${resultObj.surname} ${resultObj.name}`
  );
  xhr.send();

  testBlock[0].style.display = "none";
  resultBlock[0].style.display = "flex";
});

resultBtn.addEventListener("click", () => {
  location.reload();
});
