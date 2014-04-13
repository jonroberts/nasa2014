// Game scene
// -------------
// Runs the core gameplay loop

var activeShip=undefined;
var score=undefined;

Crafty.scene('Game', function() {

	console.log('running')
	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}
	
	score = Crafty.e("2D, DOM, Text")
		.text("Capital: $1000000")
		.attr({x: Crafty.viewport.width - 180, y: Crafty.viewport.height - 20, w: 200, h:50})
		.css({color: "#fff"});
	score.value=1000000;

	this.player = Crafty.e('Probe').at(38, 39);

	this.buyProbe = Crafty.e('BuyProbe').at(1,39);
	this.buyShip = Crafty.e('BuyShip').at(2,39);
	this.occupied[this.player.at().x][this.player.at().y] = true;

	activeShip=this.player;
	this.probes=[];

	// Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if(y>32){continue;}
			if (Math.random() < 0.01 && !this.occupied[x][y]) {
				// Place a bush entity at the current tile
				//var bush_or_rock = (Math.random() > 0.3) ? 'Bush' : 'Rock'
				var asteroid = 'Rock';
				var ast = Crafty.e(asteroid).at(x, y);
 				ast.asteroid_data = { 'price': y, 'earth_height': y, 'spectral_type': 'A', 'delta_v': x };
 				ast.bind('Click',function(){console.log('clicked');alert('clicked!');})

				//ast.bind('Click',function(){console.log('clicked');alert('clicked!');})
				
				
				this.occupied[x][y] = true;
			}
		}
	}

//    this.pause_scene = Crafty.bind('Space', function() {
//        Game.paused = !Game.paused;
//	});

    Crafty.bind('KeyDown', function(e) {
        if(e.key == Crafty.keys.SPACE) {
            Game.paused = !Game.paused;
        }
    });

	// Generate five villages on the map in random locations
	/*var max_villages = 5;
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.03) {
				if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
					Crafty.e('Village').at(x, y);
				}
			}
		}
	}*/

	// Play a ringing sound to indicate the start of the journey
	//Crafty.audio.play('ring');

	// Show the victory screen once all villages are visisted
	this.show_victory = this.bind('VillageVisited', function() {
		if (!Crafty('Village').length) {
			Crafty.scene('Victory');
		}
	});
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('VillageVisited', this.show_victory);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, Text')
		.text('All villages visited!')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.css($text_css);

	// Give'em a round of applause!
	Crafty.audio.play('applause');

	// After a short delay, watch for the player to press a key, then restart
	// the game when a key is pressed
	var delay = true;
	setTimeout(function() { delay = false; }, 5000);
	this.restart_game = Crafty.bind('KeyDown', function() {
		if (!delay) {
			Crafty.scene('Game');
		}
	});
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading; please wait...')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.css($text_css);

	// Load our sprite map image
	Crafty.load([
		'assets/16x16_forest_2.gif',
		//'assets/hunter.png',
		'assets/ship.png',
		'assets/probe.png',
		'assets/door_knock_3x.mp3',
		'assets/door_knock_3x.ogg',
		'assets/door_knock_3x.aac',
		'assets/board_room_applause.mp3',
		'assets/board_room_applause.ogg',
		'assets/board_room_applause.aac',
		'assets/candy_dish_lid.mp3',
		'assets/candy_dish_lid.ogg',
		'assets/candy_dish_lid.aac'
		], function(){
		// Once the images are loaded...

		// Define the individual sprites in the image
		// Each one (spr_tree, etc.) becomes a component
		// These components' names are prefixed with "spr_"
		//  to remind us that they simply cause the entity
		//  to be drawn with a certain sprite
		Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
			spr_buy_probe:[1, 0],
			spr_buy_ship: [0, 0],
			spr_visited:  [0, 1],
			spr_rock:     [1, 1]
		});

		// Define the PC's sprite to be the first sprite in the third row of the
		//  animation sprite map
		Crafty.sprite(16, 'assets/ship.png', {
			spr_player:  [0, 0],
		}, 0, 2);

		Crafty.sprite(16, 'assets/probe.png', {
			spr_probe:  [0, 0],
		}, 0, 0);

		// Define our sounds for later use
		Crafty.audio.add({
			knock: 	  ['assets/door_knock_3x.mp3', 'assets/door_knock_3x.ogg', 'assets/door_knock_3x.aac'],
			applause: ['assets/board_room_applause.mp3', 'assets/board_room_applause.ogg', 'assets/board_room_applause.aac'],
			ring:     ['assets/candy_dish_lid.mp3', 'assets/candy_dish_lid.ogg', 'assets/candy_dish_lid.aac']
		});

		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	})
});
