debug.SpritesPanel = function(game) {
    debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';

    this.gfx = new gf.Graphics();

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

    this.showing = {
        shapes: false,
        tree: false
    };
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
            '<span>Draw Collider Shapes</span>' +
            '<div class="checkbox">' +
                '<input type="checkbox" value="" id="gf_debug_toggleQuadTree" class="gf_debug_toggleQuadTree" name="check" />' +
                '<label for="gf_debug_toggleQuadTree"></label>' +
            '</div>' +
            '<span>Draw QuadTree</span>'
        );
        debug.ui.delegate(pad, 'change', '.gf_debug_toggleShapes', this.toggleType.bind(this, 'shapes'));
        debug.ui.delegate(pad, 'change', '.gf_debug_toggleQuadTree', this.toggleType.bind(this, 'tree'));

        div.appendChild(pad);

        return div;
    },
    toggleType: function(type) {
        this.showing[type] = !this.showing[type];
    },
    tick: function() {
        if(this.game.world !== this.gfx.parent) {
            if(this.gfx.parent)
                this.gfx.parent.removeChild(this.gfx);

            this.game.world.add.obj(this.gfx);
        }

        this.gfx.clear();

        //draw all the bodies
        if(this.showing.shapes) {
            var bods = this.game.physics.bodies;
            for(var i = 0; i < bods.length; ++i) {
                debug.drawBodyShape(
                    bods[i],
                    bods[i].sensor ? this.style.sensorShape : this.style._defaultShape,
                    this.gfx
                );
            }
        }

        //draw the quadtree
        if(this.showing.tree) {
            debug.drawQuadTree(
                this.game.physics.tree,
                this.style.tree,
                this.gfx
            );
        }
    }
});