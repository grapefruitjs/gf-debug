gf.debug.WorldPanel = function (game) {
    gf.debug.Panel.call(this, game);

    this.name = 'world';
};

gf.inherits(gf.debug.WorldPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        gf.debug.ui.setText(div, 'A minimap of the world, outline your current viewport, stats about the world');

        return div;
    }
});