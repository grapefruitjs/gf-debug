gf.debug.SpritesPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';
};

gf.inherits(gf.debug.SpritesPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this),
            col = document.createElement('div');

        gf.debug.ui.addClass(col, 'checkbox');
        gf.debug.ui.setHtml(col,
            '<input type="checkbox" value="None" id="gf_debug_toggleCollisions" class="gf_debug_toggleCollisions" name="check" />' +
            '<label for="gf_debug_toggleCollisions"></label>' +
            '<span>Show sprite colliders</span>'
        );
        gf.debug.ui.bindDelegate(col, 'click', 'gf_debug_toggleCollisions', this.toggleCollisions.bind(this), 'input');
        div.appendChild(col);

        return div;
    },
    toggleCollisions: function() {
        var obj = this.game.stage,
            style = {
                color: 0xff2222,
                sensor: {
                    color: 0x22ff22
                }
            },
            show = !this.showing;

        while(obj) {
            if(obj.showPhysics) {
                if(show)
                    obj.showPhysics(style);
                else
                    obj.hidePhysics();
            }

            obj = obj._iNext;
        }

        this.game.world._showPhysics = this.showing = show;
    }
});