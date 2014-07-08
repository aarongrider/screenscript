####################################################
#####  TCA XML Content Scaper
#####  Aaron Grider
#####  ++ This scraper is designed to parse the xml
#####  ++ files of each app to generate a text file
#####  ++ that can later be used to generate scree-
#####  ++ shot information.
####################################################

from xml.dom import minidom # Import XML parser
import urllib # Import URLlib (for downloading XML file)
import os # Ability to run terminal commands
import time # For sleep function

f = open('apps.txt', 'r')# Create info.txt file
text = f.read().splitlines()
f.close()

i = 2
textlen = len(text)

while i <= textlen:

	# Set file data variables
	APPID = text[i - 2]
	URL = text[i - 1]

	# Load xml file to temp folder
	print URL
	xml = urllib.URLopener()
	xml.retrieve(URL,"./temp/content.xml")

	xmldoc = minidom.parse('./temp/content.xml') # Set up file to parse

	# Download artwork
	content = xmldoc.getElementsByTagName('albumart')
	URL = content[0].firstChild.data.encode('utf8')
	print URL
	art = urllib.URLopener()
	art.retrieve(URL,"./temp/art.jpg")

	# Create info.txt file
	f = open('./temp/info.txt', 'w')

	# Set APPID
	print APPID
	f.write(APPID + "\n")

	# Get content title
	content = xmldoc.getElementsByTagName('title')
	title = content[1].firstChild.data.encode('utf8')
	print title
	f.write(title + "\n")

	# Get content subtitle
	content = xmldoc.getElementsByTagName('subtitle')
	try: 
		subtitle = content[0].firstChild.data.encode('utf8')
		print subtitle
		f.write(subtitle + "\n")
	except AttributeError:
		subtitle = "NA"
		f.write(subtitle + "\n")

	# Get row values
	content = xmldoc.getElementsByTagName('row')

	# Add first 3 rows to txt file
	for x in range(3): # Replace number with how many rows you wish to include in final mockup
		try:
			row = content[x].firstChild.data.encode('utf8')
			print row
			f.write(row + "\n")
		except AttributeError:
			row = ""
			f.write(row + "\n")

	f.close() # End writing to file

	# iOS 5' sub
	os.system("open -a /Applications/Adobe\ Photoshop\ CC\ 2014/Adobe\ Photoshop\ CC\ 2014.app template_ios_5.psd photoshop.jsx")

	# iOS 4.5'
	#os.system("open -a /Applications/Adobe\ Photoshop\ CC\ 2014/Adobe\ Photoshop\ CC\ 2014.app template_ios_5.psd photoshop_ios_5.jsx")

	# iOS iPad nonRetina
	#os.system("open -a /Applications/Adobe\ Photoshop\ CC\ 2014/Adobe\ Photoshop\ CC\ 2014.app template_ios_5.psd photoshop_ios_5.jsx")

	time.sleep(5)

	print "Finished building %d out of %d" % ((i / 2), (textlen / 2))

	i += 2

print "OPERATION FINISHED"