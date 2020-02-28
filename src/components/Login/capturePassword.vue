<template>
  <b-form @submit="submit">
    <b-form-group
      id="input-group-1"
      label="Password:"
      label-for="input-1"
    >
      <b-form-input
        id="input-1"
        v-model="form.password"
        type="password"
        required
        placeholder="Enter Password"
      ></b-form-input>
    </b-form-group>
  </b-form>

</template>

<script>
export default {
  name: 'p-capture-password',

  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {

    submit () {
      this.$ux.login = 'authenticating'
      this.$ux.randomState = 'bla'

      setTimeout(() => this.$ux.login = 'authenticated', 1000)
    },

  }

}
</script>

<style>
</style>
