gf.debug.GamepadPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'gamepad';
};

gf.inherits(gf.debug.GamepadPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        gf.debug.ui.setText(div, this.name);

        return div;
    },
    tick: function() {
        
    }
});