package legacy

import (
	"errors"
	"time"
)

type YearMeta struct {
	FirstDayAD string `json:"first_day_AD"`
	LastDayAD  string `json:"last_day_AD"`
	FirstDayBS string `json:"first_day_BS"`
	LastDayBS  string `json:"last_day_BS"`
}

type Year struct {
	Months map[string]Month
	Year   int
	Meta   struct {
		YearFormat string `json:"year_format"`
	}
}

type Month struct {
	Days       []Day
	NepYear    string `json:"nep_year"`
	NepName    string `json:"nep_name"`
	EngMonths  string `json:"eng_months"`
	FirstDayAD string `json:"first_day_AD"`
	LastDayAD  string `json:"last_day_AD"`
	FirstDayBS string `json:"first_day_BS"`
	LastDayBS  string `json:"last_day_BS"`
}

type Day struct {
	Event       string
	Nep         string
	Eng         int
	Tithi       string
	Eng_Weekday string `json:"eng_weekday"`
	Nep_Weekday string `json:"nep_weekday"`
	Nep_Date    string `json:"nep_date"`
	Eng_Date    string `json:"eng_date"`
}

type Meta map[int]YearMeta

var MetaJSON = "meta.json"

// Returns the slice of nepali years in the Meta map
func (m Meta) Years() []int {
	years := make([]int, 0)
	for y := range m {
		years = append(years, y)
	}
	return years
}

// Find the nepali year corresponding to a nepali date based on the given Meta
// map. Returns integer, error where error is non nil if the date isn't present
// in the Meta map
func nepaliYearForADDate(t time.Time, m Meta) (int, error) {
	for k, v := range m {
		firstDayOfYear, err := time.Parse("2006-1-2", v.FirstDayAD)
		if err != nil {
			panic(err) // Panic means JSON data is not in the expected format
		}
		lastDayOfYear, err := time.Parse("2006-1-2", v.LastDayAD)
		if err != nil {
			panic(err) // Panic means JSON data is not in the expected format
		}
		if isTimeBetween(t, firstDayOfYear, lastDayOfYear) {
			return k, nil
		}
	}
	return 0, errors.New("year not found")
}
