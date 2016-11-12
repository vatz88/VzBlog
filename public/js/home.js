$(function () {
    $('#blogNavButton').addClass('active');

    $.get("/api/articles/all", function (data) {
        for (i = data.length - 1; i >= 0; i--) {
            $(".container").append(makeArticleCard(data[i]));
        }
    });
});