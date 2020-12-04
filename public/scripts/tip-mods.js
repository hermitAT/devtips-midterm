
$(document).ready(function() {


  $('.far fa-thumbs-up').on('click', function(event) {

    const $likeIcon = $(this);
    const $tip_id = $(this)[0].id;

    $.ajax('/tip/:tip_id/like', {
      method: 'POST',
      data: { "tip_id": $tip_id },
      dataType: "json"
    })
      .done(function() {
        $likeIcon.removeClass('far').addClass('fas');
      });
  });

  $('.fas fa-thumbs-up').on('click', function(event) {

    const $likeIcon = $(this);
    const $tip_id = $(this)[0].id;

    $.ajax('/tip/:tip_id/like', {
      method: 'DELETE',
      data: { "tip_id": $tip_id },
      dataType: "json"
    })
      .done(function() {
        $likeIcon.removeClass('fas').addClass('far');
      });
  });

  $('.far fa-bookmark').on('click', function(event) {

    const $bookmarkIcon = $(this);
    const $tip_id = $(this)[0].id;

    $.ajax('/tip/:tip_id/like', {
      method: 'POST',
      data: { "tip_id": $tip_id },
      dataType: "json"
    })
      .done(function() {
        $bookmarkIcon.removeClass('far').addClass('fas');
      });
  });

  $('.fas fa-bookmark').on('click', function(event) {

    const $bookmarkIcon = $(this);
    const $tip_id = $(this)[0].id;

    $.ajax('/tip/:tip_id/like', {
      method: 'DELETE',
      data: { "tip_id": $tip_id },
      dataType: "json"
    })
      .done(function() {
        $bookmarkIcon.removeClass('fas').addClass('far');
      });
  });

});
