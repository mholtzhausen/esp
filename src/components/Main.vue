<template>
  <ul>
    <ux-state
      name="authenticated"
      value='true'
    >
      <li>Currently logged in. Click <a
          href="Javascript:;"
          @click="logout"
        >Here to log out</a></li>
    </ux-state>
    <ux-state
      name="authenticated"
      value='false'
    >
      <li>Currently logged out. Click <a
          href="Javascript:;"
          @click="login"
        >Here to log in</a></li>
    </ux-state>
  </ul>
</template>

<script>
export default {
  name: 'Main',
  methods: {
    login () {
      this.$ux.authenticated = 'true'
    },
    logout () {
      this.$ux.authenticated = 'false'
    }
  }
}
</script>

<style>
</style>
