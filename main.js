import { testData } from "./test-data.js";
import * as markupService from "./markup-service.js";

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

const createTestBlock = (arr) => {
  let questionNum = 1;
  return arr.map((el) => {
    const child = document.createElement("form");
    child.className = "test_item";
    child.id = questionNum;

    switch (el.type) {
      case "checkbox":
        child.innerHTML = markupService.makeCheckboxElement(
          el.question,
          el.answers
        );
        break;
      case "select":
        child.innerHTML = markupService.makeSelectElement(
          el.question,
          el.answers
        );
        break;
      case "radio":
        child.innerHTML = markupService.makeRadioElement(
          el.question,
          el.answers
        );
        break;
      case "input":
        child.innerHTML = markupService.makeInputElement(
          el.question,
          el.answers
        );
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

let results = [];
let points = 0;

testBtn.addEventListener("click", (e) => {
  e.preventDefault();

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

    console.log(JSON.stringify(correctSort), JSON.stringify(resSort));

    if (JSON.stringify(correctSort) === JSON.stringify(resSort)) points += 1;
  }

  resultObj = {
    ...student,
    points,
  };

  var madeBy = document.getElementsByClassName("result_score1");
  var score = document.getElementsByClassName("result_score2");
  madeBy[0].innerHTML = `Виконав: ${resultObj.group} ${resultObj.surname} ${resultObj.name}`;
  score[0].innerHTML = `Оцінка: ${resultObj.points}/${questionsForTest.length}`;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/");

  xhr.setRequestHeader("score", resultObj.points);

  xhr.setRequestHeader(
    "author",
    `${encodeURIComponent(resultObj.group)} ${encodeURIComponent(
      resultObj.surname
    )} ${encodeURIComponent(resultObj.name)}`
  );

  console.dir(xhr);

  xhr.send();

  testBlock[0].style.display = "none";
  resultBlock[0].style.display = "flex";
});

resultBtn.addEventListener("click", () => {
  location.reload();
});
