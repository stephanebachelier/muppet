define([
  'marionette'
],

function (Marionette) {
  // https://github.com/FlorentD/mbb-ladder/blob/master/public/js/views/header/behavior/PreventClick.js
  'use strict';

  return Marionette.Behavior.extend({
    events: {
      'click': 'preventClickAction'
    },

    preventClickAction: function (event) {
			event.stopPropagation();
			event.preventDefault();
		}
  });
});
