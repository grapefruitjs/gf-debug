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

    this.keySize = 80;

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

        if(this.data.length > ((this.canvas.width - this.keySize) / this.dataLineWidth))
            this.data.shift();

        this.redraw();
    },
    redraw: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBg();
        this.drawKey();
        this.drawData();
    },
    drawBg: function() {
        var ctx = this.ctx,
            minX = this.keySize,
            maxX = this.canvas.width,
            maxY = this.canvas.height,
            step = maxY / 3;

        ctx.strokeStyle = ctx.fillStyle = this.labelStyle;

        //draw top marker line
        ctx.beginPath();
        ctx.moveTo(minX, step);
        ctx.lineTo(maxX, step);
        ctx.stroke();

        //draw the second marker line
        ctx.beginPath();
        ctx.moveTo(minX, step*2);
        ctx.lineTo(maxX, step*2);
        ctx.stroke();

        //draw baseline marker
        ctx.beginPath();
        ctx.moveTo(minX, maxY);
        ctx.lineTo(maxX, maxY);
        ctx.stroke();

        //draw marker line text
        ctx.fillText(((this.max / 3)*2).toFixed(this.labelPrecision) + this.label, minX + this.padding, step-this.padding);
        ctx.fillText((this.max / 3).toFixed(this.labelPrecision) + this.label, minX + this.padding, (step*2)-this.padding);
    },
    drawKey: function() {
        var ctx = this.ctx,
            i = 0,
            box = 10,
            pad = this.padding,
            lbl = this.labelStyle;

        for(var k in this.styles) {
            var style = this.styles[k],
                y = (box * i) + (pad * (i+1));

            ctx.fillStyle = style;
            ctx.fillRect(pad, y, box, box);
            ctx.fillStyle = lbl;
            ctx.fillText(k, pad + box + pad, y + box);

            i++;
        }
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
                x = maxX - ((len - i) * lw),
                y = maxY,
                v,
                step;

            for(var k in vals) {
                ctx.beginPath();
                ctx.strokeStyle = ctx.fillStyle = this.styles[k] || this.styles._default;
                ctx.lineWidth = lw;

                v = vals[k];
                if(k === 'event') {
                    ctx.moveTo(x, maxY);
                    ctx.lineTo(x, 0);
                    ctx.fillText(v, x+this.padding, this.padding*2);
                } else {
                    step = ((v / this.max) * maxY);
                    step = step < 0 ? 0 : step;

                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y-=step);
                }

                ctx.stroke();
            }
        }
    }
});