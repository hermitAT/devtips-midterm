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
const paginator = function(arr, offset = 10) {

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
 * Function receives an object of pages with Resource IDs
 * Each page in the object creates button and associates
 * loading its resource IDs with this button
 * @param {*} tipsPaged
 */
const drawPager = function(tipsPaged) {

  for (const page in tipsPaged) {
    $('#paginator').append(`<button>${page}</button>`)
    $('#paginator button:last-child').click(() => {
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

  const { id, likes, dislikes, creator_id, title, url,  description } = tip;
  let type = tip.type;
  let content = ``
  if (['markdown', 'code'].includes(type)) type = 'text';
  switch (type) {
    case 'video':
      content += `<youtube-video controls src="${url}"></youtube-video>`;
      break;
    case 'text':
      content += `<a href="${url}">${url}</a><p>${description}</p>`;
      break;
    case 'link':
      content += `<span>Link: </span><a href="${url}">${url}</a><p>${description}</p>`;
      break;
    case 'image':
      content += `<img src="${url}" class="mw-100" alt="${title}">`
  }

  return `
  <div class="row no-gutter justify-content-center">
  <div class="col col-sm-10 col-md-12 col-lg-8 position-relative">
    <a href="/user/${creator_id}"><img class="tip-avatar m-4 bg-white border rounded-circle shadow-sm" width="48" height="48" src="https://avatars.dicebear.com/4.4/api/avataaars/${creator_id}.svg"></a>
    <div class="tip-icons d-flex flex-column align-items-center">
      <i class="far fa-thumbs-up"></i><span class="like badge badge-dark mb-2">${likes}</span>
      <i class="fas fa-thumbs-down"></i><span class="dislike badge badge-dark mb-3">${dislikes}</span>
      <i class="far fa-bookmark"></i>
    </div>
    <div class="card mb-3 shadow-sm">
      <div class="card-header border-0">
        <a href="/tip/${id}">${title}</a>
      </div>
      <div class="card-body" style="min-height: 10em;">
        ${content}
      </div>
    </div>
  </div>
</div>
  `;
};


/**
 * Load a set of resources received as an array of database objects
 * @param {*} tweets - array of objects
 */
const renderTips = function(tips) {
  $('#list-tips').empty();
  for (const tip of tips) {
    $('#list-tips').prepend(createTipElement(tip));
  }
};


const getAllTips = function() {

  $.ajax(`/tip/all`, { method: 'GET' })
  .then(tips => {
    console.log('ids loaded')
    $('#paginator').empty();
    const tipsPaged = paginator(tips);
    if (tipsPaged['2']) drawPager(tipsPaged);
    loadTips(tipsPaged[1])
  })

}


$(document).ready(() => {

  getAllTips();
  //loadTips([4,5]); // initial testcode, to be replaced
  //searchFormValidateInput();

});
