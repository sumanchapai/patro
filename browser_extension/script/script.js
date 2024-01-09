// Connect to background.js
chrome.runtime.connect({name:"popup"});

var monthsInEng = ["baishakh", "jestha", "asar", "shrawan",
        "bhadau", "aswin", "kartik", "mansir", 
        "poush", "magh", "falgun", "chaitra"];

var weekNamesArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var currentDateTdElement = null;
var currentSelectedTdElement = null;
var currentSelectedTdElementID = null;

var indexToMonth = {
    0:'Baishakh',
    1:"Jestha",
    2:"Asar", 
    3:"Shrawan",
    4:"Bhadau",
    5:"Aswin",
    6:"Kartik",
    7:"Mansir",
    8:"Poush",
    9:"Magh",
    10:"Falgun",
    11:"Chaitra"
}

var monthToIndex= {
    'Baishakh':0,
    "Jestha":  1,
    "Asar":    2,
    "Shrawan": 3,
    "Bhadau":  4,
    "Aswin":   5,
    "Kartik":  6,
    "Mansir":  7,
    "Poush":   8,
    "Magh":    9,
    "Falgun": 10,
    "Chaitra":11
}

var API_URL = "https://sumanchapai.github.io/patro/";

var ALL_YEARS_DATA={};
var yearData = null;
var currentNepaliDate = new NepaliDate(true);


function capitalizeString(string_){
    return string_[0].toUpperCase() + string_.slice(1);
}

function resetTdValues(){
    let tbody = document.querySelector("tbody");
    for (let td of tbody.querySelectorAll("td")){
        td.innerText = "";
        td.removeAttribute("id");
    }
}

function populateTrValues(monthValue){
    resetTdValues();
    let tbodyElement = document.querySelector("tbody");
    let allTdElements = tbodyElement.querySelectorAll("td");
    var currentDayIndex = 0
    
    let startingWeekIndex = 0;
    let allDays = yearData["months"][indexToMonth[monthValue]]["days"];

    let allThElements = document.querySelectorAll("th");
    for (let thElement of allThElements){
        if (allThElements[startingWeekIndex].id.toLowerCase() == allDays[currentDayIndex]["eng_weekday"].toLowerCase()){
            break;
    }
        else{
            startingWeekIndex++;}
    }

    allTdElements = [...allTdElements];
    allTdElements = allTdElements.slice(startingWeekIndex);

    for (let tdElement of allTdElements){
        tdElement.innerText = allDays[currentDayIndex]["nep"]
        
        tdElement.setAttribute("id",allDays[currentDayIndex]["nep_date"]);
        currentDayIndex++;
        if (allDays.length == currentDayIndex){break;}
    }
}

async function showCalendar(monthValue, yearValue, firstTime = false){

    if (!(ALL_YEARS_DATA.hasOwnProperty(yearValue))) {
        let response = await fetch(API_URL+`${yearValue}.json`)
        response = await response.json();

        yearData = response;
        ALL_YEARS_DATA[yearValue] = response

        showCalendar(monthValue, yearValue, firstTime)

    } else {

        var response = ALL_YEARS_DATA[yearValue]
        yearData = response;
        populateTrValues(monthValue);
        highlightCurrentDay(firstTime);
        highlightSelectedDay();
        highlightCurrentDay(false);
}
}
function removeHighlightedDay(){
        currentSelectedTdElement.removeAttribute("style");
        currentSelectedTdElement = null;
        currentSelectedTdElementID = null;

}
function highlightSelectedDay(){
    if (currentSelectedTdElement){
        if (currentSelectedTdElementID != `${currentNepaliDate.getYear()}-${currentNepaliDate.getMonth()+1}-${currentNepaliDate.getDate()}`){
            currentSelectedTdElement.removeAttribute("style");
        }
    }

    let neededElement = document.getElementById(currentSelectedTdElementID);
    if (neededElement && neededElement != currentDateTdElement){
        neededElement.setAttribute("style", "border-radius: 50%;background-color:orange;line-height: 100%;text-align: center;");
    }
}
function highlightCurrentDay(firstTime){
    try {
        currentDateTdElement = document.getElementById(`${currentNepaliDate.getYear()}-${currentNepaliDate.getMonth()+1}-${currentNepaliDate.getDate()}`)
        if (currentDateTdElement != null)
        currentDateTdElement.setAttribute("style", "border-radius: 50%;background-color:blue;line-height: 100%;text-align: center;");
        if (firstTime){
            currentSelectedTdElement = currentDateTdElement;
            currentSelectedTdElementID = currentDateTdElement.id;
            displayDayInformation(currentDateTdElement);
        }
    } catch (error) {
        console.log(error) ;
    }
}
function changeMonthAndYear(type, button_selected = false){
    

    let monthElement = document.querySelector("#current_month");
    let monthValue = monthElement.innerText;

    let yearElement = document.querySelector("#current_year");
    let yearValue = parseInt(yearElement.innerText);

    if (type == 'previous' && monthValue.toLowerCase() == 'baishakh' && yearValue == 2000){return;}
    if (type == 'next' && (monthValue.toLowerCase() == 'chaitra' && yearValue == 2089)){return;}

    if (type == 'previous'){
        if (monthValue.toLowerCase() == "baishakh"){
            yearValue -= 1;
            monthValue = 'chaitra';
        } else {
        let index = monthsInEng.indexOf(monthValue.toLowerCase());
        monthValue = monthsInEng[index-1];
        }
    } else 
        if (monthValue.toLowerCase() == "chaitra"){
            yearValue += 1;
            monthValue = 'baishakh';
        } else {
        let index = monthsInEng.indexOf(monthValue.toLowerCase());
        monthValue = monthsInEng[index+1];
        }
    
    if (button_selected){
        monthValue = indexToMonth[currentNepaliDate.getMonth()];
        monthElement.innerText = monthValue;
        yearValue = currentNepaliDate.getYear();
        yearElement.innerText = yearValue;
    }
    else{
        monthElement.innerText = monthValue;
        yearElement.innerText = yearValue;
    }

    if (currentDateTdElement != null)
    currentDateTdElement.setAttribute("style", "");
    showCalendar(monthToIndex[capitalizeString(monthValue)], yearValue);
}

