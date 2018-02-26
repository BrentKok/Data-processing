import csv
import json

# Opens a csv file called data.csv
# Creates a json file, called scatter.json
csvfile = open('data.csv', 'r')
jsonfile = open('scatter.json', 'w')

columns = ("Country","GDP", "Population")
reader = csv.DictReader( csvfile, columns)
read = list(reader)
readerSize = len(read)
count = 0

jsonfile.write('[')
for row in read:
    count += 1
    json.dump(row, jsonfile)
    if count != readerSize:
    	jsonfile.write(',\n')

jsonfile.write(']')