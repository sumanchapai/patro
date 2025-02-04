package main

// JSON structure for data/meta.json
type YearMeta struct {
	FirstDayAD string `json:"first_day_AD"`
	LastDayAD  string `json:"last_day_AD"`
	FirstDayBS string `json:"first_day_BS"`
	LastDayBS  string `json:"last_day_BS"`
}

// JSON structure for a year data data/<year>.json
// For example data/2080.json
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
	Eng         string
	Tithi       string
	Eng_Weekday string `json:"eng_weekday"`
	Nep_Weekday string `json:"nep_weekday"`
	Nep_Date    string `json:"nep_date"`
	Eng_Date    string `json:"eng_date"`
}
