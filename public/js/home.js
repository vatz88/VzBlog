// var articleData;
// var totalArticles;
// var start;
// var end;
// var maxArticles = 5;

// var makeArticleCard = function (data) {

//     var title = data.article_name;
//     var content = data.article_content;
//     var author = data.first_name + " " + data.last_name;
//     var tag;
//     if (data.tag) {
//         tag = "'>" + data.tag;
//     } else {
//         tag = "hidden'>";
//     }

//     var atricleTemplate = "<div class='panel panel-default'>" +
//         "<div class='panel-heading text-uppercase'>" +
//         "<span class='articleTitle'>" + title + "  </span>" +
//         "<span class='label label-info" + tag + "</span>" +
//         "</div>" +
//         "<div class='panel-body text-capitalize'>" +
//         content +
//         "</div>" +
//         "<div class='panel-footer'>" +
//         "<div class='row'>" +
//         "<div class='col-sm-12 col-md-12 col-lg-12 col-xs-12'>Article by " + "<em class='text-capitalize'>" + author + "</em>" + "</div>" +
//         "</div>" +
//         "</div>" +
//         "</div>";

//     return atricleTemplate;
// }

// function displayArticles() {
//     if (start < 0) {
//         return;
//     }
//     if (start < maxArticles) {
//         end = 0;
//     } else {
//         end = start - maxArticles;
//     }
//     var i;
//     for (i = start; i >= end; i--) {
//         $(".container").append(makeArticleCard(articleData[i]));
//     }
//     start = end - 1;
//     return;
// }

// $('#blogNavButton').addClass('active');

// displayArticles();

$(function() {
    $('#blogNavButton').addClass('active');

    $.get("/api/articles/all", function(data) {
        for (i = data.length - 1; i >= 0; i--) {
            $(".container").append(makeArticleCard(data[i]));
        }
    });
});