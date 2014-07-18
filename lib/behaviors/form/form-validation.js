define([
  'marionette',
  'underscore',
  'invalid'
],

function (Marionette, _, Ruler) {
  'use strict';

  return Marionette.Behavior.extend({
    events: {
      'blur @ui.input': 'onFieldChange'
    },

    ui: {
      errors: '.input-error',
      input: 'input'
    },

    defaults: {
      error: '<i class="icon icon-left-nav"></i>',
      rules: null,
      validatorOptions: {
        empty: true
      }
    },

    onRender: function () {
      this._buildUiErrors();
    },

    onFormValidate: function (data, errors) {
      if ('function' === typeof this.validate) {
        // copy the validation error to the given error structure
        _.defaults(errors, this.validate(data));
        this.renderFormError(errors);
      }
    },

    // ## renderFormError
    // loop on all input errors fields injected in page and update the error field
    // either to add an error or remove a previous one
    renderFormError: function (errors) {
      // loop on all input errors fields
      var key;
      for (key in errors) {
        this.renderFormInputError(key, errors[key]);
      }
    },

    // ## renderFormInputError
    // update the field error for the given input, either to display or remove the existing error
    // `name` {string}
    // `error` {string}
    renderFormInputError: function (name, error) {
      // set error message or clear previous message
      var message = error || '';
      this._toggleError(this._uiErrors[name], '' !== message);
    },

    // ## _buildUiErrors
    // internal method used to build the _uiErrors which purpose is to index the `this.ui.errors`
    // base on the `data-error` attributes
    _buildUiErrors: function () {
      // buld the `_uiErrors`
      if (!this._uiErrors) {
        this._uiErrors = {};
        this.ui.errors.toArray().forEach(function (el) {
          var name = el.dataset.error;
          this._uiErrors[name] = el;
        }, this);
      }
    },

    // ## _toggleError
    // toggle the error on the DOM element by injecting the error
    // `visible` parameter default to true
    _toggleError: function (el, visible) {
      if (!el) {
        // DOM element is not found in view.
        return;
      }

      if (undefined === visible) {
        visible = true;
      }
      el.innerHTML = visible ? _.result(this.options, 'error') : '';
    },

    _getValidator: function () {
      if (undefined === this.ruler) {
        // force validator to null if no rules defined
        this.ruler = this.options.rules ? new Ruler(this.options.rules) : null;
      }
      return this.ruler;
    },

    validate: function (data) {
      // validate if any validator is provided else return true to not block
      // user in an invalidate state not handled by the view
      return this._getValidator() ? this._getValidator().validate(data, this.options.validatorOptions) : true;
    },

    validateField: function (el) {
      var validator = this._getValidator();
      if (!validator) {
        return;
      }

      var error = validator.$validate(el, this.options.validatorOptions);
      for (var key in error) {
        this.renderFormInputError(key, error[key]);
      }

      return error;
    },

    onFieldChange: function (event) {
      event.stopImmediatePropagation();
      // event.preventDefault();

      var $input = $(event.target);
      if (/submit|reset|button/.test($input.attr('type'))) {
        return false;
      }
      return this.validateField($input);
    }
  });
});
