<template>
    <!--components/time-picker/time-picker.wxml-->
    <!-- 自定义时间筛选器 -->
    <view v-if="pickerShow">
        <view :class="'picker-container ' + (pickerShow ? 'show_picker' : 'hide_picker')" :animation="animationData">
            <view class="btn-box" @touchmove.stop.prevent="onCatchTouchMove">
                <view class="pick_btn" @click="hideModal">取消</view>
                <view class="pick_btn" style="color: #19f" @click="onConfirm">确定</view>
            </view>

            <view>
                <picker-view
                    class="sensorTypePicker"
                    indicator-style="height: 35px;"
                    @change="changeStartDateTime"
                    :value="startValue"
                    :style="'height: ' + (endDate ? '120px' : '250px') + ';'"
                    @pickstart="handlePickStart"
                    @pickend="handlePickEnd"
                >
                    <picker-view-column style="min-width: 70px; flex-shrink: 0" v-if="yearColumn">
                        <view class="picker-item" v-for="(item, index) in startYearList" :key="index">{{ item }}年</view>
                    </picker-view-column>
                    <picker-view-column v-if="monthColumn">
                        <view class="picker-item" v-for="(item, index) in startMonthList" :key="index">{{ item }}月</view>
                    </picker-view-column>
                    <picker-view-column v-if="dayColumn">
                        <view class="picker-item" v-for="(item, index) in startDayList" :key="index">{{ item }}日</view>
                    </picker-view-column>
                    <picker-view-column v-if="hourColumn">
                        <view class="picker-item" v-for="(item, index) in startHourList" :key="index">{{ item }}时</view>
                    </picker-view-column>
                    <picker-view-column v-if="minColumn">
                        <view class="picker-item" v-for="(item, index) in startMinuteList" :key="index">{{ item }}分</view>
                    </picker-view-column>
                    <picker-view-column v-if="secColumn">
                        <view class="picker-item" v-for="(item, index) in startSecondList" :key="index">{{ item }}秒</view>
                    </picker-view-column>
                </picker-view>
            </view>

            <view v-if="endDate">
                <view class="to" style="margin-top: 4px; margin-bottom: 4px">至</view>
                <picker-view
                    class="sensorTypePicker"
                    indicator-style="height: 35px;"
                    @change="changeEndDateTime"
                    @pickstart="handlePickStart"
                    @pickend="handlePickEnd"
                    :value="endValue"
                >
                    <picker-view-column style="min-width: 70px; flex-shrink: 0">
                        <view class="picker-item" style="min-width: 70px" v-for="(item, index) in endYearList" :key="index">{{ item }}年</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="picker-item" v-for="(item, index) in endMonthList" :key="index">{{ item }}月</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="picker-item" v-for="(item, index) in endDayList" :key="index">{{ item }}日</view>
                    </picker-view-column>
                    <picker-view-column v-if="hourColumn">
                        <view class="picker-item" v-for="(item, index) in endHourList" :key="index">{{ item }}时</view>
                    </picker-view-column>
                    <picker-view-column v-if="minColumn">
                        <view class="picker-item" v-for="(item, index) in endMinuteList" :key="index">{{ item }}分</view>
                    </picker-view-column>
                    <picker-view-column v-if="secColumn">
                        <view class="picker-item" v-for="(item, index) in startSecondList" :key="index">{{ item }}秒</view>
                    </picker-view-column>
                </picker-view>
            </view>

            <!-- <view class='sure' bindtap="onConfirm">确定</view> -->
        </view>
        <!-- 遮罩 -->
        <view class="sensorType-screen" @click="hideModal" @touchmove.stop.prevent="onCatchTouchMove" :animation="animationOpacity" />
    </view>
</template>

<script>
'use strict';

