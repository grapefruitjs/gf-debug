gf.debug.WorldPanel = function (game) {
    gf.debug.Panel.call(this, game);

    this.name = 'world';
};

gf.inherits(gf.debug.WorldPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        gf.debug.ui.setText(div, this.name);

        return div;
    }
});