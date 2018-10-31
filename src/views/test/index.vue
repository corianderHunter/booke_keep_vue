<template>
    <div>
        <v-card color="blue-grey darken-2" class="white--text w100">
            <div class="headline">test geoloction</div>
            <div>{{this.logs.toString()||'noops,nothing...'}}</div>
        </v-card>
    </div>
</template>

<script>
export default {
    geolocationOptions: { enableHighAccuracy: true },
    data() {
        return {
            logs: []
        };
    },
    mounted() {
        if (!navigator.geolocation)
            return this.logs.push('not support geolocation.');
        navigator.geolocation.getCurrentPosition(
            this.getGeoLocaSuccess,
            this.getGeoLocaError,
            this.$options.geolocationOptions
        );
    },
    methods: {
        getGeoLocaSuccess(postion) {
            this.logs.push('success:' + JSON.stringify(postion));
        },
        getGeoLocaError(error) {
            this.logs.push('error:' + error.toString());
        }
    }
};
</script>

<style scoped>
</style>