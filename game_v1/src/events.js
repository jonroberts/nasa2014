Crafty.bind('CheckMissionDate', function () {
    var m = dateDisplay.value.getMonth() + 1;
    if (m < 10) m = '0' + m;

    var d = dateDisplay.value.getDate();
    if (+d < 10) d = '0' + d;

    var y = dateDisplay.value.getFullYear();

    var dateStr = y + '-' + m + '-' + d;

    if (future_events[dateStr]) {
        console.log('Mission!');
        console.log(future_events[dateStr]);
        Crafty.e('MissionRocket')
            .attr({mission_data: future_events[dateStr], mission_date: dateStr})
            .at(Math.floor(Math.random() * Game.map_grid.width), 38);
    }
});

function missionInfoHtml(mission_data, mission_date) {
    return "<div class='info-box'><div class='ib-top'>" +
        "<div class='ib-top-img'><img src='" + mission_data['image'] + "'></div>" +
        "<div class='ib-top-right'><div class='ib-top-name'>" + mission_data['name'] + '</div>' +
        "<div class='ib-top-launch'>Launch date: " + mission_date + "</div></div>" +
        "<div class='ib-details'><div class='ib-agency'>Agency: " + mission_data['agency'] + "</div>" +
        "<div class='ib-desc'>" + mission_data['description'] + "</div>" +
        "</div></div></div>";
}