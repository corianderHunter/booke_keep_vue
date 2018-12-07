<template>
    <v-container class="record-card" fluid grid-list-lg>
        <v-card color="purple" class="white--text">
            <div class="card-content">
                <v-layout row>
                    <v-flex xs7>
                        <v-card-title primary-title>
                            <div>
                                <div class="headline">五花肉黑猪肉</div>
                                <div>5元一斤</div>
                            </div>
                        </v-card-title>
                    </v-flex>
                    <v-flex xs5>
                        <v-img
                            src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                            height="125px"
                            contain
                        ></v-img>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex>
                        <v-card-title>
                            <div>文鼎广场苏果超市二楼</div>
                        </v-card-title>
                    </v-flex>
                </v-layout>
            </div>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">
                <v-btn icon>
                    <v-icon>share</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.record-card {
    padding: 20px;
    .card-content {
        min-height: calc(100vh - 110px);
    }
}
</style>