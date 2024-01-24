# Patro

HamroPatro has too much ads. We scrape their website, save data (date and tihis) in JSON and build alternative simpler ad-free mobile app, website and CLI out of it.

## API

Meta at: <https://sumanchapai.github.io/patro/meta.json>\
Year data available by replacing the word `meta` in the meta api with the year.
For example: <https://sumanchapai.github.io/patro/2080.json>

## Chrome-extension

You can get the Patro chrome extension at the chrome web store [here](https://chromewebstore.google.com/detail/patro/mnagbabdhfjkajadblahmbbddecinhml). The extension also supports various keyboard shortcuts for easier navigation which can be manually set/changed at `chrome://extensions/shortcuts`.

<p align='center'>
<img width="40%" height="350px" alt='Patro Chrome-extension' src="https://lh3.googleusercontent.com/fNbkcQY4EYpYh3prVBSccUbiuNxHAKpEssoWJj9OP6EZAtWtv95anq4CPuuBJpkNPB4dgN3uBLZ3D2cMg5zOk0w4kQs=s1280-w1280-h800">
<img width="40%" height="350px" alt="image" src="https://github.com/sumanchapai/patro/assets/114323952/92e42d73-f7f0-4037-99d9-32d3f07eaa96">
</p>

## CLI

Install the CLI by running

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
