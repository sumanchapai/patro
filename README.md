# Patro

HamroPatro has too much ads. We scrape their website, save data (date and tihis)
in JSON and build alternative simpler ad-free mobile app, website and CLI out of
it.

## API

Meta at: <https://sumanchapai.github.io/patro/meta.json>\
Year data available by replacing the word `meta` in the meta api with the year.
For example: <https://sumanchapai.github.io/patro/2080.json>

## Chrome-extension

You can get the Patro chrome extension at the chrome web store
[here](https://chromewebstore.google.com/detail/patro/mnagbabdhfjkajadblahmbbddecinhml).
The extension also supports various keyboard shortcuts for easier navigation
which can be manually set/changed at `chrome://extensions/shortcuts`.

<p align='center'>
<img width="40%" height="350px" alt='Patro Chrome-extension' src="https://lh3.googleusercontent.com/fNbkcQY4EYpYh3prVBSccUbiuNxHAKpEssoWJj9OP6EZAtWtv95anq4CPuuBJpkNPB4dgN3uBLZ3D2cMg5zOk0w4kQs=s1280-w1280-h800">
<img width="40%" height="350px" alt="image" src="https://github.com/sumanchapai/patro/assets/114323952/92e42d73-f7f0-4037-99d9-32d3f07eaa96">
</p>

## CLI

Install the CLI by running (with `go >= 1.21` installed)

```bash
go install github.com/sumanchapai/patro/cli/patro@latest
```

Use the CLI as follows

```bash
# Display the current month calendar
patro

# Display the calendar for the previous, current, and next month
patro -3

# Display the calendar for a given year, example patro 2080
patro <year>

# Display the calendar of a specific month of a specific year, example patro 7 2080
# Note that it's not patro <year> <month> to follow the convention of the cal command
patro <month> <year>
```

If you also want the tithis displayed on the calendar, pass the "--tithi" flag
or "-t" as shortcut. For example,

```bash
patro -t
```

displays the patro with tithis alongside date. Note that because an API request
has to be made to get the tithi, the response is a bit slower when using the
tithi flag.

## Flutter
**Patro** also supports a Flutter-based mobile application that provides an ad-free solution for viewing the current Nepali and English date-time. The app is lightweight, fast, and designed for simplicity.

<img src="flutter/assets/screenshot.jpg" alt="Patro App Screenshot" width="200">

### Prerequisites
- Flutter


### Steps
1. Clone the repository:
   ```sh
   git clone git@github.com:sumanchapai/patro.git
   ```
2. Navigate to the project directory:
   ```sh
   cd patro/flutter

   ```
3. Install dependencies:
   ```sh
   flutter pub get
   ```
4. Run the app:
   ```sh
   flutter run
   ```

### LICENSE
MIT

