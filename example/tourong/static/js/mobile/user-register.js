define(function (require) {
    var mobileverify = require('../widget/mobileverify.js');

    require('../unit/location.js');
    require('../unit/select.js');
    require('../unit/bottomnav.js');
    mobileverify('#mobileverify');
});