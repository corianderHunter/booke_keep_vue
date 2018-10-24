<template>
    <div class="timeline" v-finger:swipe="fingerSwipe" v-scroll="onScroll">
        <v-card class="default-header">
            <v-btn absolute bottom color="pink" right fab>
                <v-icon color="white">add</v-icon>
            </v-btn>
            <v-img
                max-height="300"
                src="https://cdn.vuetifyjs.com/images/cards/forest.jpg"
                gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
            >
                <v-container fill-height>
                    <v-layout align-center class="v-layout">
                        <strong class="display-4 font-weight-regular mr-4">8</strong>
                        <v-layout column justify-end>
                            <div class="headline font-weight-light">Monday</div>
                            <div class="text-uppercase font-weight-light">February 2015</div>
                        </v-layout>
                    </v-layout>
                </v-container>
            </v-img>
        </v-card>
        <v-card>
            <v-img
                max-height="180"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
            >
                <v-container fill-height>
                    <v-layout align-center class="v-layout">
                        <div class="calendar—div mg0a"></div>
                    </v-layout>
                </v-container>
            </v-img>
        </v-card>
        <v-timeline class="v-timeline" align-top dense>
            <v-timeline-item color="pink" small v-for="(item,n) in items" :key="n">
                <v-layout pt-3>
                    <v-flex xs3 class="mr-2">
                        <strong>{{item.date}}</strong>
                    </v-flex>
                    <v-flex class="timeline-item-content">
                        <strong>{{item.name}}</strong>
                        <div class="caption">{{item.address}}</div>
                        <div class="caption">{{item.price}}</div>
                        <v-img
                            class="timeline-img"
                            :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
                            gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
                        >
                            <v-layout
                                slot="placeholder"
                                fill-height
                                align-center
                                justify-center
                                ma-0
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-layout>
                        </v-img>
                    </v-flex>
                </v-layout>
            </v-timeline-item>
            <v-timeline-item
                color="pink"
                small
                v-show="timelineHolder"
                transition="slide-y-reverse-transition"
            >
                <v-layout pt-3>
                    <v-flex xs3 class="mr-2">
                        <div class="placeholder">&nbsp;&nbsp;&nbsp;</div>
                    </v-flex>
                    <v-flex class="timeline-item-content">
                        <div class="placeholder">&nbsp;</div>
                        <div class="caption placeholder">&nbsp;</div>
                        <div class="caption placeholder">&nbsp;</div>
                        <div class="placeholder">&nbsp;
                            <br>&nbsp;
                            <br>&nbsp;
                        </div>
                    </v-flex>
                </v-layout>
            </v-timeline-item>
        </v-timeline>
    </div>
</template>
<script>
import { isEdged } from '@utils/common';
export default {
    innerwidth: window.innerHeight,
    data: () => ({
        items: [],
        testData: {
            date: '16.09.09',
            name: '百吉',
            address: '河定桥家乐福',
            price: '4￥'
        },
        timelineHolder: false
    }),
    mounted() {
        this.items = [this.testData];
        window.onresize = () => (this.$options.innerwidth = window.innerWidth);
    },
    methods: {
        onScroll(evt) {
            if (this.timelineHolder) return;
            //这考虑用 requestAnima?
            let restHeight =
                document.documentElement.getBoundingClientRect().bottom -
                this.$options.innerwidth;
            if (restHeight < 190) {
                this.upFresh();
            }
        },
        fingerSwipe(evt) {
            //向上滚动刷新
            if (isEdged('bottom')) {
                this.upFresh();
            }
        },
        upFresh() {
            this.timelineHolder = true;
            setTimeout(() => {
                this.items.push({
                    date: '111',
                    name: '111',
                    address: '111',
                    price: '111'
                });
                this.items.push({
                    date: '111',
                    name: '111',
                    address: '111',
                    price: '111'
                });
                this.timelineHolder = false;
            }, 2000);
        }
    }
};
</script>

<style lang="scss" scoped>
.timeline {
    display: flex;
    flex-direction: column;
    flex: 1;
    .v-layout {
        color: #fff;
    }
    .calendar—div {
        opacity: 0.6;
    }
    .timeline-img {
        margin: 10px 0;
    }
    .v-timeline {
        width: calc(100% - 30px);
        margin: 0 auto;
        flex: 1;
    }
}
</style>