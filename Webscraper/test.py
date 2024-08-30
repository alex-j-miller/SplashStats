import csv
from collections import defaultdict

# Define the input file name
input_file = 'Node/output.csv'

# Parsing data into a dictionary
swimmers = defaultdict(lambda: defaultdict(lambda: ''))

# Reading the data from the file
with open(input_file, mode='r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        name = row['Name']
        event = row['Event']
        time = row['Time in Seconds']
        swimmers[name][event] = time

# Preparing the output
header = ["Name", "50 Free", "100 Free", "200 Free", "500 Free", "1000 Free", "1650 Free", "50 Back", "100 Back", "200 Back", "50 Breast", "100 Breast", "200 Breast", "50 Fly", "100 Fly", "200 Fly", "100 IM", "200 IM", "400 IM" ]
print(",".join(header))

for name, events in swimmers.items():
    row = [name, events["50 Free"], events["100 Free"], events["200 Free"], events["500 Free"], events["1000 Free"], events["1650 Free"], events["50 Back"], events["100 Back"], events["200 Back"], events["50 Breast"], events["100 Breast"], events["200 Breast"], events["50 Fly"], events["100 Fly"], events["200 Fly"], events["100 IM"], events["200 IM"], events["400 IM"]]
    print(",".join(row))