import csv
import json

csvfile = open('dataset.csv', 'r')
jsonfile = open('data.json', 'w')

columns = ("Date","Rain")
reader = csv.DictReader( csvfile, columns)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')