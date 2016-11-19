var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
    var date = data.time.split('T')[0];
    var formatedDate = date.split('-'); // yyyy-mm-dd
    formatedDate = formatedDate[2].toString() + " " + monthNames[parseInt(formatedDate[1])] + " " + formatedDate[0].toString();

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
        "<div class='col-sm-6 col-md-6 col-lg-6 col-xs-6'>Article by " + "<em class='text-capitalize'>" + author + "</em>" + "</div>" +
        "<div class='col-sm-6 col-md-6 col-lg-6 col-xs-6 text-right'>Published on " + "<em>" + formatedDate + "</em>" + "</div>" +
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