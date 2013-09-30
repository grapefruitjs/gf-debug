gf.debug.Minimap = function(container, game) {
    this.canvas = document.createElement('canvas');
    this.prerenderCanvas = document.createElement('canvas');

    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.pctx = this.prerenderCanvas.getContext('2d');

    this.cachedpos = new gf.Vector();
    this.mapimage = null;
    this.game = game;
    this.scale = 0.25;

    this.viewportRectColor = 'rgba(255, 0, 255, 1)';
};

 gf.inherit(gf.debug.Minimap, Object, {
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
        var world = this.game.world;

        //for each child of world, if it is visible and a tilemap, prerender it
        for(var w = 0, wl = world.children.length; w < wl; ++w) {
            if(world.children[w].visible && world.children[w] instanceof gf.Tilemap) {
                this.prerenderMap(world.children[w]);
            }
        }
    },
    prerenderMap: function(map) {
        for(var l = 0, ll = map.children.length; l < ll; ++l) {
            var layer = map.children[l];

            //if it is a Tilelayer and is visible
            if(layer.tileIds && layer.visible) {
                this.prerenderLayer(layer, map);
            }
        }
    },
    prerenderLayer: function(layer, map) {
        var size = map.size,
            tsx = map.tileSize.x * this.scale,
            tsy = map.tileSize.y * this.scale;

        //render the layer one tile at a time
        for(var x = 0, xl = size.x; x < xl; ++x) {
            for(var y = 0, yl = size.y; y < yl; ++y) {
                var id = (x + (y * size.x)),
                    tid = layer.tileIds[id];

                this.prerenderTile(tid, map);
            }
        }
    },
    prerenderTile: function(tid, x, y) {
        var set = map.getTileset(tid),
            tx = set.getTileTexture(tid);

        if(!set || !tx)
            return;

        //from pixi canvas renderer
        this.pctx.drawImage(
            tx.baseTexture.source,
            tx.frame.x,
            tx.frame.y,
            tx.frame.width,
            tx.frame.height,
            x,
            y,
            tx.frame.width * this.scale,
            tx.frame.height * this.scale
        );
    }
});