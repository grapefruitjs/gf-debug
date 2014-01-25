debug.SpritesPanel = function(game) {
    debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';

    this.showing = {
        shapes: false,
        tree: false
    };

    //style of things to draw
    this.style = {
        _defaultShape: {
            size: 1,
            color: 0xff2222,
            alpha: 1
        },
        sensorShape: {
            size: 1,
            color: 0x22ff22,
            alpha: 1
        },
        tree: {
            size: 1,
            color: 0x2222ff,
            alpha: 1
        }
    };

    this.gfx = new gf.Graphics();
};

gf.inherit(debug.SpritesPanel, debug.Panel, {
    createPanelElement: function() {
        var div = debug.Panel.prototype.createPanelElement.call(this),
            pad = document.createElement('div');

        // Show colliders
        debug.ui.setHtml(pad,
            '<div class="checkbox">' +
                '<input type="checkbox" value="" id="gf_debug_toggleShapes" class="gf_debug_toggleShapes" name="check" />' +
                '<label for="gf_debug_toggleShapes"></label>' +
            '</div>' +
            '<span>Draw Collider Shapes (WARNING: Very Expensive!)</span>'
        );
        debug.ui.delegate(pad, 'change', '.gf_debug_toggleShapes', this.toggleType.bind(this, 'shapes'));

        div.appendChild(pad);

        return div;
    },
    toggleType: function(type) {
        this.showing[type] = !this.showing[type];
    },
    tick: function() {
        var idx = this.game.stage.children.indexOf(this.gfx);

        //ensure always on top
        if(idx !== this.game.stage.children.length - 1) {
            if(this.gfx.parent)
                this.gfx.parent.removeChild(this.gfx);

            this.game.stage.addChild(this.gfx);
        }

        this.gfx.clear();

        //draw all the bodies
        if(this.showing.shapes) {
            var self = this;
            this.game.physics.space.eachShape(function(shape) {
                if(!shape.body) return;

                shape.sprite._drawShape(
                    shape,
                    self.gfx,
                    shape.sensor ? self.style.sensorShape : self.style._defaultShape
                );
            });
        }
    }
});
