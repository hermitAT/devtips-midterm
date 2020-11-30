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
 * Load tips currently existing in db
 */
const loadTips = function(tipsID) {

  $.ajax(`/search/get-tips`, { method: 'POST', data: {tipsID} })
    .then(tips => {
      console.log(tips)
      renderTips(tips);
    });

};


const loadTipsForUser = function(tipsID, userID) {
  $.ajax(`/search/get-tips-for-user`, { method: 'POST', data: {tipsID, userID} })
    .then(tips => {
      console.log(tips)
      renderTips(tips);
    });

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
  for (const tip of tips) {
    $('#tip-feed').prepend(createTipElement(tip));
  }
};


$(document).ready(() => {

  loadTips([4,5]);
  loadTips([6,7], 4)
  //submitNewTweet();

});
