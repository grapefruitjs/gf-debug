//based on: http://www.html5rocks.com/en/tutorials/doodles/gamepad/
var STICK_OFFSET = 10,
btnIds = [
    'button-1',
    'button-2',
    'button-3',
    'button-4',
    'button-left-shoulder-top',
    'button-right-shoulder-top',
    'button-left-shoulder-bottom',
    'button-right-shoulder-bottom',
    'button-select',
    'button-start',
    'stick-1',
    'stick-2',
    'button-dpad-top',
    'button-dpad-bottom',
    'button-dpad-left',
    'button-dpad-right'
],
axisIds = [
    ['stick-1-axis-x', 'stick-1'],
    ['stick-1-axis-y', 'stick-1'],
    ['stick-2-axis-x', 'stick-2'],
    ['stick-2-axis-y', 'stick-2']
],
template =
'<div class="gf_debug_gp_buttons">' +
    '<div class="gf_debug_gp_face" name="button-1"></div>' +
    '<div class="gf_debug_gp_face" name="button-2"></div>' +
    '<div class="gf_debug_gp_face" name="button-3"></div>' +
    '<div class="gf_debug_gp_face" name="button-4"></div>' +
    '<div class="gf_debug_gp_top-shoulder" name="button-left-shoulder-top"></div>' +
    '<div class="gf_debug_gp_top-shoulder" name="button-right-shoulder-top"></div>' +
    '<div class="gf_debug_gp_bottom-shoulder" name="button-left-shoulder-bottom"></div>' +
    '<div class="gf_debug_gp_bottom-shoulder" name="button-right-shoulder-bottom"></div>' +
    '<div class="gf_debug_gp_select-start" name="button-select"></div>' +
    '<div class="gf_debug_gp_select-start" name="button-start"></div>' +
    '<div class="gf_debug_gp_stick" name="stick-1"></div>' +
    '<div class="gf_debug_gp_stick" name="stick-2"></div>' +
    '<div class="gf_debug_gp_face" name="button-dpad-top"></div>' +
    '<div class="gf_debug_gp_face" name="button-dpad-bottom"></div>' +
    '<div class="gf_debug_gp_face" name="button-dpad-left"></div>' +
    '<div class="gf_debug_gp_face" name="button-dpad-right"></div>' +
'</div>' +
'<div class="gf_debug_gp_labels">' +
    '<label for="button-1">?</label>' +
    '<label for="button-2">?</label>' +
    '<label for="button-3">?</label>' +
    '<label for="button-4">?</label>' +
    '<label for="button-left-shoulder-top">?</label>' +
    '<label for="button-right-shoulder-top">?</label>' +
    '<label for="button-left-shoulder-bottom">?</label>' +
    '<label for="button-right-shoulder-bottom">?</label>' +
    '<label for="button-select">?</label>' +
    '<label for="button-start">?</label>' +
    '<label for="stick-1">?</label>' +
    '<label for="stick-2">?</label>' +
    '<label for="button-dpad-top">?</label>' +
    '<label for="button-dpad-bottom">?</label>' +
    '<label for="button-dpad-left">?</label>' +
    '<label for="button-dpad-right">?</label>' +
    '<label for="stick-1-axis-x">?</label>' +
    '<label for="stick-1-axis-y">?</label>' +
    '<label for="stick-2-axis-x">?</label>' +
    '<label for="stick-2-axis-y">?</label>' +
'</div>' +
'<div class="gf_debug_gp_name">Grapefruit</div>';

gf.debug.Gamepad = function() {
    var el = this.element = document.createElement('div');
    el.classList.add('gf_debug_gp');
    el.innerHTML = template;
};

gf.inherit(gf.debug.Gamepad, Object, {
    updateButton: function(status) {
        var buttonEl = this.element.querySelector('[name="' + btnIds[status.code] + '"]'),
            labelEl = this.element.querySelector('label[for="' + btnIds[status.code] + '"]');

        labelEl.innerHTML = status.value.toFixed(2);

        if(status.down) {
            buttonEl.classList.add('pressed');
            labelEl.classList.add('visible');
        } else {
            buttonEl.classList.remove('pressed');
            labelEl.classList.remove('visible');
        }
    },
    updateAxis: function(status) {
        var stickEl = this.element.querySelector('[name="' + axisIds[status.code][1] + '"]'),
            labelEl = this.element.querySelector('label[for="' + axisIds[status.code][0] + '"]'),
            offsetVal = status.value * STICK_OFFSET;

        if(status.code === gf.input.GP_AXIS.LEFT_ANALOGUE_HOR || status.code === gf.input.GP_AXIS.RIGHT_ANALOGUE_HOR) {
            stickEl.style.marginLeft = offsetVal + 'px';
        } else {
            stickEl.style.marginTop = offsetVal + 'px';
        }

        labelEl.innerHTML = status.value.toFixed(2);
        if(status.value !== 0) {
            labelEl.classList.add('visible');
            if (status.value > 0) {
                labelEl.classList.add('positive');
            } else {
                labelEl.classList.add('negative');
            }
        } else {
            labelEl.classList.remove('visible');
            labelEl.classList.remove('positive');
            labelEl.classList.remove('negative');
        }
    }
});
