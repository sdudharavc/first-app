var CommanFunction = function () {
    var handleHorizontalPopup = function () {
        var height = $(window).height();
        $('.td-tab-container').css({height: height})
        $('body').on('click', '.tab-minimize', function () {
            $(this).closest('.td-tab-container').addClass('tab-minimized');
        });
        $('body').on('click', '.td-tab-container.tab-minimized', function () {
            $(this).removeClass('tab-minimized');
        });
    }
    return {
        init_handleHorizontalPopup: function () {
            handleHorizontalPopup();
        }
    }
}();