<template>
	<b-container fluid class="p-0">
		<p-dashboard v-if="$ux.authenticated==='true'"></p-dashboard>		
		<p-login v-if="$ux.authenticated==='false'"></p-login>		
	</b-container>
</template>

<script>
import Login from "./Login/Login.vue"
import Dashboard from "./Dashboard/Dashboard.vue"

export default {
  name: 'Main',
  components:{
	  'p-dashboard': Dashboard,
	  'p-login': Login
  }
}
</script>

<style>
</style>
