import type { ValidationError } from 'yup';

export type ValidationErrorMap = Record<string, string>;

export const mapYupErrors = (error: ValidationError): ValidationErrorMap => {
  const errors: ValidationErrorMap = {};
  if (error.inner && error.inner.length > 0) {
    error.inner.forEach((err) => {
      if (err.path && !errors[err.path]) {
        errors[err.path] = err.message;
      }
    });
  } else if (error.path) {
    errors[error.path] = error.message;
  }
  return errors;
};

export default mapYupErrors;
