define([
  'marionette',
  'underscore',
  'backbone.syphon',
  'vent'
],
function (Marionette, _, Syphon, vent) {
  'use strict';

  // configure Syphon for radio to not be empty
  Syphon.InputReaders.register('radio', function (value) {
    return true;
  });

  Syphon.KeyAssignmentValidators.register('radio', function ($el, key, value) {
    return true;
  });

  Syphon.KeyAssignmentValue.register('radio', function (data, $el, key, value) {
    // for entry in data if it does not exist
    if (!data[key]) {
      data[key] = '';
    }
    return value;
  });

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

    onSuccess: function (msg) {
      // do something
    },

    onError: function (msg) {
      // do something
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
