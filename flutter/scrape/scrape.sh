#!/bin/bash
LAST_NEP_YEAR=2089
for ((i=2000;i<=LAST_NEP_YEAR;i++)); do
    python scrape.py $i 
done