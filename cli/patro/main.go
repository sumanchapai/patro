package main

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/fatih/color"
	"github.com/opensource-nepal/go-nepali/dateConverter"
)

const HelpMsg = `# Display the current month calendar
patro

# Display the calendar for the previous, current, and next month
patro -3

# Display the calendar for a given year, example patro 2080
patro <year>

# Display the calendar of a specific month of a specific year, example patro 7 2080 
# Note that it's not patro 7 2080 to follow the convention of the cal command
patro <month> <year>`

var todayColor = color.New(color.FgBlack).Add(color.BgGreen)

type CalMonth struct {
	year  int
	month int
}

func main() {
	// Get args without program
	args := os.Args[1:]
	calMonths := validateArgs(args)
	for i, calMonth := range calMonths {
		DisplayMonthCalendar(calMonth.year, calMonth.month)
		if i != len(calMonths)-1 {
			fmt.Println()
		}
	}
}

func errExit(msg interface{}) {
	fmt.Println(msg)
	os.Exit(1)
}

func errHelpExit(msg interface{}) {
	fmt.Println(msg)
	fmt.Printf("%s\n\n", "Use as follows:")
	fmt.Println(HelpMsg)
	os.Exit(1)
}

func nepaliMonthName(number int) (string, error) {
	months := []string{
		"Baisakh", "Jestha", "Asar",
		"Shrawan", "Bhadra", "Ashoj",
		"Kartik", "Mangsir", "Poush",
		"Magh", "Falgun", "Chait",
	}
	if number > 0 && number < 13 {
		return months[number-1], nil
	} else {
		return "", fmt.Errorf("invalid month number, must be between 1-12")
	}
}

// Display calendar month for the given year, and month of the nepali calendar.
// For example, to display the calendar for 2056 Karthik, you would call this
// function with params: 2056, 7
func DisplayMonthCalendar(year, month int) {
	todayAd := today()
	englishDate, err := dateConverter.NepaliToEnglish(year, month, 1)
	if err != nil {
		errExit(err)
	}
	displayMonthHeader(year, month)
	dateStr := fmt.Sprintf("%d-%02d-%02d", englishDate[0], englishDate[1], englishDate[2])
	ad, err := time.Parse(time.DateOnly, dateStr)
	if err != nil {
		errExit(err)
	}
	fmt.Println("Su Mo Tu We Th Fr Sa")
	calendarDay := 1
	var isToday bool
	for {
		isToday = (todayAd.Year() == ad.Year() && todayAd.Month() == ad.Month() && todayAd.Day() == ad.Day())
		text := fmt.Sprintf("%2d", calendarDay)
		if isToday {
			text = todayColor.Sprint(text)
		}
		if ad.Weekday() == time.Sunday {
			fmt.Printf("%v", text)
		} else if calendarDay == 1 {
			// Add appropriate padding to align to the weekday
			padding := ad.Weekday() * 3
			emptySpace := fmt.Sprintf("%[1]*s", padding, " ")
			fmt.Printf("%s%s", emptySpace, text)
		} else {
			fmt.Printf(" %v", text)
		}
		// Format appropriately based on the day of the week
		if ad.Weekday() == time.Saturday {
			fmt.Println()
		}
		calendarDay++
		// Add one day
		ad = ad.AddDate(0, 0, 1)
		bs, err := dateConverter.EnglishToNepali(ad.Year(), int(ad.Month()), ad.Day())
		if err != nil {
			errExit(err)
		}
		// Exit if got new month
		if bs[2] == 1 {
			fmt.Println()
			break
		}
	}
}

func displayMonthHeader(year, month int) {
	width := 20
	monthName, err := nepaliMonthName(month)
	if err != nil {
		errExit(err)
	}
	calendarTitle := fmt.Sprintf("%v-%v", monthName, year)
	fmt.Printf("%[1]*[2]v\n", -width, fmt.Sprintf("%[1]*s", (width+len(calendarTitle))/2, calendarTitle))
}

// Get today's time in Nepal as time.Time object
func today() time.Time {
	tz, _ := time.LoadLocation("Asia/Kathmandu")
	// Find out the current time in Nepal
	return time.Now().In(tz)
}

// Validate args and return the year and month to print
// Note that if the month is 0 it signals printing the calendar for the entire year
// If both year and month are zero, it means error
func validateArgs(args []string) []CalMonth {
	todayAD := today()
	todayBS, err := dateConverter.EnglishToNepali(todayAD.Year(), int(todayAD.Month()), todayAD.Day())
	if err != nil {
		errExit(err)
	}
	currentYear := todayBS[0]
	currentMonth := todayBS[1]
	currentCalMonth := CalMonth{currentYear, currentMonth}
	switch len(args) {
	case 0:
		return []CalMonth{currentCalMonth}
	case 1:
		if args[0] == "-3" {
			return []CalMonth{PreviousCalMonth(currentCalMonth), currentCalMonth, NextCalMonth(currentCalMonth)}
		}
		year, err := strconv.ParseInt(args[0], 10, 32)
		if err != nil {
			errHelpExit(err)
		}
		calMonths := make([]CalMonth, 0)
		for month := 1; month <= 12; month++ {
			calMonths = append(calMonths, CalMonth{year: int(year), month: month})
		}
		return calMonths
	case 2:
		// Note that we'd ideally like to specify
		// nepcal year month
		// However, to follow the convention of the cal command
		// one needs to say
		// nepcal month year
		month, err := strconv.ParseInt(args[0], 10, 32)
		if err != nil {
			errHelpExit(err)
		}
		year, err := strconv.ParseInt(args[1], 10, 32)
		if err != nil {
			errHelpExit(err)
		}
		if month < 1 || month > 12 {
			errHelpExit(fmt.Sprintf("Invalid month. Expected between 0 and 12 received %v", month))
		}
		return []CalMonth{{year: int(year), month: int(month)}}
	default:
		errHelpExit("Maximum number of valid args is 2")
	}
	return nil
}

func PreviousCalMonth(current CalMonth) CalMonth {
	if current.month == 1 {
		return CalMonth{month: 12, year: current.year - 1}
	}
	return CalMonth{month: current.month - 1, year: current.year}
}

func NextCalMonth(current CalMonth) CalMonth {
	if current.month == 12 {
		return CalMonth{month: 1, year: current.year + 1}
	}
	return CalMonth{month: current.month + 1, year: current.year}
}
