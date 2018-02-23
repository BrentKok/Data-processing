import csv
import json

# Opens a csv file called dataset.csv
# Creates a json file, called data.json
csvfile = open('dataset.csv', 'r')
jsonfile = open('data.json', 'w')

columns = ("Date","Rain")
reader = csv.DictReader( csvfile, columns)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write(',\n')