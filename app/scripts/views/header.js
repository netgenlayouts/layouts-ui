'use strict';

var Core = require('core');
var _ = require('underscore');

module.exports = Core.View.extend({

  template: 'header',

  events: {
    'submit form.js-layout': 'set_name',
    'click .js-show-form': 'enter_editing',
    'click .js-cancel': 'cancel_editing',
    'click .js-publish': 'publish_layout',
    'click .js-discard': 'discard_draft',
    'click .js-normal-mode': '$normal_mode'
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core.state, 'change', this.render);
    this.listenTo(this.model, 'draft:success', this.render);
    this.listenTo(this.model, 'save:success', this.after_save);
    this.listenTo(this.model, 'publish:success discard:success', this.close_layout);
    return this;
  },

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    this.$name_input = this.$('.js-name');
    //this.prevent_leave_page();
    return this;
  },


  $normal_mode: function(){
    Core.state.set({mode_zone_link: false});
  },

  set_name: function(e){
    e.preventDefault();
    this.model.save(this.serialize().params, {method: 'POST', patch: true});
  },

  enter_editing: function(){
    this.context.editing = true;
    this.render();
    this.$('form.js-layout input[name="name"]').focus();

    var strLength = this.$name_input.val().length * 2;
    this.$name_input.focus();
    this.$name_input[0].setSelectionRange(strLength, strLength);
  },

  exit_editing: function(){
    this.context.editing = false;
    this.render();
  },

  cancel_editing: function(e){
    e.preventDefault();
    this.exit_editing();
  },

  after_save: function(){
    this.exit_editing();
  },

  publish_layout: function(e){
    e.preventDefault();
    this.model.publish();
  },

  discard_draft: function(e){
    e.preventDefault();
    var self = this;
    return new Core.Modal({
      title: 'Confirm',
      body: 'Are you sure you want to discard layout? All of the changes you have made will be lost.'
    }).on('apply', function(){
      self.model.discard();
    }).open();
  },

  close_layout: function(){
    this.can_leave_page = true;
    location.href = '/';
  },

  can_leave_page: false,

  prevent_leave_page: function(){
    var self = this;
    window.addEventListener('beforeunload', function(e){
      if (!self.can_leave_page){
        var dialogText = 'Are you sure you want to leave the page?';
        e.returnValue = dialogText;
        return dialogText;
      }
    });
  }

});
