<template>
  <div id="app">
    <NavigationBar />
    <router-view />
  </div>
</template>

<script>
import NavigationBar from "./components/NavigationBar";

export default {
    name: 'App',
    components: {
        NavigationBar: NavigationBar
    }
}
</script>
