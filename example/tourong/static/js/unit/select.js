define(function(require) {
    var $ = require('../libs/zepto.js');

    require('../libs/zepto-events.js');
    $('.u-select').each(function() {
        var $select = $('select', this);
        var $this = $(this);
        var text = $select.find('option').filter(function() {
            return this.selected;
        }).text() || $('option', $select).eq(0).text();

        $this.prepend('<div class="select-current">' + text + '</div>');
    });

    $(document).on('change', '.u-select select', function() {
        var $this = $(this);
        var text = $this.find('option').filter(function() {
            return this.selected;
        }).text() || $('option', $this).eq(0).text();

        $(this).prev().html(text);
    });
});