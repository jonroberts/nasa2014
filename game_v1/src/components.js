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

Crafty.c('HRefinery', {
    init: function () {
        this.requires('Actor, spr_h_refinery');
    }
});

Crafty.c('GasStation', {
    init: function () {
        this.requires('Actor, spr_gas_station');
    }
});


var testGlobal = undefined;

// A Rock is just an Actor with a certain sprite
Crafty.c('Rock', {
    init: function () {
        this.requires('Actor, spr_rock, Mouse')
            .origin('center')
            .attr({ isprobed: false });


//        this.gravity("platform")
//            .gravityConst(2);

        var info_box = Crafty.e("2D, DOM, Text")
            .attr({w: 200, alpha: 0.8, visible: false})
            .text('An Asteroid!')
            .css({
                'background': '-moz-linear-gradient(center top , #999 0%, #666 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                color: '#111',
                textShadow: '0 -1px 1px #666',
                'border-radius': '5px',
                'box-shadow': '0 1px 1px rgba(255, 255, 255, 0.8), 0 0 0 #666666, 0 1px 0 rgba(0, 0, 0, 0.5) inset, 0 0 0 rgba(255, 255, 255, 0.75) inset',
                padding: '7px 10px',
                border: '1px solid #AAA',
                display: 'block'
            });
//        info_box.visible = false;

        this.bind('MouseOver', function (data) {
            info_box.text(asteroidInfoHtml(this.asteroid_data, this.isprobed));

            var jqInfoBox = $('#' + info_box.getDomId());
            info_box.dom_height = jqInfoBox.height();

            if (this._x >= Game.width() - 250) {
                info_box.x = this._x - 225;
            } else {
                info_box.x = this._x + 25;
            }

            if (this._y >= Game.height() / 2) {
                info_box.y = this._y - info_box.dom_height;
            } else {
                info_box.y = this._y + 5;
            }

            jqInfoBox.css('height', 'inherit');
            this.attach(info_box);
            info_box.visible = true;

            testGlobal = info_box;
        });
        this.bind('MouseOut', function (data) {
            info_box.visible = false;
        });
        this.bind("EnterFrame", function (frame) {
            if (!Game.paused) {
                this.x += this.x_speed;
                this.rotation += this.rotation_rate;

                info_box.rotation = 0;
                if (this._x >= (Game.width()) - 250) {
                    info_box.x = this._x - 225;
                } else {
                    info_box.x = this._x + 25;
                }

                if (this._y >= Game.height() / 2) {
                    if (info_box.dom_height) {
                        info_box.y = this._y - info_box.dom_height;
                    } else {
                        info_box.y = this._y - $('#' + info_box.getDomId()).height()
                    }

                } else {
                    info_box.y = this._y + 5;
                }

                if (this._x >= Game.width()) {
                    this.destroy();
                    Crafty.trigger('CreateAsteroid', this);
                }
            }
        });

        this.bind("Click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.open('http://www.minorplanetcenter.net/db_search_alt/show_object?utf8=%E2%9C%93&object_id=' + this.asteroid_data.prov_des, '_blank')
        });


    },

    hit: function () {
        this.destroy();
    },

    hitShip: function (data) {
        if (data[0] == activeShip) {
            activeShip.destroy();
            activeShip = undefined;
        }
    }
});

