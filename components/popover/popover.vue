<template>
    <view v-if="visible" :class="'popover-view ' + vertical + ' ' + align" :style="'width:' + pw + 'px;height:' + ph + 'px;left:' + px + 'px;top:' + py + 'px;'">789</view>
</template>

<script>
'use strict';

const { windowWidth, windowHeight } = uni.getSystemInfoSync();
const trangleHeight = 12;
export default {
    data() {
        return {
            visible: false,
            pw: 100,
            ph: 120,
            px: 0,
            py: 0,
            vertical: {},
            align: {}
        };
    },
    relations: {
        './popover-item': {
            type: 'child'
        }
    },
    methods: {
        onDisplay: function (e) {
            let that = this;

            if (that.last && that.last === e.id) {
                that.setData({
                    visible: !that.visible
                });
            } else {
                uni.createSelectorQuery()
                    .selectViewport()
                    .scrollOffset((view) => {
                        let { pw, ph, px, py, vertical, align } = that;
                        let pOverW = (pw - e.width) / 2;
                        let offsetL = e.left;
                        let offsetR = windowWidth - e.right;
                        let offsetB = windowHeight - e.bottom;
                        if (offsetL >= pOverW && offsetR >= pOverW) {
                            align = 'center';
                            px = e.left - pOverW;
                        } else {
                            if (offsetL > pOverW && offsetR < pOverW) {
                                align = 'left';
                                px = windowWidth - (offsetR + pw);

                                if (windowWidth - pw == px) {
                                    px -= 5;
                                }
                            } else {
                                if (offsetL < pOverW && offsetR > pOverW) {
                                    align = 'right';
                                    px = e.left;

                                    if (px == 0) {
                                        px += 5;
                                    }
                                }
                            }
                        }

                        if (offsetB >= ph + trangleHeight) {
                            vertical = 'bottom';
                            py = view.scrollTop + e.bottom + trangleHeight;
                        } else {
                            vertical = 'top';
                            py = view.scrollTop + e.top - ph - trangleHeight;
                        }

                        that.setData({
                            visible: true,
                            px: px,
                            py: py,
                            ph: that.getItemsHeight(),
                            vertical: vertical,
                            align: align
                        });
                    })
                    .exec();
            }

            that.last = e.id;
        },
        onHide: function () {
            this.setData({
                visible: false
            });
        },
        getItems: function () {
            return this.getRelationNodes('./popover-item');
        },

        getItemsHeight() {
            return this.getItems()
                .map((item) => item.data.height)
                .reduce((a, b) => a + b, 0);
        }
    }
};
</script>
<style>
@import './popover.css';
</style>
