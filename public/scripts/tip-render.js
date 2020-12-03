/**
 * Calculate the time difference between the current moment and a given one.
 * Returns result as n minutes/hours/days/months/years ago,
 * supports singular form of units.
 * If difference is less than a minute - returns 'now'
 * @param {*} date - a Date (in ms) to calculate a difference with
 */
const timeAgo = function(date) {

  const timeMap = {
    'year' : 24 * 60 * 60 * 1000 * 365,
    'month' : 24 * 60 * 60 * 1000 * 30.42,
    'day' : 24 * 60 * 60 * 1000,
    'hour' : 60 * 60 * 1000,
    'minute' : 60 * 1000,
    'order': ['year', 'month', 'day', 'hour', 'minute']
  };

  const delta = Math.floor((Date.now() - date));
  for (const unit of timeMap.order) {
    const num = Math.floor(delta / timeMap[unit]);
    if (num >= 1) return `${num} ${unit}${(num === 1) ? '' : 's'} ago`;
  }
  return 'now';

};


/**
 * Function receives array (e.g. resource IDs)
 * and offset (default is 10)
 * Returns object like {1:[id1, id2...], 2:[id21, id22...]}
 * @param {*} arr
 * @param {*} offset
 */
const pager = function(arr, offset = 10) {

  const pages = {};
  let page = 1;
  const lastPage = Math.ceil(arr.length / offset)
  while (page <= lastPage) {
    pages[page] = arr.slice(offset * (page -1) ,offset * page);
    page++;
  }
  return pages;

}


/**
 * Function receives an array of tip IDs to load
 * and pass it to /tips POST route, result is sent
 * to be rendered on a page
 */
const loadTips = function(tipsID) {

  $.ajax(`/tip`, { method: 'POST', data: { tipsID } })
    .then(tips => {
      renderTips(tips);
    });

};


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
    $('#tip-feed').empty();
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


/**
 * Function receives an object of pages with Resource IDs
 * Each page in the object creates button and associates
 * loading its resource IDs with this button
 * @param {*} tipsPaged
 */
const drawPager = function(tipsPaged) {

  for (const page in tipsPaged) {
    $('#pager').append(`<button>${page}</button>`)
    $('#pager button:last-child').click(() => {
      loadTips(tipsPaged[page])
    })
  }

}


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
 * Compose a new resource element for the feed using
 * a particular resource-related data from the server
 * @param {*} tip
 *  */
const createTipElement = function(tip) {

  const { user, content } = tip;

  return `
    <article>
      <div>${tip.title} likes: ${tip.likes} created: ${timeAgo(tip.created_at)}</div>
    </article>
  `;
};


/**
 * Load a set of resources received as an array of database objects
 * @param {*} tweets - array of objects
 */
const renderTips = function(tips) {
  $('#tip-feed').empty();
  for (const tip of tips) {
    $('#tip-feed').prepend(createTipElement(tip));
  }
};


$(document).ready(() => {


  loadTips([4,5]); // initial testcode, to be replaced
  searchFormValidateInput();

});
