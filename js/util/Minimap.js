gf.debug.Minimap = function(container, game) {
    this.canvas = document.createElement('canvas');
    this.prerenderCanvas = document.createElement('canvas');

    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.pctx = this.prerenderCanvas.getContext('2d');

    this.cachedpos = new gf.Point();
    this.mapimage = null;
    this.game = game;
    this.scale = 0.25;

    this.viewportRectColor = 'rgba(255, 0, 255, 1)';
};

gf.inherits(gf.debug.Minimap, Object, {
    render: function() {
        if(!this.game.world)
            return;

        var world = this.game.world;

        //if the world changes, prerender an image for it
        if(!this.cachedworld || this.cachedworld !== world) {
            this.cachedworld = world;

            this.canvas.width = this.prerenderCanvas.width = (world.size.x * world.tileSize.x * this.scale);
            this.canvas.height = this.prerenderCanvas.height = (world.size.y * world.tileSize.y * this.scale);

            this.prerender();
        }

        //only render when moving
        if(this.cachedpos && this.cachedpos.x === world.position.x && this.cachedpos === world.position.y)
            return;

        //update cached position
        this.cachedpos.x = world.position.x;
        this.cachedpos.y = world.position.y;

        //redraw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMap();
        //this.drawObjects();
        //this.drawViewport();
    },
    drawMap: function() {
        //draw the prerendered map image
        this.ctx.drawImage(this.prerenderCanvas, 0, 0);

        //draw the viewport
        var w = this.game.world,
            p = w.position,
            c = this.game.camera,
            s = this.scale;

        this.ctx.strokeStyle = this.viewportRectColor;
        this.ctx.strokeRect(
            (-p.x * s) / w.scale.x,
            (-p.y * s) / w.scale.x,
            (c.size.x * s) / w.scale.x,
            (c.size.y * s) / w.scale.y
        );
    },
    prerender: function() {
        var world = this.game.world,
            size = world.size,
            tsx = world.tileSize.x * this.scale,
            tsy = world.tileSize.y * this.scale;

        for(var l = 0, ll = world.children.length; l < ll; ++l) {
            var layer = world.children[l];

            //if it is a TiledLayer
            if(layer.tileIds && layer.visible) {
                for(var x = 0, xl = size.x; x < xl; ++x) {
                    for(var y = 0, yl = size.y; y < yl; ++y) {
                        var id = (x + (y * size.x)),
                            tid = layer.tileIds[id],
                            set = world.getTileset(tid),
                            tx;

                        if(set) {
                            tx = set.getTileTexture(tid);
                            this.prerenderTile(tx, x * tsx, y * tsy);
                        }
                    }
                }
            }
        }
    },
    prerenderTile: function(tile, x, y) {
        var frame = tile.frame;

        //from pixi canvas renderer
        this.pctx.drawImage(
            tile.baseTexture.source,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            x,
            y,
            frame.width * this.scale,
            frame.height * this.scale
        );
    }
});