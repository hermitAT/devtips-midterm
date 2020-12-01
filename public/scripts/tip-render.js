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

  $.ajax(`/tips`, { method: 'POST', data: { tipsID } })
    .then(tips => {
      console.log(tips)
      renderTips(tips);
    });

};

/**
 * 1. Disable standard behaviour for the search form element
 * 2. Take its content and send it to /search/ route with POST method
 * 3. Receive an array of Resource IDs which fit search parameters
 * 4. Clear pager element (buttons) and split the array to pages
 * 5. If there are more than 1 page - draw pager buttons
 * 6. Load the 1st page of results
 */
const searchForm = function() {

  $('form').on('submit', function(e) {
    e.preventDefault();
    const search = $(this).serialize();
    $.ajax(`/search/`, { method: 'POST', data: search })
      .then((tips) => {
        $('#pager').empty();
        const tipsPaged = pager(tips);
        if (tipsPaged['2']) drawPager(tipsPaged);
        loadTips(tipsPaged[1])
      })
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
  $('#tip-feed').empty()
  for (const tip of tips) {
    $('#tip-feed').prepend(createTipElement(tip));
  }
};


$(document).ready(() => {


  loadTips([4,5]); // initial testcode, to be replaced
  searchForm();

});
