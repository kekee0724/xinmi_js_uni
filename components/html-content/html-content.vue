<template>
    <view>
        <rich-text class="rich-box" :nodes="articledetail"></rich-text>
    </view>
</template>

<script>
'use strict';

export default {
    data() {
        return {
            articledetail: {}
        };
    },
    options: {
        addGlobalClass: true
    },
    props: {
        style: String,
        html: {
            type: String,
            default: undefined
        },
        hideImage: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        html: {
            handler: function (html) {
                if (this.hideImage) {
                    html = html.replace('class="image"', 'style="display: none;"').replace(/\<img/gi, '<img style="display: none;"');
                } else {
                    html = html
                        .replace(/figure/gi, 'div')
                        .replace(/\<img/gi, '<img style="width:100%;height:auto;position: relative;overflow: hidden;"')
                        .replace(/style=""/gi, '');
                }

                var divReg = /<div.*?(?:>|\/>)/gi;
                var styleReg = /style=[\'\"]?([^\'\"]*)[\'\"]?/i;
                var arr = html.match(divReg);

                if (arr && arr.length) {
                    for (var i = 0; i < arr.length; i++) {
                        var src = arr[i].match(styleReg);

                        if (src && src[1] && !src[1].startsWith('http')) {
                            html = html.replace(src[1], 'width:100%;height:auto;');
                        }
                    }
                }

                this.setData({
                    articledetail: html
                });
            },

            immediate: true,
            deep: true
        }
    },
    mounted: function () {},
    methods: {}
};
</script>
<style>
@import './html-content.css';
</style>
