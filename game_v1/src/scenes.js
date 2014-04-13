// Game scene
// -------------
// Runs the core gameplay loop

var activeShip=undefined;
var score=undefined;
function updateScore(val){
    score.value += val;
    score.text('Capital: $' + (score.value/1000000.).toFixed(3)+'m');
    if(score.value<0){
	    alert('You have run out of money and will remain trapped on earth!');
	    location.reload();
    }
}

var dateDisplay=undefined;

Crafty.scene('Game', function() {

	console.log('running')
	// A 2D array to keep track of all occupied tiles
	Game.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		Game.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			Game.occupied[i][y] = false;
		}
	}
	
	score = Crafty.e("2D, DOM, Text")
		.attr({x: Crafty.viewport.width - 180, y: Crafty.viewport.height - 35, w: 200, h:50})
		.css({color: "#fff"});
	score.value=11000000;
	updateScore(0);

    dateDisplay = Crafty.e("2D, DOM, Text")
        .attr({x: Crafty.viewport.width - 180, y: 35, w: 200, h: 50})
        .css({color: "#fff"});
    dateDisplay.value=new Date();
    dateDisplay.text((dateDisplay.value.getMonth()+1) + '/' + dateDisplay.value.getDate() + '/' + dateDisplay.value.getFullYear());
	



	this.player = Crafty.e('Probe').at(38, 38);

	this.buyProbe = Crafty.e('BuyProbe').at(1,39);
	this.buyShip = Crafty.e('BuyShip').at(3,39);
	this.base = Crafty.e('BaseProngs').at(38,38);
	this.base = Crafty.e('Base').at(38,39);
	Game.occupied[this.player.at().x][this.player.at().y] = true;

	activeShip=this.player;
	this.probes=[];

	for (var i=0; i<Game.asteroids.length; i++) {
        addAsteroid(Game.asteroids[i]);
	}

    function addAsteroid(asteroid) {
        x=Math.floor( Math.random()*Game.map_grid.width );
		y=Game.map_grid.height - (Math.round( asteroid['earth_dist'] * 10.0 ) + 7);
		var ast = Crafty.e('Rock').at(x,y);
		ast.asteroid_data = asteroid;
		console.log('Placing asteroid ' + i + ' , ' + x + ' , ' + y);
		Game.occupied[x][y] = true;
    }

    function addSingleAsteroid(asteroid) {
        x=0;
		y=Game.map_grid.height - (Math.round( asteroid['earth_dist'] * 10.0 ) + 7);
		var ast = Crafty.e('Rock').at(x,y);
		ast.asteroid_data = asteroid;
		console.log('Placing asteroid ' + i + ' , ' + x + ' , ' + y);
		Game.occupied[x][y] = true;
    }

    Crafty.e('ISS').at(0, 37);

    Crafty.bind('KeyDown', function(e) {
        if(e.key == Crafty.keys.SPACE) {
            Game.paused = !Game.paused;
        }
    });

    Game.day = 0;

    this.bind('DayLoop', function() {
        Crafty.e("Delay").delay(function() {
          Crafty.trigger('IncrementDay', this);
        }, 100, -1);
    });

    this.bind('IncrementDay', function() {
        if (!Game.paused){
            Game.day += 1;
            dateDisplay.value.setTime(dateDisplay.value.getTime() + 86400000);
            dateDisplay.text((dateDisplay.value.getMonth()+1) + '/' + dateDisplay.value.getDate() + '/' + dateDisplay.value.getFullYear());
        }
        Crafty.trigger('DayLoop', this);
    });
    Crafty.trigger('DayLoop', this);
    

    Crafty.bind('CreateAsteroid', function() {
        url = 'http://localhost:8100/get_random_asteroids?limit=' + 10 + '&day=' + Game.day;

        $.ajax({
            url: url,
            success: function(data, status, jqXHR) {
                Game.asteroids=data.results;
                var asteroid = Game.asteroids[Math.floor(Math.random()*Game.asteroids.length)];
                addSingleAsteroid(asteroid);
            },
            dataType: 'json'
        });
    })

}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	//this.unbind('VillageVisited', this.show_victory);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, Text')
		.text('All asteroids mined!')
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
		'assets/16x16_forest_1.gif',
		'assets/16x16_forest_2.gif',
		//'assets/hunter.png',
		'assets/ship.png',
		'assets/base.png',
		'assets/probe.png',
		'assets/ISS.png',
		], function(){
		// Once the images are loaded...

		// Define the individual sprites in the image
		// Each one (spr_tree, etc.) becomes a component
		// These components' names are prefixed with "spr_"
		//  to remind us that they simply cause the entity
		//  to be drawn with a certain sprite
		Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
			spr_base:      [0, 0],
			spr_baseProngs:[0, 1],
			spr_2:         [1, 0],
			spr_3:         [1, 1]
		});
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

		Crafty.sprite(16, 'assets/iss.png', {
			spr_iss:  [0, 0],
		}, 0, 0);

		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	})
});
