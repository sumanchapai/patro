# Patro
HamroPatro has too much ads. We scrape their website, save data (date and tihis) in JSON and build alternative simpler ad-free mobile app and website out of it.

## API
Meta at: <https://sumanchapai.github.io/patro/meta.json>\
Year data available by replacing the word `meta` in the meta api with the year.
For example: <https://sumanchapai.github.io/patro/2080.json>

## Chrome-extension
You can get the Patro chrome extension at the chrome web store [here](https://chromewebstore.google.com/detail/patro/mnagbabdhfjkajadblahmbbddecinhml)
<p align='center'>
<img alt='Patro Chrome-extension' src="https://lh3.googleusercontent.com/fNbkcQY4EYpYh3prVBSccUbiuNxHAKpEssoWJj9OP6EZAtWtv95anq4CPuuBJpkNPB4dgN3uBLZ3D2cMg5zOk0w4kQs=s1280-w1280-h800">
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
# Note that it's not patro 7 2080 to follow the convention of the cal command
patro <month> <year>
```

