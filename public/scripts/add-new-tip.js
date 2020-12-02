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


const createNewTip = function() {

  $('form').on('submit', function(e) {
    e.preventDefault();
    const x = $('form').val();
    const tip = disarm($('input').serialize());
    console.log(tip)
    $.ajax(`/`, { method: 'POST', data: { tip }})

  });
}


const drawTagCheckboxes = function() {

  $.ajax(`/search/tags`, { method: 'GET'})
      .then(tags => {
        tags.map(tag => {
          const checkbox = `
          <input type="checkbox" id="${tag}" name="tag" value="${tag}">
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
