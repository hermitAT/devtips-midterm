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

  $('form').on('submit', function(e) {
    e.preventDefault();
    let tip = disarm($('form').serialize());
    const userID = 4;              // MUST BE TAKEN FROM A COOKIE!!!!
    tip += `&amp;creator_id=${userID}`;
    $.ajax(`/`, { method: 'POST', data: { tip }})
      //.then((tipID) => $.ajax(`/tip/${tipID}`, { method: 'GET' }))
      .then(() => 'Succsess')
      .catch(() => 'Error')
  });
}

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
        })
      })

}



$(document).ready(() => {


  drawTagCheckboxes();
  createNewTip();

});
