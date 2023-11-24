package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"golang.org/x/exp/slices"
)

// TODO
// Update
var DataDir = "/Users/suman/Desktop/oss/patro/data"

func main() {
	tz, _ := time.LoadLocation("Asia/Kathmandu")

	// We show calendar of the dates between before and after
	after := flag.Uint("a", 3, "no of days before today")
	before := flag.Uint("b", 3, "no of days after today")
	flag.Parse()

	// Find out the current time in Nepal
	todayAD := time.Now().In(tz)
	// Note the method time.Sub is not what we want here
	minDayAD := todayAD.Add(-time.Hour * 24 * time.Duration(*before))
	maxDayAD := todayAD.Add(time.Hour * 24 * time.Duration(*after))

	// Read meta.json
	var metaMap Meta
	metaFile, err := os.Open(filepath.Join(DataDir, MetaJSON))
	if err != nil {
		panic(err)
	}
	defer metaFile.Close()
	if err := json.NewDecoder(metaFile).Decode(&metaMap); err != nil {
		panic(err)
	}

	// Find the nepali year for todayAD, minDayAD and maxDayAD
	currentYearBS, err := nepaliYearForADDate(todayAD, metaMap)
	if err != nil {
		fmt.Fprintln(os.Stderr, "no data for current year")
		os.Exit(1)
	}
	// List of available data years
	availableBSYears := metaMap.Years()
	minYearBS, err := nepaliYearForADDate(minDayAD, metaMap)
	if err != nil {
		// Note here that the Min function panics if the size of the slice is 0
		// However if the size of the slice was zero current year wouldn't have been found
		// Thus the codes would not have reached here
		fmt.Fprintf(os.Stderr, "minimum data available for year %v\n", slices.Min(availableBSYears))
		os.Exit(1)
	}
	maxYearBS, err := nepaliYearForADDate(maxDayAD, metaMap)
	if err != nil {
		// Note here that the Max function panics if the size of the slice is 0
		// However if the size of the slice was zero current year wouldn't have been found
		// Thus the codes would not have reached here
		fmt.Fprintf(os.Stderr, "max data available for year %v\n", slices.Max(availableBSYears))
		os.Exit(1)
	}
	// Ensure that the data for all the years from min to max is available
	for y := minYearBS; y <= maxYearBS; y++ {
		if _, ok := metaMap[y]; !ok {
			fmt.Fprintf(os.Stderr, "no data present for year %v\n", y)
			os.Exit(1)
		}
	}
	// Print the data of the starting year
	fmt.Println(minYearBS)
	fmt.Println(currentYearBS)
	fmt.Println(maxYearBS)
}

func isTimeBetween(candidate time.Time, lower time.Time, upper time.Time) bool {
	isBeforeOrEqualUpper := candidate.Before(upper) || candidate.Equal(upper)
	isAfterOrEqualLower := candidate.After(lower) || candidate.Equal(lower)
	return isBeforeOrEqualUpper && isAfterOrEqualLower
}
