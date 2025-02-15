import os

# Get the directory of the current script
script_dir = os.path.dirname(__file__)
# Construct the full path to the files
csv_path = os.path.join(script_dir, "registrant_data.csv")
html_path = os.path.join(script_dir, "nametags10.html")
new_html_path = os.path.join(script_dir, "../..", "nametags10gen.html")

# Open new html file to write to
newHtmlFile = open(new_html_path, "w+")

# Initialize global variables before input files are read
registrantList = []
htmlListofRegistrants = []

# Try catch to open files to ensure they are locating valid files and displaying error if not
try:
   with open(csv_path, "r") as dataFile:
      # Reads first line containing key labels
      keyList = dataFile.readline().strip().split(sep=',')
      # Moves location to second line in data file
      next(dataFile)
      # Loops through the lines and splits the values into a value list and pairs them with key labels
      for line in dataFile:
         line = line.strip()
         valueList = line.split(sep=',')
         registrant = {}
         # Creates dictionary of key value pairs from split data and adds the dictionaries to a list
         for key, value in zip(keyList, valueList):
            registrant.update({key:value})
         registrantList.append(registrant)
      # Closes the file
      dataFile.close()
# Displays error if no file is found
except FileNotFoundError:
   print(f"Error: The file {os.path.basename(csv_path)} was not found")

try:
   with open(html_path, "r") as hardcodeHtml:
      # Passes all lines of html code into a list of html lines, keeping formmating
      htmlLines = hardcodeHtml.readlines()
      # Close html file
      hardcodeHtml.close()
# Displays error if no file is found
except FileNotFoundError:
   print(f"Error: The file {os.path.basename(html_path)} was not found")

# Initialize html variables to be used in output file
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

# Class to store registrant information
class HtmlRegistrant:
   def __init__(self, first_name, last_name, _position, _company, _city, _state):
      self.firstname = first_name
      self.lastname = last_name
      self.position = _position
      self.company = _company
      self.city = _city
      self.state = _state

# Function to create the necessary html code to display registrant information
def create_html_name_tags():
   row_count = 1
   for i, person in enumerate(htmlListofRegistrants):
      if i % 2 == 0:
         type_of_row_insert(row_count)
         row_count += 1
      insert_registrant(i)
   for lines in range(89,91):
      newHtmlFile.write(htmlLines[lines])
   newHtmlFile.close()

# Function to insert correct row type in html file
def type_of_row_insert(count):
   if count == 1 or count % 5 == 1:
         insert_page_top()
         insert_first_row()
   elif count % 5 != 0:
      insert_row()
   else:
      insert_last_row()

# Function to insert beginning of page in html code  
def insert_page_top():
   newHtmlFile.write(pageTop)

# Function to insert the beginning row of page in html code
def insert_first_row():
   newHtmlFile.write(topRow)

# Function to insert standard row of page in html code
def insert_row():
   newHtmlFile.write(row)

# Function to insert bottom row of page in html code
def insert_last_row():
   newHtmlFile.write(bottomRow)

# Function to insert registrant information into html file using html code
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

# Creates a list of Registrant objects containing necessary information for html file from list of dictionaries
for registrant in registrantList:
   firstname = registrant['firstname']
   lastname = registrant['lastname']
   position = registrant['position']
   company = registrant['company']
   city = registrant['city']
   state = registrant['state']
   newHtmlregistrant = HtmlRegistrant(firstname, lastname, position, company, city, state)
   htmlListofRegistrants.append(newHtmlregistrant)

# Writes the beginning of html file
for line in range(0,12):
   newHtmlFile.write(htmlLines[line])

# Inserts CSS stylesheet with location address to support new page
newHtmlFile.write(css)

# Inserts the rest of the beginning html code including head
for line in range(13,17):
   newHtmlFile.write(htmlLines[line])

# Calls function to insert html code with registrant information to create name tags
create_html_name_tags()