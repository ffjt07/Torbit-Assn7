import os

# Get the directory of the current script
script_dir = os.path.dirname(__file__)
# Construct the full path to the CSV file
csv_path = os.path.join(script_dir, "registrant_data.csv")
html_path = os.path.join(script_dir, "nametags10.html")
new_html_path = os.path.join(script_dir, "..", "nametags10reg.html")

hardcodeHtml = open(html_path, "r")
newHtmlFile = open(new_html_path, "w+")
registrantList = []
htmlListofRegistrants = []
try:
   with open(csv_path, "r") as dataFile:
      keyList = dataFile.readline().strip().split(sep=',')
      next(dataFile)
      for line in dataFile:
         line = line.strip()
         valueList = line.split(sep=',')
         registrant = {}
         for key, value in zip(keyList, valueList):
            registrant.update({key:value})
         registrantList.append(registrant)
      dataFile.close()
except FileNotFoundError:
   print(f"Error: The file {os.path.basename(csv_path)} was not found")


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
   def __init__(self, first_name, last_name, _position, _company, _city, _state):
      self.firstname = first_name
      self.lastname = last_name
      self.position = _position
      self.company = _company
      self.city = _city
      self.state = _state

for registrant in registrantList:
   firstname = registrant['firstname']
   lastname = registrant['lastname']
   position = registrant['position']
   company = registrant['company']
   city = registrant['city']
   state = registrant['state']
   newHtmlregistrant = HtmlRegistrant(firstname, lastname, position, company, city, state)
   htmlListofRegistrants.append(newHtmlregistrant)

def create_html_name_tags():
   row_count = 1
   for i, person in enumerate(htmlListofRegistrants):
      if i % 2 == 0:
         type_of_row_insert(row_count)
         row_count += 1
      insert_registrant(i)
   for lines in range(89,91):
      newHtmlFile.write(htmlLines[lines])

def type_of_row_insert(count):
   if count == 1 or count % 5 == 1:
         insert_page_top()
         insert_first_row()
   elif count % 5 != 0:
      insert_row()
   else:
      insert_last_row()
   
def insert_page_top():
   newHtmlFile.write(pageTop)

def insert_first_row():
   newHtmlFile.write(topRow)

def insert_row():
   newHtmlFile.write(row)

def insert_last_row():
   newHtmlFile.write(bottomRow)


def insert_registrant(index):
   name = htmlListofRegistrants[index].firstname + " " + htmlListofRegistrants[index].lastname + pEnd + "\n"
   insert_position = htmlListofRegistrants[index].position + pEnd + "\n"
   insert_company = htmlListofRegistrants[index].company + pEnd + "\n"
   location = htmlListofRegistrants[index].city + ", " + htmlListofRegistrants[index].state + pEnd + "\n"
   newHtmlFile.write(tag)
   newHtmlFile.write(tagName + name)
   newHtmlFile.write(tagPosition + insert_position)
   newHtmlFile.write(tagCompany + insert_company)
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

create_html_name_tags()