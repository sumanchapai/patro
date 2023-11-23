package main

import (
	"fmt"
	"time"
)

func main() {
	tz, _ := time.LoadLocation("Asia/Kathmandu")
	// Find out the current time in Nepal
	today := time.Now().In(tz)
	//
	// Get JSON file for the current year, previous year and the next year
	// Error if the current year JSON cannot be found
	//
	fmt.Println("Nepali Calendar", today.Format("2006-01-02"))
}
