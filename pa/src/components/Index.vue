<template>
    <div>
        <div v-for="ticker in tickers" v-bind:key="ticker">
            {{ ticker }}
        </div>
    </div>
</template>

<script>
    import axios from 'axios/index'

    export default {
        name: "Index",
        data: function () {
            return {
                dataUrl: new URL('https://en.wikipedia.org/w/api.php?' +
                    'origin=*&' +
                    'format=json&' +
                    'action=parse&' +
                    'prop=text&' +
                    'page=List_of_S%26P_500_companies&' +
                    'formatversion=2'),
                tickers: []
            }
        },
        methods: {
            parseHTML: function () {
                // TODO enable cache
                axios.get(this.dataUrl)
                    .then(response => {
                        let parser = new DOMParser().parseFromString(response.data.parse.text, 'text/html');
                        let tickers = parser.getElementById('constituents').children[0].children;
                        for (let i = 1; i < tickers.length; i++) {
                            // eslint-disable-next-line no-console
                            this.tickers.push(tickers[i].children[0].innerText)
                        }
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    });
            }
        },
        mounted: function () {
            this.parseHTML()

        }
    }
</script>

<style scoped>

</style>