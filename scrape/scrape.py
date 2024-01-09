from __future__ import annotations

import datetime
import json
import os
import sys
import time
from typing import Dict, List, Tuple, Union

import bs4
import requests
from rich.progress import (BarColumn, MofNCompleteColumn, Progress, TextColumn,
                           TimeElapsedColumn)

from calendar_dict import INT_TO_MONTH, INT_TO_WEEKDAY_DICT
from exceptions import (InvalidYearException, NeedYearArgumentOnlyException,
                        NonNumericYearArgumentException)

# Example: python scrape.py 2080 fetches data for 2080B.S and saves them in database/2080.json

META_DATA_JSON_FILE_PATH: str = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "data/meta.json")


def fetch_and_parse(year: int) -> Dict[str, Dict]:

    HAMRO_PATRO_URL: str = f"https://www.hamropatro.com/calendar/{year}/"

    current_month: int = 1
    max_month: int = 12

    all_months_data: Dict[str, Dict] = {}

    with Progress(
            TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
            BarColumn(),
            MofNCompleteColumn(),
            TextColumn("•"),
            TimeElapsedColumn(),
    ) as p:

        for i in p.track(range(max_month)):

            current_month_dict: Dict[str, Union[str, Dict]] = {}
            all_months_data[INT_TO_MONTH[current_month]] = current_month_dict

            r: requests.models.Response = requests.get(url=HAMRO_PATRO_URL +
                                                       str(current_month))

            if r.status_code != 200:
                raise InvalidYearException("Invalid year value")

            tuple_response: Tuple[List,
                                  List] = parse_html(r.content, current_month,
                                                     year)
            days_list: List[Dict] = tuple_response[0]
            month_info: List[bs4.element.Tag] = tuple_response[1]

            current_month_dict["days"] = days_list

            nepali_month_info: List[str] = month_info[0].text.split()
            english_month_info: List[str] = month_info[1].text.split()

            current_month_dict["nep_year"]: str = nepali_month_info[0]
            current_month_dict["nep_name"]: str = nepali_month_info[1]

            current_month_dict["eng_months"]: str = english_month_info[0]
            current_month_dict["eng_years"]: str = english_month_info[1]

            current_month_dict["first_day_AD"]: str = days_list[0]["eng_date"]
            current_month_dict["last_day_AD"]: str = days_list[-1]["eng_date"]

            current_month_dict["first_day_BS"]: str = days_list[0]["nep_date"]
            current_month_dict["last_day_BS"]: str = days_list[-1]["nep_date"]

            current_month += 1

    return all_months_data


def parse_html(html: bytes, current_month: int,
               nep_year: int) -> Tuple[List, List]:

    soup: bs4.BeautifulSoup = bs4.BeautifulSoup(html, 'lxml')
    calendar_body: bs4.element.Tag = soup.find(class_="calendar")
    dates_body: bs4.element.Tag = calendar_body.find(class_="dates")
    month_info: bs4.element.Tag = soup.find_all(class_="newDateText")

    current_nepali_day: int = 1

    month_list: List[Dict] = []

    for li_tag in dates_body.find_all("li"):

        english_data: str = li_tag["id"]

        # skip over id's 0
        if english_data != "0" and english_data != '--':

            day_dict: Dict[str, str] = {}
            month_list.append(day_dict)

            day_dict["event"]: str = li_tag.find(class_="event").text
            day_dict["nep"]: str = li_tag.find(class_="nep").text
            day_dict["eng"]: str = li_tag.find(class_="eng").text
            try:
                day_dict["tithi"]: str = li_tag.find(class_="tithi").text
            except AttributeError:
                day_dict["tithi"]: str = ""

            eng_year, month, day = map(int, english_data.split("-"))

            day: datetime.datetime = datetime.datetime(eng_year, month, day)
            day_dict["eng_weekday"]: str = INT_TO_WEEKDAY_DICT[
                day.weekday()][0]
            day_dict["nep_weekday"]: str = INT_TO_WEEKDAY_DICT[
                day.weekday()][1]

            day_dict[
                "nep_date"]: str = \
                    f"{nep_year}-{current_month}-{current_nepali_day}"
            day_dict["eng_date"]: str = english_data

            current_nepali_day += 1

    return (month_list, month_info)


def update_meta_json(calendar_year_data: Dict[str, Union[Dict, int]],
                     year: int):

    if not os.path.exists(META_DATA_JSON_FILE_PATH):
        with open(META_DATA_JSON_FILE_PATH, 'w') as f:
            f.write(json.dumps({}))

    with open(META_DATA_JSON_FILE_PATH, 'r') as in_json_file:
        meta_data_dict = json.load(in_json_file)

    if year not in meta_data_dict:
        meta_data_dict[year] = {}

    meta_data_dict[year]["first_day_AD"] = calendar_year_data["months"][
        "Baishakh"]["first_day_AD"]
    meta_data_dict[year]["last_day_AD"] = calendar_year_data["months"][
        "Chaitra"]["last_day_AD"]

    meta_data_dict[year]["first_day_BS"] = calendar_year_data["months"][
        "Baishakh"]["first_day_BS"]
    meta_data_dict[year]["last_day_BS"] = calendar_year_data["months"][
        "Chaitra"]["last_day_BS"]

    with open(META_DATA_JSON_FILE_PATH, 'w') as out_json_file:
        out_json_file.write(json.dumps(meta_data_dict, indent=2))


def save_as_json_file(calendar_year_data: Dict[str, Union[Dict, int]],
                      year: int) -> None:

    PATH_TO_DUMP: str = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), f"data/{year}.json")

    if os.path.exists(PATH_TO_DUMP):

        print(f"--- Overwriting existing path : {PATH_TO_DUMP} ---")

    with open(PATH_TO_DUMP, 'w') as json_file:

        json_file.write(json.dumps(calendar_year_data, indent=2))
        print(f"--- Saved JSON data for year {year} in {PATH_TO_DUMP} ---")

    update_meta_json(calendar_year_data, year)


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
