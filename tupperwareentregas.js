function initAnimate() {

    $(".logoInit").animate({
        "margin-left": "40%"
    }, 1500, function() {
        $(".logoInit").hide();
        $(".bodyPage").show(100);
    });
}

function showWindow(classText) {

    $("." + classText).show()

    $("html, body").animate({
        scrollTop: ($("." + classText).first().offset().top)
    }, 2000);
}

function closeWindows(classText) {

    $("." + classText).hide(1000);
}