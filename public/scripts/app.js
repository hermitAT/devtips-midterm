
$(() => {
  // Autoresize textarea elements
  autosize(document.querySelectorAll('textarea'));

  // The compose box
  $('#compose-textarea-title, #compose-textarea-url, #compose-textarea-description').on('input propertychange', (e) => {
    if (!$('#compose-textarea-title').val() && !$('#compose-textarea-url').val() && !$('#compose-textarea-description').val()) {
      $('#compose-textarea-url').hide();
    } else {
      $('#compose-textarea-url').show();
    }
  });

});
