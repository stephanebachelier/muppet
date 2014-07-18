define([
  './form-validation',
  'underscore'
],

function (FormValidation, _) {
  'use strict';

  return FormValidation.extend({
    ui: {
      errors: '.input-error',
      input: 'input',
      submit: 'input[type=submit]'
    },

    initialize: function () {
      this.options.validatorOptions.empty = true; // force the rendering of all errors
    },

    onRender: function () {
      FormValidation.prototype.onRender.call(this);
      this.ui.submit.attr('disabled', true);
    },

    onFieldChange: function (event) {
      var result = FormValidation.prototype.onFieldChange.call(this, event);
      if (false === result) {
        // form input is not a candidate for validation
        return;
      }
      // trigger a full form validation
      this.view.triggerMethod('form:submit');
    },

    renderFormError: function (errors) {
      FormValidation.prototype.renderFormError.call(this, errors);
      if (!_.compact(_.values(errors)).length) {
        this.ui.submit.attr('disabled', false);
      }
    }
  });
});
