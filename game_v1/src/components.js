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
        this.replace('<div class="buy_button">Buy Probe ($100000)</div>');
        this.bind('Click', function (data) {
            activeShip.destroy();
            activeShip = Crafty.e('Probe').at(38, 38);

            score.value -= 100000;
            score.text('Capital: $' + score.value);
        });
        this.bind('MouseOver', function (data) {
            console.log(this);
        });
    }
});
Crafty.c('BuyShip', {
    init: function () {
        this.requires('Actor, spr_buy_ship, Mouse, HTML');
        this.replace('<div class="buy_button">Buy Ship ($300000)</div>');
        this.bind('Click', function (data) {
            activeShip.destroy();
            activeShip = Crafty.e('PlayerCharacter').at(38, 38);

            score.value -= 300000;
            score.text('Capital: $' + score.value);
        });
        this.bind('MouseOver', function (data) {
            console.log(this);
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
                info_box.text('An Asteroid! $' + this.asteroid_data.price);
            } else {
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
//                console.log('current x: ' + this._x + ', map width: ' + Game.map_grid.tile.width);
//                if (this._x >= Game.map_grid.tile.width) {
//                    console.log('Out of frame');
//                    this.destroy();
//                    Crafty.trigger('CreateAsteroid', this);
//                } else {
//                    console.log('current x: ' + this._x + ', map width: ' + Game.map_grid.tile.width);
//                }
            }
        });

    },
    hit: function () {
        this.destroy();
    }
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
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
            score.value -= 100;
            score.text('Capital: $' + score.value);
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
        console.log('hitting asteroid.');
        asteroid = data[0].obj;
        ast_price = asteroid.price;
        console.log(this.cargo);
        console.log(ast_price);
        this.cargo += +1000000;
        console.log(this.cargo);
        asteroid.hit();
    },
    hitDock: function (data) {
        dock = data[0].obj;
        score.value += this.cargo;
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
            score.value -= 50;
            score.text('Capital: $' + score.value);
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
