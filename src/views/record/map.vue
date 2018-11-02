<template>
    <div class="map-div">
        <div ref="map"></div>
    </div>
</template>

<script>
const constant = require('@/../constant');
import jsonp from 'jsonp';
import md5 from 'md5';
import map from './map';
export default {
    $_veeValidate: {
        validator: 'new'
    },
    geolocationOptions: { enableHighAccuracy: true },
    ...constant,
    test_position: {
        coords: {
            accuracy: 20251,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: 22.396428,
            longitude: 114.10949699999999,
            speed: null
        },
        timestamp: 1540953672334
    },
    map: null,
    data() {
        return {
            curLatLng: [],
            curLocations: []
        };
    },
    created() {
        window.QQmap = data => {
            if (!data || !data.result || !data.result.pois)
                return console.error('高德地图返回地址异常。');
            this.curLocations = data.result.pois;
        };
    },
    destroyed() {
        window.QQmap = null;
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
        initMap() {
            let dom = this.$refs.map;
            let myLatlng = new qq.maps.LatLng(
                this.curLatLng[0],
                this.curLatLng[1]
            );
            var myOptions = {
                zoom: 13,
                center: myLatlng,
                mapTypeId: qq.maps.MapTypeId.ROADMAP
            };
            this.$options.map = new qq.maps.Map(dom, myOptions);
        },
        getGeoLocaSuccess(position) {
            let [lat, lng] = [
                position.coords.latitude,
                position.coords.longitude
            ];
            this.curLatLng = [lat, lng];
            let url =
                this.$options.location_api +
                '?callback=QQmap&' +
                `get_poi=1&key=${
                    this.$options.location_key
                }&location=${lat},${lng}&output=jsonp`;
            let sig = md5(url + this.$options.location_SK);
            url = this.$options.location_baseApi + url + `&sig=${sig}`;
            url = encodeURI(url);
            jsonp(url, null, (err, data) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(JSON.stringify(data));
                }
            });
            this.initMap();
        },
        getGeoLocaError(...args) {
            console.log(args);
        }
    }
};
</script>

<style lang="scss" scoped>
.map-div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    & > div {
        width: 100%;
        height: 100%;
    }
}
</style>