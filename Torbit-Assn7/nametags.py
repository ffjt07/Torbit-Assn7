import os

# Get the directory of the current script
script_dir = os.path.dirname(__file__)
# Construct the full path to the CSV file
csv_path = os.path.join(script_dir, "registrant_data.csv")
html_path = os.path.join(script_dir, "nametags10.html")
new_html_path = os.path.join(script_dir, "..", "nametags10reg.html")

dataFile = open(csv_path, "r")
hardcodeHtml = open(html_path, "r")
newHtmlFile = open(new_html_path, "w+")
keyList = dataFile.readline().strip().split(sep=',')
registrantList = []
htmlListofRegistrants = []

htmlLines = hardcodeHtml.readlines()
hardcodeHtml.close()
css = htmlLines[12][0:33] + "./assets/css/nametags10.css\">\n" 
pageTop = htmlLines[17]
topRow = htmlLines[18]
row = htmlLines[32]
bottomRow = htmlLines[74]
rowEnd = htmlLines[31]
tag = htmlLines[19]
tagName = htmlLines[20][0:32]
tagPosition = htmlLines[21][0:36]
tagCompany = htmlLines[22][0:31]
tagLocation = htmlLines[23][0:36]
pEnd = "</p>"
tagEnd = htmlLines[24]
pageEnd = htmlLines[88]

class HtmlRegistrant:
   def __init__(self, firstname, lastname, position, company, city, state):
      self.firstname = firstname
      self.lastname = lastname
      self.position = position
      self.company = company
      self.city = city
      self.state = state

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

for registrant in registrantList:
   firstname = registrant['firstname']
   lastname = registrant['lastname']
   position = registrant['position']
   company = registrant['company']
   city = registrant['city']
   state = registrant['state']
   newHtmlregistrant = HtmlRegistrant(firstname, lastname, position, company, city, state)
   htmlListofRegistrants.append(newHtmlregistrant)

 
def createHtmlNameTags():
   rowCount = 1
   for i, registrant in enumerate(htmlListofRegistrants):
      if i % 2 == 0:
         typeOfRowInsert(rowCount)
         rowCount += 1
      insertRegistrant(i)

def typeOfRowInsert(count):
   if count == 1 or count % 5 == 1:
         insertPageTop()
         insertFirstRow()
   elif count % 5 != 0:
      insertRow()
   else:
      insertLastRow()
   


def insertPageTop():
   newHtmlFile.write(pageTop)

def insertFirstRow():
   newHtmlFile.write(topRow)

def insertRow():
   newHtmlFile.write(row)

def insertLastRow():
   newHtmlFile.write(bottomRow)


def insertRegistrant(index):
   name = htmlListofRegistrants[index].firstname + " " + htmlListofRegistrants[index].lastname + pEnd + "\n"
   position = htmlListofRegistrants[index].position + pEnd + "\n"
   company = htmlListofRegistrants[index].company + pEnd + "\n"
   location = htmlListofRegistrants[index].city + ", " + htmlListofRegistrants[index].state + pEnd + "\n"
   newHtmlFile.write(tag)
   newHtmlFile.write(tagName + name)
   newHtmlFile.write(tagPosition + position)
   newHtmlFile.write(tagCompany + company)
   newHtmlFile.write(tagLocation + location)
   newHtmlFile.write(tagEnd)
   if index % 2 != 0:
      newHtmlFile.write(rowEnd)
   if index % 10 == 9 and index > 0:
      newHtmlFile.write(pageEnd)


for line in range(0,12):
   newHtmlFile.write(htmlLines[line])
newHtmlFile.write(css)
for line in range(13,17):
   newHtmlFile.write(htmlLines[line])

createHtmlNameTags()