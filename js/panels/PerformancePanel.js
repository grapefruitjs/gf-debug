gf.debug.PerformancePanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'performance';
    this.title = 'Performance';
    this.eventQueue = [];
    this.active = false;
};

gf.inherits(gf.debug.PerformancePanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        this.graph = new gf.debug.Graph(div, window.innerWidth, 200, {
            input: 'rgba(80, 220, 80, 1)',
            camera: 'rgba(80, 80, 220, 1)',
            phys: 'rgba(80, 220, 200, 1)',
            draw: 'rgba(220, 80, 80, 1)',
            event: 'rgba(200, 200, 200, 0.6)'
        });
        this.graph.max = 50;

        return div;
    },
    tick: function() {
        if(!this.active)
            return;

        var t = this.game.timings,
            o = {
                input: t.inputEnd - t.inputStart,
                camera: t.cameraEnd - t.cameraStart,
                phys: t.physicsEnd - t.physicsStart,
                draw: t.renderEnd - t.renderStart
            },
            evt = this.eventQueue.shift();

        if(evt)
            o.event = evt;

        this.graph.addData(o);
    },
    logEvent: function(name) {
        this.eventQueue.push(name);
    }
});