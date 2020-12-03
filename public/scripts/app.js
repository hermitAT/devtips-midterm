
$(() => {
  // Autoresize textarea elements
  autosize(document.querySelectorAll('textarea'));

  // The compose box
  $('#compose-textarea-title, #compose-textarea-data, #compose-textarea-description, #compose-input-tags').on('input propertychange', (e) => {
    if ($('#compose-textarea-title').val() || $('#compose-textarea-data').val() || $('#compose-textarea-description').val() || $('#compose-input-tags').val()) {
      $('#compose-textarea-data').show();
      if($('#compose-textarea-data').val() || $('#compose-textarea-description').val() || $('#compose-input-tags').val()){
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


  $('#form-compose-submit').on('click', function(event) {
    event.preventDefault();
    const form = $('#form-compose');
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize()
    }).done(function(data) {
      console.log('Success! ', data);
    }).fail(function(err) {
      console.log('Failure. ', err);
    });
  });

});