function populateWeekdays(element, arrayList){

    element.setAttribute("style", "font-size:10px;")
    let trElement = document.createElement("tr");
    for (let item of arrayList){
        let thElement = document.createElement("th");
        thElement.setAttribute("id", item);
        thElement.innerText = item.slice(0,3);
        trElement.appendChild(thElement);
    }
    element.append(trElement);
}

function createTrValues(){
    let tbody = document.querySelector("tbody");
    for (let i=0; i < 5; i++){
        let trElement = document.createElement("tr");
        for (let i=0; i < 7; i++){
            let tdElement = document.createElement("td");
            tdElement.addEventListener("click",
             ()=>{ displayDayInformation(tdElement)})
            trElement.appendChild(tdElement);
        }
        tbody.append(trElement);
    }
}

function displayDayInformation(TdElement){
    let date = TdElement.id.split('-');
    let year = date[0];
    let month = date[1];
    let day = date[2];
    let allData = yearData["months"][capitalizeString(indexToMonth[month-1])]["days"][day-1];

    allDisplaySpans = document.querySelectorAll(".display");
    
    for (let spanElement of allDisplaySpans){
        spanElement.innerText = allData[spanElement.id]
    }
    document.querySelector("#month_display").innerText = document.querySelector("#current_month").innerText;
    document.querySelector("#year_display").innerText = document.querySelector("#current_year").innerText;
        // need to do for year display and month display
    if (currentSelectedTdElementID != `${currentNepaliDate.getYear()}-${currentNepaliDate.getMonth()+1}-${currentNepaliDate.getDate()}`){
        currentSelectedTdElement.setAttribute("style", "");}

    currentSelectedTdElement = TdElement;
    currentSelectedTdElementID = TdElement.getAttribute('id');

    if (currentSelectedTdElementID == `${currentNepaliDate.getYear()}-${currentNepaliDate.getMonth()+1}-${currentNepaliDate.getDate()}`){
            currentSelectedTdElement.setAttribute("style", "border-radius: 50%;background-color:blue;line-height: 100%;text-align: center;");
    } else {
        currentSelectedTdElement.setAttribute("style", "border-radius: 50%;background-color:orange;line-height: 100%;text-align: center;");
}
    highlightCurrentDay(false);
}

window.onload = function (){

    populateWeekdays(document.querySelector("thead"),weekNamesArray);
    let prevElement = document.querySelector(".prev");
    let nextElement = document.querySelector(".next");
    prevElement.addEventListener("click", ()=>{changeMonthAndYear("previous");});
    nextElement.addEventListener("click", ()=>{changeMonthAndYear("next");});

    let monthValue = currentNepaliDate.getMonth();
    let yearValue = currentNepaliDate.getYear();

    document.querySelector("#current_month").innerText = indexToMonth[monthValue];
    document.querySelector("#current_year").innerText = yearValue;

    document.querySelector("#today_button").addEventListener("click", ()=>{
        changeMonthAndYear(null, true);
        removeHighlightedDay();
        let currentDateTdElement = document.getElementById(`${currentNepaliDate.getYear()}-${currentNepaliDate.getMonth()+1}-${currentNepaliDate.getDate()}`)
        currentSelectedTdElement = currentDateTdElement;
        currentSelectedTdElementID = currentDateTdElement.id;
        // The argument first time is passed as true as
        // we also want to display the current days info
        // just like we would when someone opens the extension
        highlightCurrentDay(true);
        })

    createTrValues();
    showCalendar(monthValue, yearValue, true);
}