export default {
    data() {
        return {
            startValue: [],
            endValue: {},
            isPicking: '',
            startPickTime: '',
            endPickTime: '',
            endDate: {},
            yearColumn: '',
            monthColumn: '',
            dayColumn: '',
            hourColumn: '',
            minColumn: '',
            secColumn: '',
            HourList: '',
            MinuteList: '',
            SecondList: '',
            YearList: '',
            MonthList: '',
            DayList: '',
            limitStartTime: '',
            limitEndTime: '',
            dateLimit: '',
            limitStartTimeArr: '',
            limitEndTimeArr: '',
            yearStart: '',
            yearEnd: '',
            startTime: '',
            endTime: '',
            startDayList: {},
            endDayList: {},
            startYearList: {},
            startMonthList: {},
            startHourList: {},
            startMinuteList: {},
            startSecondList: {},
            endYearList: {},
            endMonthList: {},
            endHourList: {},
            endMinuteList: {},
            endSecondList: '',
            animationOpacity: {},
            animationData: {}
        };
    },
    props: {
        pickerShow: {
            type: Boolean
        },
        config: Object
    },
    destroyed: function () {},
    beforeMount: function () {},
    mounted: function () {
        this.readConfig();
        this.initPick(this.config || null);
        this.setData({
            startValue: this.startValue,
            endValue: this.endValue
        });
    },
    methods: {
        onCatchTouchMove() {},

        readConfig() {
            let limitEndTime = new Date().getTime();
            let limitStartTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;

            if (this.config) {
                let conf = this.config;

                if (typeof conf.dateLimit == 'number') {
                    limitStartTime = new Date().getTime() - 1000 * 60 * 60 * 24 * conf.dateLimit;
                }

                if (conf.limitStartTime) {
                    limitStartTime = new Date(conf.limitStartTime.replace(/-/g, '/')).getTime();
                }

                if (conf.limitEndTime) {
                    limitEndTime = new Date(conf.limitEndTime.replace(/-/g, '/')).getTime();
                }

                this.setData({
                    yearStart: conf.yearStart || 2000,
                    yearEnd: conf.yearEnd || 2100,
                    endDate: conf.endDate || false,
                    dateLimit: conf.dateLimit || false,
                    yearColumn:
                        conf.column == 'year' || conf.column == 'month' || conf.column == 'day' || conf.column == 'hour' || conf.column == 'minute' || conf.column == 'second',
                    monthColumn: conf.column == 'month' || conf.column == 'day' || conf.column == 'hour' || conf.column == 'minute' || conf.column == 'second',
                    dayColumn: conf.column == 'day' || conf.column == 'hour' || conf.column == 'minute' || conf.column == 'second',
                    hourColumn: conf.column == 'hour' || conf.column == 'minute' || conf.column == 'second',
                    minColumn: conf.column == 'minute' || conf.column == 'second',
                    secColumn: conf.column == 'second'
                });
            }

            let limitStartTimeArr = formatTime(limitStartTime);
            let limitEndTimeArr = formatTime(limitEndTime);
            this.setData({
                limitStartTime,
                limitStartTimeArr,
                limitEndTime,
                limitEndTimeArr
            });
        },

        handlePickStart: function () {
            this.setData({
                isPicking: true
            });
        },
        handlePickEnd: function () {
            this.setData({
                isPicking: false
            });
        },
        onConfirm: function () {
            if (this.isPicking) {
                return;
            }

            let startTime = new Date(this.startPickTime.replace(/-/g, '/'));
            let endTime = new Date(this.endPickTime.replace(/-/g, '/'));

            if (startTime <= endTime || !this.endDate) {
                this.setData({
                    startTime,
                    endTime
                });
                let startArr = formatTime(startTime).arr;
                let endArr = formatTime(endTime).arr;

                let format0 = function (num) {
                    return num < 10 ? '0' + num : num;
                };

                let startTimeBack =
                    startArr[0] +
                    '-' +
                    (this.monthColumn ? format0(startArr[1]) : '01') +
                    '-' +
                    (this.dayColumn ? format0(startArr[2]) : '01') +
                    ' ' +
                    (this.hourColumn ? format0(startArr[3]) : '00') +
                    ':' +
                    (this.minColumn ? format0(startArr[4]) : '00') +
                    ':' +
                    (this.secColumn ? format0(startArr[5]) : '00');
                let endTimeBack =
                    endArr[0] +
                    '-' +
                    (this.monthColumn ? format0(endArr[1]) : '01') +
                    '-' +
                    (this.dayColumn ? format0(endArr[2]) : '01') +
                    ' ' +
                    (this.hourColumn ? format0(endArr[3]) : '00') +
                    ':' +
                    (this.minColumn ? format0(endArr[4]) : '00') +
                    ':' +
                    (this.secColumn ? format0(endArr[5]) : '00');
                let time = {
                    startTime: startTimeBack,
                    endTime: endTimeBack
                };
                this.$emit('setPickerTime', {
                    detail: time
                });
                this.$emit('hidePicker', {
                    detail: {}
                });
            } else {
                uni.showToast({
                    icon: 'none',
                    title: '时间不合理'
                });
            }
        },
        hideModal: function () {
            this.$emit('hidePicker', {
                detail: {}
            });
        },
        changeStartDateTime: function (e) {
            let val = e.detail.value;
            this.compareTime(val, 'start');
        },
        changeEndDateTime: function (e) {
            let val = e.detail.value;
            this.compareTime(val, 'end');
        },

        compareTime(val_, type) {
            const val = val_.map((it) => it.toString());
            let h = val[3] ? this.HourList[val[3]] : '00';
            let m = val[4] ? this.MinuteList[val[4]] : '00';
            let s = val[5] ? this.SecondList[val[5]] : '00';
            let time = this.YearList[val[0]] + '-' + this.MonthList[val[1]] + '-' + this.DayList[val[2]] + ' ' + h + ':' + m + ':' + s;
            let start = this.limitStartTime;
            let end = this.limitEndTime;
            let timeNum = new Date(time.replace(/-/g, '/')).getTime();
            let year;
            let month;
            let day;
            let hour;
            let min;
            let sec;
            let limitDate;
            if (!this.dateLimit) {
                limitDate = [this.YearList[val[0]], this.MonthList[val[1]], this.DayList[val[2]], this.HourList[val[3]], this.MinuteList[val[4]], this.SecondList[val[5]]];
            } else {
                if (type == 'start' && timeNum > new Date(this.endPickTime.replace(/-/g, '/')) && this.config.endDate) {
                    limitDate = formatTime(this.endPickTime).arr;
                } else {
                    if (type == 'end' && timeNum < new Date(this.startPickTime.replace(/-/g, '/'))) {
                        limitDate = formatTime(this.startPickTime).arr;
                    } else {
                        if (timeNum < start) {
                            limitDate = this.limitStartTimeArr.arr;
                        } else {
                            if (timeNum > end) {
                                limitDate = this.limitEndTimeArr.arr;
                            } else {
                                limitDate = [
                                    this.YearList[val[0]],
                                    this.MonthList[val[1]],
                                    this.DayList[val[2]],
                                    this.HourList[val[3]],
                                    this.MinuteList[val[4]],
                                    this.SecondList[val[5]]
                                ];
                            }
                        }
                    }
                }
            }

            year = limitDate[0];
            month = limitDate[1];
            day = limitDate[2];
            hour = limitDate[3];
            min = limitDate[4];
            sec = limitDate[5];

            if (type == 'start') {
                this.setStartDate(year, month, day, hour, min, sec);
            } else {
                if (type == 'end') {
                    this.setEndDate(year, month, day, hour, min, sec);
                }
            }
        },

        getDays: function (year, month) {
            let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            if (month === 2) {
                return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
            } else {
                return daysInMonth[month - 1];
            }
        },
        initPick: function (initData) {
            const date = initData.initStartTime ? new Date(initData.initStartTime.replace(/-/g, '/')) : new Date();
            const endDate = initData.initEndTime ? new Date(initData.initEndTime.replace(/-/g, '/')) : new Date();
            const startYear = date.getFullYear();
            const startMonth = date.getMonth() + 1;
            const startDay = date.getDate();
            const startHour = date.getHours();
            const startMinute = date.getMinutes();
            const startSecond = date.getSeconds();
            const endYear = endDate.getFullYear();
            const endMonth = endDate.getMonth() + 1;
            const endDay = endDate.getDate();
            const endHour = endDate.getHours();
            const endMinute = endDate.getMinutes();
            const endSecond = endDate.getSeconds();
            let YearList = [];
            let MonthList = [];
            let DayList = [];
            let HourList = [];
            let MinuteList = [];
            let SecondList = [];

            for (let i = this.yearStart; i <= this.yearEnd; i++) {
                YearList.push(i);
            }

            for (let i = 1; i <= 12; i++) {
                MonthList.push(i);
            }

            for (let i = 1; i <= 31; i++) {
                DayList.push(i);
            }

            for (let i = 0; i <= 23; i++) {
                if (0 <= i && i < 10) {
                    i = '0' + i;
                }

                HourList.push(i);
            }

            for (let i = 0; i <= 59; i++) {
                if (0 <= i && i < 10) {
                    i = '0' + i;
                }

                MinuteList.push(i);
                SecondList.push(i);
            }

            this.setData({
                YearList,
                MonthList,
                DayList,
                HourList,
                MinuteList,
                SecondList
            });
            this.setStartDate(startYear, startMonth, startDay, startHour, startMinute, startSecond);
            this.setEndDate(endYear, endMonth, endDay, endHour, endMinute, endSecond);
        },

        setPickerDateArr(type, year, month, day, hour, minute, second) {
            let yearIdx = 0;
            let monthIdx = 0;
            let dayIdx = 0;
            let hourIdx = 0;
            let minuteIdx = 0;
            let secondIdx = 0;
            this.YearList.map((v, idx) => {
                if (parseInt(v) === year) {
                    yearIdx = idx;
                }
            });
            this.MonthList.map((v, idx) => {
                if (parseInt(v) === month) {
                    monthIdx = idx;
                }
            });
            let DayList = [];

            for (let i = 1; i <= this.getDays(year, month); i++) {
                DayList.push(i);
            }

            DayList.map((v, idx) => {
                if (parseInt(v) === day) {
                    dayIdx = idx;
                }
            });

            if (type == 'start') {
                this.setData({
                    startDayList: DayList
                });
            } else {
                if (type == 'end') {
                    this.setData({
                        endDayList: DayList
                    });
                }
            }

            this.HourList.map((v, idx) => {
                if (parseInt(v) === parseInt(hour)) {
                    hourIdx = idx;
                }
            });
            this.MinuteList.map((v, idx) => {
                if (parseInt(v) === parseInt(minute)) {
                    minuteIdx = idx;
                }
            });
            this.SecondList.map((v, idx) => {
                if (parseInt(v) === parseInt(second)) {
                    secondIdx = idx;
                }
            });
            return {
                yearIdx,
                monthIdx,
                dayIdx,
                hourIdx,
                minuteIdx,
                secondIdx
            };
        },

        setStartDate: function (year, month, day, hour, minute, second) {
            let pickerDateArr = this.setPickerDateArr('start', year, month, day, hour, minute, second);
            this.setData({
                startYearList: this.YearList,
                startMonthList: this.MonthList,
                startHourList: this.HourList,
                startMinuteList: this.MinuteList,
                startSecondList: this.SecondList,
                startValue: [pickerDateArr.yearIdx, pickerDateArr.monthIdx, pickerDateArr.dayIdx, pickerDateArr.hourIdx, pickerDateArr.minuteIdx, pickerDateArr.secondIdx],
                startPickTime:
                    this.YearList[pickerDateArr.yearIdx] +
                    '-' +
                    this.MonthList[pickerDateArr.monthIdx] +
                    '-' +
                    this.DayList[pickerDateArr.dayIdx] +
                    ' ' +
                    this.HourList[pickerDateArr.hourIdx] +
                    ':' +
                    this.MinuteList[pickerDateArr.minuteIdx] +
                    ':' +
                    this.SecondList[pickerDateArr.secondIdx]
            });
        },
        setEndDate: function (year, month, day, hour, minute, second) {
            let pickerDateArr = this.setPickerDateArr('end', year, month, day, hour, minute, second);
            this.setData({
                endYearList: this.YearList,
                endMonthList: this.MonthList,
                endHourList: this.HourList,
                endMinuteList: this.MinuteList,
                endSecondList: this.SecondList,
                endValue: [pickerDateArr.yearIdx, pickerDateArr.monthIdx, pickerDateArr.dayIdx, pickerDateArr.hourIdx, pickerDateArr.minuteIdx, pickerDateArr.secondIdx],
                endPickTime:
                    this.YearList[pickerDateArr.yearIdx] +
                    '-' +
                    this.MonthList[pickerDateArr.monthIdx] +
                    '-' +
                    this.DayList[pickerDateArr.dayIdx] +
                    ' ' +
                    this.HourList[pickerDateArr.hourIdx] +
                    ':' +
                    this.MinuteList[pickerDateArr.minuteIdx] +
                    ':' +
                    this.SecondList[pickerDateArr.secondIdx]
            });
        }
    },
    watch: {
        pickerShow: {
            handler: function (val) {
                if (val) {
                    let animation = uni.createAnimation({
                        duration: 500,
                        timingFunction: 'ease'
                    });
                    let animationOpacity = uni.createAnimation({
                        duration: 500,
                        timingFunction: 'ease'
                    });
                    setTimeout(() => {
                        animation.bottom(0).step();
                        animationOpacity.opacity(0.7).step();
                        this.setData({
                            animationOpacity: animationOpacity.export(),
                            animationData: animation.export()
                        });
                    }, 0);
                } else {
                    let animation = uni.createAnimation({
                        duration: 100,
                        timingFunction: 'ease'
                    });
                    let animationOpacity = uni.createAnimation({
                        duration: 500,
                        timingFunction: 'ease'
                    });
                    animation.bottom(-320).step();
                    animationOpacity.opacity(0).step();
                    this.setData({
                        animationOpacity: animationOpacity.export(),
                        animationData: animation.export()
                    });
                }

                if (this.startValue && this.endValue) {
                    let s = 0;
                    let e = 0;
                    let conf = this.config;
                    this.startValue.map((val) => {
                        if (val == 0) {
                            s++;
                        }
                    });
                    this.endValue.map((val) => {
                        if (val == 0) {
                            e++;
                        }
                    });
                    let tmp = {
                        hour: 4,
                        minute: 5,
                        second: 6
                    };
                    let n = tmp[conf.column];

                    if (s >= n || e >= n) {
                        this.initPick(this.config);
                        this.setData({
                            startValue: this.startValue,
                            endValue: this.endValue
                        });
                    }
                }
            },

            immediate: true
        }
    }
};

function formatTime(date) {
    if (typeof date == 'string' || 'number') {
        try {
            date = date.replace(/-/g, '/');
        } catch (error) {}

        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return {
        str: [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':'),
        arr: [year, month, day, hour, minute, second]
    };
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}
</script>
<style>
@import './time-picker.css';
</style>
