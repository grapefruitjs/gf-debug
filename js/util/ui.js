//Some general dom helpers
gf.debug.ui = {
    bindDelegate: function(dom, evt, cls, fn, name) {
        name = name ? name.toUpperCase() : 'DIV';

        dom.addEventListener(evt, function(e) {
            if(e.target && e.target.nodeName.toUpperCase() === name) {
                var classes = e.target.className.split(' ');

                if(classes && classes.indexOf(cls) !== -1) {
                    if(fn) fn(e);
                }
            }
        });
    },

    removeClass: function(dom, cls) {
        var classes = dom.className.split(' '),
            i = classes.indexOf(cls);

        if(i !== -1) {
            classes.splice(i, 1);
            dom.className = classes.join(' ').trim();
        }
    },

    addClass: function(dom, cls) {
        var classes = dom.className.split(' ');

        classes.push(cls);
        dom.className = classes.join(' ').trim();
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