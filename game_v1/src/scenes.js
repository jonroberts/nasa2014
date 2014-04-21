// Game scene
// -------------
// Runs the core gameplay loop

var activeShip = undefined;
var score = undefined;
var gasStation = undefined;
var iss = undefined;

function updateScore(val) {
    score.value += val;
    score.text('Capital: $' + (score.value / 1000000.).toFixed(3) + ' Million');
    if (score.value < 0) {
        alert('You have run out of money and will remain trapped on earth!');
        location.reload();
    }
}

function retainCanvasFocus(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else if (e.originalEvent.stopPropagation) {
        e.originalEvent.stopPropagation();
    }

    if (e.preventDefault) {
        e.preventDefault();
    } else if (e.originalEvent.preventDefault) {
        e.originalEvent.preventDefault();
    }
}


var dateDisplay = undefined;

Crafty.scene('Game', function () {

    // autopause will stop the game from progressing when on another window, like when an object is clicked on
    Crafty.settings.modify('autoPause', true);

    console.log('running');
    // A 2D array to keep track of all occupied tiles
    Game.occupied = new Array(Game.map_grid.width);
    for (var i = 0; i < Game.map_grid.width; i++) {
        Game.occupied[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            Game.occupied[i][y] = false;
        }
    }

    score = Crafty.e("2D, DOM, Text")
        .attr({x: Game.width() - 225, y: Game.height() - 25, w: 200, h: 50, value: Game.starting_money})
        .css({color: "#fff", 'z-index': 100})
        .text('Capital: $' + (Game.starting_money / 1000000.).toFixed(3) + ' Million')
        .textFont({ size: '14px' });

    dateDisplay = Crafty.e("2D, DOM, Text")
        .attr({x: Game.width() - 170, y: 6, w: 200, h: 50})
        .css({color: "#fff"})
        .textFont({ size: '14px' });
    dateDisplay.value = new Date();
    dateDisplay.text((dateDisplay.value.getMonth() + 1) + '/' + dateDisplay.value.getDate() + '/' + dateDisplay.value.getFullYear());

    var researchButton = Crafty.e("2D, DOM, Text, Mouse, Keyboard, researchButton, topMenu, topMenu-bg")
        .attr({x: 10, y: 6, h: 10})
        .css({
            'border': '1px solid #CCCCCC',
            'border-radius': '5px',
            'box-shadow': '0 1px 3px #FFFFFF, 0 1px 0 #666666 inset, 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.8) inset',
            'margin': '0 15px',
            'padding': '5px 10px',
            'text-shadow': '0 1px 2px #111111',
            'cursor': 'pointer',
            'position': 'relative',
            'min-width': '0'
        })
        .text('Research')
        .bind("KeyDown", function(e) {
            if (e.key == Crafty.keys.R) {
                if (!(Crafty.keydown[Crafty.keys.CTRL] || Crafty.keydown[224])) {
                    retainCanvasFocus(e);
                }

                $("#missionList").hide();
                $(".missionsButton").addClass('topMenu-bg').removeClass('topMenu-highlight');

                buildTechTree();
                $('.researchButton').toggleClass('topMenu-bg').toggleClass('topMenu-highlight');
                var offset = $('#' + researchButton.getDomId()).offset();
                $('#techTree')
                    .css({'top': offset.top + 24, 'left': offset.left + 5})
                    .toggle();
            }
        })
        .textFont({ size: '12px' });

    $('.researchButton').click(function(){
        $("#missionList").hide();
        $(".missionsButton").addClass('topMenu-bg').removeClass('topMenu-highlight');

        buildTechTree();
        $(this).toggleClass('topMenu-bg').toggleClass('topMenu-highlight');
        var offset = $('#' + researchButton.getDomId()).offset();
        $('#techTree')
            .css({'top': offset.top + 24, 'left': offset.left + 5})
            .toggle();
    });

    var missionsButton = Crafty.e("2D, DOM, Text, Mouse, Keyboard, missionsButton, topMenu, topMenu-bg")
        .attr({x: 10, y: 6, h: 10})
        .css({
            'border': '1px solid #CCCCCC',
            'border-radius': '5px',
            'box-shadow': '0 1px 3px #FFFFFF, 0 1px 0 #666666 inset, 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.8) inset',
            'margin': '0 15px',
            'padding': '5px 10px',
            'text-shadow': '0 1px 2px #111111',
            'cursor': 'pointer',
            'position': 'relative',
            'min-width': '0'
        })
        .bind("KeyDown", function(e) {
            if (e.key == Crafty.keys.M) {
                retainCanvasFocus(e);

                $("#techTree").hide();
                $(".researchButton").addClass('topMenu-bg').removeClass('topMenu-highlight');

                buildMissionList();
                $('.missionsButton').toggleClass('topMenu-bg').toggleClass('topMenu-highlight');
                var offset = $('#' + missionsButton.getDomId()).offset();

                $('#missionList')
                    .css({'top': offset.top + 24, 'left': offset.left + 5})
                    .toggle();
            }
        })
        .bind("CheckMissionDate", function() {
            var next_event = futureMissions(1)[0];
            $('.topMenu').css({'width': ''});
            this.text('<div>Next Mission: ' + next_event['date'] + ', ' + next_event['name'] + '</div>');
        })
        .textFont({ size: '12px' });

    $('.missionsButton').click(function(){
        $("#techTree").hide();
        $(".researchButton").addClass('topMenu-bg').removeClass('topMenu-highlight');

        buildMissionList();
        $('.missionsButton').toggleClass('topMenu-bg').toggleClass('topMenu-highlight');
        var offset = $('#' + missionsButton.getDomId()).offset();
        $('#missionList')
            .css({'top': offset.top + 24, 'left': offset.left + 5})
            .toggle();
    });

    this.purchaseMenu = Crafty.e("2D, DOM, Text")
        .attr({w: 45, h: 22, x: 0, y: Game.height() - 42, alpha: 0.5})
        .text('<div></div>')
        .css({
            'background': 'linear-gradient(rgba(220, 220, 238, 0.3), rgba(170, 187, 238, 0.3)) repeat scroll 0 0 rgba(0, 0, 0, 0)',
            'border': '1px solid #CCCCCC',
            'border-radius': '10px',
            'box-shadow': '0 1px 3px #FFFFFF, 0 1px 0 #666666 inset, 0 -1px 1px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.8) inset',
            'margin': '0 15px',
            'padding': '5px 20px',
            'text-shadow': '0 1px 2px #111111'
        })
        .textFont({ size: '12px' });

    this.player = Crafty.e('Probe').at(38, 38);
    this.buyProbe = Crafty.e('BuyProbe').at(2, 39);
    this.base = Crafty.e('BaseProngs').at(38, 38);
    this.base = Crafty.e('Base').at(38, 39);
    Game.occupied[this.player.at().x][this.player.at().y] = true;

    activeShip = this.player;
    this.probes = [];

    for (var i = 0; i < Game.asteroids.length; i++) {
        addAsteroid(Game.asteroids[i]);
    }

    iss = Crafty.e('ISS').at(0, 37);

    var pauseIndicator = null;

    Crafty.bind('AdvancedMiner', function () {
        Game.max_ship_cargo = 3;
    });

    Crafty.bind('EnableMetalsMining', function () {
        Game.mining_ability['Metals'] = true;
        Game.mining_ability['Platinum'] = true;
    });

    Crafty.bind('EnableHydrogenMining', function () {
        Game.mining_ability['Hydrogen'] = true;
    });

	Crafty.bind('ShowAllSpectra',function(){
		Game.showAllSpectra=true;
		Crafty("Rock").each(function(ix){
			var asteroid=Crafty(Crafty("Rock")[""+ix]);
			asteroid.gotProbed();
		});
	});

    Crafty.bind('EnableWaterMining', function () {
        Game.mining_ability['Water'] = true;
    });

    Crafty.bind('KeyDown', function (e) {
        if (e.key == Crafty.keys.SPACE) {
            retainCanvasFocus(e);

            Game.paused = !Game.paused;

            if (Game.paused) {
                pauseIndicator = Crafty.e("2D, DOM, Text")
                    .attr({x: Game.width() - 170, y: 30, w: 200, h: 50, frameCount: 0})
                    .css({color: "#fff", 'z-index': 100})
                    .textFont({ size: '16px' })
                    .text("Paused")
                    .bind("EnterFrame", function () {
                        this.frameCount += 1;

                        if (this.frameCount % 100 == 0) {
                            this.visible = true;
                        } else if (this.frameCount % 100 == 70) {
                            this.visible = false;
                        }
                    });
            } else {
                if (pauseIndicator) {
                    pauseIndicator.destroy();
                }
            }
        }
    });

    Game.day = 0;

    var timer = Crafty.e('Timer')
        .interval(Game.framerate_ms * 4.5)
        .callback(function () {
            if (!Game.paused) {
                Game.day += 1;
                dateDisplay.value.setTime(dateDisplay.value.getTime() + 86400000);
                dateDisplay.text((dateDisplay.value.getMonth() + 1) + '/' + dateDisplay.value.getDate() + '/' + dateDisplay.value.getFullYear());
                Crafty.trigger('CheckMissionDate');
            }
        })
        .start();

    Crafty.bind('CreateAsteroid', function () {
        CreateAsteroid(1,true);
    })

});

