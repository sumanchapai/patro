var months_in_eng = ["baishakh", "jestha", "asar", "shrawan",
        "bhadau", "aswin", "kartik", "mansir", 
        "poush", "magh", "falgun", "chaitra"];

var weekNamesArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var current_date_td_element = null;

var index_to_month = {
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

var month_to_index= {
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
var currentNepaliDate = new NepaliDate();


function capitalizeString(string_){
    return string_[0].toUpperCase() + string_.slice(1);
}

function reset_td_values(){
    let tbody = document.querySelector("tbody");
    for (let td of tbody.querySelectorAll("td")){
        td.innerText = "";
    }
}

function populateTrValues(monthValue){
    reset_td_values();
    let tbody_element = document.querySelector("tbody");
    let all_td_elements = tbody_element.querySelectorAll("td");
    var current_day_index = 0
    
    console.log(monthValue);
    let starting_week_index = 0;
    let all_days = yearData["months"][index_to_month[monthValue]]["days"];

    let all_th_elements = document.querySelectorAll("th");
    for (let th_element of all_th_elements){
        if (all_th_elements[starting_week_index].id.toLowerCase() == all_days[current_day_index]["eng_weekday"].toLowerCase()){
            break;
    }
        else{
            starting_week_index++;}
    }

    all_td_elements = [...all_td_elements];
    all_td_elements = all_td_elements.slice(starting_week_index);

    for (let td_element of all_td_elements){
        td_element.innerText = all_days[current_day_index]["nep"]
        
//        let date_list = all_days[current_day_index]["nep_date"].split('-');
 //       let nepali_date_in_english = date_list[date_list.length -1];
        td_element.setAttribute("id",all_days[current_day_index]["nep_date"]);
        current_day_index++;
        if (all_days.length == current_day_index){break;}
    }
}

async function showCalendar(monthValue, yearValue, first_time = false){

    if (!(ALL_YEARS_DATA.hasOwnProperty(yearValue))) {
        let response = await fetch(API_URL+`${yearValue}.json`)
        response = await response.json();

        yearData = response;
        ALL_YEARS_DATA[yearValue] = response

        showCalendar(monthValue, yearValue, first_time)

    } else {

        var response = ALL_YEARS_DATA[yearValue]
        yearData = response;
        populateTrValues(monthValue);
        highlightCurrentDay(first_time);
}
}

function highlightCurrentDay(first_time){
    try {
        current_date_td_element = document.getElementById(`${currentNepaliDate.getYear()}-${currentNepaliDate.getMonth()+1}-${currentNepaliDate.getDate()}`)
        if (current_date_td_element != null)
        current_date_td_element.setAttribute("style", "border-radius: 50%;background-color:blue;line-height: 100%;text-align: center;");
        if (first_time){
            displayDayInformation(current_date_td_element);
        }
    } catch (error) {
        console.log(error) ;
    }
}
function changeMonthAndYear(type){

    let month_element = document.querySelector("#current_month");
    let month_value = month_element.innerText;

    let year_element = document.querySelector("#current_year");
    let year_value = parseInt(year_element.innerText);

    if (type == 'previous'){
        if (month_value.toLowerCase() == "baishakh"){
            year_value -= 1;
            month_value = 'chaitra';
        } else {
        let index = months_in_eng.indexOf(month_value.toLowerCase());
        month_value = months_in_eng[index-1];
        }
    } else 
        if (month_value.toLowerCase() == "chaitra"){
            year_value += 1;
            month_value = 'baishakh';
        } else {
        let index = months_in_eng.indexOf(month_value.toLowerCase());
        month_value = months_in_eng[index+1];
        }
    
    month_element.innerText = month_value;
    year_element.innerText = year_value;

    if (current_date_td_element != null)
    current_date_td_element.setAttribute("style", "");
    showCalendar(month_to_index[capitalizeString(month_value)], year_value);
}

function populateWeekdays(element, array_list){

    element.setAttribute("style", "font-size:10px;")
    let tr_element = document.createElement("tr");
    for (let item of array_list){
        let th_element = document.createElement("th");
        th_element.setAttribute("id", item);
        th_element.innerText = item.slice(0,3);
        tr_element.appendChild(th_element);
    }
    element.append(tr_element);
}

function create_tr_values(){
    let tbody = document.querySelector("tbody");
    for (let i=0; i < 5; i++){
        let tr_element = document.createElement("tr");
        for (let i=0; i < 7; i++){
            let td_element = document.createElement("td");
            td_element.addEventListener("click",
             ()=>{ displayDayInformation(td_element)})
            tr_element.appendChild(td_element);
        }
        tbody.append(tr_element);
    }
}

function displayDayInformation(td_element){
    let date = td_element.id.split('-');
    let year = date[0];
    let month = date[1];
    let day = date[2];
    let all_data = yearData["months"][capitalizeString(index_to_month[month-1])]["days"][day-1];

    all_display_spans = document.querySelectorAll(".display");
    
    for (let span_element of all_display_spans){
        span_element.innerText = all_data[span_element.id]
    }
    document.querySelector("#month_display").innerText = document.querySelector("#current_month").innerText;
    document.querySelector("#year_display").innerText = document.querySelector("#current_year").innerText;
        // need to do for year display and month display
}

window.onload = function (){

    populateWeekdays(document.querySelector("thead"),weekNamesArray);
    let prev_element = document.querySelector(".prev");
    let next_element = document.querySelector(".next");
    prev_element.addEventListener("click", ()=>{changeMonthAndYear("previous");});
    next_element.addEventListener("click", ()=>{changeMonthAndYear("next");});

    let month_value = currentNepaliDate.getMonth();
    let year_value = currentNepaliDate.getYear();

    document.querySelector("#current_month").innerText = index_to_month[month_value];
    document.querySelector("#current_year").innerText = year_value;

    create_tr_values();
    showCalendar(month_value, year_value, true);
}
