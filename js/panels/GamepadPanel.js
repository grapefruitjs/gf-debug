gf.debug.GamepadPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'gamepad';
    this.title = 'Gamepad';

    this.gamepad = new gf.debug.Gamepad();
    this.bindEvents();
};

gf.inherits(gf.debug.GamepadPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        div.appendChild(this.gamepad.element);
        window.console.log(this.gamepad.element);

        return div;
    },
    bindEvents: function() {
        var game = this.game,
            pad = this.gamepad;

        //bind all buttons
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.FACE_1, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.FACE_2, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.FACE_3, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.FACE_4, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.LEFT_SHOULDER, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.RIGHT_SHOULDER, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.LEFT_TRIGGER, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.RIGHT_TRIGGER, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.SELECT, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.START, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.LEFT_ANALOGUE_STICK, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.RIGHT_ANALOGUE_STICK, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.PAD_TOP, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.PAD_BOTTOM, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.PAD_LEFT, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.input.GP_BUTTON.PAD_RIGHT, pad.updateButton.bind(pad));

        //bind all sticks
        game.input.gamepad.sticks.on(gf.input.GP_AXIS.LEFT_ANALOGUE_HOR, pad.updateAxis.bind(pad));
        game.input.gamepad.sticks.on(gf.input.GP_AXIS.LEFT_ANALOGUE_VERT, pad.updateAxis.bind(pad));
        game.input.gamepad.sticks.on(gf.input.GP_AXIS.RIGHT_ANALOGUE_HOR, pad.updateAxis.bind(pad));
        game.input.gamepad.sticks.on(gf.input.GP_AXIS.RIGHT_ANALOGUE_VERT, pad.updateAxis.bind(pad));
    }
});