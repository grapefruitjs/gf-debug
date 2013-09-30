gf.debug.SpritesPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';

    this.gfx = new gf.PIXI.Graphics();
    this.game.world.add.obj(this.gfx);

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
    }
};

 gf.inherit(gf.debug.SpritesPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this),
            pad = document.createElement('div'),
            col = document.createElement('div');

        // Show colliders
        gf.debug.ui.addClass(col, 'checkbox');
        gf.debug.ui.setHtml(col,
            '<input type="checkbox" value="" id="gf_debug_toggleShapes" class="gf_debug_toggleShapes" name="check" />' +
            '<label for="gf_debug_toggleShapes"></label>' +
            '<span>Draw Collider Shapes</span>' +
            '<br/>' +
            '<input type="checkbox" value="" id="gf_debug_toggleQuadTree" class="gf_debug_toggleQuadTree" name="check" />' +
            '<label for="gf_debug_toggleQuadTree"></label>' +
            '<span>Draw QuadTree</span>'
        );
        gf.debug.ui.bindDelegate(col, 'click', 'gf_debug_toggleShapes', this.toggle.bind(this, 'shapes'), 'input');
        gf.debug.ui.bindDelegate(col, 'click', 'gf_debug_toggleQuadTree', this.toggle.bind(this, 'tree'), 'input');
        pad.appendChild(col);

        div.appendChild(pad);

        return div;
    },
    toggle: function(type) {
        this.showing[type] = !this.showing[type];
    },
    tick: function() {
        this.gfx.clear();

        //draw all the bodies
        if(this.showing.shapes) {
            var bods = this.game.physics.bodies;
            for(var i = 0; i < bods.length; ++i) {
                gf.debug.drawBodyShape(
                    bods[i],
                    bods[i].sensor ? this.style.sensorShape : this.style._defaultShape,
                    this.gfx
                );
            }
        }

        //draw the quadtree
        if(this.showing.tree) {
            gf.debug.drawQuadTree(
                this.game.physics.tree,
                this.style.tree,
                this.gfx
            );
        }
    }
});