Crafty.c('ISS', {
    init: function () {
        this.requires('Actor, Collision, spr_iss, Mouse')
            .attr({x_speed: 2.5 * Math.random() / -Math.log(Math.sqrt(Math.random()) / 10)})
            .onHit('GasStation', function (data) {
                if (gasStation.fueled) {
                    updateScore(5000);
                }
            });

        var info_box = Crafty.e("2D, DOM, Text")
            .attr({w: 75, alpha: 0.8})
            .text('The ISS')
            .css({
                'background': '-moz-linear-gradient(center top , #999 0%, #666 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                color: '#111',
                textShadow: '0 -1px 1px #666',
                'border-radius': '5px',
                'box-shadow': '0 1px 1px rgba(255, 255, 255, 0.8), 0 0 0 #666666, 0 1px 0 rgba(0, 0, 0, 0.5) inset, 0 0 0 rgba(255, 255, 255, 0.75) inset',
                padding: '10px',
                border: '1px solid #AAA',
                display: 'none'
            });

        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;
            $('#' + info_box.getDomId()).css('height', 'inherit');
            this.attach(info_box);
            info_box.css({ display: 'block' });
        });

        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });

        // needs to be set for the ISS
        this.bind("EnterFrame", function (frame) {
            if (!Game.paused) {
                this.move('e', this.x_speed);
                if (this._x >= Game.width()) {
                    this.x = -1;
                }
            }
        });
    }
});

//Crafty.c('TechTree', {
//    init: function() {
//        this.requires('2D, Mouse, HTML, DOM')
//            .css({display: 'none'});
//    }
//});


// This is the player-controlled character
Crafty.c('Ship', {
    init: function () {
        var classes = 'Actor, Controls, Collision, spr_player, SpriteAnimation, Mouse';
        if (Game.debug) {
            classes += ', DebugCanvas, VisibleMBR';
        }

        this.requires(classes)
            .attr({
                move: {left: false, right: false, up: false, down: false},
                xspeed: 0, yspeed: 0, speed: 0,
                decay: 0.95, // deceleration when keys are released
                speed_factor: 0.04, // acceleration of the ship
                cargo: 0,
                fuel: 1000,
                thrusters: null
            })
            .origin("center")
            .bind("KeyDown", function (e) {
                //on keydown, set the move booleans
                if (e.key === Crafty.keys.RIGHT_ARROW) {
                    this.move.right = true;
                } else if (e.key === Crafty.keys.LEFT_ARROW) {
                    this.move.left = true;
                } else if (e.key === Crafty.keys.UP_ARROW) {
                    this.move.up = true;
                }
            }).bind("KeyUp", function (e) {
                //on key up, set the move booleans to false
                if (e.key === Crafty.keys.RIGHT_ARROW) {
                    this.move.right = false;
                } else if (e.key === Crafty.keys.LEFT_ARROW) {
                    this.move.left = false;
                } else if (e.key === Crafty.keys.UP_ARROW) {
                    this.move.up = false;
                }
            }).bind("EnterFrame", function () {
                if (!Game.paused) {
                    if (this.move.right) this.rotation += 5;
                    if (this.move.left) this.rotation -= 5;

                    //acceleration and movement vector
                    var vx = Math.sin(this._rotation * Math.PI / 180) * this.speed_factor,
                        vy = Math.cos(this._rotation * Math.PI / 180) * this.speed_factor;

                    //if the move up is true, increment the y/xspeeds
                    if (this.move.up) {
                        this.yspeed -= vy;
                        this.xspeed += vx;

                        if (!this.thrusters) {
                            var thruster1 = Crafty.e('Thruster');
                            thruster1.rotate({
                                cos: 1 - Math.cos(this.rotation * Math.PI / 180),
                                sin: 1 - Math.sin(this.rotation * Math.PI / 180),
                                o: {
                                    x: this._origin.x,
                                    y: this._origin.y
                                }
                            });
                            thruster1._globalZ = this._globalZ - 1;
                            thruster1.shift(this._x, this._y);
                            thruster1.start(this.rotation);

                            var thruster2 = Crafty.e('Thruster');
                            thruster2.rotate({
                                cos: -Math.cos(this.rotation * Math.PI / 180),
                                sin: -Math.sin(this.rotation * Math.PI / 180),
                                o: {
                                    x: this._origin.x,
                                    y: this._origin.y
                                }
                            });
                            thruster2._globalZ = this._globalZ - 1;
                            thruster2.shift(this._x, this._y);
                            thruster2.start(this.rotation);

                            this.thrusters = [thruster1, thruster2];
                            this.attach(this.thrusters[0], this.thrusters[1]);

//                            this.bind("Rotate", function(data) {
//                                if (this.thrusters) {
//                                    this.thrusters.updateRotation(data);
//                                }
//                            });
                        }
                    } else {
                        if (this.thrusters) {
                            this.thrusters[0].destroy();
                            this.thrusters[1].destroy();
                            this.thrusters = null;
                        }

                        //if released, slow down the ship
                        this.xspeed *= this.decay;
                        this.yspeed *= this.decay;
                    }

                    //move the ship by the x and y speeds or movement vector
                    this.x += this.xspeed;
                    this.y += this.yspeed;

                    if (this._x > Crafty.viewport.width || this._y > Crafty.viewport.height ||
                        this._x < -64 || this._y < -64) {
                        this.destroy()
                    }
                }

            })
            .bind('Moved', function () {
                updateScore(-100);
                this.fuel -= 10;
            })
            .bind('Click', function (data) {
                console.log(this);
            })
            .collision()
            .onHit('Rock', function (data) {
                // Respond to this ship hitting an asteroid
                this.stopMovement();
                var asteroid = data[0].obj;

                // resources extracted according to researched efficiency
                this.cargo += +(asteroid.price * Game.research.mining_efficiency.water);
                asteroid.hit();
            })
            .onHit('BaseProngs', function (data) {
                updateScore(this.cargo / 2.);
                this.cargo = 0;
            })
            .onHit('HRefinery', function (data) {
                updateScore(this.cargo);
                gasStation.fueled = true;
                this.cargo = 0;
            })
            .onHit('GasStation', function (data) {
                if (gasStation.fueled) {
                    // refuel, but don't change the gas station's status
                    updateScore(this.fuel - 1000);
                    this.fuel = 1000;
                }
            });

        if (Game.debug) {
            this.debugAlpha(0.2);
        }
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
    }
});

