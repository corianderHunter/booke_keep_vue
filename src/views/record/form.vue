<template>
    <v-card color="purple lighten-1" dark>
        <div v-show="!mapVisible">
            <v-toolbar card color="purple">
                <v-icon>mdi-account</v-icon>
                <v-toolbar-title class="font-weight-light">记录</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-text-field clearable color="white" label="名称"></v-text-field>
                <v-layout>
                    <v-flex xs12>
                        <v-text-field clearable color="white" label="价格"></v-text-field>
                    </v-flex>
                    <v-flex style="width:50px;">
                        <v-select
                            class="measure-select"
                            flat
                            background-color="transparent"
                            attach
                            :items="measures"
                            solo
                            v-model="measure"
                        ></v-select>
                    </v-flex>
                </v-layout>
                <v-text-field
                    clearable
                    color="white"
                    v-model="position.address"
                    append-icon="location_searching"
                    label="地址"
                    @input="addressInput"
                    @click:clear-icon-cb="position = {address:''}"
                    @click:append="mapInit"
                ></v-text-field>
                <div>
                    <div class="images-label">图片</div>
                    <div class="images-container w100">
                        <div v-if="imageList.length">
                            <img
                                v-for="(value,idx) in imageList"
                                :key="idx"
                                :src="value"
                                height="50"
                                class="grey lighten-2 dib"
                            >
                            <img
                                v-if="imageList.length<10"
                                height="50"
                                src="@static/images/image-add.png"
                                @click="imageDialog=true;"
                            >
                        </div>
                        <div v-else class="no-image" @click="imageDialog=true;">添加图片</div>
                    </div>
                </div>
                <v-textarea color="white" label="备注"></v-textarea>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="save" dark>保存</v-btn>
            </v-card-actions>
            <v-snackbar
                v-model="hasSaved"
                :timeout="2000"
                absolute
                bottom
                left
            >Your profile has been updated</v-snackbar>
        </div>
        <tx-map
            ref="txMap"
            @mapHide="mapVisible=false"
            :position="position"
            @getPosi="getPosi"
            v-show="mapVisible"
        />
        <v-dialog v-model="imageDialog" content-class="image-dialog">
            <v-btn fab dark large color="purple" @click="getPictures('CAMERA')">
                <v-icon dark>add_a_photo</v-icon>
            </v-btn>
            <v-btn fab dark large color="purple" @click="getPictures('PHOTOLIBRARY')">
                <v-icon dark>photo_library</v-icon>
            </v-btn>
        </v-dialog>
        <v-snackbar v-model="snackbar" :top="true" color="#FFAB40" style="margin-top:20px;">
            {{snackbarText}}
            <v-btn dark flat @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
import VeeValidate from 'vee-validate';
import txMap from './map';

let mediaPickerOptions = {
    selectMode: 100,
    maxSelectCount: 10,
    maxSelectSize: 1024 * 1024 * 20
};

export default {
    data: () => ({
        hasSaved: false,
        model: null,
        mapVisible: false,
        imageDialog: false,
        snackbar: false,
        snackbarText: '未知错误！',
        position: {
            address: ''
        },
        imageList: ['https://picsum.photos/500/300?image=55'],
        measure: '￥',
        measures: ['￥', '$']
    }),
    components: {
        txMap
    },
    mounted() {},

    methods: {
        addressInput: _.debounce(function() {
            if (this.position.address) this.$refs.txMap.getPosiBySugg();
        }),
        getPosi(item) {
            this.position = item;
        },
        customFilter(item, queryText, itemText) {
            const textOne = item.name.toLowerCase();
            const textTwo = item.abbr.toLowerCase();
            const searchText = queryText.toLowerCase();

            return (
                textOne.indexOf(searchText) > -1 ||
                textTwo.indexOf(searchText) > -1
            );
        },
        dialogMessage(message) {
            this.snackbar = true;
            this.snackbarText = message;
        },
        getPictures(sourceType = 'CAMERA') {
            if (sourceType === 'CAMERA') {
                if (!navigator.camera)
                    return this.dialogMessage('当前系统不支持CAMERA!');

                navigator.camera.getPicture(
                    results => {
                        this.imageList = [...this.imageList, ...results];
                        this.imageDialog = false;
                    },
                    err => {
                        console.log(err);
                        this.imageDialog = false;
                    },
                    {
                        quality: 50
                    }
                );
            } else {
                if (!MediaPicker)
                    return this.dialogMessage('当前系统不支持媒体选择!');

                MediaPicker.getMedias(
                    mediaPickerOptions,
                    medias => {
                        //medias [{mediaType: "image", path:'/storage/emulated/0/DCIM/Camera/2017.jpg', uri:"android retrun uri,ios retrun URL" size: 21993}]
                        this.imageList = [
                            ...this.imageList,
                            ...medias.map(val => val.path)
                        ];
                        // getThumbnail(medias);
                        this.imageDialog = false;
                    },
                    err => {
                        console.log(err);
                        this.imageDialog = false;
                    }
                );
            }
        },
        save() {
            this.hasSaved = true;
        },
        mapInit() {
            this.mapVisible = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.v-card {
    min-height: 100vh;
    .measure-select {
        box-shadow: none;
    }
    .images-label {
        color: hsla(0, 0%, 100%, 0.7);
        font-size: 16px;
    }
    .images-container {
        overflow: auto;
        margin-top: 10px;
        & > div {
            width: max-content;
            img {
                &:not(:last-child) {
                    margin-right: 5px;
                }
            }
            &.no-image {
                width: auto;
                text-align: center;
                line-height: 80px;
                border: 1px dashed;
                border-radius: 4px;
                background-color: rgba(255, 255, 255, 0.08);
            }
        }
    }
}
</style>
<style>
.image-dialog {
    width: 210px;
    padding: 6px 12px;
    background-color: rgba(255, 255, 255, 0.6);
}
</style>





