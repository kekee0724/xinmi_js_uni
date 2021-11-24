<template>
    <view
        :class="'popover-item ' + (hasline ? 'underline' : '')"
        hover-class="popover-item-hover"
        @click.stop.prevent="onClick"
        :style="'height:' + height + 'px;line-height:' + height + 'px;'"
    >
        删除
    </view>
</template>

<script>
'use strict';

export default {
    data() {
        return {
            height: 30
        };
    },
    relations: {
        './popover': {
            type: 'parent'
        }
    },
    props: {
        hasline: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onClick: function () {
            let { index } = this;
            let eventDetail = {
                index: index
            };
            let eventOption = {};
            this.$emit(
                'tap',
                {
                    detail: eventDetail
                },
                eventOption
            );
        }
    }
};
</script>
<style>
@import './popover-item.css';
</style>
