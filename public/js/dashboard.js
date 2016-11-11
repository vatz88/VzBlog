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
    console.log(sendData);

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