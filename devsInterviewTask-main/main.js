// this is a basic connection schema to the corresponding data for the table provided.
// this API KEY will expire after January 2022
// Written by GSoosalu & ndr3svt
const API_KEY = 'AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
let exerciseData;
let arrData;
let selectindx;
let currentArray;
let rightindx;
let score = 0;
let finalScore = 0;
let selectedID;
let clicked = false;
let nextCounter = 0;

function handleClientLoad() {
    gapi.load('client', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS
    }).then(function () {
        getExerciseData();
    }, function (error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

function getExerciseData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
        range: 'Learning!A1:F10',
    }).then(function (response) {
        response.result.values.shift(); //eliminates first element
        arrData = response.result.values;
        getAnswers();

    }, function (response) {
        console.log('Error: ' + response.result.error.message);
    });
}

console.log("hola")
function getAnswers() {
    let rand = Math.floor(Math.random() * arrData.length);    //selects a random element from the array
    let rValue = arrData[rand];
    currentArray = rValue;
    rightindx = currentArray[4];  //saves index of correct answer
    score = rValue[5]; // save the score of that question
    document.getElementById("question").innerHTML = rValue[2];  //inserts question
    let arrAnswers = rValue[3];
    let finalAnswers = arrAnswers.split(";")  //splits the array of answers
    document.getElementById("option1").innerHTML = finalAnswers[0];
    document.getElementById("option2").innerHTML = finalAnswers[1];

    // option 3 and option 4 are special cases
    let div3 = document.getElementById("div3");
    let lastDiv = document.getElementById("lastDiv");
    let op_four = document.getElementById("option4");

    if (finalAnswers[2] === undefined || finalAnswers[2] === null) {
        div3.style.display = "none";
    } else {
        document.getElementById("option3").innerHTML = finalAnswers[2];
        div3.style.display = "block";
    }

    if (finalAnswers.length > 3) {
        lastDiv.classList.remove("d-none");
        op_four.innerHTML = finalAnswers[3];
    } else {
        lastDiv.classList.add("d-none");
    }
}


function toggleChoice(index, id) {
    selectedID = id;
    selectindx = index;

    if (document.getElementsByClassName("option-selected").length > 0) {
        document.getElementsByClassName("option-selected")[0].className = "option";
    }

    document.getElementById(selectedID).className = "option-selected";
}

function myEvaluation() {
    let right_msg = document.getElementById("evaluationMessageRight");
    let wrong_msg = document.getElementById("evaluationMessageWrong");
    let next_btn = document.getElementById("nextBtn");
    let evaluate_btn = document.getElementById("evaluateBtn");


    if (selectindx == rightindx) {
        right_msg.style.display = next_btn.style.display = "block";
        wrong_msg.style.display = evaluate_btn.style.display = "none";
        document.getElementById(selectedID).className = "option-success";
        finalScore = finalScore + parseInt(score);

    } else {
        wrong_msg.style.display = next_btn.style.display = "block";
        evaluate_btn.style.display = right_msg.style.display = "none";
        document.getElementById(selectedID).className = "option-failure";
        finalScore = finalScore + 0;
    }
}

function goNext() {
    let completionBar = document.getElementById("myBar");
    nextCounter++;
    getAnswers();
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("evaluateBtn").style.display = "block";
    document.getElementById("scoreLabel").innerHTML = "Your score is: " + finalScore;

    if (document.getElementsByClassName("option-failure").length > 0) {
        document.getElementsByClassName("option-failure")[0].className = "option";
        document.getElementById("evaluationMessageWrong").style.display = "none";
    }

    if (document.getElementsByClassName("option-success").length > 0) {
        document.getElementsByClassName("option-success")[0].className = "option";
        document.getElementById("evaluationMessageRight").style.display = "none";
    }

    switch (nextCounter) {
        case 1:
            setBarWidth(66, completionBar);
            completionBar.innerHTML = "Question 2 of 3"
            break;
        case 2:
            setBarWidth(99, completionBar);
            completionBar.innerHTML = "Question 3 of 3"
            break;
        case 3:
            setBarWidth(100, completionBar);
            completionBar.innerHTML = "Completed!";
            fScreen = document.getElementById("finalScreen");
            fScreen.classList.remove("d-none");
            document.getElementById("questionScreen").style.display = "none";
            break;
    }
}

function setBarWidth(width, completionBar) {
    completionBar.style.width = width + "%";
    completionBar.innerHTML = width + "%";
}

