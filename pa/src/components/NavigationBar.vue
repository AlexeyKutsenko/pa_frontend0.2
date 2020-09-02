<template>
  <div>
    <b-navbar
      type="dark"
      variant="dark"
    >
      <b-navbar-nav>
        <b-nav-item to="/">
          Home
        </b-nav-item>
        <b-nav-item to="/indices">
          Index
        </b-nav-item>
        <b-nav-item to="/goals">
          Goals
        </b-nav-item>
        <b-nav-item to="/portfolios">
          Portfolios
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown
          v-if="isLoggedIn"
          right
        >
          <template v-slot:button-content>
            <em>{{ username }}</em>
          </template>
          <b-dropdown-item
            href="#"
            @click="logout"
          >
            Sign out
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item
          v-else
          right
          to="/registration"
        >
          Registration
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>

export default {
    name: "NavigationBar",
    computed: {
        username: function () {
            return this.$store.getters.username;
        },
        isLoggedIn: function () {
            return this.$store.getters.isLoggedIn;
        },
    },
    methods: {
        logout: function () {
            this.$store.dispatch('logout').then(() => this.$router.push({name: 'login'}))
        }
    }
}
</script>

<style scoped>

</style>
