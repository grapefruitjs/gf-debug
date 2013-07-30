//Some general dom helpers
gf.debug.ui = {
    bindDelegate: function(dom, evt, cls, fn) {
        dom.addEventListener(evt, function(e) {
            if(e.target && e.target.nodeName === 'div') {
                var classes = e.target.className.trim().split(' ');

                if(classes && classes.indexOf(cls) !== -1) {
                    if(fn) fn(e);
                }
            }
        });
    },

    removeClass: function(dom, cls) {
        var classes = dom.className.trim().split(' '),
            i = classes.indexOf(cls);

        if(i !== -1) {
            classes.splice(i, 1);
            dom.className = classes.join(' ');
        }
    },

    addClass: function(dom, cls) {
        var classes = dom.className.trim().split(' ');

        classes.push(cls);
        dom.className += classes.join(' ');
    },

    setText: function(dom, txt) {
        dom.textContent = txt;
    },

    setHtml: function(dom, html) {
        dom.innerHTML = html;
    },

    setStyle: function(dom, style, value) {
        if(typeof style === 'string') {
            dom.style[style] = value;
        } else {
            for(var key in style) {
                dom.style[key] = style[key];
            }
        }
    }
};