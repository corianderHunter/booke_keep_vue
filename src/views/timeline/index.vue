<template>
    <div class="timeline">
        <v-card class="default-header" transition="slide-y-reverse-transition">
            <v-btn absolute bottom color="pink" right fab v-show="curHeader==='default'">
                <v-icon color="white">add</v-icon>
            </v-btn>
            <v-img
                :max-height="curHeader==='default'?300:180"
                src="https://cdn.vuetifyjs.com/images/cards/forest.jpg"
                gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
            >
                <v-container fill-height v-show="curHeader==='default'">
                    <v-layout align-center class="v-layout">
                        <strong class="display-4 font-weight-regular mr-4">8</strong>
                        <v-layout column justify-end>
                            <div class="headline font-weight-light">Monday</div>
                            <div class="text-uppercase font-weight-light">February 2015</div>
                        </v-layout>
                    </v-layout>
                </v-container>
                <v-container fill-height v-show="curHeader==='reading'" class="pa0">
                    <v-layout align-center class="v-layout" v-show="calendarChoosing">
                        <div class="calendar—div mg0a">
                            <div class="weekday">星期一</div>
                            <strong class="display-2 font-weight-regular">8</strong>
                            <div class="text-uppercase">9月 2018</div>
                        </div>
                    </v-layout>
                    <v-date-picker
                        v-model="date"
                        full-width
                        landscape
                        class="mt-3"
                        v-show="!calendarChoosing"
                    ></v-date-picker>
                </v-container>
            </v-img>
        </v-card>
        <div class="scroll-container" v-scroll:#scroll-target="onScroll" id="scroll-target">
            <v-timeline align-top dense class="w100" v-finger:swipe="fingerSwipe" ref="timeline">
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
                <transition enter-active-class="animated fadeIn" leave-active-class="hide">
                    <v-timeline-item
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
                </transition>
            </v-timeline>
        </div>
    </div>
</template>
<script>
import { isEdged } from '@utils/common';
export default {
    innerwidth: window.innerHeight,
    headers: ['default', 'reading'],
    timelineNode: null,
    data: () => ({
        items: [],
        calendarChoosing: false,
        date: '2018-10-24',
        testData: {
            date: '16.09.09',
            name: '百吉',
            address: '河定桥家乐福',
            price: '4￥'
        },
        timelineHolder: false,
        curHeader: 'default'
    }),
    mounted() {
        this.items = [this.testData, this.testData, this.testData];
        this.$options.timelineNode = this.$refs.timeline.$el;
        window.onresize = () => {
            requestAnimationFrame(
                () => (this.$options.innerwidth = window.innerWidth)
            );
        };
    },
    methods: {
        changeHeader(header) {
            this.curHeader = header;
        },
        onScroll(evt) {
            if (this.timelineHolder) return;
            let restHeight =
                this.$options.timelineNode.offsetHeight -
                this.$options.timelineNode.parentElement.offsetHeight -
                this.$options.timelineNode.parentElement.scrollTop;
            console.log(this.$options.timelineNode.scrollTop);
            if (restHeight < 190) {
                this.upFresh();
            }
        },
        fingerSwipe(evt) {
            //向上滚动刷新
            if (evt.direction === 'Up') {
                if (isEdged('bottom', this.$options.timelineNode, false)) {
                    this.upFresh();
                }
            }
            if (evt.direction === 'Down') {
                if (isEdged('top', this.$options.timelineNode, false)) {
                    this.changeHeader('default');
                }
            }
        },
        upFresh() {
            this.timelineHolder = true;
            this.changeHeader('reading');
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
    height: 100vh;
    overflow: hidden;
    .v-layout {
        color: #fff;
    }
    .calendar—div {
        text-align: center;
        padding-top: 32px;
        .weekday {
            font-size: 16px !important;
        }
    }
    .timeline-img {
        margin: 10px 0;
    }
    .scroll-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        .v-timeline {
            width: calc(100% - 30px);
            margin: 0 auto;
            flex: 1;
        }
    }
}
</style>