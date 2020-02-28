<template>
  <b-form @submit.stop.prevent="submit">
    <b-form-group
      id="input-group-1"
      label="Email address:"
      label-for="input-1"
    >
      <b-form-input
        id="input-1"
        v-model="form.email"
        type="email"
        required
        placeholder="Enter email"
      ></b-form-input>
    </b-form-group>
  </b-form>

</template>

<script>
export default {
  name: 'p-capture-email',

  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {

	submit(){
		this.$ux.login='capturePassword'
		this.$ux.randomState = 'bleg'
	},
	
  }

}
</script>

<style>
</style>
