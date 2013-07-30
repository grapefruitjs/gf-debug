gf.debug.PhysicsPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'physics';
};

gf.inherits(gf.debug.PhysicsPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        gf.debug.ui.setText(div, this.name);

        return div;
    }
});