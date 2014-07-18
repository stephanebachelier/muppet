define([
  './behaviors/icon-close',
  './behaviors/form',
  './behaviors/form-validation',
  './behaviors/form-validation-disable'
],

function (IconClose, Form, FormValidation, FormValidationDisable) {
  'use strict';

  return {
    iconClose: IconClose,
    form: Form,
    formValidation: FormValidation,
    formValidationDisable: FormValidationDisable
  };
});
