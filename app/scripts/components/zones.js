'use strict';

var Zones = require('../collections/zones');
var ZonesView = require('../views/zones');

var Compontent = function() {
  return new ZonesView({
    el: '.zones',
    collection: new Zones()
  });
}

module.exports = Compontent;
