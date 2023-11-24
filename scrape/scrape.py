from __future__ import annotations

import datetime
import json
import os
import sys
import time
from typing import Dict, List, Tuple, Union

import bs4
import requests

from calendar_dict import INT_TO_MONTH, INT_TO_WEEKDAY_DICT
from exceptions import (InvalidYearException, NeedYearArgumentOnlyException,
                        NonNumericYearArgumentException)

# Example: python scrape.py 2080 fetches data for 2080B.S and saves them in database/2080.json


def fetch_and_parse(year: int) -> Dict[str, Dict]:

    HAMRO_PATRO_URL: str = f"https://www.hamropatro.com/calendar/{year}/"

    current_month: int = 1
    max_month: int = 12

    all_months_data: Dict[str, Dict] = {}

    while current_month <= max_month:

        current_month_dict: Dict[str, Union[str, Dict]] = {}
        all_months_data[INT_TO_MONTH[current_month]] = current_month_dict

        r: requests.models.Response = requests.get(url=HAMRO_PATRO_URL +
                                                   str(current_month))
        if r.status_code != 200:
            raise InvalidYearException("Invalid year value")

        tuple_response: Tuple[Dict, List] = parse_html(r.content,
                                                       current_month, year)
        days_dict: Dict[int, Dict] = tuple_response[0]
        month_info: List[bs4.element.Tag] = tuple_response[1]

        current_month_dict["days"] = days_dict

        nepali_month_info: List[str] = month_info[0].text.split()
        english_month_info: List[str] = month_info[1].text.split()

        current_month_dict["nep_year"]: str = nepali_month_info[0]
        current_month_dict["nep_name"]: str = nepali_month_info[1]

        current_month_dict["eng_months"]: str = english_month_info[0]
        current_month_dict["eng_years"]: str = english_month_info[1]

        current_month += 1

    return all_months_data


def parse_html(html: bytes, current_month: int,
               nep_year: int) -> Tuple[Dict, List]:

    soup: bs4.BeautifulSoup = bs4.BeautifulSoup(html, 'lxml')
    calendar_body: bs4.element.Tag = soup.find(class_="calendar")
    dates_body: bs4.element.Tag = calendar_body.find(class_="dates")
    month_info: bs4.element.Tag = soup.find_all(class_="newDateText")

    current_nepali_day: int = 1

    month_dict: Dict[int, Dict] = {}

    for li_tag in dates_body.find_all("li"):

        english_data: str = li_tag["id"]

        # skip over id's 0
        if english_data != "0":

            day_dict: Dict[str, str] = {}
            month_dict[current_nepali_day] = day_dict

            day_dict["event"]: str = li_tag.find(class_="event").text
            day_dict["nep"]: str = li_tag.find(class_="nep").text
            day_dict["eng"]: str = li_tag.find(class_="eng").text
            day_dict["tithi"]: str = li_tag.find(class_="tithi").text

            eng_year, month, day = map(int, english_data.split("-"))

            day: datetime.datetime = datetime.datetime(eng_year, month, day)
            day_dict["eng_weekday"]: str = INT_TO_WEEKDAY_DICT[
                day.weekday()][0]
            day_dict["nep_weekday"]: str = INT_TO_WEEKDAY_DICT[
                day.weekday()][1]

            day_dict[
                "nep_date"]: str = f"{nep_year}-{current_month}-{current_nepali_day}"
            day_dict["eng_date"]: str = english_data

            current_nepali_day += 1

    return (month_dict, month_info)


def save_as_json_file(calendar_year_data: Dict[str, Union[Dict, int]],
                      year: int) -> None:

    path_to_dump: str = os.path.join(os.path.dirname(__file__),
                                     f"data/{year}.json")

    if os.path.exists(path_to_dump):

        print(f"--- Overwriting existing path : {path_to_dump} ---")

    with open(path_to_dump, 'w') as json_file:

        json_file.write(json.dumps(calendar_year_data, indent=2))
        print(f"--- Saved JSON data for year {year} in {path_to_dump} ---")


def main() -> None:

    if len(sys.argv) != 2:
        raise NeedYearArgumentOnlyException("Year argument only neeeded")

    year: str = sys.argv[1]
    if not year.isnumeric():
        raise NonNumericYearArgumentException(
            "Year argument needs to be numeric")

    response_dict: Dict[str, Union[Dict, int]] = {}
    response_dict["months"]: Dict[str, Dict] = fetch_and_parse(int(year))
    response_dict["year"]: int = int(year)
    response_dict["meta"]: Dict[str, str] = {"year_format": "YYYY-MM-DD"}
    save_as_json_file(response_dict, year)


if __name__ == '__main__':

    start_time: float = time.time()
    main()
    end_time: float = time.time()

    print(f"--- Execution Finished : {end_time-start_time:.2f} seconds ---")
