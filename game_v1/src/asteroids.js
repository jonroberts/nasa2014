//var asteroids = undefined;

function StartAsteroids(limit,day) {
	url = 'http://localhost:8100/get_random_asteroids?limit=' + limit + '&day=' + day;
	
	$.ajax({
		url: url,
		success: success_start,
		dataType: 'json'
	});
}

function success_start(data, textStatus, jqXHR) {
	Game.asteroids=data.results;
	Game.start();
}