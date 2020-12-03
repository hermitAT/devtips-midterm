
$(document).ready(function() {


  $('.far fa-thumbs-up').on('click', function(event) {

    const $likeIcon = $(this);
    const tip_id = $(this).closest("a").find('#tip_id').text();

    $.ajax('/tip/:tip_id/like', {
      method: 'POST',
      data: { "tip_id": tip_id },
      dataType: "json"
    })
      .done(function() {
        $likeIcon.removeClass('far').addClass('fas');
      });
  });

  $('.fas fa-thumbs-up').on('click', function(event) {

    const $likeIcon = $(this);
    const tip_id = $(this).closest("a").find('#tip_id').text();

    $.ajax('/tip/:tip_id/like', {
      method: 'DELETE',
      data: { "tip_id": tip_id },
      dataType: "json"
    })
      .done(function() {
        $likeIcon.removeClass('fas').addClass('far');
      });
  });

  $('.far fa-bookmark').on('click', function(event) {

    const $bookmarkIcon = $(this);
    const tip_id = $(this).closest("a").find('#tip_id').text();

    $.ajax('/tip/:tip_id/like', {
      method: 'POST',
      data: { "tip_id": tip_id },
      dataType: "json"
    })
      .done(function() {
        $bookmarkIcon.removeClass('far').addClass('fas');
      });
  });

  $('.fas fa-bookmark').on('click', function(event) {

    const $bookmarkIcon = $(this);
    const $tip_id = $(this).closest('a').find('#tip_id').text();

    $.ajax('/tip/:tip_id/like', {
      method: 'DELETE',
      data: { "tip_id": $tip_id },
      dataType: "json"
    })
      .done(function() {
        $bookmarkIcon.removeClass('fas').addClass('far');
      });
  });

  // FILL IN THE .done PART OF THIS TO RENDER THE TIP RETURNED!
  $('#edit-tip').on('click', function(event) {

    const $tip_id = $(this).closest('a').find('#tip_id').text();
    const $description = $(this).closest('form').find('.desc').val();
    const $title = $(this).closest('form').find('.title').val();

    $.ajax('/tip/:tip_id/edit', {
      method: 'POST',
      data: { "tip_id": $tip_id, "description": $description, "title": $title },
      dataType: "json"
    })
      .done(function() {
        // fill me in l8r
      });
  });

});
