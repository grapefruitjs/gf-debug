debug.PerformancePanel = function(game) {
    debug.Panel.call(this, game);

    this.name = 'performance';
    this.title = 'Performance';
    this.eventQueue = [];
};

gf.inherit(debug.PerformancePanel, debug.Panel, {
    createPanelElement: function() {
        var div = debug.Panel.prototype.createPanelElement.call(this);

        this.graph = new debug.Graph(div, window.innerWidth - 20, 250 - 5, {
            input: 'rgba(80, 220, 80, 1)',
            camera: 'rgba(80, 80, 220, 1)',
            phys: 'rgba(80, 220, 200, 1)',
            user: 'rgba(200, 80, 220, 1)',
            draw: 'rgba(220, 80, 80, 1)',
            debug: 'rgba(220, 220, 80, 1)',
            event: 'rgba(200, 200, 200, 0.6)'
        });
        this.graph.max = 45;

        return div;
    },
    tick: function() {
        var t = this.game.timings,
            o = {
                input: t.inputEnd - t.inputStart,
                camera: t.cameraEnd - t.cameraStart,
                phys: t.physicsEnd - t.physicsStart,
                user: t.userFuncsEnd - t.userFuncsStart,
                debug: t.__debugLastDiff || 0,
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