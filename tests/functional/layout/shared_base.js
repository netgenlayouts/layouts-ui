define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../../support/page');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Layout shared',

    before: function() {
      page = new Page(this.remote);
      page
        .setFindTimeout(5000)
        .maximizeWindow()
    },

    beforeEach: function() {
      Page.clearStorage()
    },


    'create': function() {
      var layout_name = utils.stamped('Testing shared layout');
      return page
        .navigateTo('#layout?shared=1')
        .match('.modal', {visible: true})
          .input('Name').fill(layout_name)
          .clickOn('.layout-type label:nth-of-type(2)')
          .clickOn('.action_apply')
        .end()
        .waitForAjax()
        .assertCurrentUrl(new RegExp('/bm/dev/app/#layout/\\d+/edit'), 'match')

        .match('.app-center .layout-name', {visible: true}).assertText('Shared: ' + layout_name, 'include')
    }



  });



});
