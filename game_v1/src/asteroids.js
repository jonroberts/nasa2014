function StartAsteroids(limit, day) {
    $.getJSON(Game.server_url, {'limit': limit, 'day': day}, function(data) {
        Game.asteroids=data.results;
        Game.start();
    });
}

function CreateAsteroid(limit) {
    $.getJSON(Game.server_url, {'limit': limit, 'day': Game.day}, function(data) {
        Game.asteroids = data.results;
        addSingleAsteroid(Game.asteroids[Math.floor(Math.random() * Game.asteroids.length)]);
    });
}

function addAsteroid(asteroid) {
    var x = Math.floor(Math.random() * Game.map_grid.width);
    var y = Game.map_grid.height - (Math.round(asteroid['earth_dist'] * 10.0) + 7);

    _addAsteroid(asteroid, x, y);
}

function addSingleAsteroid(asteroid) {
    var x = 0;
    var y = Game.map_grid.height - (Math.round(asteroid['earth_dist'] * 10.0) + 7);

    _addAsteroid(asteroid, x, y);
}

function _addAsteroid(asteroid, x, y) {
    if (Game.scaleAsteroids) {
        ast_scale = Math.max(Math.log(1.6*asteroid['diameter']), 1);
    } else {
        ast_scale = 1
    }

    Crafty.e('Rock').at(x, y).attr({
        asteroid_data: asteroid,
        rotation_rate: (Game.framerate_ms / (10 * asteroid['rot_per'])),
        w: Game.map_grid.tile.width * ast_scale,
        h: Game.map_grid.tile.height * ast_scale,
        x_speed: Math.abs(asteroid['earth_dv'] / 100)
    }).origin('center');

    Game.occupied[x][y] = true;
}