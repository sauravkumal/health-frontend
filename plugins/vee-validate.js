import Vue from 'vue'
import {extend, ValidationObserver, ValidationProvider} from 'vee-validate'
import {email, required} from 'vee-validate/dist/rules'


// Add a rule.

extend('required', {
  ...required,
  message: '{_field_} is required',
})
extend('email', {
  ...email,
  message: 'Email must be valid',
})


// Register it globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
