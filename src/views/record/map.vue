<template>
    <div class="map-div">
        <v-menu offset-y nudge-bottom="10" :value="menuVisible">
            <div class="map-search" slot="activator">
                <input v-model="address" @input="addressInput">
                <div class="search-btn">
                    <v-icon
                        color="#757575"
                        v-if="address&&address.length"
                        @click="clearAddress"
                    >highlight_off</v-icon>
                    <v-icon
                        v-if="address&&address.length"
                        color="#757575"
                        @click="getPosiBySugg"
                    >refresh</v-icon>
                    <v-icon color="#757575" @click="getPosiByLatLng('geocoder')">location_searching</v-icon>
                </div>
                <div @click="$emit('mapHide');" class="cancel-btn">取消</div>
            </div>
            <v-list>
                <template v-if="curLocations&&curLocations.length">
                    <v-list-tile v-for="(item, index) in curLocations" :key="index">
                        <v-list-tile-title @click="choosePosi(item)">{{item.address}}</v-list-tile-title>
                    </v-list-tile>
                </template>
                <v-list-tile v-else>
                    <v-list-tile-title>未查询到位置信息...</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <template>
            <div class="map-div">
                <v-menu offset-y nudge-bottom="10" :value="menuVisible">
                    <div class="map-search" slot="activator">
                        <input v-model="address" @input="addressInput">
                        <div class="search-btn">
                            <v-icon
                                color="#757575"
                                v-if="address&&address.length"
                                @click="clearAddress"
                            >highlight_off</v-icon>
                            <v-icon
                                v-if="address&&address.length"
                                color="#757575"
                                @click="getPosiBySugg"
                            >refresh</v-icon>
                            <v-icon
                                color="#757575"
                                @click="getPosiByLatLng('geocoder')"
                            >location_searching</v-icon>
                        </div>
                        <div @click="$emit('mapHide');" class="cancel-btn">取消</div>
                    </div>
                    <v-list>
                        <template v-if="curLocations&&curLocations.length">
                            <v-list-tile v-for="(item, index) in curLocations" :key="index">
                                <v-list-tile-title @click="choosePosi(item)">{{item.address}}</v-list-tile-title>
                            </v-list-tile>
                        </template>
                        <v-list-tile v-else>
                            <v-list-tile-title>未查询到位置信息...</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <div class="map" ref="map"></div>
                <v-snackbar v-model="snackbar" :top="true" color="#FFAB40" style="margin-top:20px;">
                    {{snackbarText}}
                    <v-btn dark flat @click="snackbar = false">Close</v-btn>
                </v-snackbar>
            </div>
        </template>
    </div>
</template>

<script>
const constant = require('@/../constant');
import jsonp from 'jsonp';
import md5 from 'md5';
import map from './map';

let addressInput = _.debounce(function() {
    this.getPosiBySugg();
}, 300);

