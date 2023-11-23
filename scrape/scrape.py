from __future__ import annotations
from exceptions import NeedYearArgumentOnlyException, NonNumericYearArgumentException
from typing import Dict
from bs4 import BeautifulSoup
from calendar_dict import INT_TO_MONTH, INT_TO_WEEKDAY_DICT

import requests
import json
import sys
import datetime

#document.querySelectorAll(".newDateText", ".headderNew");
# Example: python scrape.py 2080 fetches data for 2080B.S and saves them in database/2080.json

def fetch_and_parse(year : int) -> str:
    HAMRO_PATRO_URL = f"https://www.hamropatro.com/calendar/{year}/"
    current_month = 1
    all_months_data = {}
    while current_month < 2:

        current_month_dict = {}
        all_months_data[INT_TO_MONTH[current_month]] = current_month_dict

        r = requests.get(url=HAMRO_PATRO_URL+str(current_month))

        days_dict, month_info = parse_html(r.content, current_month, year)

        current_month_dict["days"] = days_dict


        nepali_month_info = month_info[0].text.split()
        english_month_info = month_info[1].text.split()

        current_month_dict["nep_year"] = nepali_month_info[0]
        current_month_dict["nep_name"] = nepali_month_info[1]

        current_month_dict["eng_months"] = english_month_info[0]
        current_month_dict["eng_years"] = english_month_info[1]

        current_month +=1

    return all_months_data

def parse_html(html : bytes, current_month : int, nep_year: int) -> Dict:
    
    soup = BeautifulSoup(html, 'lxml')
    calendar_body = soup.find(class_="calendar")
    dates_body = calendar_body.find(class_="dates")
    month_info = soup.find_all(class_="newDateText")

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

    return month_dict, month_info


def save_as_json_file(calendar_year_data : Dict)->None:
    print(json.dumps(calendar_year_data, indent=2))

def main() -> None:
    if len(sys.argv) != 2:
        raise NeedYearArgumentOnlyException("Year argument only neeeded")

    year : str = sys.argv[1]
    if not year.isnumeric():
        raise NonNumericYearArgumentException("Year argument needs to be numeric")

    
    response_dict= {}
    response_dict["months"] = fetch_and_parse(int(year))
    response_dict["year"] = year
    response_dict["meta"] = {"year_format":"YYYY-MM-DD"}
    save_as_json_file(response_dict)

if __name__ == '__main__':
    main()
