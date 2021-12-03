<template>
    <view class="am-drawer">
        <slot></slot>
    </view>
</template>

<script>
'use strict';

export default {
    data() {
        return {};
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    props: {
        state: Boolean,
        width: String
    },
    methods: {}
};
</script>
<style>
@import './drawer.css';
</style>