Crafty.c('Thruster', {
    init: function () {
        this.requires("2D, Canvas, Particles")
            .attr({
                alpha: 0.8,
                particleDefaults: {
                    maxParticles: 15,
                    size: 2,
                    sizeRandom: 1,
                    speed: 1,
                    speedRandom: 1.2,
                    lifeSpan: 5,
                    lifeSpanRandom: 2,
                    angle: 0,
                    angleRandom: 2,
                    startColour: [255, 131, 0, 1],
                    startColourRandom: [48, 50, 45, 0],
                    endColour: [245, 35, 0, 0],
                    endColourRandom: [60, 60, 60, 0],
                    sharpness: 5,
                    sharpnessRandom: 2,
                    spread: 0,
                    duration: -1,
                    fastMode: true,
                    gravity: { x: 0, y: 0.1 },
                    jitter: 0
                }});
    },

    start: function (rotation) {
        particleParams = this.particleDefaults;
        particleParams.angle = 180 - rotation;
        this.particles(particleParams);
    },

    updateRotation: function (data) {
        this._Particles.angle -= data['deg'];
    }
});


// This is the player-controlled character
Crafty.c('Probe', {
    init: function () {
        this.requires('Actor, Controls, Collision, spr_probe, SpriteAnimation, Mouse')
            .attr({
                move: {left: false, right: false, up: false, down: false},
                xspeed: 0, yspeed: 0, speed: 0,
                decay: 0.92, // deceleration rate
                speed_factor: 1.5, // the acceleration rate
                max_speed: 1.2
            })
            .origin("center")
            .bind("KeyDown", function (e) {
                //on keydown, set the move booleans
                if (e.key === Crafty.keys.RIGHT_ARROW) {
                    if (this.move.left) this.move.left = false;
                    this.move.right = true;
                } else if (e.key === Crafty.keys.LEFT_ARROW) {
                    if (this.move.right) this.move.left = false;
                    this.move.left = true;
                } else if (e.key === Crafty.keys.UP_ARROW) {
                    if (this.move.down) this.move.left = false;
                    this.move.up = true;
                } else if (e.key === Crafty.keys.DOWN_ARROW) {
                    if (this.move.up) this.move.left = false;
                    this.move.down = true;
                }
            }).bind("KeyUp", function (e) {
                //on key up, set the move booleans to false
                if (e.key === Crafty.keys.RIGHT_ARROW) {
                    this.move.right = false;
                } else if (e.key === Crafty.keys.LEFT_ARROW) {
                    this.move.left = false;
                } else if (e.key === Crafty.keys.UP_ARROW) {
                    this.move.up = false;
                } else if (e.key === Crafty.keys.DOWN_ARROW) {
                    this.move.down = false;
                }
            }).bind("EnterFrame", function () {
                if (!Game.paused) {
                    var y_dir = 0;
                    var x_dir = 0;

                    if (this.move.right) x_dir = 1;
                    else if (this.move.left) x_dir = -1;

                    if (this.move.up) y_dir = 1;
                    else if (this.move.down) y_dir = -1;

                    var vx = Math.sin(x_dir * Math.PI / 180) * this.speed_factor * (Game.width() / Game.height()),
                        vy = Math.sin(-y_dir * Math.PI / 180) * this.speed_factor;

                    if (this.move.left || this.move.right) {
                        this.xspeed += vx;
                    } else {
                        this.xspeed *= this.decay;
                    }

                    if (this.move.up || this.move.down) {
                        this.yspeed += vy;
                    } else {
                        this.yspeed *= this.decay;
                    }

                    if (Math.abs(this.xspeed) <= 1E-10) this.xspeed = 0;
                    if (Math.abs(this.yspeed) <= 1E-10) this.yspeed = 0;

                    //move the ship by the x and y speeds or movement vector
                    this.x += this.xspeed;
                    this.y += this.yspeed;

                    if (this._x > Crafty.viewport.width || this._y > Crafty.viewport.height ||
                        this._x < -64 || this._y < -64) {
                        this.destroy()
                    }
                }
            })
            .bind('Moved', function () {
                updateScore(-50);
            })
            .bind('Click', function (data) {
                console.log(this);
            })
            .collision()
            .onHit('Rock', function (data) {
                var asteroid = data[0].obj;
                asteroid.isprobed = true;
                asteroid.sprite(0, 1);
                this.destroy();
            });
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
    }
});

