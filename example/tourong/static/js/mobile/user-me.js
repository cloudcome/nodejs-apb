define(function (require) {
    var $ = require('../libs/zepto.js');
    var area3 = require('../widget/area3.js');
    var $avatar = $('#avatar');
    var $preview = $('.current-avatar', $avatar);
    var dft = $preview.data('default');
    var $file = $('.input-file', $avatar);
    var accept = ($file.attr('accept') || '').split(',');

    require('../unit/location.js');
    require('../unit/bottomnav.js');
    require('../unit/select.js');
    area3('#area3');

    $file.change(function() {
        var file = this.files && this.files[0];
        var src;

        if (file) {
            if ($.inArray(file.type, accept) > -1 && window.URL) {
                src = URL.createObjectURL(file);
                $preview.html('<img src="' + src + '">');
            } else {
                _setDefault();
            }
        } else {
            _setDefault();
        }
    });

    function _setDefault() {
        $preview.html('<img src="' + dft + '">');
    }
});