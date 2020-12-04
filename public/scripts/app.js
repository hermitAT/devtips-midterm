
$(() => {
  // Autoresize textarea elements
  autosize(document.querySelectorAll('textarea'));

  // The compose box
  $('#compose-textarea-title, #compose-textarea-data, #compose-textarea-description, #compose-input-tags').on('input propertychange', (e) => {
    if ($('#compose-textarea-title').val() || $('#compose-textarea-data').val() || $('#compose-textarea-description').val() || $('#compose-input-tags').val()) {
      $('#compose-textarea-data').show();
      if ($('#compose-textarea-data').val() || $('#compose-textarea-description').val() || $('#compose-input-tags').val()) {
        $('#compose-metadata').show();
      } else {
        $('#compose-metadata').hide();
      }
    } else {
      $('#compose-textarea-data').hide();
      $('#compose-metadata').hide();
    }
  });

  // Compose box hidden radio select element via buttons
  $('#form-compose .type-select').data();
  $('#form-compose .type-select').on('click', (e) => {
    const thisElement = $(e.currentTarget);
    // Get type of clicked button
    const type = thisElement.data('type');
    // Select corresponding input
    $('#compose-type').val(type).change();
    // Set button to active
    $('#form-compose .type-select').removeClass('active');
    thisElement.addClass('active');
  });

  const makeComment = function(data) {
    return `
    <div class="d-flex flex-row">
    <div class="comment-avatar pr-2 py-2">
      <a href="/user/${data.user_id}"><img class="border rounded-circle shadow-md" width="72" height="72" src="https://avatars.dicebear.com/4.4/api/avataaars/${data.user_id}.svg"></a>
    </div>
    <div class="card shadow-sm comment my-2 ml-1" style="flex: 1;">
      <div class="card-header">
        <a href="/user/${data.user_id}">${data.name}</a>
        <span class="comment-date-created">${timeAgo(data.created_at)}</span>
      </div>
      <div class="card-body">
        <p class="mb-0">${data.comment}</p>
      </div>
    </div>
  </div>
    `;
  };

    // Comment form submit
    $('#form-comment-submit').on('click', function(event) {
      event.preventDefault();
      const form = $('#form-comment');
      $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize()
      }).done(function(data) {
        const comment = makeComment(data);
        console.log(comment);
        $(comment).hide().prependTo("#comment-list").slideDown();
      }).fail(function(err) {
        console.log('Failure. ', err);
      });
    });


  // Compose form submit
  $('#form-compose-submit').on('click', function(event) {
    event.preventDefault();
    const form = $('#form-compose');
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize()
    }).done(function(data) {
      console.log('Success! ', data);
      window.location = `${window.location.origin}/tip/${data.id}`;
    }).fail(function(err) {
      console.log('Failure. ', err);
    });
  });

});