Crafty.scene('Intro', function() {

    var intro_html = "<p>In 2020 a huge asteroid will hit Earth. If you don't build an asteroid defence platform in time, life will be over.</p>"
        + "<p>Build ships, telescopes and satellites to explore Near Earth Asteroids and liberate their resources, but be quick!</p>"
        + "<h3>Controls</h3>"
        + "<p><strong>left, right, up, down:</strong> move current ship<br>"
        + "<strong>Space:</strong> pause/restart<br>"
        + "<strong>1:</strong> purchase a probe<br>"
        + "<strong>2:</strong> purchase a mining ship (if available)<br>"
        + "<strong>M:</strong> show upcoming missions and launch events<br>"
        + "<strong>R:</strong> show research tree</p>"
        + "<button onclick='start()'><span style='padding:5px;'>Start Game</span></button>"
        + "<h3>About the Data</h3>"
        + "<p>All the asteroids in the game are real. Their distance from earth folows their true distance on the day shown, their rotation follows their measured rotation, as does their velocity, composition and estimated value. Click any asteroid to find out more. The space missions you'll see are actual NASA missions in the future.</p>"
        + "<p>We've sped up time (a lot) for the sake of gameplay, and there's no asteroid that we know about that will strike Earth in 2020. But we don't know there isn't - and that's why we need to be smarter than the dinosaurs. For more details, check out the <a href='https://github.com/jonroberts/nasa2014' target=_blank>github for the project</a>.</p>"
        + "<p>Space Rocks! was created as part of the <a href='https://2014.spaceappschallenge.org' target=_blank>International Space Apps Challenge</a> by <a href='https://2014.spaceappschallenge.org/project/space-rocks/' target=_blank>Jeff Allen</a>, <a href='https://2014.spaceappschallenge.org/project/space-rocks/' target=_blank>Matt Lipson</a> and <a href='https://2014.spaceappschallenge.org/project/space-rocks/' target=_blank>Jonathan Roberts</a>. Check out <a href='https://2014.spaceappschallenge.org/awards/#globalnom' target=_blank>all the other awesome projects nominated for global judging</a>.</p>"

    var intro = $('<div id="logo" data-intro="' + intro_html + '"><img src="./assets/Logo_120.png" title="space rocks"></div>');

//    $('body').append(intro);
    $('body').prepend(intro);
    $('#logo').show();
    $('body').chardinJs();
    $('body').chardinJs('start');
    $('body').on('chardinJs:stop',function(){
        $('#logo').hide();
        Crafty.scene('Game');
    })
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function () {
    // Draw some text for the player to see in case the file takes a noticeable amount of time to load
    Crafty.e('2D, DOM, Text')
        .text('Loading; please wait...')
        .attr({ x: 0, y: Game.height() / 2 - 24, w: Game.width() })
        .css($text_css);

    // Load our sprite map image
    Crafty.load([
        'assets/16x16_sprites_1.gif',
        'assets/16x16_sprites_2.gif',
        'assets/ship.png',
        'assets/base.png',
        'assets/probe.png',
        'assets/iss.png',
        'assets/asteroids.gif',
        'assets/Rocket.png'
    ], function () {
        // Define the individual sprites in the image
        // These components' names are prefixed with "spr_"
        Crafty.sprite(16, 'assets/16x16_sprites_1.gif', {
            spr_base: [0, 0],
            spr_baseProngs: [0, 1],
            spr_h_refinery: [1, 1],
            spr_gas_station: [1, 0]
        });
        Crafty.sprite(16, 'assets/16x16_sprites_2.gif', {
            spr_buy_probe: [1, 0],
            spr_buy_ship: [0, 0],
            spr_visited: [0, 1],
            spr_rock: [1, 1]
        });
        Crafty.sprite(64, 'assets/asteroids_64.gif', {
            spr_rock_1: [0, 0],
            spr_rock_2: [0, 1],
            spr_rock_3: [0, 2],
            spr_rock_4: [0, 3],
            spr_rock_5: [0, 4]
        });

        // Define the PC's sprite to be the first sprite in the third row of sprite map
        Crafty.sprite(16, 'assets/ship.png', {
            spr_player: [0, 0],
        }, 0, 2);

        Crafty.sprite(16, 'assets/probe.png', {
            spr_probe: [0, 0],
        }, 0, 0);

        Crafty.sprite(16, 'assets/iss.png', {
            spr_iss: [0, 0],
        }, 0, 0);
        
        Crafty.sprite(32, 'assets/Rocket.png',{
            spr_rocket: [0, 0],
        }, 0, 0);

        // Now that our sprites are ready to draw, start the game
        if (Game.showIntro) {
            Crafty.scene('Intro');
        } else {
            Crafty.scene('Game');
        }

    })
});
