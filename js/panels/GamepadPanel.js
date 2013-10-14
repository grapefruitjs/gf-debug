debug.GamepadPanel = function(game) {
    debug.Panel.call(this, game);

    this.name = 'gamepad';
    this.title = 'Gamepad';

    this.gamepad = new debug.Gamepad();
    this.bindEvents();
};

gf.inherit(debug.GamepadPanel, debug.Panel, {
    createPanelElement: function() {
        var div = debug.Panel.prototype.createPanelElement.call(this);

        div.appendChild(this.gamepad.element);

        return div;
    },
    bindEvents: function() {
        var game = this.game,
            pad = this.gamepad;

        //bind all buttons
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.FACE_1, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.FACE_2, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.FACE_3, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.FACE_4, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.LEFT_SHOULDER, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.RIGHT_SHOULDER, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.LEFT_TRIGGER, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.RIGHT_TRIGGER, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.SELECT, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.START, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.LEFT_ANALOGUE_STICK, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.RIGHT_ANALOGUE_STICK, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.PAD_TOP, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.PAD_BOTTOM, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.PAD_LEFT, pad.updateButton.bind(pad));
        game.input.gamepad.buttons.on(gf.GamepadButtons.BUTTON.PAD_RIGHT, pad.updateButton.bind(pad));

        //bind all sticks
        game.input.gamepad.sticks.on(gf.GamepadSticks.AXIS.LEFT_ANALOGUE_HOR, pad.updateAxis.bind(pad));
        game.input.gamepad.sticks.on(gf.GamepadSticks.AXIS.LEFT_ANALOGUE_VERT, pad.updateAxis.bind(pad));
        game.input.gamepad.sticks.on(gf.GamepadSticks.AXIS.RIGHT_ANALOGUE_HOR, pad.updateAxis.bind(pad));
        game.input.gamepad.sticks.on(gf.GamepadSticks.AXIS.RIGHT_ANALOGUE_VERT, pad.updateAxis.bind(pad));
    }
});