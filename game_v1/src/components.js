// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
    init: function () {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        })
    },

    // Locate this entity at the given position on the grid
    at: function (x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x / Game.map_grid.tile.width, y: this.y / Game.map_grid.tile.height }
        } else {
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
            return this;
        }
    }
});


// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
    init: function () {
        this.requires('2D, Canvas, Grid');
    }
});
Crafty.c('Base', {
    init: function () {
        this.requires('Actor, Solid, spr_base');
    }
});
Crafty.c('BaseProngs', {
    init: function () {
        this.requires('Actor, spr_baseProngs');
    }
});
//Crafty.c('BuyProbe', {
//    init: function () {
//        this.requires('Actor, spr_buy_probe, Mouse');
//        this.bind('Click', function (data) {
//            activeShip.destroy();
//            activeShip = Crafty.e('Probe').at(38, 38);
//            score.value -= 100000;
//            score.text('Capital: $' + score.value);
//        });
//        this.bind('MouseOver', function (data) {
//            console.log(this);
//        });
//    }
//});
Crafty.c('BuyProbe', {
    init: function () {
        this.requires('Actor, spr_buy_probe, Mouse, HTML');

        var info_box = Crafty.e("2D, DOM, Text")
            .text('Buy Probe ($100000)')
            .css({
                'background': '-moz-linear-gradient(center top , #B6B4E6 0%, #1790ED 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'border': '1px solid #CCCCCC',
                'border-radius': '15px',
                'box-shadow': '0 1px 2px #FFFFFF, 0 -1px 1px #666666, 0 -1px 1px rgba(0, 0, 0, 0.5) inset, 0 1px 1px rgba(255, 255, 255, 0.8) inset',
                'font-size': '12px',
                'margin': '0 15px',
                'padding': '5px 20px',
                'text-shadow': '0 1px 2px #111111',
                'width': '75px',
                'alpha': 0.8,
                'display': 'none'
            });

//        this.replace('<div class="buy_button">Buy Probe ($100000)</div>');
        this.bind('Click', function (data) {
            activeShip.destroy();
            activeShip = Crafty.e('Probe').at(38, 38);

            score.value -= 100000;
            score.text('Capital: $' + score.value);
        });
        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;
            this.attach(info_box);
            info_box.css({ display: 'block' });

            console.log(this);
        });
        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });
    }
});
Crafty.c('BuyShip', {
    init: function () {
        this.requires('Actor, spr_buy_ship, Mouse, HTML');

        var info_box = Crafty.e("2D, DOM, Text")
            .text('Buy Ship ($300000)')
            .css({
                'background': '-moz-linear-gradient(center top , #B6B4E6 0%, #1790ED 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'border': '1px solid #CCCCCC',
                'border-radius': '15px',
                'box-shadow': '0 1px 2px #FFFFFF, 0 -1px 1px #666666, 0 -1px 1px rgba(0, 0, 0, 0.5) inset, 0 1px 1px rgba(255, 255, 255, 0.8) inset',
                'font-size': '12px',
                'margin': '0 15px',
                'padding': '5px 20px',
                'text-shadow': '0 1px 2px #111111',
                'width': '75px',
                'alpha': 0.8,
                'display': 'none'
            });

//        this.replace('<div class="buy_button">Buy Ship ($300000)</div>');
        this.bind('Click', function (data) {
            activeShip.destroy();
			activeShip = Crafty.e('Ship').at(38, 38);
            score.value -= 300000;
            score.text('Capital: $' + score.value);
        });
        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;
            this.attach(info_box);
            info_box.css({ display: 'block' });

            console.log(this);
        });
        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });
    }
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Rock', {
    init: function () {
        this.isprobed = false;
        this.requires('Actor, spr_rock, Mouse');

        var x_speed = Math.random() / -Math.log(Math.sqrt(Math.random()) / 10);

        var info_box = Crafty.e("2D, DOM, Text")
            .text('An Asteroid!')
            .css({
                color: '#111',
                textShadow: '0 -1px 1px #666',
                'background-color': '#999',
                width: 175,
                'border-radius': '5px',
                padding: '7px 10px',
                border: '1px solid AAA',
                'box-shadow': '0 -1px 1px #666',
                display: 'none'
            });

        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;

            if (this.isprobed) {
                info_box.text('Asteroid ' + this.asteroid_data.prov_des + ': $' + this.asteroid_data.price);
            } else {
                info_box.text('Asteroid ' + this.asteroid_data.prov_des);
                this.isprobed = true;
            }
            this.attach(info_box);
            info_box.css({ display: 'block' });
            console.log(info_box);
        });
        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });
        this.bind("EnterFrame", function (frame) {
            if (!Game.paused) {
                this.move('e', x_speed);
                if (this._x >= (Game.map_grid.width*Game.map_grid.tile.width)) {
                    this.destroy();
                    Crafty.trigger('CreateAsteroid', this);
                }
            }
        });

        this.bind("Click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.open('http://www.minorplanetcenter.net/db_search_alt/show_object?utf8=%E2%9C%93&object_id=' + this.asteroid_data.prov_des,'_blank')
        })

    },
    hit: function () {
        this.destroy();
    }
});
Crafty.c('ISS', {
    init: function () {
        this.requires('Actor, spr_iss, Mouse');

        var x_speed = Math.random() / -Math.log(Math.sqrt(Math.random()) / 10);

        var info_box = Crafty.e("2D, DOM, Text")
            .text('The ISS')
            .css({
                color: '#111',
                textShadow: '0 -1px 1px #666',
                'background-color': '#999',
                width: 175,
                'border-radius': '5px',
                padding: '7px 10px',
                border: '1px solid AAA',
                'box-shadow': '0 -1px 1px #666',
                display: 'none'
            });

        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;

            if (this.isprobed) {
                info_box.text('The ISS');
            }
            this.attach(info_box);
            info_box.css({ display: 'block' });
        });
        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });
		// needs to be set for the ISS
        this.bind("EnterFrame", function (frame) {
            if (!Game.paused) {
                this.move('e', x_speed);
                if (this._x >= (Game.map_grid.width*Game.map_grid.tile.width)) {
                    this.destroy();
                    Crafty.trigger('CreateAsteroid', this);
                }
            }
        });


    }
});
function updateScore(val){
    score.value += val;
    score.text('Capital: $' + (score.value/1000000.).toFixed(3)+'m');
    if(score.value<0){
	    alert('You have run out of money and will remain trapped on earth!');
	    location.reload();
    }
}

