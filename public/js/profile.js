$(function() {
    $('.alert').toggle(false);
})

$("#profileForm").submit(function(event) {
    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page:
    var formData = $(this).serializeArray();
    var url = $(this).attr("action");

    var sendData = {};
    $(formData).each(function(index, obj) {
        sendData[obj.name] = obj.value;
    });

    // Send the data using post
    var posting = $.post(url, sendData);

    // Put the results in a div
    posting.done(function(data) {
        $('.alert').toggle(false);
        $('.alert').slideToggle();
        $('#alert-msg').text(data);
    });
    posting.fail(function(data) {
        alert("Sorry, some error occured. Please try again later");
    });
});