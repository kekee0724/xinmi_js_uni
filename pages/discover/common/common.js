'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.DiscoverTypeEnum = exports.ActivityModeEnum = exports.SignTypeEnum = exports.ReviewTypeEnum = exports.ActivityTypeEnum = void 0;
var ActivityTypeEnum;

(function (ActivityTypeEnum) {
    ActivityTypeEnum[(ActivityTypeEnum['signUp'] = 0)] = 'signUp';
    ActivityTypeEnum[(ActivityTypeEnum['onGoing'] = 1)] = 'onGoing';
    ActivityTypeEnum[(ActivityTypeEnum['finish'] = 2)] = 'finish';
    ActivityTypeEnum['unPublish'] = 'false';
})((ActivityTypeEnum = exports.ActivityTypeEnum || (exports.ActivityTypeEnum = {})));

var ReviewTypeEnum;

(function (ReviewTypeEnum) {
    ReviewTypeEnum[(ReviewTypeEnum['toBeReview'] = 0)] = 'toBeReview';
    ReviewTypeEnum[(ReviewTypeEnum['reviewNotPass'] = 1)] = 'reviewNotPass';
    ReviewTypeEnum[(ReviewTypeEnum['reviewPass'] = 2)] = 'reviewPass';
})((ReviewTypeEnum = exports.ReviewTypeEnum || (exports.ReviewTypeEnum = {})));

var SignTypeEnum;

(function (SignTypeEnum) {
    SignTypeEnum[(SignTypeEnum['waitSignIn'] = 0)] = 'waitSignIn';
    SignTypeEnum[(SignTypeEnum['signIn'] = 1)] = 'signIn';
})((SignTypeEnum = exports.SignTypeEnum || (exports.SignTypeEnum = {})));

var ActivityModeEnum;

(function (ActivityModeEnum) {
    ActivityModeEnum[(ActivityModeEnum['online'] = 1)] = 'online';
    ActivityModeEnum[(ActivityModeEnum['offline'] = 2)] = 'offline';
})((ActivityModeEnum = exports.ActivityModeEnum || (exports.ActivityModeEnum = {})));

var DiscoverTypeEnum;

(function (DiscoverTypeEnum) {
    DiscoverTypeEnum[(DiscoverTypeEnum['circle'] = 0)] = 'circle';
    DiscoverTypeEnum[(DiscoverTypeEnum['activityDiscover'] = 1)] = 'activityDiscover';
    DiscoverTypeEnum[(DiscoverTypeEnum['articleHome'] = 2)] = 'articleHome';
})((DiscoverTypeEnum = exports.DiscoverTypeEnum || (exports.DiscoverTypeEnum = {})));
