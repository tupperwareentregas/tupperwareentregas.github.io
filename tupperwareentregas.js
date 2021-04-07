$(document).on("ready", function() {

    $("html, .logoInit").animate({
        "margin-left": "0px"
    }, 2000);

    $(".logoInit").hide();

    $(".bodyPage").show(400);
});

function showWindow(classText) {

    $("." + classText).show()

    $("html, body").animate({
        scrollTop: ($("." + classText).first().offset().top)
    }, 2000);
}

function closeWindows(classText) {

    $("." + classText).hide(1000);
}