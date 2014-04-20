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

    var researchButton = Crafty.e("2D, DOM, Text, menuButton, Mouse, Keyboard")
        .attr({x: 10, y: 6, w: 20, h: 16})
        .css({'padding-top': '5px'})
        .textFont({ size: '30px'})
        .text('*')
        .bind('Click', function () {
            $("#missionList").hide();

            buildTechTree();
            var offset = $('#' + researchButton.getDomId()).offset();
            $('#techTree')
                .css({'top': offset.top + 20, 'left': offset.left + 20})
                .toggle();
        })
        .bind("KeyDown", function(e) {
            if (e.key == Crafty.keys.R) {
                $("#missionList").hide();

                buildTechTree();
                var offset = $('#' + researchButton.getDomId()).offset();
                $('#techTree')
                    .css({'top': offset.top + 20, 'left': offset.left + 20})
                    .toggle();
            }
        })
        .bind("CloseMenuWindow", function(){
            $("#techTree").hide();
        });

    var missionsButton = Crafty.e("2D, DOM, Text, menuButton, Mouse, Keyboard")
        .attr({x: 40, y: 6, w: 20, h: 16})
        .css({'padding-top': '5px'})
        .textFont({ size: '30px'})
        .text('*')
        .bind('Click', function () {
            $("#techTree").hide();

            buildMissionList();
            var offset = $('#' + missionsButton.getDomId()).offset();
            $('#missionList')
                .css({'top': offset.top + 20, 'left': offset.left + 20})
                .toggle();
        })
        .bind("KeyDown", function(e) {
            if (e.key == Crafty.keys.M) {
                $("#techTree").hide();

                buildMissionList();
                var offset = $('#' + missionsButton.getDomId()).offset();
                $('#missionList')
                    .css({'top': offset.top + 20, 'left': offset.left + 20})
                    .toggle();
            }
        })
        .bind("CloseMenuWindow", function(){
            $("#missionList").hide();
        });

    this.purchaseMenu = Crafty.e("2D, DOM, Text")
        .attr({w: 45, h: 22, x: 0, y: Game.height() - 42, alpha: 0.5})
        .text('<div></div>')
        .css({
            'background': '-moz-linear-gradient(center top , rgba(220, 220, 238, 0.3) 0%, rgba(170, 187, 238, 0.3) 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
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

    Crafty.bind('EnableWaterMining', function () {
        Game.mining_ability['Water'] = true;
    });

    Crafty.bind('KeyDown', function (e) {
        if (e.key == Crafty.keys.SPACE) {
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
                pauseIndicator.destroy();
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
        'assets/16x16_forest_1.gif',
        'assets/16x16_forest_2.gif',
        'assets/ship.png',
        'assets/base.png',
        'assets/probe.png',
        'assets/ISS.png'
    ], function () {
        // Define the individual sprites in the image
        // These components' names are prefixed with "spr_"
        Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
            spr_base: [0, 0],
            spr_baseProngs: [0, 1],
            spr_h_refinery: [1, 1],
            spr_gas_station: [1, 0]
        });
        Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
            spr_buy_probe: [1, 0],
            spr_buy_ship: [0, 0],
            spr_visited: [0, 1],
            spr_rock: [1, 1]
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

        // Now that our sprites are ready to draw, start the game
        Crafty.scene('Game');
    })
});
