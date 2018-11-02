<template>
    <v-card color="purple lighten-1" dark>
        <v-toolbar card color="purple">
            <v-icon>mdi-account</v-icon>
            <v-toolbar-title class="font-weight-light">记录</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="purple darken-3" fab small @click="isEditing = !isEditing">
                <v-icon v-if="isEditing">create</v-icon>
                <v-icon v-else>clear</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-text-field clearable :disabled="!isEditing" color="white" label="名称"></v-text-field>
            <v-layout>
                <v-flex xs10>
                    <v-text-field clearable :disabled="!isEditing" label="价格"></v-text-field>
                </v-flex>
                <v-flex xs2>
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
                append-icon="location_searching"
                label="地址"
                @click:append="mapInit"
            ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isEditing" @click="save" dark>保存</v-btn>
        </v-card-actions>
        <v-snackbar
            v-model="hasSaved"
            :timeout="2000"
            absolute
            bottom
            left
        >Your profile has been updated</v-snackbar>
        <tx-map v-show="mapVisible"/>
    </v-card>
</template>

<script>
import VeeValidate from 'vee-validate';
import txMap from './map';
export default {
    data: () => ({
        hasSaved: false,
        isEditing: true,
        model: null,
        mapVisible: false,
        states: [
            { name: 'Florida', abbr: 'FL', id: 1 },
            { name: 'Georgia', abbr: 'GA', id: 2 },
            { name: 'Nebraska', abbr: 'NE', id: 3 },
            { name: 'California', abbr: 'CA', id: 4 },
            { name: 'New York', abbr: 'NY', id: 5 }
        ],
        measure: '￥',
        measures: ['￥', '$']
    }),
    components: {
        txMap
    },
    mounted() {},

    methods: {
        customFilter(item, queryText, itemText) {
            const textOne = item.name.toLowerCase();
            const textTwo = item.abbr.toLowerCase();
            const searchText = queryText.toLowerCase();

            return (
                textOne.indexOf(searchText) > -1 ||
                textTwo.indexOf(searchText) > -1
            );
        },
        save() {
            this.isEditing = !this.isEditing;
            this.hasSaved = true;
        },
        mapInit() {
            console.log('test');
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
}
</style>