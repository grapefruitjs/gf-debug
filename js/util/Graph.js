gf.debug.Graph = function(container, width, height, dataStyles) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this.label = 'ms';
    this.labelPrecision = 0;
    this.labelStyle = 'rgba(200, 200, 200, 0.6)';
    this.max = 50;
    this.dataLineWidth = 1;
    this.padding = 5;

    this.data = [];
    this.styles = dataStyles || {};

    if(!this.styles._default)
        this.styles._default = 'red';

    if(!this.styles.event)
        this.styles.event = 'gray';
};

gf.inherits(gf.debug.Graph, Object, {
    addData: function(values) {
        this.data.push(values);

        if(this.data.length > (this.canvas.width / this.dataLineWidth))
            this.data.shift();

        this.redraw();
    },
    redraw: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBg();
        this.drawData();
    },
    drawBg: function() {
        var ctx = this.ctx,
            maxX = this.canvas.width,
            maxY = this.canvas.height,
            step = maxY / 3;

        ctx.strokeStyle = ctx.fillStyle = this.labelStyle;

        //draw top marker line
        ctx.beginPath();
        ctx.moveTo(0, step);
        ctx.lineTo(maxX, step);
        ctx.stroke();

        //draw the second marker line
        ctx.beginPath();
        ctx.moveTo(0, step*2);
        ctx.lineTo(maxX, step*2);
        ctx.stroke();

        //draw baseline marker
        ctx.beginPath();
        ctx.moveTo(0, maxY);
        ctx.lineTo(maxX, maxY);
        ctx.stroke();

        //draw marker line text
        ctx.fillText(((this.max / 3)*2).toFixed(this.labelPrecision) + this.label, this.padding, step-this.padding);
        ctx.fillText((this.max / 3).toFixed(this.labelPrecision) + this.label, this.padding, (step*2)-this.padding);
    },
    drawData: function() {
        var ctx = this.ctx,
            maxX = this.canvas.width,
            maxY = this.canvas.height,
            lw = this.dataLineWidth,
            len = this.data.length;

        //iterate backwards through the data drawing from right to left
        for(var i = len - 1; i > -1; --i) {
            var vals = this.data[i],
                x1 = maxX - ((len - i) * lw), //right - (count * width)
                x2 = x1-lw,
                y = maxY;

            for(var k in vals) {
                var v = vals[k];
                if(k === 'event') {
                    ctx.fillStyle = this.styles.event;
                    ctx.fillRect(x1, 0, x2, maxY);
                    ctx.fillText(v, x1+2, this.padding);
                } else {
                    var step = maxY - ((v / this.max) * maxY); //bottom - ((prct of max value) * max Y coord)

                    ctx.fillStyle = this.styles[k] || this.styles._default;
                    console.log(x1, y, x2, y-step);
                    debugger;
                    ctx.fillRect(x1, y, x2, y-=step);
                }
            }
        }
    }
});