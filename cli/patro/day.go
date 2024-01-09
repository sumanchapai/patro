package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/ursaserver/ursa/memoize"
)

// Return the data file for a given year.
// Downloads the file by making an API request
func GetDataFileForYear(year int) (io.ReadCloser, error) {
	dataFileAPI := fmt.Sprintf("https://sumanchapai.github.io/patro/%v.json", year)
	response, err := http.Get(dataFileAPI)
	if err != nil {
		return *(new(io.ReadCloser)), err
	}
	return response.Body, err
}

func GetDayInfo(year, month, day int) (Day, error) {
	var dayInfo Day
	monthInfo, err := GetMonthInfo(year, month)
	if err != nil {
		return dayInfo, err
	}
	return monthInfo.Days[day-1], nil
}

// Get month info for a given nepali date
// For example to get the info for Kartik 2056
// you would call GetDayInfo(2056, 7)
func GetMonthInfo(year, month int) (Month, error) {
	monthName, err := nepaliMonthName(month)
	var monthMap Month
	if err != nil {
		errExit(err)
	}
	yearInfo := GetYearInfo(year)
	if yearInfo == nil {
		return monthMap, fmt.Errorf("cannot read the year data")
	} else if yearInfo.err != nil {
		return monthMap, yearInfo.err
	} else {
		monthMap = yearInfo.year.Months[monthName]
		return monthMap, nil
	}
}

type YearInfo struct {
	year Year
	err  error
}

// Get info for a given nepali year
// Note that this function is memoized for performace reasons
func getYearInfo(year int) *YearInfo {
	dataFile, err := GetDataFileForYear(year)
	if err != nil {
		return nil
	}
	var yearMap Year
	if err != nil {
		panic(err)
	}
	defer dataFile.Close()
	err = json.NewDecoder(dataFile).Decode(&yearMap)
	return &YearInfo{year: yearMap, err: err}
}

var GetYearInfo = memoize.Unary(getYearInfo)