export default {
    $_veeValidate: {
        validator: 'new'
    },
    geolocationOptions: { enableHighAccuracy: true },
    ...constant,
    getPosiCount: 0,
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
    regionInfo: null, //当前所在的位置区域信息
    map: null,
    myLatLng: null, //交互选择的经纬度
    marker: null,
    curLatLng: [], //设备定位的经纬度
    positionTimer: null,
    data() {
        return {
            snackbarText: '查询当前地址异常！',
            snackbar: false,
            address: '',
            curLocations: [],
            menuVisible: true
        };
    },
    props: {
        position: Object
    },
    created() {
        this.address = this.position.address;
        //当获取当前区域信息
        window.region = data => {
            this.$options.regionInfo = data.result.ad_info;
            if (this.position.address) {
                this.getPosiBySugg();
            } else {
                this.getPosiByLatLng();
            }
        };
        //地址逆解析 回调 （由经纬度获取位置信息）
        window.geocoder = data => {
            if (!data || !data.result || !data.result.pois)
                return (this.curLocations = []);
            this.curLocations = data.result.pois.map(val => {
                return {
                    address: this.addressTitle(val),
                    location: val.location
                };
            });
            this.choosePosi(
                {
                    address: data.result.formatted_addresses.recommend,
                    location: data.result.location
                },
                true
            );
        };
        //地址关键词查询回调
        window.suggestion = data => {
            this.menuVisible = true;
            if (!data || !data.data) return (this.curLocations = []);
            if (!data.data.length) return (this.curLocations = []);
            this.curLocations = data.data.map(val => {
                return {
                    address: this.addressTitle(val),
                    location: val.location
                };
            });
        };
    },
    destroyed() {
        window.geocoder = null;
        window.suggestion = null;
    },
    mounted() {
        if (!navigator.geolocation)
            return this.logs.push('not support geolocation.');
        //先获取当前位置信息,成功后查询当前区域信息
        this.initMap();
        this.getCurrentPosition();
    },
    watch: {
        'position.address': function(val) {
            this.address = val;
        }
    },
    methods: {
        addressInput,
        choosePosi(item, back) {
            this.address = item.address;
            this.setMarker([item.location.lat, item.location.lng]);
            this.$emit('getPosi', item);
            back ? null : this.$emit('mapHide');
        },
        addressTitle(item) {
            return item.address
                ? item.address + (item.title ? ` ${item.title}` : '')
                : '';
        },
        clearAddress() {
            this.address = '';
        },
        getCurrentPosition() {
            navigator.geolocation.getCurrentPosition(
                this.getGeoLocaSuccess,
                this.getGeoLocaError,
                this.$options.geolocationOptions
            );
        },
        initMap() {
            let dom = this.$refs.map;
            var myOptions = {
                zoom: 16,
                disableDoubleClickZoom: true,
                mapTypeId: qq.maps.MapTypeId.ROADMAP
            };
            this.$options.map = new qq.maps.Map(dom, myOptions);
            this.addMapEvent();
        },
        setMarker(args) {
            if (!this.$options.map) return; // 排除
            this.$options.myLatLng = new qq.maps.LatLng(...args);
            this.$options.map.panTo(this.$options.myLatLng);
            if (this.$options.marker) this.$options.marker.setMap(null);
            this.$options.marker = new qq.maps.Marker({
                position: this.$options.myLatLng,
                animation: qq.maps.MarkerAnimation.DROP,
                map: this.$options.map
            });
        },
        addMapEvent() {
            qq.maps.event.addListener(this.$options.map, 'click', event => {
                this.getPosiByLatLng(undefined, [
                    event.latLng.lat,
                    event.latLng.lng
                ]);
            });
            qq.maps.event.addListener(this.$options.map, 'longpress', event => {
                this.getPosiByLatLng(undefined, [
                    event.latLng.lat,
                    event.latLng.lng
                ]);
            });
        },
        getGeoLocaSuccess(position) {
            clearInterval(this.$options.positionTimer);
            let [lat, lng] = [
                position.coords.latitude,
                position.coords.longitude
            ];
            this.$options.curLatLng = [lat, lng];
            this.getPosiByLatLng('region');
        },
        getGeoLocaError() {
            this.$options.positionTimer = setInterval(() => {
                if (this.$options.positionTimer > 5) {
                    this.getCurrentPosition();
                    this.$options.positionTimer++;
                } else {
                    this.snackbar = true;
                    clearInterval(this.$options.positionTimer);
                }
            }, 4000);
        },
        //通过经纬度获取当前位置列表
        getPosiByLatLng(
            callback = 'geocoder',
            latLng = this.$options.curLatLng
        ) {
            let url =
                this.$options.location_geocoder_api +
                `?callback=${callback}&` +
                `get_poi=1&key=${this.$options.location_key}&location=${
                    latLng[0]
                },${latLng[1]}&output=jsonp`;
            let sig = md5(url + this.$options.location_SK);
            url = this.$options.location_baseApi + url + `&sig=${sig}`;
            url = encodeURI(url);
            try {
                jsonp(url); //callback geocoder()
            } catch (err) {
                this.snackbarText = '查询腾讯定位服务失败！';
                this.snackbar = true;
            }
        },
        //通过关键字获取位置列表
        getPosiBySugg() {
            let url =
                this.$options.location_suggestion_api +
                `?callback=suggestion&` +
                `key=${this.$options.location_key}&keyword=${
                    this.address
                }&output=jsonp&region=${this.$options.regionInfo.city}`;
            let sig = md5(url + this.$options.location_SK);
            url = this.$options.location_baseApi + url + `&sig=${sig}`;
            url = encodeURI(url);
            try {
                jsonp(url); //callback suggestion()
            } catch (err) {
                this.snackbarText = '查询腾讯定位服务失败！';
                this.snackbar = true;
            }
        }
        //dom交互事件
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
    color: #000;
    z-index: 98;
    & > .map {
        width: 100%;
        height: 100%;
        // display: contents;
    }
    .v-menu {
        display: block !important;
    }
    .map-search {
        position: fixed;
        top: 15px;
        left: 7.5%;
        display: flex;
        width: 85%;
        background-color: #fff;
        color: #000;
        line-height: 2.8;
        z-index: 99;
        & > input {
            flex: 1;
            padding-left: 15px;
        }
        & > .search-btn {
            padding: 0 10px;
            .v-icon {
                vertical-align: middle;
            }
        }
        & > .cancel-btn {
            width: 60px;
            text-align: center;
            position: relative;
            color: #757575;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                margin-top: auto;
                margin-bottom: auto;
                border-left: 1px solid #eeeeee;
                height: 60%;
                width: 0;
            }
        }
    }
}
</style>
        <div class="map" ref="map"></div>
        <v-snackbar v-model="snackbar" :top="true" color="#FFAB40" style="margin-top:20px;">
            {{snackbarText}}
            <v-btn dark flat @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
