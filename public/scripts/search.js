
/**
 * 1. Function receives arrays with valid and invalid search tags
 * 2. Changes the header accordingly
 * 3. Returns true/false to indicate necessity of further search
 * @param {*} valid
 * @param {*} invalid
 */
const makeResultsHeader = function(valid, invalid) {
  valid = valid.map(word => '#' + word);
  invalid = invalid.map(word => '#' + word);

  const plurIn = invalid.length > 1;
  const valS = (valid.length > 1) ? 's' : '';
  const [tobe, an, s] = (plurIn) ? ['are', '', 's'] : ['is', 'a ', '']

  const invalidMessage = (invalid.length) ? `, ${an}tag${s} ${invalid.join(', ')} ${tobe} invalid!` : '';
  const validMessage = (valid.length) ? `Result${valS} for tag${valS} ${valid.join(', ')}` : 'No results';
  const message = validMessage + invalidMessage;
  if (!valid.length) {
    $('#results-header').text(message);
    return false;
  }
  $('#results-header').text(message);
  return true;
}


/**
 * 1. Disable standard behaviour for the search form element
 * 2. Split input to words and compare to existing tags
 * 3. Take its content and send it to /search/ route with POST method
 * 4. Compose the search results header
 * 5. Pass valid tags to search query if any
 */
const searchFormValidateInput = function() {

  $('form').on('submit', function(e) {
    e.preventDefault();
    const string = disarm($('input').val());
    const words = string.replace(/(#|,)/g, ' ').trim().toLowerCase().split(/[\s]+/);
    if (!words[0]) return $('input').val('');
    $('#list-tips').empty();
    $.ajax(`/search/tags`, { method: 'GET'})
      .then(tags => {

        const [ valid, invalid ] = [[], []];
        for (const word of words) {
          (tags.includes(word)) ? valid.push(word) : invalid.push(word);
        }

        const isValid = makeResultsHeader(valid, invalid);
        if (isValid) searchQuery(valid);
      })
  })
}

/**
 * 1. Function receives an array of valid tags to search for
 * 2. Get an array of Resource IDs which fit search parameters
 * 3. Clear pager element (buttons) and split the array to pages
 * 4. If there are more than 1 page - draw pager buttons
 * 5. Load the 1st page of results
 * @param {*} search
 */
const searchQuery = function(search) {
  $.ajax(`/search/`, { method: 'POST', data: { search } })
    .then((tips) => {

      $('#pager').empty();
      const tipsPaged = pager(tips);
      if (tipsPaged['2']) drawPager(tipsPaged);
      loadTips(tipsPaged[1])
    })

}

$(document).ready(() => {


  //loadTips([4,5]); // initial testcode, to be replaced
  //searchFormValidateInput();

});
