gf.debug.MapPanel = function (game) {
    gf.debug.Panel.call(this, game);

    this.name = 'map';
    this.title = 'Mini-Map';
};

gf.inherits(gf.debug.MapPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        this.minimap = new gf.debug.Minimap(div, this.game);

        return div;
    },
    tick: function() {
        this.minimap.render();
    }
});