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
	console.log('APICALL: ' + textStatus);
	Game.asteroids=data.results;
	Game.start();
}

function GetAsteroids(limit,day) {
	url = 'http://localhost:8100/get_random_asteroids?limit=' + limit + '&day=' + day;

	$.ajax({
		url: url,
		success: success,
		dataType: 'json'
	});
}

function success(data, textStatus, jqXHR) {
	console.log('NEW ASTEROIDS APICALL: ' + textStatus);
	Game.asteroids=data.results;
	console.log(data.results);
}
