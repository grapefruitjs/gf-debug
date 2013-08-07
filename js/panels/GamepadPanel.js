gf.debug.GamepadPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'gamepad';
    this.title = 'Gamepad';

    this.gamepad = new gf.debug.Gamepad();
    this.firstEvent = true;
    this.bindEvents();
};

gf.inherits(gf.debug.GamepadPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        div.appendChild(this.gamepad.element);

        return div;
    },
    bindEvents: function() {
        //bind all buttons
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.FACE_1, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.FACE_2, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.FACE_3, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.FACE_4, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.LEFT_SHOULDER, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.RIGHT_SHOULDER, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.LEFT_TRIGGER, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.RIGHT_TRIGGER, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.SELECT, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.START, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.LEFT_ANALOGUE_STICK, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.RIGHT_ANALOGUE_STICK, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.PAD_TOP, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.PAD_BOTTOM, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.PAD_LEFT, this.gamepad.updateButton.bind(this));
        this.game.input.gamepad.buttons.on(gf.input.GP_BUTTON.PAD_RIGHT, this.gamepad.updateButton.bind(this));

        //bind all sticks
        this.game.input.gamepad.sticks.on(gf.input.GP_AXIS.LEFT_ANALOGUE_HOR, this.gamepad.updateStick.bind(this));
        this.game.input.gamepad.sticks.on(gf.input.GP_AXIS.LEFT_ANALOGUE_VERT, this.gamepad.updateStick.bind(this));
        this.game.input.gamepad.sticks.on(gf.input.GP_AXIS.RIGHT_ANALOGUE_HOR, this.gamepad.updateStick.bind(this));
        this.game.input.gamepad.sticks.on(gf.input.GP_AXIS.RIGHT_ANALOGUE_VERT, this.gamepad.updateStick.bind(this));
    }
});