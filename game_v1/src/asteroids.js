function StartAsteroids(limit, day) {
    $.getJSON(Game.server_url, {'limit': limit, 'day': day, 'min_dist': Game.min_asteroid_distance, 'max_dist': Game.max_asteroid_distance, 'noval_accept_prob': Game.noval_accept_prob }, function(data) {
        Game.asteroids=data.results;
        Game.start();
    });
}

function CreateAsteroid(limit) {
    $.getJSON(Game.server_url, {'limit': limit, 'day': Game.day, 'min_dist': Game.min_asteroid_distance, 'max_dist': Game.max_asteroid_distance, 'noval_accept_prob': Game.noval_accept_prob}, function(data) {
        Game.asteroids = data.results;
        addSingleAsteroid(Game.asteroids[Math.floor(Math.random() * Game.asteroids.length)]);
    });
}

function addAsteroid(asteroid) {
    var x = Math.floor(Math.random() * Game.map_grid.width*0.8);
    var y = Game.map_grid.height - (Math.round(  (asteroid['earth_dist'] - 0.5)*13.6 + 7.0  ) );
    _addAsteroid(asteroid, x, y);
}

function addSingleAsteroid(asteroid) {
    var x = 0;
    var y = Game.map_grid.height - (Math.round(  (asteroid['earth_dist'] - 0.5)*13.6 + 7.0  ) );
    _addAsteroid(asteroid, x, y);
}

function _addAsteroid(asteroid, x, y) {
    if (y < 0) {
        return;
    }
//console.log(asteroid.earth_dist + ' -> ' + y + '  ,  ' + Game.map_grid.height + '  , ' + x + '  ,  ' + Game.map_grid.width);

    if (Game.scaleAsteroids) {
        //ast_scale = Math.max(Math.sqrt(Math.log(Game.scaleAsteroidFactor*asteroid['diameter'])), 1);
        ast_scale = asteroidScale(asteroid['diameter']);
    } else {
        ast_scale = 1
    }

    //console.log(asteroid['diameter'] + ' -> ' + ast_scale + ' --- ' + Game.map_grid.height);

    Crafty.e('Rock').at(x, y).attr({
        asteroid_data: asteroid,
        rotation_rate: (Game.framerate_ms / (10 * asteroid['rot_per'])),
        w: Game.map_grid.tile.width * ast_scale,
        h: Game.map_grid.tile.height * ast_scale,
        x_speed: Math.abs(asteroid['earth_dv'] / 100)
    }).origin('center');

    Game.occupied[x][y] = true;
}

function asteroidScale(d) {
    if (d=="" || isNaN(d)) {
        return 1.0;
    }
    d = Math.max(d,1.0);
    d = Math.min(d,10.0);
    return 1.0 + (d - 1.0)/10.0;
}

function asteroidInfoHtml(asteroid_data, isprobed) {
    unprobed = '<p>Unexplored!</p>';
    spec_type = 'Send probe to find out!';
    tval = 'Send probe to find out!';
    dist = asteroid_data.earth_dist.toFixed(2) + ' AU';
    deltav = asteroid_data.earth_dv.toFixed(2) + ' km/s';
    
    diameter = '';
    if (!isNaN(asteroid_data.diameter) && asteroid_data.diameter != "") {
        diameter = asteroid_data.diameter.toFixed(2) + ' km';
    } else {
        diameter = 'Not yet measured!';
    }

    rot_per = '';
    if (!isNaN(asteroid_data.rot_per) && asteroid_data.rot_per != "") {
        rot_per = asteroid_data.rot_per.toFixed(2) + ' hours';
    } else {
        rot_per = 'Not yet measured!';
    }

    minerals = 'Send probe to find out!';
    price_per_kg = 'Send probe to find out!';
    pha = asteroid_data.pha == 'Y' ? '<p class="hazard">Potentially Hazardous Object!</p>' : '';
    neo = asteroid_data.neo == 'Y' ? '<p>Near Earth Object</p>' : '';

isprobed=true;
    if (isprobed) {
        unprobed = '';
        spec_type = asteroid_data.spec;
        minerals_key = SPECTRAL_INDEX[asteroid_data.spec];
        minerals = '';
        for (key in minerals_key) {
            minerals = minerals + ' ' + key;
        }
        if (asteroid_data.value < 1E-20) {
            asteroid_data.value = 0.0;
        }
        if (asteroid_data.price < 1E-20) {
            asteroid_data.price = 0.0;
        }
        price_per_kg = '$' + asteroid_data.value.toLocaleString();
        tval = '$' + asteroid_data.price.toLocaleString();
    }

    html = '<h3 style="border-bottom: 1px solid #111">Asteroid ' + asteroid_data.full_name + '</h3>';
    html = html + unprobed;
    html = html + '<p>Spectral Type: ' + spec_type + '</p>';
    html = html + '<p>Minerals: ' + minerals + '</p>';
    html = html + '<p>Price per kg: ' + price_per_kg + '</p>';
    html = html + '<p>Total Value: ' + tval + '</p>';
    html = html + '<p>Distance: ' + dist + '</p>';
    html = html + '<p>Delta-V: ' + deltav + '</p>';
    html = html + '<p>Diameter: ' + diameter + '</p>';
    html = html + '<p>Rotational Period: ' + rot_per + '</p>';
    html = html + neo + pha;

    return html;
}
