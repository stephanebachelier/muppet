define([
  'marionette',
  'underscore',
  'backbone.syphon',
  'vent'
],
function (Marionette, _, Syphon, vent) {
  'use strict';

  return Marionette.Behavior.extend({
    events: {
      'submit form': 'submit'
    },

    defaults: {
      formEvents: {
        trigger: 'submit',
        listeners: {
          success: 'success',
          error: 'error'
        }
      },
    },

    _formEvents: {
      success: 'onSuccess',
      error: 'onError'
    },

    initialize: function () {
      this.formEvents = {};
      var listeners = this.options.formEvents.listeners;
      _.keys(listeners).forEach(function (name) {
        this.formEvents[listeners[name]] = this._formEvents[name];
      }, this);
      Backbone.Marionette.bindEntityEvents(this, vent, this.formEvents);
    },

    // ## External API

    // ### submitForm
    submit: function (event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (this.onFormSubmit()) {
        this._submitForm(this.data);
      }
    },

    onSuccess: function (message) {
      this.view.trigger('success', message);
    },

    onError: function (error) {
      this.view.trigger('error', error);
    },

    //
    // ## Internal API
    //

    // ### submit
    _submitForm: function (data) {
      vent.trigger(this.options.formEvents.trigger, data);
    },

    // ### onFormSubmit
    onFormSubmit: function () {
      this.data = Syphon.serialize(this);
      var errors = {};
      this.view.triggerMethod('form:validate', this.data, errors);

      return 0 === _.compact(_.values(errors)).length;
    }
  });
});
