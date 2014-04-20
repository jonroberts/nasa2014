image_assets = {
    agencies: {
        'NASA': 'assets/agencies/nasa.png',
        'ESA': 'assets/agencies/esa.png',
        'JAXA': 'assets/agencies/jaxa.png',
        'CSA': 'assets/agencies/csa.png',
        'RSA': 'assets/agencies/rsa.png',
        'MOIMG': 'assets/agencies/marsone.png'
    }
};

Crafty.bind('CheckMissionDate', function () {
    var m = dateDisplay.value.getMonth() + 1;
    if (m < 10) m = '0' + m;

    var d = dateDisplay.value.getDate();
    if (+d < 10) d = '0' + d;

    var y = dateDisplay.value.getFullYear();

    var dateStr = y + '-' + m + '-' + d;

    if (future_events[dateStr]) {
        var destination = null;
        if (future_events[dateStr]['destination']) {
            destination = future_events[dateStr]['destination'];
        }

        if (destination === 'ISS') {
            var y_shuttle = (Game.map_grid.height - 1) * Game.map_grid.tile.height;
            var velocity_ratio = iss._entry.obj.x_speed / 0.1;
            var x_shuttle = (iss._x + (y_shuttle - iss._y) * velocity_ratio) % Game.width();

            Crafty.e('ISSShuttle')
                .attr({mission_data: future_events[dateStr], mission_date: dateStr})
                .at(Math.round(x_shuttle / Game.map_grid.tile.width), Game.map_grid.height - 1);
        } else if (destination === 'orbit') {
            var x_tile = Math.floor(Math.random() * Game.map_grid.width);
            Crafty.e('OrbitalRocket')
                .attr({mission_data: future_events[dateStr], mission_date: dateStr, x_tile: x_tile})
                .at(x_tile, Game.map_grid.height - 1);
        } else {
            Crafty.e('MissionRocket')
                .attr({mission_data: future_events[dateStr], mission_date: dateStr})
                .at(Math.floor(Math.random() * Game.map_grid.width), 38);
        }
    }
});

function missionInfoHtml(mission_data, mission_date) {
    var html = "<div class='info-box'><div class='ib-top'>";
    html += "<div class='ib-top-img'><img src='" + mission_data['image'] + "'></div>";
    html += "<div class='ib-top-right'><div class='ib-top-name'>" + mission_data['name'] + '</div>';
    html += "<div class='ib-top-launch'>Launch date: " + mission_date + "</div></div></div>";
    html += "<div class='ib-border'></div>";
    html += "<div class='ib-details'><div class='ib-agency'>Agency: ";

    $.each(mission_data['agency'].split(', '), function (i, agency) {
        html += "<div class='ib-agency-inner'><img src='" + image_assets.agencies[agency] + "'></div>";
    });

    html += "</div>";
    html += "<div class='ib-desc'>" + mission_data['description'] + "</div>";
    html += "</div></div></div>";

    return html
}

function futureMissions(n) {
    if (!n) {
        n = 10;
    }

    var mission_dates = Object.keys(future_events).filter(function (e) {
        return new Date(e) > dateDisplay.value;
    }).sort(function (a, b) {
        var date_a = new Date(a),
            date_b = new Date(b);

        if (date_a < date_b) return -1;
        if (date_a > date_b) return 1;
        return 0;
    });

//    console.log(mission_dates);

    var missions = [];
    $.each(mission_dates.slice(0, n), function (i, d) {
        var m = future_events[d];
        m['date'] = d;
        missions.push(m);
    });

    return missions;
}

function buildMissionList() {
    $('#missionList').empty();

    $.each(futureMissions(), function (i, mission) {
        var d = mission['date'];

        var text = '<div class="mission-list-row"><div class="ib-top">';
        text += '<div class="ib-top-img"><img src="' + mission['image'] + '"></div>';
        text += "<div class='ib-top-right'><div class='ib-top-name'>" + mission['name'] + '</div>';
        text += "<div class='ib-top-launch'>" + d + "</div></div>";
        text += '</div></div>';

        text = $(text).click(function () {
            window.open(mission['link'], '_blank')
        });

        $('#missionList').append(text);
    });
}

/**
 *
 * Event component definitions
 *
 */

