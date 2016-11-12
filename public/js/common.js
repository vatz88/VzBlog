var makeArticleCard = function (data) {

    var title = data.article_name;
    var content = data.article_content;
    var author = data.first_name + " " + data.last_name;
    var tag;
    if (data.tag) {
        tag = "'>" + data.tag;
    } else {
        tag = "hidden'>";
    }

    var atricleTemplate = "<div class='panel panel-default'>" +
        "<div class='panel-heading text-uppercase'>" +
        "<span class='articleTitle'>" + title + "  </span>" +
        "<span class='label label-info" + tag + "</span>" +
        "</div>" +
        "<div class='panel-body'>" +
        content +
        "</div>" +
        "<div class='panel-footer'>" +
        "<div class='row'>" +
        "<div class='col-sm-12 col-md-12 col-lg-12 col-xs-12'>Article by " + "<em class='text-capitalize'>" + author + "</em>" + "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

    return atricleTemplate;
}

$('#searchBlog-btn').click(function (event) {

    event.preventDefault();

    $(".container").html('');

    var api_url = "/api/searchBlog/?keywords=" + $('#searchBlog-value').val();

    $.get(api_url, function (data) {
        if (data.length === 0) {
            $(".container").append('<h2>Sorry nothing found. Try searching by tag, article title or author name.</h2>');
        } else {
            for (i = data.length - 1; i >= 0; i--) {
                $(".container").append(makeArticleCard(data[i]));
            }
        }
    });
});