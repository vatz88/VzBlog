$(function () {
    $('.alert').toggle(false);
    $('#newArticle-form').toggle(false);
});

// new article btn click
$('#newArticle-btn').on('click', function () {
    $('.alert').toggle(false);
    $('#newArticle-form').toggle(false);
    $('#newArticle-form').slideToggle();
    $('imput[name="article_name"]').focus();
});

// on new atricle form submit
$("#newArticle-form").submit(function (event) {
    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page:
    var formData = $(this).serializeArray();
    var url = $(this).attr("action");

    var sendData = {};
    $(formData).each(function (index, obj) {
        sendData[obj.name] = obj.value;
    });

    // Send the data using post
    var posting = $.post(url, sendData);

    // Put the results in a div
    posting.done(function (data) {
        $('#newArticle-form').toggle(false);
        $('.alert').slideToggle();
        $('#alert-msg').text(data);
        $('#newArticle-form').trigger("reset");
    });
});

// Delete artilce
$(".removeArticleBtn").click(function () {

    var url = "/api/article/delete";

    var btn_value = $(this).val();
    var sendData = {
        "article_id": btn_value
    };

    // Send the data using post
    var posting = $.post(url, sendData);

    // Put the results in a div
    posting.done(function (data) {
        $('#newArticle-form').toggle(false);
        $('.alert').slideToggle();
        $('#alert-msg').text(data);
        $('#' + btn_value).remove();
    });
    posting.fail(function (data) {
        location.reload();
    });
});