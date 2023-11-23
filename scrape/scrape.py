from __future__ import annotations
from exceptions import NeedYearArgumentOnlyException, NonNumericYearArgumentException
from typing import Dict

import requests
import json
import sys

# Example: python scrape.py 2080 fetches data for 2080B.S and saves them in database/2080.json

def fetch_and_parse(year : int) -> str:
    HAMRO_PATRO_URL = f"https://www.hamropatro.com/calendar/{year}/"
    current_month = 1
    all_months_data = []
    while current_month < 13:
        r = requests.get(url=HAMRO_PATRO_URL+str(current_month))
        month_data : Dict = parse_html(r.content)
        all_months_data.append(month_data)
    return all_months_data

def parse_html(html : str) -> Dict:
    pass

def save_to_file(calendar_year_data : Dict)->None:
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
