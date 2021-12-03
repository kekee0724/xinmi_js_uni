<template>
    <view class="page-body" v-if="latitude && longitude">
        <view class="page-section page-section-gap">
            <map id="myMap" style="width: 100%; height: 300px" :latitude="latitude" :markers="markers" :longitude="longitude" :setting="setting"></map>
        </view>
    </view>
</template>

<script>
'use strict';

var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }

        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                if (result.done) {
                    resolve(result.value);
                } else {
                    adopt(result.value).then(fulfilled, rejected);
                }
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

export default {
    data() {
        return {
            latitude: {},
            longitude: {},
            setting: {},
            markers: [],
            poi: {}
        };
    },
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.getLogAndLat(this.address);
    },
    methods: {
        getLogAndLat(address) {
            return __awaiter(this, void 0, void 0, function* () {
                var QQMapWX = require('./qqmap-wx-jssdk.js');

                var qqmapsdk = new QQMapWX({
                    key: 'TFHBZ-FCGCU-UFNVL-BA6TW-AHETH-PTBVU'
                });
                var that = this;
                qqmapsdk.geocoder({
                    address: address,
                    success: function (res) {
                        let result = res.result;
                        let latitude = result.location.lat;
                        let longitude = result.location.lng;
                        that.setData({
                            latitude: latitude,
                            longitude: longitude,
                            setting: {
                                skew: 0,
                                rotate: 0,
                                title: res.title,
                                showLocation: true,
                                showScale: false,
                                subKey: '',
                                layerStyle: 1,
                                enableZoom: true,
                                enableScroll: true,
                                enableRotate: false,
                                showCompass: false,
                                enable3D: false,
                                enableOverlooking: false,
                                enableSatellite: false,
                                enableTraffic: false
                            },
                            markers: [
                                {
                                    id: 0,
                                    title: res.title,
                                    latitude: latitude,
                                    longitude: longitude,
                                    width: 20,
                                    height: 20,
                                    callout: {
                                        color: '#000',
                                        display: 'ALWAYS'
                                    }
                                }
                            ],
                            poi: {
                                latitude: latitude,
                                longitude: longitude
                            }
                        });
                    },
                    fail: function (error) {
                        console.error(error);
                    },
                    complete: function (_res) {}
                });
            });
        }
    }
};
</script>
<style>
@import './qq-map.css';
</style>
