<template>
  <b-card
    class="shadow loginCard mt-5"
    title="ESP Login"
    img-src="../../static/padlock-card.jpg"
  >
    <b-card-text>
      <div v-if="$ux.randomState==='bla'">bla</div>
      <p-capture-email v-if="$ux.login==='captureEmail'"></p-capture-email>
      <p-capture-password v-if="$ux.login==='capturePassword'"></p-capture-password>
      <div v-if="$ux.login==='registerPassword'">registerPassword</div>
      <div v-if="$ux.login==='authenticating'">authenticating</div>
      <div v-if="$ux.login==='authenticated'">authenticated</div>
    </b-card-text>
  </b-card>
</template>

<script>
import captureEmail from "./captureEmail.vue";
import capturePassword from "./capturePassword.vue";

export default {
  name: 'p-login',
  components: {
    'p-capture-email' : captureEmail,
    'p-capture-password' : capturePassword,
  }
}
</script>

<style scoped>
.loginCard {
  width: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>>
</style>
