<template>
    <view class="rate">
        <view class="rate__item" v-for="(item, index) in valueClone > 0 ? values : placeholders" :key="item.index">
            <view :class="'rate__item--icon icon' + (valueClone > 0 ? '' : '-placeholder') + '-' + iconClassMap[item]">
                <view @click="choose" :data-index="index" data-half="1"></view>
                <view @click="choose" :data-index="index" data-half="0"></view>
            </view>
        </view>
    </view>
</template>

<script>
'use strict';

export default {
    data() {
        return {
            iconClassMap: {
                0: 'empty',
                0.5: 'half',
                1: 'full'
            },

            iconText: 'star',
            values: [],
            placeholders: [],
            valueClone: 0
        };
    },
    props: {
        value: {
            type: Number,
            default: 0
        },
        placeholder: {
            type: Number,
            default: 0
        },
        allowHalf: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        length: {
            type: Number,
            default: 5
        }
    },
    mounted() {
        if (this.value === 0 && this.placeholder === 0) {
            this._refreshPlaceholders(0);
        }
    },
    methods: {
        _refreshValues(value) {
            this.setData({
                values: this._generateArray(Number(value))
            });
        },

        _refreshPlaceholders(value) {
            this.setData({
                placeholders: this._generateArray(Number(value))
            });
        },

        _generateArray(value) {
            let arr = [];
            let fullCount = value;

            if (fullCount <= 0) {
                return [0, 0, 0, 0, 0];
            }

            let isAppendHalf = false;

            if (this.allowHalf) {
                if (!isPositiveIntegerNumber(fullCount)) {
                    fullCount = Math.floor(fullCount);
                    isAppendHalf = true;
                }
            } else {
                fullCount = Math.ceil(fullCount);
            }

            for (let i = 0; i < fullCount; i++) {
                arr.push(1);
            }

            if (isAppendHalf) {
                arr.push(0.5);
            }

            let emptyCount = this.length - arr.length;

            for (let i = 0; i < emptyCount; i++) {
                arr.push(0);
            }

            return arr;
        },

        choose(e) {
            if (this.disabled) {
                return;
            }

            let index = Number(e.currentTarget.dataset.index);
            let isHalf = Number(e.currentTarget.dataset.half) === 1;
            let value = (index + 1) * 2;

            if (this.allowHalf) {
                if (isHalf) {
                    value = value - 1;
                }
            }

            value = (value / 2).toFixed(1);

            if (value === this.value) {
                return;
            }

            this.setData({
                valueClone: value
            });
            this.$emit('change', {
                detail: {
                    value
                }
            });
        }
    },
    watch: {
        value: {
            handler: function (newValue) {
                this.valueClone = this.deepClone(this.value);
                this._refreshValues(newValue);
            },

            immediate: true
        },

        placeholder: {
            handler: function (newValue) {
                this._refreshPlaceholders(newValue);
            },

            immediate: true
        }
    }
};

function rpxToPx(rpx) {
    let sysInfo = uni.getSystemInfoSync();
    return (rpx * sysInfo.windowWidth) / 750;
}

function isPositiveIntegerNumber(num) {
    let numStr = num.toString();
    return /(^[1-9]\d*$)/.test(numStr);
}
</script>
<style>
@import './index.css';
</style>
