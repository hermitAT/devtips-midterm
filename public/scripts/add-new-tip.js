/**
 * Replace 'dangerous' characters which could possibly
 * be a part of malicious code with special char HTML codes
 * @param {*} str - untrusted text string to disarm
 */
const disarm = function(str) {

  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;

};

/**
 * 1. Serialize all input at once
 * 2. TO BE DONE: Validate if there any empty fields
 * 3. Insert current user ID to the query string
 *    as creator_id (for security check)
 * 4. Call '/' POST and send serialized data there
 */
const createNewTip = function() {
  $('form.form-compose').submit(function(event) {
    event.preventDefault(); // Prevent the form from submitting via the browser
    const form = $(this);

    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize()
    }).done((data) => {
      console.log('Success! ', data.id);
    }).fail((err) => {
      console.log('Failure. ', err);
    });
  });
};

/**
 * Create a checkbox for each tag in the DB
 */
const drawTagCheckboxes = function() {

  $.ajax(`/search/tags`, { method: 'GET'})
    .then(tags => {
      tags.map(tag => {
        const checkbox = `
          <input type="checkbox" id="${tag}" name="tags" value="${tag}">
          <label for="${tag}"> #${tag}</label>
          `;
        $('mark').append(checkbox);
      });
    });
};



$(document).ready(() => {

  drawTagCheckboxes();
  createNewTip();

});