// This is the player-controlled character
Crafty.c('Ship', {
    init: function () {
        this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation, Mouse')
            .fourway(2)
            .stopOnSolids()
            .onHit('Rock', this.hitAsteroid)
            .onHit('BaseProngs', this.hitDock)
            // These next lines define our four animations
            //  each call to .animate specifies:
            //  - the name of the animation
            //  - the x and y coordinates within the sprite
            //     map at which the animation set begins
            //  - the number of animation frames *in addition to* the first one
            .animate('PlayerMovingUp', 0, 0, 2)
            .animate('PlayerMovingRight', 0, 1, 2)
            .animate('PlayerMovingDown', 0, 2, 2)
            .animate('PlayerMovingLeft', 0, 3, 2);

        // Watch for a change of direction and switch animations accordingly
        var animation_speed = 4;
        this.bind('NewDirection', function (data) {
            if (!Game.paused) {
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
            }
        });
        this.bind('Moved', function () {
			updateScore(-100);
        });
        this.bind('MouseOver', function (data) {
            console.log('Hey!' + data);
        });
        this.bind('Click', function (data) {
            console.log(this);
        });

        this.cargo = 0;
    },

    // Registers a stop-movement function to be called when
    //  this entity hits an entity with the "Solid" component
    stopOnSolids: function () {
        this.onHit('Solid', this.stopMovement);
        return this;
    },

    // Stops the movement
    stopMovement: function () {
        this._speed = 0;
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
    },

    // Respond to this player visiting a village
    visitVillage: function (data) {
        villlage = data[0].obj;
        villlage.visit();
    },
    hitAsteroid: function (data) {
        this.stopMovement();
        asteroid = data[0].obj;
        ast_price = asteroid.price;
        this.cargo += +1000000;
        asteroid.hit();
    },
    hitDock: function (data) {
        dock = data[0].obj;
		updateScore(this.cargo);
        this.cargo = 0;
    }
});

// This is the player-controlled character
Crafty.c('Probe', {
    init: function () {
        this.requires('Actor, Fourway, Collision, spr_probe, SpriteAnimation, Mouse')
            .fourway(2)
            .stopOnSolids()
            .onHit('Rock', this.hitAsteroid)
            // These next lines define our four animations
            //  each call to .animate specifies:
            //  - the name of the animation
            //  - the x and y coordinates within the sprite
            //     map at which the animation set begins
            //  - the number of animation frames *in addition to* the first one
            .animate('PlayerMovingUp', 0, 0, 2)
            .animate('PlayerMovingRight', 0, 0, 2)
            .animate('PlayerMovingDown', 0, 0, 2)
            .animate('PlayerMovingLeft', 0, 0, 2);

        // Watch for a change of direction and switch animations accordingly
        var animation_speed = 4;
        this.bind('NewDirection', function (data) {
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
        this.bind('Moved', function () {
			updateScore(-50);
        })

        this.bind('MouseOver', function (data) {
            console.log('Hey!' + data);
        });
        this.bind('Click', function (data) {
            console.log(this);
        })
    },

    // Registers a stop-movement function to be called when
    //  this entity hits an entity with the "Solid" component
    stopOnSolids: function () {
        this.onHit('Solid', this.stopMovement);

        return this;
    },

    // Stops the movement
    stopMovement: function () {
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
    hitAsteroid: function (data) {
        asteroid = data[0].obj;
        asteroid.isprobed = true;
        asteroid.sprite(0, 1);
        this.destroy();
    }
});

// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
    init: function () {
        this.requires('Actor, spr_village');
    },

    // Process a visitation with this village
    visit: function () {
        this.destroy();
        Crafty.audio.play('knock');
        Crafty.trigger('VillageVisited', this);
    }
});
