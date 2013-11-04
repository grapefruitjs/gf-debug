debug.Physics = function(container, game) {
    //create canvases
    this.canvas = document.createElement('canvas');
    this.staticCanvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sctx = this.staticCanvas.getContext('2d');
    container.appendChild(this.canvas);
    //container.appendChild(this.staticCanvas);

    //store trees
    this.game = game;

    //style of things to draw
    this.style = {
        _defaultShape: {
            size: 1,
            color: '#ff2222',
            alpha: 1
        },
        sensorShape: {
            size: 1,
            color: '#22ff22',
            alpha: 1
        },
        tree: {
            size: 1,
            color: '#2222ff',
            alpha: 1
        }
    };
};

gf.inherit(debug.Physics, Object, {
    render: function() {
        var sw, sh,
            fw, fh,
            doRender = false,
            actShapes = this.game.physics.space.activeShapes,
            stcShapes = this.game.physics.space.staticShapes;

        sw = sh = fw = fh = 0;

        if(actShapes.root) {
            /* jshint -W106 */
            sw = actShapes.root.bb_r - actShapes.root.bb_l;
            sh = actShapes.root.bb_t - actShapes.root.bb_b;
            /* jshint +W106 */
            doRender = true;
        }

        if(stcShapes.root) {
            /* jshint -W106 */
            fw = Math.max(sw, stcShapes.root.bb_r - stcShapes.root.bb_l);
            fh = Math.max(sh, stcShapes.root.bb_t - stcShapes.root.bb_b);
            /* jshint +W106 */
            doRender = true;
        }

        if(doRender) {
            //clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width = fw, this.canvas.height = fh);

            //render static shapes
            //if(this.staticCanvas.width !== sw || this.staticCanvas.height !== sh) {
            //this.sctx.clearRect(0, 0, this.staticCanvas.width = sw, this.staticCanvas.height = sh);
            //this.staticCanvas.width = sw;
            //this.staticCanvas.height = sh;
            this.drawShapes(this.ctx, stcShapes);
            //}

            //draw static canvas
            /* jshint -W106 */
            //this.ctx.drawImage(this.staticCanvas, 0, 0);
            /* jshint +W106 */

            //render active shapes
            this.drawShapes(this.ctx, actShapes);
        }
    },
    drawShapes: function(ctx, tree) {
        var self = this;
        tree.each(function(shape) {
            self.drawShape(
                ctx,
                shape,
                shape.sensor ? self.style.sensorShape : self.style._defaultShape
            );
        });
    },
    drawShape: function(ctx, shape, style) {
        ctx.lineWidth = style.size;
        ctx.strokeStyle = style.color;

        var p = shape.body.p;

        //draw circle
        if(shape.type === 'circle') {
            /* jshint -W106 */
            var cx = shape.bb_l + ((shape.bb_r - shape.bb_l) / 2),
                cy = shape.bb_t + ((shape.bb_b - shape.bb_t) / 2);
            /* jshint +W106 */

            ctx.arc(cx, cy, shape.r, 0, 2 * Math.PI);
        }
        //draw polygon
        else {
            var vx = shape.verts[0],
                vy = shape.verts[1];

            ctx.beginPath();
            ctx.moveTo(
                p.x + vx,
                p.y + vy
            );

            for(var i = 2; i < shape.verts.length; i += 2) {
                ctx.lineTo(
                    p.x + shape.verts[i],
                    p.y + shape.verts[i + 1]
                );
            }

            ctx.closePath();
        }

        ctx.stroke();
    }
});
