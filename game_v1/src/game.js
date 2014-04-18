Game = {

	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:  76,
		height: 41,
		tile: {
			width:  16,
			height: 16
		}
	},

    debug: false,

    // show thrusters from ship engines
    showThrusters: true,

    // whether to scale asteroids according to diameter data
    scaleAsteroids: true,
    scaleAsteroidFactor: 0.2,

    paused: false,
    starting_money: 15000000,
    asteroids: undefined,
    framerate_ms: 100,
    day: 0,

    // url of the asteroid server
    server_url: 'http://localhost:8100/get_random_asteroids',
//    server_url: 'http://server.spacerocksgame.org/get_random_asteroids',

    // effects of research
    research: {
        mining_efficiency: {
            water: .01
        }
    },

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},

	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},

	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working

        if (window.innerWidth < this.width()) {
            Crafty.init(Crafty.DOM.window.width, Crafty.DOM.window.height);
        } else {
            Crafty.init(this.width(),this.height());
        }
        Crafty.canvas.init();

        // Simply start the "Loading" scene to get things going
		Crafty.scene('Loading');
	}
};

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' };