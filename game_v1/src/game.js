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

    paused: false,
    starting_money: 15000000,
    asteroids: undefined,
    framerate_ms: 100,
    day: 0,

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

//    relative_width: function() {
//        return this.width() + (Crafty.viewport.width/2);
//    },

	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working

        if (window.innerWidth < this.width()) {
            Crafty.init(Crafty.DOM.window.width, Crafty.DOM.window.height);
        } else {
            Crafty.init(this.width(),this.height());
        }
//        Crafty.canvas.init();

        // Simply start the "Loading" scene to get things going
		Crafty.scene('Loading');
	}
};

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }