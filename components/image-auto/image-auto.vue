<template>
    <view>
        <image :class="sclass" :style="sstyle" :mode="mode" :src="ssrc" @error="imageError"></image>
    </view>
</template>

<script>
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

const index_1 = require('../../core/index');

export default {
    data() {
        return {
            ssrc: {},
            sstyle: {},
            sclass: {},
            mode: {}
        };
    },
    onPageShow: function () {},
    onPageHide: function () {},
    onPageResize: function () {},
    options: {
        addGlobalClass: true
    },
    props: {
        src: {
            type: String,
            default: undefined
        },
        style: {
            type: String,
            default: undefined
        },
        className: {
            type: String,
            default: undefined
        }
    },
    watch: {
        src_style_className: {
            handler: function (newValue, oldValue) {
                const { src, style, className } = newValue;

                this.setData({
                    ssrc: src ? index_1.transformAssetsUrl(src) : index_1.connectlocalUrl('error.png'),
                    sstyle: style,
                    sclass: src ? className : 'erro-class',
                    mode: src ? 'aspectFill' : 'aspectFit'
                });
            },

            immediate: true,
            deep: true
        }
    },
    mounted: function () {},
    methods: {
        imageError: function () {
            this.setData({
                ssrc: index_1.connectlocalUrl('error.png'),
                mode: 'aspectFit'
            });
        }
    },
    computed: {
        src_style_className() {
            const { src, style, className } = this;

            return {
                src,
                style,
                className
            };
        }
    }
};
</script>
<style>
@import './image-auto.css';
</style>
