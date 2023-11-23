from __future__ import annotations
from exceptions import NeedYearArgumentOnlyException, NonNumericYearArgumentException
from typing import Dict
from bs4 import BeautifulSoup

import requests
import json
import sys
import datetime


#document.querySelectorAll(".newDateText", ".headderNew");

# Example: python scrape.py 2080 fetches data for 2080B.S and saves them in database/2080.json

INT_TO_WEEKDAY_DICT = {
        0:("Monday","सोमवार"),
        1:("Tuesday","मङ्गलवार"),
        2:("Wednesday","बुधवार"),
        3:("Thursday","बिहिवार"),
        4:("Friday","शुक्रवार"),
        5:("Saturday","शनिवार"),
        6:("Sunday","आइतवार"),
        }

INT_TO_MONTH= {
        1:"Baishakh",
        2:"Jestha",
        3:"Asar",
        4:"Shrawan",
        5:"Bhadau",
        6:"Aswin",
        7:"Kartik",
        8:"Mansir",
        9:"Poush",
        10:"Magh",
        11:"Falgun",
        12:"Chaitra",
}

def fetch_and_parse(year : int) -> str:
    HAMRO_PATRO_URL = f"https://www.hamropatro.com/calendar/{year}/"
    current_month = 1
    all_months_data = {}
    while current_month < 2:

        current_month_dict = {}
        all_months_data[INT_TO_MONTH[current_month]] = current_month_dict

        r = requests.get(url=HAMRO_PATRO_URL+str(current_month))
        current_month_dict["days"] = parse_html(r.content, current_month, year)

        current_month +=1

    return all_months_data

def parse_html(html : bytes, current_month : int, nep_year: int) -> Dict:
    
    soup = BeautifulSoup(html, 'lxml')
    calendar_body = soup.find(class_="calendar")
    dates_body = calendar_body.find(class_="dates")

    current_nepali_day = 1

    month_dict = {}

    for li_tag in dates_body.find_all("li"):

        english_data = li_tag["id"]

        # skip over id's 0
        if english_data != "0":

            day_dict = {}
            month_dict[current_nepali_day] = day_dict

            day_dict["event"] = li_tag.find(class_="event").text
            day_dict["nep"] = li_tag.find(class_="nep").text
            day_dict["eng"] = li_tag.find(class_="eng").text
            day_dict["tithi"] = li_tag.find(class_="tithi").text

            eng_year, month, day = map(int, english_data.split("-"))
            day = datetime.datetime(eng_year, month, day)
            day_dict["eng_weekday"] = INT_TO_WEEKDAY_DICT[day.weekday()][0]
            day_dict["nep_weekday"] = INT_TO_WEEKDAY_DICT[day.weekday()][1]

            day_dict["nep_date"] = f"{nep_year}-{current_month}-{current_nepali_day}"
            day_dict["eng_date"] = english_data
            # get nepali and english weekday
            current_nepali_day += 1

    return month_dict


def save_to_file(calendar_year_data : Dict)->None:
    print(json.dumps(calendar_year_data, indent=2))
    pass

def main() -> None:
    if len(sys.argv) != 2:
        raise NeedYearArgumentOnlyException("Year argument only neeeded")

    year : str = sys.argv[1]
    if not year.isnumeric():
        raise NonNumericYearArgumentException("Year argument needs to be numeric")

    all_months_data : str = fetch_and_parse(int(year))
    save_to_file(all_months_data)

if __name__ == '__main__':
    main()