/**
 * Creates a timer component, which calls a function on an interval.
 * The example below prints "!" once per second for five seconds, and
 * then stops.
 *
 var timer = Crafty.e('Timer')
 .interval(1000)
 .callback(function() {
			console.debug("!")
			timer.count = typeof(timer.count) == 'undefined' ? 1 : timer.count + 1;
			if (timer.count == 5) {
				timer.stop();
			}
		})
 .start();
 */
Crafty.c('Timer', {

    init: function () {
        this.intervalMs = 0;
        this._state = "stopped";

        this.bind('Pause', function () {
            this._oldState = this._state;
            this.stop();
        });

        this.bind('Unpause', function () {
            if (this._oldState == "running") {
                this.start();
            }
        });
    },

    // Sets how often to trigger (in milliseconds)
    interval: function (milliseconds) {
        this.intervalMs = milliseconds;
        return this;
    },

    // Sets the function to call when time elapses
    callback: function (callback) {
        this.callback = callback;
        return this;
    },

    // Starts running the timer
    start: function () {
        var self = this;
        this._ref = setInterval(function () {
            self.callback()
        }, this.intervalMs);
        this._state = "running";
        return this;
    },

    // Stops and cleans up the timer
    stop: function () {
        clearInterval(this._ref);
        delete this._ref;
        this._state = "stopped";
        return this;
    }

});
