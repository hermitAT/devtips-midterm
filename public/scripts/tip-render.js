const db = require('../../db/db-helpers')

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
const loadTips = function() {

  // $.ajax('/tweets/', { method: 'GET' })
  //   .then(function(res) {
  //     renderTweets(res);
  //   });

  db.searchByTags()
    .then(res => console.log(res))

};


/**
 * Compose a new tweet element for the feed using
 * a particular tweet-related data from the server
 * @param {*} data
 *  */
const createTipElement = function(data) {

  const { user, content } = data;

  return `
    <article>
      <header>
        <div class="author-name"><img src="${user.avatars}">${user.name}</div>
        <div class="author-account" hidden>${user.handle}</div>
      </header>
      <p>${disarm(content.text)}</p>
      <footer>
        <div class="date-ago">${timeAgo(data.created_at)}</div>
        <div><img hidden src="/images/tweet-footer-buttons.png"></div>
      </footer>
    </article>
  `;
};


/**
 * Load a set of tweets received as an array of database objects
 * @param {*} tweets - array of objects
 */
const renderTips = function(tweets) {
  for (const tweet of tweets) {
    $('#tweet-feed').prepend(createTweetElement(tweet));
  }
};


$(document).ready(() => {

  loadTips();
  //submitNewTweet();

});
