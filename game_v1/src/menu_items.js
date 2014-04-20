Crafty.c('BuyProbe', {
    init: function () {
        this.requires('Actor, spr_buy_probe, Mouse, HTML, Keyboard');

        var info_box = Crafty.e("2D, DOM, Text, infoBox")
            .attr({w: 75, alpha: 0.8})
            .text('Buy Probe ($' + Game.probe_cost.toLocaleString() + ')')
            .css({
//                'background': '-moz-linear-gradient(center top , #B6B4E6 0%, #1790ED 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'background': 'linear-gradient(#B6B4E6, #1790ED) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'border': '1px solid #CCCCCC',
                'border-radius': '15px',
                'box-shadow': '0 1px 2px #FFFFFF, 0 -1px 1px #666666, 0 -1px 1px rgba(0, 0, 0, 0.5) inset, 0 1px 1px rgba(255, 255, 255, 0.8) inset',
                'margin': '0 15px',
                'padding': '5px 20px',
                'text-shadow': '0 1px 2px #111111',
                'display': 'none'
            })
            .textFont({ size: '12px' });

        this.bind('Click', function (data) {
            this.createProbe();
        });
        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;
            $('#' + info_box.getDomId()).css('height', 'inherit');
            this.attach(info_box);
            info_box.css({ display: 'block' });
        });
        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });

        this.bind("KeyDown", function(e) {
            if (e.key == Crafty.keys['1']) {
                retainCanvasFocus(e);

                this.createProbe();
            }
        });
    },

    createProbe: function() {
        activeShip.destroy();
        activeShip = Crafty.e('Probe').at(38, 38);
        updateScore(-1 * Game.probe_cost);
    }
});

Crafty.c('BuyShip', {
    init: function () {
        this.requires('Actor, spr_buy_ship, Mouse, HTML');

        var info_box = Crafty.e("2D, DOM, Text")
            .attr({w: 75, alpha: 0.8})
            .text('Buy Ship ($' + Game.ship_cost.toLocaleString() + ')')
            .css({
//                'background': '-moz-linear-gradient(center top , #B6B4E6 0%, #1790ED 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'background': 'linear-gradient(#B6B4E6, #1790ED) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'border': '1px solid #CCCCCC',
                'border-radius': '15px',
                'box-shadow': '0 1px 2px #FFFFFF, 0 -1px 1px #666666, 0 -1px 1px rgba(0, 0, 0, 0.5) inset, 0 1px 1px rgba(255, 255, 255, 0.8) inset',
                'margin': '0 15px',
                'padding': '5px 20px',
                'text-shadow': '0 1px 2px #111111',
                'display': 'none'
            })
            .textFont({ size: '12px' });

        this.bind('Click', function (data) {
            this.createShip();
        });
        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;
            $('#' + info_box.getDomId()).css('height', 'inherit');
            this.attach(info_box);
            testGlobal = info_box;
            info_box.css({ display: 'block' });
        });
        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });

        this.bind("KeyDown", function(e) {
            if (e.key == Crafty.keys['2']) {
                retainCanvasFocus(e);

                this.createShip();
            }
        });
    },

    createShip: function() {
        activeShip.destroy();
        activeShip = Crafty.e('Ship').at(38, 36);
        updateScore(-1 * Game.ship_cost);
    }
});

Crafty.c('BuyGasStation', {
    init: function () {
        this.requires('Actor, spr_gas_station, Mouse, HTML, infoBox');

        var info_box = Crafty.e("2D, DOM, Text")
            .attr({w: 75, alpha: 0.8})
            .text('Buy Space Gas Station ($1000000)')
            .css({
//                'background': '-moz-linear-gradient(center top , #B6B4E6 0%, #1790ED 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'background': 'linear-gradient(#B6B4E6, #1790ED) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'border': '1px solid #CCCCCC',
                'border-radius': '15px',
                'box-shadow': '0 1px 2px #FFFFFF, 0 -1px 1px #666666, 0 -1px 1px rgba(0, 0, 0, 0.5) inset, 0 1px 1px rgba(255, 255, 255, 0.8) inset',
                'margin': '0 15px',
                'padding': '5px 20px',
                'text-shadow': '0 1px 2px #111111',
                'display': 'none'
            })
            .textFont({ size: '12px' });

        this.bind('Click', function (data) {
            gasStation = Crafty.e('GasStation').at(20, 37);
            gasStation.fueled = false;
            updateScore(-1000000);
        });
        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;
            $('#' + info_box.getDomId()).css('height', 'inherit');
            this.attach(info_box);
            info_box.css({ display: 'block' });
        });
        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });
    }
});

Crafty.c('BuyHRefinery', {
    init: function () {
        this.requires('Actor, spr_h_refinery, Mouse, HTML');

        var info_box = Crafty.e("2D, DOM, Text, infoBox")
            .attr({w: 75, alpha: 0.8})
            .text('Buy Refinery ($1000000)')
            .css({
//                'background': '-moz-linear-gradient(center top , #B6B4E6 0%, #1790ED 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'background': 'linear-gradient(#B6B4E6, #1790ED) repeat scroll 0 0 rgba(0, 0, 0, 0)',
                'border': '1px solid #CCCCCC',
                'border-radius': '15px',
                'box-shadow': '0 1px 2px #FFFFFF, 0 -1px 1px #666666, 0 -1px 1px rgba(0, 0, 0, 0.5) inset, 0 1px 1px rgba(255, 255, 255, 0.8) inset',
                'margin': '0 15px',
                'padding': '5px 20px',
                'text-shadow': '0 1px 2px #111111',
                'display': 'none'
            })
            .textFont({ size: '12px' });

        this.bind('Click', function (data) {
            Crafty.e('HRefinery').at(20, 36);
            updateScore(-1000000);
        });
        this.bind('MouseOver', function (data) {
            info_box.x = this._x + 15;
            info_box.y = this._y - 45;
            $('#' + info_box.getDomId()).css('height', 'inherit');
            this.attach(info_box);
            info_box.css({ display: 'block' });
        });
        this.bind('MouseOut', function (data) {
            info_box.css({display: 'None'});
        });
    }
});
