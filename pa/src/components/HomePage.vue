<template>
    <div class="container-fluid">
        <h1 class="text-center">This is homepage</h1>
        <h2 class="text-center">{{msg}}</h2>
    </div>
</template>

<script>
    export default {
        name: "HomePage",
        data() {
            return {msg: 'Hello World'}
        }
    }
</script>

<style scoped>

</style>