// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		})
	},

	// Locate this entity at the given position on the grid
	at: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
		} else {
			this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
			return this;
		}
	}
});


// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Solid, spr_tree');
	},
});

// A Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
	init: function() {
		this.requires('Actor, Solid, spr_bush');
	},
});

// A Bush is just an Actor with a certain sprite
Crafty.c('BuyProbe', {
	init: function() {
		this.requires('Actor, spr_buy_probe, Mouse');
		this.bind('Click', function(data) {
			activeShip.destroy();
			activeShip = Crafty.e('Probe').at(38, 39);
			score.value-=100000;
			score.text('Capital: $'+score.value);
		});
		this.bind('MouseOver', function(data) {
			console.log(this);
		});
	},
});
Crafty.c('BuyShip', {
	init: function() {
		this.requires('Actor, spr_buy_ship, Mouse');
		this.bind('Click', function(data) {
			activeShip.destroy();
			activeShip = Crafty.e('PlayerCharacter').at(38, 39);

			score.value-=300000;
			score.text('Capital: $'+score.value);
		});
		this.bind('MouseOver', function(data) {
			console.log(this);
		});
	},
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Rock', {
	init: function() {
		this.isprobed=false;
		this.requires('Actor, spr_rock, Mouse');

        var x_speed = Math.random()/-Math.log(Math.sqrt(Math.random())/10);

		this.bind('MouseOver', function(data) {
			$('#info_title').html('An Asteroid!');
			if(this.isprobed){
				$('#info_desc').html('$'+this.asteroid_data.price);
			}
			$('#info_box').show();
		} );
		this.bind('MouseOut', function(data) {
			$('#info_title').text('');
			$('#info_desc').text('');
			$('#info_box').hide();
		} );
        this.bind("EnterFrame", function(frame) {
            if (!Game.paused) this.move('e', x_speed);
        });

	},
	hit: function() {
		this.destroy();
	},
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
	init: function() {
		this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation, Mouse')
			.fourway(2)
			.stopOnSolids()
			.onHit('Rock',this.hitAsteroid)
			// These next lines define our four animations
			//  each call to .animate specifies:
			//  - the name of the animation
			//  - the x and y coordinates within the sprite
			//     map at which the animation set begins
			//  - the number of animation frames *in addition to* the first one
			.animate('PlayerMovingUp',    0, 0, 2)
			.animate('PlayerMovingRight', 0, 1, 2)
			.animate('PlayerMovingDown',  0, 2, 2)
			.animate('PlayerMovingLeft',  0, 3, 2);

		// Watch for a change of direction and switch animations accordingly
		var animation_speed = 4;
		this.bind('NewDirection', function(data) {
			if (data.x > 0) {
				this.animate('PlayerMovingRight', animation_speed, -1);
			} else if (data.x < 0) {
				this.animate('PlayerMovingLeft', animation_speed, -1);
			} else if (data.y > 0) {
				this.animate('PlayerMovingDown', animation_speed, -1);
			} else if (data.y < 0) {
				this.animate('PlayerMovingUp', animation_speed, -1);
			} else {
				this.stop();
			}
		});
		this.bind('MouseOver', function(data) { console.log('Hey!' + data); } );
		this.bind('Click',function(data){console.log(this);})
	},

	// Registers a stop-movement function to be called when
	//  this entity hits an entity with the "Solid" component
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);

		return this;
	},

	// Stops the movement
	stopMovement: function() {
		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},

	// Respond to this player visiting a village
	visitVillage: function(data) {
		villlage = data[0].obj;
		villlage.visit();
	},
	hitAsteroid: function(data) {
		this.stopMovement();
		console.log('hitting asteroid.');
		asteroid = data[0].obj;
		ast_price = asteroid.price;
		console.log('hitAsteroid: ' + ast_price);
		asteroid.hit();
	}
});

// This is the player-controlled character
Crafty.c('Probe', {
	init: function() {
		this.requires('Actor, Fourway, Collision, spr_probe, SpriteAnimation, Mouse')
			.fourway(2)
			.stopOnSolids()
			.onHit('Rock',this.hitAsteroid)
			// These next lines define our four animations
			//  each call to .animate specifies:
			//  - the name of the animation
			//  - the x and y coordinates within the sprite
			//     map at which the animation set begins
			//  - the number of animation frames *in addition to* the first one
			.animate('PlayerMovingUp',    0, 0, 2)
			.animate('PlayerMovingRight', 0, 0, 2)
			.animate('PlayerMovingDown',  0, 0, 2)
			.animate('PlayerMovingLeft',  0, 0, 2);

		// Watch for a change of direction and switch animations accordingly
		var animation_speed = 4;
		this.bind('NewDirection', function(data) {
			if (data.x > 0) {
				this.animate('PlayerMovingRight', animation_speed, -1);
			} else if (data.x < 0) {
				this.animate('PlayerMovingLeft', animation_speed, -1);
			} else if (data.y > 0) {
				this.animate('PlayerMovingDown', animation_speed, -1);
			} else if (data.y < 0) {
				this.animate('PlayerMovingUp', animation_speed, -1);
			} else {
				this.stop();
			}
		});
		this.bind('MouseOver', function(data) { console.log('Hey!' + data); } );
		this.bind('Click',function(data){console.log(this);})
	},

	// Registers a stop-movement function to be called when
	//  this entity hits an entity with the "Solid" component
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);

		return this;
	},

	// Stops the movement
	stopMovement: function() {
		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},

	// Respond to this player visiting a village
	/*visitVillage: function(data) {
		villlage = data[0].obj;
		villlage.visit();
	},*/
	hitAsteroid: function(data) {
		asteroid = data[0].obj;
		asteroid.isprobed=true;
		asteroid.sprite(0,1);
		this.destroy();
	}
});

// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
	init: function() {
		this.requires('Actor, spr_village');
	},

	// Process a visitation with this village
	visit: function() {
		this.destroy();
		Crafty.audio.play('knock');
		Crafty.trigger('VillageVisited', this);
	}
});
