const { query, extract } = require('../');
const querystring = require('querystring');


const createNewTip = function(tipSerialized) {
  //const urid = decodeURI(tipSerialized.replace(/&amp;/g, '&'))
  //const urid = decodeURI(tipSerialized).replace(/&amp;/g, '&')
  const tip = querystring.parse(decodeURI(tipSerialized).replace(/&amp;/g, '&'))
  //console.log(urid);
  console.log(tip)
  //console.log(tip['amp;description']);

};
exports.createNewTip = createNewTip;
