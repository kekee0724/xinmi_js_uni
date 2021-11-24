<script>
'use strict';

export default {
    data() {
        return {};
    },
    options: {
        addGlobalClass: true
    },
    props: {
        hideLoading: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        hideLoading: {
            handler: function (val) {
                if (!val) {
                    uni.showLoading({
                        title: '加载中'
                    });
                } else {
                    uni.hideLoading();
                }
            },

            immediate: true,
            deep: true
        }
    }
};
</script>
<style>
@import './loading.css';
</style>
