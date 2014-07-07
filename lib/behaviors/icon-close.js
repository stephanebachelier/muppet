define([
  'marionette'
],

function (Marionette) {
  'use strict';

  return Marionette.Behavior.extend({
    events: {
      'click @ui.closeIcon': 'close'
    },

    ui: {
      closeIcon: '.icon-close'
    },

    close: function () {
      this.view.close();
    }
  });
});
