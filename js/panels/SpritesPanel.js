gf.debug.SpritesPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';

    this.gfx = new gf.PIXI.Graphics();

    this.style = {
        _default: {
            size: 1,
            color: 0xff2222,
            alpha: 1
        },
        sensor: {
            size: 1,
            color: 0x22ff22,
            alpha: 1
        }
    };
};

 gf.inherit(gf.debug.SpritesPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this),
            pad = document.createElement('div'),
            col = document.createElement('div');

        // Show colliders
        gf.debug.ui.addClass(col, 'checkbox');
        gf.debug.ui.setHtml(col,
            '<input type="checkbox" value="None" id="gf_debug_toggleCollisions" class="gf_debug_toggleCollisions" name="check" />' +
            '<label for="gf_debug_toggleCollisions"></label>' +
            '<span>Show sprite colliders</span>'
        );
        gf.debug.ui.bindDelegate(col, 'click', 'gf_debug_toggleCollisions', this.toggleCollisions.bind(this), 'input');
        pad.appendChild(col);

        div.appendChild(pad);

        return div;
    },
    toggleCollisions: function() {
        this.showing = !this.showing;

        if(this.showing) {
            this.game.world.addChild(this.gfx);
            this._drawPhysics();
        } else {
            if(this.gfx.parent)
                this.gfx.parent.removeChild(this.gfx);
        }
    },
    tick: function() {
        if(this.showing) {
            this._drawPhysics();
        }
    },
    _drawPhysics: function() {
        var self = this,
            g = this.gfx,
            bods = this.game.physics.bodies;

        this.gfx.clear();
        for(var i = 0; i < bods.length; ++i) {
            var body = bods[i],
                shape = body.shape,
                p = shape.position,
                style = body.sensor ? self.style.sensor : self.style._default;

            g.lineStyle(style.size, style.color, style.alpha);

            //circle
            if(shape._shapetype === gf.SHAPE.CIRCLE) {
                //var cx = shape.bb_l + ((shape.bb_r - shape.bb_l) / 2),
                //    cy = shape.bb_t + ((shape.bb_b - shape.bb_t) / 2);

                g.drawCircle(p.x, p.y, shape.radius);
            }
            //polygon
            else {
                var pt = shape.points[0];

                g.moveTo(p.x + pt.x, p.y + pt.y);

                for(var x = 1; x < shape.points.length; x++) {
                    g.lineTo(
                        p.x + shape.points[x].x,
                        p.y + shape.points[x].y
                    );
                }

                g.lineTo(p.x + pt.x, p.y + pt.y);
            }
        }
    }
});