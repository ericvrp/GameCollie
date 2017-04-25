# GameCollie
GameCollie keeps track of all your game collection needs

with yarn:
	yarn		# to install
	yarn start	# to run

with npm:
	npm install	# to install
	npm start	# to run

notes:
	- the scraper from https://github.com/sselph/scraper/releases generates gamelist.xml files in the desired format.
	- https://github.com/sselph/scraper/wiki/Supported-Platforms
	- per platform folder run:
		scraper -thumb_only -append -add_not_found -workers 10
