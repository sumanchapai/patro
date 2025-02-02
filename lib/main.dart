import 'dart:convert';

import 'package:intl/intl.dart'; // Add this import

import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:clean_nepali_calendar/clean_nepali_calendar.dart';
import 'package:english_words/english_words.dart';
import 'package:flutter/services.dart' show rootBundle;

void main() {
  runApp(MyApp());
}

class MyAppState extends ChangeNotifier {
  late Map<String, dynamic> dateData = {};

  NepaliDateTime current =
      NepaliDateTime.now(); // here is the current content in the box

  MyAppState() {
    loadJsonData();
  }
  //  need to put the current date in this
  Future<void> loadJsonData() async {
    String jsonString = await rootBundle.loadString('assets/2081.json');
    dateData = jsonDecode(jsonString);

    notifyListeners();
  }

  void setCurrentWord(NepaliDateTime candidate) {
    current = candidate;
    notifyListeners();
  }

  String get formattedCurrentDate {
    return NepaliDateFormat.yMMMMd(Language.nepali).format(current);
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Mero Patro',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyHomePage extends StatelessWidget {
  final NepaliCalendarController _nepaliCalendarController =
      NepaliCalendarController();
  @override
  Widget build(BuildContext context) {
    var appState = context.read<MyAppState>();
    final NepaliDateTime first = NepaliDateTime(2055, 5);
    final NepaliDateTime last = NepaliDateTime(2099, 3);
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(title: const Text('')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            EventInfoWidget(),
            BigCard(),
            DayInfoWidget(),
            SingleChildScrollView(
              padding: EdgeInsets.all(32),
              child: CleanNepaliCalendar(
                headerBuilder:
                    (decoration, height, nextMonth, prevMonth, nepaliDateTime) {
                  var dateFormat = NepaliDateFormat.yMMMM(Language.nepali);
                  return SizedBox(
                    height: height,
                    child: Container(
                      decoration: decoration,
                      child: Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_left),
                            onPressed: () => prevMonth(),
                          ),
                          Text(dateFormat.format(nepaliDateTime)),
                          IconButton(
                            icon: const Icon(Icons.arrow_right),
                            onPressed: () => nextMonth(),
                          ),
                        ],
                      ),
                    ),
                  );
                },
                controller: _nepaliCalendarController,
                onHeaderLongPressed: (date) {
                  print("header long pressed $date");
                },
                onHeaderTapped: (date) {
                  print("header tapped foobar $date");
                },
                calendarStyle: CalendarStyle(
                  weekEndTextColor: Colors.red,
                  selectedColor: const Color.fromARGB(255, 229, 144, 138),
                  dayStyle: TextStyle(fontWeight: FontWeight.bold),
                  todayStyle: TextStyle(
                    fontSize: 20.0,
                  ),
                  todayColor: Colors.orange.shade400,
                  // highlightSelected: true,
                  renderDaysOfWeek: true,
                  highlightToday: true,
                ),
                headerStyle: HeaderStyle(
                  enableFadeTransition: false,
                  centerHeaderTitle: false,
                  titleTextStyle: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.red, // color of month tab
                      fontSize: 20.0),
                ),
                initialDate: NepaliDateTime.now(), //todays date
                firstDate: first,
                lastDate: last,
                language: Language.nepali,

                onDaySelected: (day) {
                  // var day = NepaliDateFormat.M(Language.nepali);
                  appState.setCurrentWord(day);
                  print(day.toString()); // need to print this inside app
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DayInfoWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState =
        context.watch<MyAppState>(); // Watch for changes in selected date

    // Get the selected Nepali date
    NepaliDateTime selectedDate = appState.current;

    // Get Nepali Tithi and Day Name
    String tithi = "N/A";
    String selectedADDate = "n/a";
    appState.dateData['months']?.forEach((monthName, monthData) {
      for (var dayData in monthData['days']) {
        if (dayData['nep_date'] ==
            '${selectedDate.year}-${selectedDate.month}-${selectedDate.day}') {
          tithi = dayData['tithi'];
          selectedADDate = dayData['eng_date'];
          // Get Tithi if found

          break;
        }
      }
    });

    String dayNameInEnglish = DateFormat('EEEE').format(DateTime(
        selectedDate.year,
        selectedDate.month,
        selectedDate.day)); // Day name in English
// Simplified tithi (you can modify this to get exact Tithi)
    // Map English day names to Nepali day names
    //  i changed the mapping by -1 as in nepali 0 is sunday not monday
    Map<String, String> nepaliDayNames = {
      'Sunday': 'शनिवार',
      'Monday': 'आइतवार',
      'Tuesday': 'सोमवार',
      'Wednesday': 'मंगलवार',
      'Thursday': 'बुधवार',
      'Friday': 'बिहीवार',
      'Saturday': 'शुक्रवार',
    };
    String dayNameNepali = nepaliDayNames[dayNameInEnglish] ?? '';
    DateTime adDate =
        DateTime(selectedDate.year, selectedDate.month, selectedDate.day);

    String englishDate = DateFormat('yyyy-MM-dd').format(
        DateTime(selectedDate.year, selectedDate.month, selectedDate.day));

    // English date

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left side: Tithi and related info
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(tithi, style: TextStyle(fontSize: 18)),
              ),
              // Add more Tithi-related info here if needed
            ],
          ),
          // Middle: English Date
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(selectedADDate, style: TextStyle(fontSize: 25)),
              // Text(englishDate, style: TextStyle(fontSize: 20)),
              // Today's AD date
            ],
          ),
          // Right side: Day name in Nepali (e.g., Sukrabar)
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(dayNameNepali, style: TextStyle(fontSize: 18)),
          ),
        ],
      ),
    );
  }
}

class EventInfoWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var appState =
        context.watch<MyAppState>(); // Watch for changes in selected date

    // Get the selected Nepali date
    NepaliDateTime selectedDate = appState.current;
    String selectedDateString =
        "${selectedDate.year}-${selectedDate.month.toString().padLeft(2, '0')}-${selectedDate.day.toString().padLeft(2, '0')}";

    // Get Nepali Tithi and Day Name
    String event = "N/A";
    appState.dateData['months']?.forEach((monthName, monthData) {
      for (var dayData in monthData['days']) {
        if (dayData['nep_date'] == selectedDateString) {
          event = dayData['event'];

          break;
        }
      }
    });

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        mainAxisAlignment:
            MainAxisAlignment.center, // Center the Row contents horizontally
        children: [
          Center(
            // Center the Text widget inside the Row
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                event,
                style: TextStyle(fontSize: 18),
                textAlign: TextAlign
                    .center, // Ensure text is centered inside the widget
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class BigCard extends StatelessWidget {
  const BigCard({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();
    final theme = Theme.of(context);
    final style = theme.textTheme.displayMedium!.copyWith(
      color: theme.colorScheme.onPrimary,
    );

    String formattedDate =
        NepaliDateFormat.yMMMMd(Language.nepali).format(appState.current);
    return Card(
      color: theme.colorScheme.primary,
      child: Padding(
        padding: const EdgeInsets.all(40.0),
        child: Text(formattedDate, style: style),
      ),
    );
  }
}

String monthStringName(NepaliDateTime date) {
  var dateFormat = NepaliDateFormat.MMMM(Language.nepali);
  return dateFormat.format(date);
}
