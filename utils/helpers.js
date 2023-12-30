export const buildFormData = (formData, data, parentKey) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;
    formData.append(parentKey, value);
  }
}

export const handleError = (error, context, validator = null) => {
  if (error.response.status === 422 && validator) {
    validator.setErrors(error.data.errors)
  } else if (error.response.status === 423) {
    context.$root.$emit('toast', {text: error.response.data.error, type: 'error'})
  } else {
    context.$root.$emit('toast', {text: error.statusText, type: 'error'})
  }
}
