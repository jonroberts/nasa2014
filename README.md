Space Rocks!
========

This is the repository for Space Rocks!, an entry to the Space Apps Challenge 2014. A live version of the project can be seen at [http://www.spacerocksgame.org](http://www.spacerocksgame.org)

The code for the game is in ./game_v1/

The code for the API is in ./astro_api/

Description of the API Endpoint

The Space Rocks! API allows user to query for asteroids in a subset of the JPL Small Bodies Database. The asteroids made available through the API are all those that have a known spectral type. In addition to the properties provided by the SBDB, it also adds the total value and value per kg calculated by the Asterank library, and the distance and delta-v from Earth on a given day.

The endpoint of the API is http://server.spacerocksgame.org/get_asteroids_by_type and takes the following query parameters:

"limit": The number of asteroids to return

"day": The offset, relative to the current day, to calculate the distance and delta-v to Earth

"min_dist": A minimum distance to Earth cut (AU)

"max_dist": A maximum distance to Earth cut (AU)

"none": Fraction of asteroids to return which have no valuable resources

"water": Fraction of asteroids to return which have water

"metals": Fraction of asteroids to return which have metals

"hydrogen": Fraction of asteroids to return which have hydrogen

"platinum": Fraction of asteroids to return which have platinum


An example query: [http://server.spacerocksgame.org/get_asteroids_by_type?limit=10&day=0&min_dist=0.5&max_dist=3.0&none=0.09&water=0.3&metals=0.3&hydrogen=0.3&platinum=0.01](http://server.spacerocksgame.org/get_asteroids_by_type?limit=10&day=0&min_dist=0.5&max_dist=3.0&none=0.09&water=0.3&metals=0.3&hydrogen=0.3&platinum=0.01)

