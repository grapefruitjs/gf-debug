gf.debug.PerformancePanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'performance';
    this.title = 'Performance';
    this.eventQueue = [];
};

gf.inherits(gf.debug.PerformancePanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        gf.debug.ui.setText(div, this.name);

        this.graph = new gf.debug.Graph(div, 1500, 200, {
            input: 'rgb(80, 80, 80)',
            camera: 'rgb(80, 80, 220)',
            physics: 'rgb(80, 220, 80)',
            render: 'rgb(220, 80, 80)',
            event: 'rgba(200, 200, 200, 0.6)'
        });

        return div;
    },
    tick: function() {
        var t = this.game.timings,
            o = {
                input: t.inputEnd - t.inputStart,
                camera: t.cameraEnd - t.cameraStart,
                phys: t.physicsEnd - t.physicsStart,
                render: t.renderEnd - t.renderStart
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