const constant = require('@/../constant');
import jsonp from 'jsonp';
import md5 from 'md5';
import map from './map';

let addressInput = _.debounce(function() {
    this.getPosiBySugg();
}, 300);

export default {
    $_veeValidate: {
        validator: 'new'
    },
    geolocationOptions: { enableHighAccuracy: true },
    ...constant,
    getPosiCount: 0,
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
    regionInfo: null, //当前所在的位置区域信息
    map: null,
    myLatLng: null, //交互选择的经纬度
    marker: null,
    curLatLng: [], //设备定位的经纬度
    positionTimer: null,
    data() {
        return {
            snackbarText: '查询当前地址异常！',
            snackbar: false,
            address: '',
            curLocations: [],
            menuVisible: true
        };
    },
    props: {
        position: Object
    },
    created() {
        this.address = this.position.address;
        //当获取当前区域信息
        window.region = data => {
            this.$options.regionInfo = data.result.ad_info;
            if (this.position.address) {
                this.getPosiBySugg();
            } else {
                this.getPosiByLatLng();
            }
        };
        //地址逆解析 回调 （由经纬度获取位置信息）
        window.geocoder = data => {
            if (!data || !data.result || !data.result.pois)
                return (this.curLocations = []);
            this.curLocations = data.result.pois.map(val => {
                return {
                    address: this.addressTitle(val),
                    location: val.location
                };
            });
            this.choosePosi(
                {
                    address: data.result.formatted_addresses.recommend,
                    location: data.result.location
                },
                true
            );
        };
        //地址关键词查询回调
        window.suggestion = data => {
            this.menuVisible = true;
            if (!data || !data.data) return (this.curLocations = []);
            if (!data.data.length) return (this.curLocations = []);
            this.curLocations = data.data.map(val => {
                return {
                    address: this.addressTitle(val),
                    location: val.location
                };
            });
        };
    },
    destroyed() {
        window.geocoder = null;
        window.suggestion = null;
    },
    mounted() {
        if (!navigator.geolocation)
            return this.logs.push('not support geolocation.');
        //先获取当前位置信息,成功后查询当前区域信息
        this.initMap();
        this.getCurrentPosition();
    },
    watch: {
        'position.address': function(val) {
            this.address = val;
        }
    },
    methods: {
        addressInput,
        choosePosi(item, back) {
            this.address = item.address;
            this.setMarker([item.location.lat, item.location.lng]);
            this.$emit('getPosi', item);
            back ? null : this.$emit('mapHide');
        },
        addressTitle(item) {
            return item.address
                ? item.address + (item.title ? ` ${item.title}` : '')
                : '';
        },
        clearAddress() {
            this.address = '';
        },
        getCurrentPosition() {
            navigator.geolocation.getCurrentPosition(
                this.getGeoLocaSuccess,
                this.getGeoLocaError,
                this.$options.geolocationOptions
            );
        },
        initMap() {
            let dom = this.$refs.map;
            var myOptions = {
                zoom: 16,
                disableDoubleClickZoom: true,
                mapTypeId: qq.maps.MapTypeId.ROADMAP
            };
            this.$options.map = new qq.maps.Map(dom, myOptions);
            this.addMapEvent();
        },
        setMarker(args) {
            if (!this.$options.map) return; // 排除
            this.$options.myLatLng = new qq.maps.LatLng(...args);
            this.$options.map.panTo(this.$options.myLatLng);
            if (this.$options.marker) this.$options.marker.setMap(null);
            this.$options.marker = new qq.maps.Marker({
                position: this.$options.myLatLng,
                animation: qq.maps.MarkerAnimation.DROP,
                map: this.$options.map
            });
        },
        addMapEvent() {
            qq.maps.event.addListener(this.$options.map, 'click', event => {
                this.getPosiByLatLng(undefined, [
                    event.latLng.lat,
                    event.latLng.lng
                ]);
            });
            qq.maps.event.addListener(this.$options.map, 'longpress', event => {
                this.getPosiByLatLng(undefined, [
                    event.latLng.lat,
                    event.latLng.lng
                ]);
            });
        },
        getGeoLocaSuccess(position) {
            clearInterval(this.$options.positionTimer);
            let [lat, lng] = [
                position.coords.latitude,
                position.coords.longitude
            ];
            this.$options.curLatLng = [lat, lng];
            this.getPosiByLatLng('region');
        },
        getGeoLocaError() {
            this.$options.positionTimer = setInterval(() => {
                if (this.$options.positionTimer > 5) {
                    this.getCurrentPosition();
                    this.$options.positionTimer++;
                } else {
                    this.snackbar = true;
                    clearInterval(this.$options.positionTimer);
                }
            }, 4000);
        },
        //通过经纬度获取当前位置列表
        getPosiByLatLng(
            callback = 'geocoder',
            latLng = this.$options.curLatLng
        ) {
            let url =
                this.$options.location_geocoder_api +
                `?callback=${callback}&` +
                `get_poi=1&key=${this.$options.location_key}&location=${
                    latLng[0]
                },${latLng[1]}&output=jsonp`;
            let sig = md5(url + this.$options.location_SK);
            url = this.$options.location_baseApi + url + `&sig=${sig}`;
            url = encodeURI(url);
            try {
                jsonp(url); //callback geocoder()
            } catch (err) {
                this.snackbarText = '查询腾讯定位服务失败！';
                this.snackbar = true;
            }
        },
        //通过关键字获取位置列表
        getPosiBySugg() {
            let url =
                this.$options.location_suggestion_api +
                `?callback=suggestion&` +
                `key=${this.$options.location_key}&keyword=${
                    this.address
                }&output=jsonp&region=${this.$options.regionInfo.city}`;
            let sig = md5(url + this.$options.location_SK);
            url = this.$options.location_baseApi + url + `&sig=${sig}`;
            url = encodeURI(url);
            try {
                jsonp(url); //callback suggestion()
            } catch (err) {
                this.snackbarText = '查询腾讯定位服务失败！';
                this.snackbar = true;
            }
        }
        //dom交互事件
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
    color: #000;
    z-index: 98;
    & > .map {
        width: 100%;
        height: 100%;
        // display: contents;
    }
    .v-menu {
        display: block !important;
    }
    .map-search {
        position: fixed;
        top: 15px;
        left: 7.5%;
        display: flex;
        width: 85%;
        background-color: #fff;
        color: #000;
        line-height: 2.8;
        z-index: 99;
        & > input {
            flex: 1;
            padding-left: 15px;
        }
        & > .search-btn {
            padding: 0 10px;
            .v-icon {
                vertical-align: middle;
            }
        }
        & > .cancel-btn {
            width: 60px;
            text-align: center;
            position: relative;
            color: #757575;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                margin-top: auto;
                margin-bottom: auto;
                border-left: 1px solid #eeeeee;
                height: 60%;
                width: 0;
            }
        }
    }
}
</style>