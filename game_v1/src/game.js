Game = {

    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width: 76,
        height: 41,
        tile: {
            width: 16,
            height: 16
        }
    },

    debug: false,

	showAllSpectra: false,

    // show thrusters from ship engines
    showThrusters: true,

    // whether to scale asteroids according to diameter data
    scaleAsteroids: true,
    scaleAsteroidFactor: 0.2,

    paused: true,
    asteroids: undefined,
    framerate_ms: 100,
    day: 0,

    min_asteroid_distance: 0.5,
    max_asteroid_distance: 3.0,
    none_prob: 0.19,
    water_prob: 0.3,
    hydrogen_prob: 0.25,
    metals_prob: 0.25,
    platinum_prob: 0.01,

    mining_ability: { 'None': true, 'Water': false, 'Metals': false, 'Hydrogen': false, 'Platinum': false },


    num_asteroids: 25,

    // url of the asteroid server
//    server_url: 'http://localhost:8100/get_asteroids_by_type',
//    server_url: 'http://localhost/get_random_asteroids',
//    server_url: 'http://server.spacerocksgame.org/get_random_asteroids',
    server_url: 'http://server.spacerocksgame.org/get_asteroids_by_type',


    max_ship_cargo: 1,
    all_asteroids_probed: false,
    starting_money: 80000000,
    asteroid_base_value: { 'None': 0, 'Hydrogen': 2000000, 'Metals': 2000000, 'Platinum': 20000000, 'Water': 2000000 },
    fuel_cost_per_pixel: 1000,
    probe_fuel_cost_per_pixel: 0,

    metal_refinery_bonus: 2.0,
    hydrogen_refinery_bonus: 2.0,

    ship_cost: 200000,
    probe_cost: 200000,

    hrefinery_bonus: 2.0,
    // effects of research
    research: {
        mining_efficiency: {
            water: .01
        }
    },

    // The total width of the game screen. Since our grid takes up the entire screen
    //  this is just the width of a tile times the width of the grid
    width: function () {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    //  this is just the height of a tile times the height of the grid
    height: function () {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    // Initialize and start our game
    start: function () {
        // Start crafty and set a background color so that we can see it's working

        if (window.innerWidth < this.width()) {
            Crafty.init(Crafty.DOM.window.width, Crafty.DOM.window.height);
        } else {
            Crafty.init(this.width(), this.height());
        }
        Crafty.canvas.init();
        $('canvas')[0].setAttribute('tabIndex', '1');

        // Simply start the "Loading" scene to get things going
        Crafty.scene('Loading');
    }
};

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' };
