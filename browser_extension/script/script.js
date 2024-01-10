// Connect to background.js
chrome.runtime.connect({name:"popup"});

// Connect commands from background.js with the listener
chrome.runtime.onMessage.addListener((message)=>{
    if (message.command == 'previous_month'){
        changeMonthAndYear("previous");
    } else if (message.command == 'next_month'){
        changeMonthAndYear("next");
    } else if (message.command == 'today'){
        show_today();
    } else if (message.command == 'previous_day'){
        show_previous_day();
    } else if (message.command == 'next_day'){
        show_next_day();
    }
})

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
    for (let i=0; i < 6; i++){
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

function show_today(){
        changeMonthAndYear(null, true);
        removeHighlightedDay();
        let currentDateTdElement = document.getElementById(`${currentNepaliDate.getYear()}-${currentNepaliDate.getMonth()+1}-${currentNepaliDate.getDate()}`)
        currentSelectedTdElement = currentDateTdElement;
        currentSelectedTdElementID = currentDateTdElement.id;
        // The argument first time is passed as true as
        // we also want to display the current days info
        // just like we would when someone opens the extension
        highlightCurrentDay(true);
}

function change_calendar_to_required_month_and_year(year , monthIndex){

    let monthElement = document.querySelector("#current_month");
    let yearElement = document.querySelector("#current_year");
    yearElement.innerText = year
    monthElement.innerText = indexToMonth[monthIndex];
    showCalendar(monthIndex, year);

}

function show_next_day(){

    // use the currentSelectedTdElementID to get currently selected date values
    let selected_date_array = currentSelectedTdElementID.split('-');
    let year = selected_date_array[0];
    let monthIndex = selected_date_array[1] - 1;
    let day = selected_date_array[2];

    change_calendar_to_required_month_and_year(year, monthIndex)

    let nextDayValue = Number(day) + 1;
    let nextYearValue = Number(year);
    let nextMonthValue = Number(monthIndex);
    // Check if the next day value is valid
    // If nextDayValue day falls in the same month, then no problem
    // else, it will be the first day of the next month
    if (nextDayValue > ALL_YEARS_DATA[year]['months'][indexToMonth[monthIndex]]["days"].length){
        // not possible to be in the same month
        // increase monthvalue and set day to 1
        nextDayValue = 1;
        nextMonthValue++;
        if (nextMonthValue > 11){
            // the next day is the new year day
            nextMonthValue = 0;
            nextYearValue++;
        }
    }
    
    // simulate as if someone clicked that day
    let elementID = `${nextYearValue}-${nextMonthValue+1}-${nextDayValue}`

    if (nextDayValue != 1){
    displayDayInformation(document.getElementById(elementID));
    } else {
    // But we need to change calendar month if needed
    changeMonthAndYear('next');
    displayDayInformation(document.getElementById(elementID));
    }
}

function show_previous_day(){

    let selected_date_array = currentSelectedTdElementID.split('-');
    let year = selected_date_array[0];
    let monthIndex = selected_date_array[1] - 1;
    let day = selected_date_array[2];

    change_calendar_to_required_month_and_year(year, monthIndex)

    let previousDayValue = Number(day) - 1;
    let previousYearValue = Number(year);
    let previousMonthValue = Number(monthIndex);

    // Check if the previous day value is valid
    // invalid if day value is 0
    if (previousDayValue < 1){
        // not possible to be in the same month
        // decrease monthvalue and set day to last day of previous month
        previousMonthValue--;
        if (previousMonthValue < 0){
            // the next day is the new year day
            previousMonthValue = 11;
            previousYearValue--;
        }
        previousDayValue = ALL_YEARS_DATA[previousYearValue]['months'][indexToMonth[previousMonthValue]]["days"].length;
    }
    
    // simulate as if someone clicked that day
    let elementID = `${previousYearValue}-${previousMonthValue+1}-${previousDayValue}`

    if (monthIndex == previousMonthValue && year == previousYearValue){
    displayDayInformation(document.getElementById(elementID));
    } else {
    // But we need to change calendar month if needed
    changeMonthAndYear('previous');
    displayDayInformation(document.getElementById(elementID));
    }

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
            show_today();
        })

    createTrValues();
    showCalendar(monthValue, yearValue, true);
}