Crafty.c('BaseMissionClass', {
    init: function () {
        this.requires('Actor, Mouse');

        this.info_box = Crafty.e("2D, DOM, Text")
            .attr({w: 200, alpha: 0.8, visible: false})
            .css({
//                'background': '-moz-linear-gradient(center top , #999 0%, #666 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'background': 'linear-gradient(#999, #666) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                color: '#111',
                textShadow: '0 -1px 1px #666',
                'border-radius': '5px',
                'box-shadow': '0 1px 1px rgba(255, 255, 255, 0.8), 0 0 0 #666666, 0 1px 0 rgba(0, 0, 0, 0.5) inset, 0 0 0 rgba(255, 255, 255, 0.75) inset',
                padding: '7px 10px',
                border: '1px solid #AAA',
                display: 'block'
            });

        this.bind('MouseOver', function (data) {
            this.info_box.text(missionInfoHtml(this.mission_data, this.mission_date));

            var jqInfoBox = $('#' + this.info_box.getDomId());
            this.info_box.dom_height = jqInfoBox.height();

            this.adjustInfoBox(this.info_box);

            jqInfoBox.css('height', 'inherit');
            this.attach(this.info_box);
            this.info_box.visible = true;
        });

        this.bind('MouseOut', function (data) {
            this.info_box.visible = false;
        });

        this.bind("Click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.open(this.mission_data['link'], '_blank')
        });
    },
    adjustInfoBox: function () {
        this.info_box.rotation = 0;
        if (this._x >= (Game.width()) - 250) {
            this.info_box.x = this._x - 225;
        } else {
            this.info_box.x = this._x + 25;
        }

        if (this._y >= Game.height() / 2) {
            if (this.info_box.dom_height) {
                this.info_box.y = this._y - this.info_box.dom_height;
            } else {
                this.info_box.y = this._y - $('#' + this.info_box.getDomId()).height()
            }
        } else {
            this.info_box.y = this._y + 5;
        }
    }
});

Crafty.c("BaseMissionRocket", {
    init: function () {
        this.requires('BaseMissionClass, spr_player')
            .origin('center');

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
    }
});

// Deep space (i.e. outside the viewport) mission rocket
Crafty.c('MissionRocket', {
    init: function () {
        this.requires('BaseMissionRocket')
            .attr({
                yspeed: 0,
                speed_factor: 0.04, // acceleration of the ship
                thrusters: null,
                w: 14,
                h: 14
            })
            .origin("center");

        this.bind("EnterFrame", function (frame) {
            if (!Game.paused) {
                //acceleration and movement vector
                this.yspeed -= this.speed_factor;
                this.y += this.yspeed;

                this.adjustInfoBox();

                if (this._x > Crafty.viewport.width || this._y > Crafty.viewport.height ||
                    this._x < -64 || this._y < -64) {
                    this.destroy()
                }
            }
        });
    }
});

Crafty.c('ISSShuttle', {
    init: function () {
        this.requires('BaseMissionClass, spr_rocket')
            .attr({ yspeed: -0.1, w: 32, h: 32 })
            .origin("center");

        // set the z to be below the ISS
        this._globalZ = iss._globalZ - 1;

        this.bind("EnterFrame", function (frame) {
            if (!Game.paused) {
                this.y += this.yspeed;

                this.adjustInfoBox();

                if (this._y <= iss._y + 1) {
                    this.destroy()
                }
            }
        });
    }
});

// rocket with a satellite payload
Crafty.c('OrbitalRocket', {
    init: function () {
        this.requires('BaseMissionRocket')
            .attr({
                yspeed: 0,
                speed_factor: 0.02, // acceleration of the ship
                thrusters: null,
                w: 10,
                h: 10
            })
            .origin("center");

        this.bind("EnterFrame", function (frame) {
            if (!Game.paused) {
                //acceleration and movement vector
                this.yspeed -= this.speed_factor;
                this.y += this.yspeed;

                this.adjustInfoBox();

                if (this._y <= 37 * Game.map_grid.tile.height) {
                    // release the satellite and destroy the rocket
                    // TODO Need a better way of animating this besides the rocket just disappearing
                    Crafty.e('OrbitalSatellite')
                        .attr({
                            mission_data: this.mission_data,
                            mission_date: this.mission_date,
                            x_speed: 1.5 * Math.random() / -Math.log(Math.sqrt(Math.random()) / 10)
                        })
                        .at(this.x_tile, 37);
                    this.destroy()
                }
            }
        });
    }
});

Crafty.c('OrbitalSatellite', {
    init: function () {
        this.requires('BaseMissionClass, spr_iss')
            .attr({w: 12, h: 12});

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