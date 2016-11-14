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
        "<div class='panel-body'><article>" +
        content +
        "</article></div>" +
        "<div class='panel-footer'>" +
        "<div class='row'>" +
        "<div class='col-sm-12 col-md-12 col-lg-12 col-xs-12'>Article by " + "<em class='text-capitalize'>" + author + "</em>" + "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

    return atricleTemplate;
}

$('#searchBlog-form').submit(function (event) {

    event.preventDefault();

    // preloader
    $(".container").hide();
    $('#loader').show();

    $(".container").html('');
    $(".container").addClass('animate-bottom');

    var api_url = "/api/searchBlog/?keywords=" + $('#searchBlog-value').val();

    $.get(api_url, function (data) {
        if (data.length === 0) {
            $(".container").append('<h3 style="font-family:monospace;">Sorry nothing found. Try searching by tag, article title or author name.</h3>');
        } else {
            for (i = data.length - 1; i >= 0; i--) {
                $(".container").append(makeArticleCard(data[i]));
            }
        }
        $('#loader').hide();
        $(".container").show();
        $('article').readmore();
    });
});