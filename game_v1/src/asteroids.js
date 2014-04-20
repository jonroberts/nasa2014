function StartAsteroids(day) {
    $.getJSON(Game.server_url, {'limit': Game.num_asteroids, 'day': day, 'min_dist': Game.min_asteroid_distance, 'max_dist': Game.max_asteroid_distance, 'none': Game.none_prob, 'water': Game.water_prob, 'metals': Game.metals_prob, 'hydrogen': Game.hydrogen_prob, 'platinum': Game.platinum_prob }, function (data) {
        Game.asteroids = data.results;
        Game.start();
    });
}

function CreateAsteroid(limit, single) {
    $.getJSON(Game.server_url, {'limit': limit, 'day': Game.day, 'min_dist': Game.min_asteroid_distance, 'max_dist': Game.max_asteroid_distance, 'none': Game.none_prob, 'water': Game.water_prob, 'metals': Game.metals_prob, 'hydrogen': Game.hydrogen_prob, 'platinum': Game.platinum_prob }, function (data) {
        Game.asteroids = data.results;
        for (i = 0; i < data.results.length; i++) {
            if (single) {
                addSingleAsteroid(Game.asteroids[i])//;Math.floor(Math.random() * Game.asteroids.length)]);
            } else {
                addAsteroid(Game.asteroids[i]);
            }
        }
    });
}

function asteroidY(earthdist) {
    return Game.map_grid.height - (Math.round((earthdist - Game.min_asteroid_distance) * (Game.map_grid.height - 2.0 - 7.0) / (Game.max_asteroid_distance - Game.min_asteroid_distance) + 7.0));
}

function addAsteroid(asteroid) {
    var x = Math.floor(Math.random() * Game.map_grid.width * 0.8);
    var y = asteroidY(asteroid['earth_dist']);
    _addAsteroid(asteroid, x, y);
}

function addSingleAsteroid(asteroid) {
    var x = 0;
    var y = asteroidY(asteroid['earth_dist']);
    _addAsteroid(asteroid, x, y);
}

function _addAsteroid(asteroid, x, y) {
    if (y < 0) {
        return;
    }

    var ast_scale = Game.scaleAsteroids ? asteroidScale(asteroid['diameter']) : 1;

    //console.log(asteroid['diameter'] + ' -> ' + ast_scale + ' --- ' + Game.map_grid.height);

    asteroid['astclass'] = asteroidClass(asteroid);
    //console.log(asteroid.spec + ' , ' + asteroid.astclass );

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
    if (d == "" || isNaN(d)) {
        return 1.0;
    }
    d = Math.max(d, 1.0);
    d = Math.min(d, 10.0);
    return 1.0 + (d - 1.0) / 10.0;
}

function asteroidInfoHtml(asteroid_data, isprobed) {
//    unprobed = '<h4 style="border-bottom: 1px solid #111">Unexplored!</h4>';
    unprobed = '<div class="unexplored">Unexplored!</div>';
    spec_type = 'Send probe to find out!';
    tval = 'Send probe to find out!';
    dist = asteroid_data.earth_dist.toFixed(2) + ' AU';
    deltav = asteroid_data.earth_dv.toFixed(2) + ' km/s';

    diameter = 'Not yet measured!';
    if (!isNaN(asteroid_data.diameter) && asteroid_data.diameter != "") {
        diameter = asteroid_data.diameter.toFixed(2) + ' km';
    }

    rot_per = 'Not yet measured!';
    if (!isNaN(asteroid_data.rot_per) && asteroid_data.rot_per != "") {
        rot_per = asteroid_data.rot_per.toFixed(2) + ' hours';
    }

    minerals = 'Send probe to find out!';
    price_per_kg = 'Send probe to find out!';
    pha = asteroid_data.pha == 'Y' ? '<p class="neo-status hazard">Potentially Hazardous Object!</p>' : '';
    neo = asteroid_data.neo == 'Y' ? '<p class="neo-status">Near Earth Object</p>' : '';

//    isprobed = true;
    if (isprobed) {
//        unprobed = '<h4 style="border-bottom: 1px solid #111">Resources: ' + asteroid_data.astclass + '<br>Value: $' + Game.asteroid_base_value[asteroid_data.astclass].toLocaleString() + '</h4>';
        unprobed = '<div>Resources: ' + asteroid_data.astclass + '<br>Value: $' + Game.asteroid_base_value[asteroid_data.astclass].toLocaleString() + '</div>';

        spec_type = asteroid_data.spec;
        minerals = Object.keys(SPECTRAL_INDEX[asteroid_data.spec]).join(', ');

        if (asteroid_data.value < 1E-20) {
            asteroid_data.value = 0.0;
        }
        if (asteroid_data.price < 1E-20) {
            asteroid_data.price = 0.0;
        }
        price_per_kg = '$' + asteroid_data.value.toLocaleString();
        tval = '$' + asteroid_data.price.toLocaleString();
    }

    html = '<div><h3 style="font-size: 12px">Asteroid ' + asteroid_data.full_name + '</h3>';
    html += unprobed;
    html += '<div class="ib-border"></div>';
    html += '<div class="ib-details">';
    html += '<p><span>Spectral Type:</span> ' + spec_type + '</p>';
    html += '<p><span>Minerals:</span> ' + minerals + '</p>';
    html += '<p><span>Asterank Price Per kg:</span> ' + price_per_kg + '</p>';
    html += '<p><span>Asterank Value:</span> ' + tval + '</p>';
    html += '<p><span>Distance:</span> ' + dist + '</p>';
    html += '<p><span>Delta-V:</span> ' + deltav + '</p>';
    html += '<p><span>Diameter:</span> ' + diameter + '</p>';
    html += '<p><span>Rotational Period:</span> ' + rot_per + '</p>';
    html += neo + pha;
    html += '</div></div>';

    return html;
}

function asteroidClass(asteroid) {
    return SPECTRAL_INDEX_TYPE[asteroid.spec];
}
    
