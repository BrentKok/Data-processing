import csv
import json
import pprint

# Opens a csv file called data.csv
# Creates a json file, called scatter.json
csvfile = open('KNMI.csv', 'r')
jsonfile = open('linef.json', 'w')

columns = ("Station", "Date", "Average", "Min", "Max")
reader = csv.DictReader( csvfile, columns)
read = list(reader)
readerSize = len(read)
count = 0

data = {
			"249": {"Average": [], "Min": [], "Max": []},
			"260": {"Average": [], "Min": [], "Max": []}
		}

points = ["Average", "Min", "Max"]
for row in read:
    count += 1
    print(row)
    for point in points:
    	print(point)
    	current_data = {"date": row["Date"], "value": row[point]}
    	print(len(str(row["Station"])))
    	if len(str(row["Station"])) > 3:
    		key = str(row["Station"])[-3:]
    	else:
    		key = str(row["Station"])
    	print(key)
    	data[key][point].append(current_data)

json.dump(data, jsonfile, indent=4)

pprint.pprint(data)
