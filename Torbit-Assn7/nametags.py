import os

# Get the directory of the current script
script_dir = os.path.dirname(__file__)
# Construct the full path to the CSV file
csv_path = os.path.join(script_dir, "registrant_data.csv")
html_path = os.path.join(script_dir, "nametags10.html")

dataFile = open(csv_path, "r")
hardcodeHtml = open(html_path, "r")
keyList = dataFile.readline().strip().split(sep=',')
registrantList = []
hmtlListofRegistrants = []

next(dataFile)
for line in dataFile:
   i = -1
   line = line.strip()
   valueList = line.split(sep=',')
   registrant = {}
   for key, value in zip(keyList, valueList):
      registrant.update({key:value})
   registrantList.append(registrant)

dataFile.close()

htmlLines = hardcodeHtml.readlines()

for registrant in registrantList:
   firstName = registrant['firstname']
   lastName = registrant['lastname']
   company = registrant['company']
   city = registrant['city']
   state = registrant['state']