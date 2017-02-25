$(function () {

    // preloader
    $(".container").hide();
    $('#loader').show();

    // get articles
    $.get("/api/articles/all", function (data) {
        for (i = data.length - 1; i >= 0; i--) {
            $(".container").append(makeArticleCard(data[i]));
        }

        $('#loader').hide();
        $(".container").show();
        $('article').readmore();
    });

    $('#blogNavButton').addClass('active');
});