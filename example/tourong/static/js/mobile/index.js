define(function(require) {
    var banner = require('../widget/banner.js');
    var scrollwords = require('../widget/scrollwords.js');
    
    require('../unit/location.js');
    require('../unit/bottomnav.js');
    banner('#banner');
    scrollwords('#scrollwords');
});