/*
 * charts for WeChat small app v1.0
 *
 * https://github.com/xiaolin3303/wx-charts
 * 2016-11-28
 *
 * Designed and built with all the love of Web
 */
'use strict';

function assign(t, e) {
    if (null == t) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    for (var i = Object(t), a = 1; a < arguments.length; a++) {
        var n = arguments[a];

        if (null != n) {
            for (var o in n) {
                if (Object.prototype.hasOwnProperty.call(n, o)) {
                    i[o] = n[o];
                }
            }
        }
    }

    return i;
}

function findRange(t, e, i) {
    if (isNaN(t)) {
        throw new Error('[wxCharts] unvalid series data!');
    }

    i = i || 10;
    e = e || 'upper';
    for (var a = 1; i < 1; ) {
        i *= 10;
        a *= 10;
    }

    for (t = 'upper' === e ? Math.ceil(t * a) : Math.floor(t * a); t % i != 0; ) {
        if ('upper' === e) {
            t++;
        } else {
            t--;
        }
    }

    return t / a;
}

function calValidDistance(t, e, i, a) {
    var n = a.width - i.padding - e.xAxisPoints[0];
    var o = e.eachSpacing * a.categories.length;
    var r = t;
    if (t >= 0) {
        r = 0;
    } else {
        if (Math.abs(t) >= o - n) {
            r = n - o;
        }
    }

    return r;
}

function isInAngleRange(t, e, i) {
    function a(t) {
        for (; t < 0; ) {
            t += 2 * Math.PI;
        }

        for (; t > 2 * Math.PI; ) {
            t -= 2 * Math.PI;
        }

        return t;
    }

    t = a(t);
    e = a(e);
    i = a(i);

    if (e > i) {
        i += 2 * Math.PI;

        if (t < e) {
            t += 2 * Math.PI;
        }
    }

    return t >= e && t <= i;
}

function calRotateTranslate(t, e, i) {
    var a = t;
    var n = i - e;
    var o = a + (i - n - a) / Math.sqrt(2);
    o *= -1;
    return {
        transX: o,
        transY: (i - n) * (Math.sqrt(2) - 1) - (i - n - a) / Math.sqrt(2)
    };
}

function createCurveControlPoints(t, e) {
    function i(t, e) {
        return !(!t[e - 1] || !t[e + 1]) && (t[e].y >= Math.max(t[e - 1].y, t[e + 1].y) || t[e].y <= Math.min(t[e - 1].y, t[e + 1].y));
    }

    var a = null;
    var n = null;
    var o = null;
    var r = null;
    if (e < 1) {
        a = t[0].x + 0.2 * (t[1].x - t[0].x);
        n = t[0].y + 0.2 * (t[1].y - t[0].y);
    } else {
        a = t[e].x + 0.2 * (t[e + 1].x - t[e - 1].x);
        n = t[e].y + 0.2 * (t[e + 1].y - t[e - 1].y);
    }

    if (e > t.length - 3) {
        var s = t.length - 1;
        o = t[s].x - 0.2 * (t[s].x - t[s - 1].x);
        r = t[s].y - 0.2 * (t[s].y - t[s - 1].y);
    } else {
        o = t[e + 1].x - 0.2 * (t[e + 2].x - t[e].x);
        r = t[e + 1].y - 0.2 * (t[e + 2].y - t[e].y);
    }

    if (i(t, e + 1)) {
        r = t[e + 1].y;
    }

    if (i(t, e)) {
        n = t[e].y;
    }

    return {
        ctrA: {
            x: a,
            y: n
        },
        ctrB: {
            x: o,
            y: r
        }
    };
}

function convertCoordinateOrigin(t, e, i) {
    return {
        x: i.x + t,
        y: i.y - e
    };
}

function avoidCollision(t, e) {
    if (e) {
        for (; util.isCollision(t, e); ) {
            if (t.start.x > 0) {
                t.start.y--;
            } else {
                if (t.start.x < 0) {
                    t.start.y++;
                } else {
                    if (t.start.y > 0) {
                        t.start.y++;
                    } else {
                        t.start.y--;
                    }
                }
            }
        }
    }

    return t;
}

function fillSeriesColor(t, e) {
    var i = 0;
    return t.map(function (t) {
        t.color || ((t.color = e.colors[i]), (i = (i + 1) % e.colors.length));
        return t;
    });
}

function getDataRange(t, e) {
    var i = 0;
    var a = e - t;
    if (a >= 10000) {
        i = 1000;
    } else {
        if (a >= 1000) {
            i = 100;
        } else {
            if (a >= 100) {
                i = 10;
            } else {
                if (a >= 10) {
                    i = 5;
                } else {
                    if (a >= 1) {
                        i = 1;
                    } else {
                        if (a >= 0.1) {
                            i = 0.1;
                        } else {
                            i = 0.01;
                        }
                    }
                }
            }
        }
    }

    return {
        minRange: findRange(t, 'lower', i),
        maxRange: findRange(e, 'upper', i)
    };
}

function measureText(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10;
    t = String(t);
    var t = t.split('');
    var i = 0;
    t.forEach(function (t) {
        if (/[a-zA-Z]/.test(t)) {
            i += 7;
        } else {
            if (/[0-9]/.test(t)) {
                i += 5.5;
            } else {
                if (/\./.test(t)) {
                    i += 2.7;
                } else {
                    if (/-/.test(t)) {
                        i += 3.25;
                    } else {
                        if (/[\u4e00-\u9fa5]/.test(t)) {
                            i += 10;
                        } else {
                            if (/\(|\)/.test(t)) {
                                i += 3.73;
                            } else {
                                if (/\s/.test(t)) {
                                    i += 2.5;
                                } else {
                                    if (/%/.test(t)) {
                                        i += 8;
                                    } else {
                                        i += 10;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return (i * e) / 10;
}

function dataCombine(t) {
    return t.reduce(function (t, e) {
        return (t.data ? t.data : t).concat(e.data);
    }, []);
}

function getSeriesDataItem(t, e) {
    var i = [];
    t.forEach(function (t) {
        if (null !== t.data[e] && void 0 !== t.data[e]) {
            var a = {};
            a.color = t.color;
            a.name = t.name;

            if (t.format) {
                a.data = t.format(t.data[e]);
            } else {
                a.data = t.data[e];
            }

            i.push(a);
        }
    });
    return i;
}

function getMaxTextListLength(t) {
    var e = t.map(function (t) {
        return measureText(t);
    });
    return Math.max.apply(null, e);
}

function getRadarCoordinateSeries(t) {
    for (var e = (2 * Math.PI) / t, i = [], a = 0; a < t; a++) {
        i.push(e * a);
    }

    return i.map(function (t) {
        return -1 * t + Math.PI / 2;
    });
}

function getToolTipData(t, e, i, a) {
    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
    var o = t.map(function (t) {
        return {
            text: n.format ? n.format(t, a[i]) : t.name + ': ' + t.data,
            color: t.color
        };
    });
    var r = [];
    var s = {
        x: 0,
        y: 0
    };
    e.forEach(function (t) {
        if (void 0 !== t[i] && null !== t[i]) {
            r.push(t[i]);
        }
    });
    r.forEach(function (t) {
        s.x = Math.round(t.x);
        s.y += t.y;
    });
    s.y /= r.length;
    return {
        textList: o,
        offset: s
    };
}

function findCurrentIndex(t, e, i, a) {
    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0;
    var o = -1;
    if (isInExactChartArea(t, i, a)) {
        e.forEach(function (e, i) {
            if (t.x + n > e) {
                o = i;
            }
        });
    }

    return o;
}

function isInExactChartArea(t, e, i) {
    return t.x < e.width - i.padding && t.x > i.padding + i.yAxisWidth + i.yAxisTitleWidth && t.y > i.padding && t.y < e.height - i.legendHeight - i.xAxisHeight - i.padding;
}

function findRadarChartCurrentIndex(t, e, i) {
    var a = (2 * Math.PI) / i;
    var n = -1;
    if (isInExactPieChartArea(t, e.center, e.radius)) {
        var o = function (t) {
            if (t < 0) {
                t += 2 * Math.PI;
            }

            if (t > 2 * Math.PI) {
                t -= 2 * Math.PI;
            }

            return t;
        };

        var r = Math.atan2(e.center.y - t.y, t.x - e.center.x);
        r *= -1;

        if (r < 0) {
            r += 2 * Math.PI;
        }

        e.angleList
            .map(function (t) {
                return (t = o(-1 * t));
            })
            .forEach(function (t, e) {
                var i = o(t - a / 2);
                var s = o(t + a / 2);
                if (s < i) {
                    s += 2 * Math.PI;
                }

                if ((r >= i && r <= s) || (r + 2 * Math.PI >= i && r + 2 * Math.PI <= s)) {
                    n = e;
                }
            });
    }

    return n;
}

function findPieChartCurrentIndex(t, e) {
    var i = -1;

    if (isInExactPieChartArea(t, e.center, e.radius)) {
        var a = Math.atan2(e.center.y - t.y, t.x - e.center.x);
        a = -a;

        for (var n = 0, o = e.series.length; n < o; n++) {
            var r = e.series[n];

            if (isInAngleRange(a, r._start_, r._start_ + 2 * r._proportion_ * Math.PI)) {
                i = n;
                break;
            }
        }
    }

    return i;
}

function isInExactPieChartArea(t, e, i) {
    return Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2) <= Math.pow(i, 2);
}

function splitPoints(t) {
    var e = [];
    var i = [];
    t.forEach(function (t, a) {
        if (null !== t) {
            i.push(t);
        } else {
            if (i.length) {
                e.push(i);
            }

            i = [];
        }
    });

    if (i.length) {
        e.push(i);
    }

    return e;
}

function calLegendData(t, e, i) {
    if (false === e.legend) {
        return {
            legendList: [],
            legendHeight: 0
        };
    }

    var a = [];
    var n = 0;
    var o = [];
    t.forEach(function (t) {
        var i = 30 + measureText(t.name || 'undefined');

        if (n + i > e.width) {
            a.push(o);
            n = i;
            o = [t];
        } else {
            n += i;
            o.push(t);
        }
    });

    if (o.length) {
        a.push(o);
    }

    return {
        legendList: a,
        legendHeight: a.length * (i.fontSize + 8) + 5
    };
}

function calCategoriesData(t, e, i) {
    var a = {
        angle: 0,
        xAxisHeight: i.xAxisHeight
    };
    var n = getXAxisPoints(t, e, i);
    var o = n.eachSpacing;
    var r = t.map(function (t) {
        return measureText(t);
    });
    var s = Math.max.apply(this, r);
    if (s + 2 * i.xAxisTextPadding > o) {
        a.angle = (45 * Math.PI) / 180;
        a.xAxisHeight = 2 * i.xAxisTextPadding + s * Math.sin(a.angle);
    }

    return a;
}

function getRadarDataPoints(t, e, i, a, n) {
    var o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 1;
    var r = n.extra.radar || {};
    r.max = r.max || 0;
    var s = Math.max(r.max, Math.max.apply(null, dataCombine(a)));
    var l = [];
    a.forEach(function (a) {
        var n = {};
        n.color = a.color;
        n.data = [];
        a.data.forEach(function (a, r) {
            var l = {};
            l.angle = t[r];
            l.proportion = a / s;
            l.position = convertCoordinateOrigin(i * l.proportion * o * Math.cos(l.angle), i * l.proportion * o * Math.sin(l.angle), e);
            n.data.push(l);
        });
        l.push(n);
    });
    return l;
}

function getPieDataPoints(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
    var i = 0;
    var a = 0;
    t.forEach(function (t) {
        if (null === t.data) {
            t.data = 0;
        } else {
            t.data = t.data;
        }

        i += t.data;
    });
    t.forEach(function (t) {
        if (null === t.data) {
            t.data = 0;
        } else {
            t.data = t.data;
        }

        t._proportion_ = (t.data / i) * e;
    });
    t.forEach(function (t) {
        t._start_ = a;
        a += 2 * t._proportion_ * Math.PI;
    });
    return t;
}

function getPieTextMaxLength(t) {
    t = getPieDataPoints(t);
    var e = 0;
    t.forEach(function (t) {
        var i = t.format ? t.format(+t._proportion_.toFixed(2)) : util.toFixed(100 * t._proportion_) + '%';
        e = Math.max(e, measureText(i));
    });
    return e;
}

function fixColumeData(t, e, i, a, n, o) {
    return t.map(function (t) {
        return null === t ? null : {};
    });
}

function getXAxisPoints(t, e, i) {
    var a = i.yAxisWidth + i.yAxisTitleWidth;
    var n = e.width - 2 * i.padding - a;
    var o = e.enableScroll ? Math.min(5, t.length) : t.length;
    var r = n / o;
    var s = [];
    var l = i.padding + a;
    var h = e.width - i.padding;
    t.forEach(function (t, e) {
        s.push(l + e * r);
    });

    if (true === e.enableScroll) {
        s.push(l + t.length * r);
    } else {
        s.push(h);
    }

    return {
        xAxisPoints: s,
        startX: l,
        endX: h,
        eachSpacing: r
    };
}

function getDataPoints(t, e, i, a, n, o, r) {
    var s = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 1;
    var l = [];
    var h = o.height - 2 * r.padding - r.xAxisHeight - r.legendHeight;
    t.forEach(function (t, c) {
        if (null === t) {
            l.push(null);
        } else {
            var d = {};
            d.x = a[c] + Math.round(n / 2);
            var x = (h * (t - e)) / (i - e);
            x *= s;
            d.y = o.height - r.xAxisHeight - r.legendHeight - Math.round(x) - r.padding;
            l.push(d);
        }
    });
    return l;
}

function getYAxisTextList(t, e, i) {
    var a = dataCombine(t);
    a = a.filter(function (t) {
        return null !== t;
    });
    var n = Math.min.apply(this, a);
    var o = Math.max.apply(this, a);
    if ('number' == typeof e.yAxis.min) {
        n = Math.min(e.yAxis.min, n);
    }

    if ('number' == typeof e.yAxis.max) {
        o = Math.max(e.yAxis.max, o);
    }

    if (n === o) {
        var r = o || 1;
        n -= r;
        o += r;
    }

    for (var s = getDataRange(n, o), l = s.minRange, h = s.maxRange, c = [], d = (h - l) / i.yAxisSplit, x = 0; x <= i.yAxisSplit; x++) {
        c.push(l + d * x);
    }

    return c.reverse();
}

function calYAxisData(t, e, i) {
    var a = getYAxisTextList(t, e, i);
    var n = i.yAxisWidth;
    var o = a.map(function (t) {
        return {};
    });
    if (true === e.yAxis.disabled) {
        n = 0;
    }

    return {
        rangesFormat: o,
        ranges: a,
        yAxisWidth: n
    };
}

function drawPointShape(t, e, i, a) {
    a.beginPath();
    a.setStrokeStyle('#ffffff');
    a.setLineWidth(1);
    a.setFillStyle(e);

    if ('diamond' === i) {
        t.forEach(function (t, e) {
            if (null !== t) {
                a.moveTo(t.x, t.y - 4.5);
                a.lineTo(t.x - 4.5, t.y);
                a.lineTo(t.x, t.y + 4.5);
                a.lineTo(t.x + 4.5, t.y);
                a.lineTo(t.x, t.y - 4.5);
            }
        });
    } else {
        if ('circle' === i) {
            t.forEach(function (t, e) {
                if (null !== t) {
                    a.moveTo(t.x + 3.5, t.y);
                    a.arc(t.x, t.y, 4, 0, 2 * Math.PI, false);
                }
            });
        } else {
            if ('rect' === i) {
                t.forEach(function (t, e) {
                    if (null !== t) {
                        a.moveTo(t.x - 3.5, t.y - 3.5);
                        a.rect(t.x - 3.5, t.y - 3.5, 7, 7);
                    }
                });
            } else {
                if ('triangle' === i) {
                    t.forEach(function (t, e) {
                        if (null !== t) {
                            a.moveTo(t.x, t.y - 4.5);
                            a.lineTo(t.x - 4.5, t.y + 4.5);
                            a.lineTo(t.x + 4.5, t.y + 4.5);
                            a.lineTo(t.x, t.y - 4.5);
                        }
                    });
                }
            }
        }
    }

    a.closePath();
    a.fill();
    a.stroke();
}

function drawRingTitle(t, e, i) {
    var a = t.title.fontSize || e.titleFontSize;
    var n = t.subtitle.fontSize || e.subtitleFontSize;
    var o = t.title.name || '';
    var r = t.subtitle.name || '';
    var s = t.title.color || e.titleColor;
    var l = t.subtitle.color || e.subtitleColor;
    var h = o ? a : 0;
    var c = r ? n : 0;
    if (r) {
        var d = measureText(r, n);
        var x = (t.width - d) / 2 + (t.subtitle.offsetX || 0);
        var f = (t.height - e.legendHeight + n) / 2;
        if (o) {
            f -= (h + 5) / 2;
        }

        i.beginPath();
        i.setFontSize(n);
        i.setFillStyle(l);
        i.fillText(r, x, f);
        i.stroke();
        i.closePath();
    }

    if (o) {
        var u = measureText(o, a);
        var g = (t.width - u) / 2 + (t.title.offsetX || 0);
        var p = (t.height - e.legendHeight + a) / 2;
        if (r) {
            p += (c + 5) / 2;
        }

        i.beginPath();
        i.setFontSize(a);
        i.setFillStyle(s);
        i.fillText(o, g, p);
        i.stroke();
        i.closePath();
    }
}

function drawPointText(t, e, i, a) {
    var n = e.data;
    a.beginPath();
    a.setFontSize(i.fontSize);
    a.setFillStyle('#666666');
    t.forEach(function (t, i) {
        if (null !== t) {
            var o = e.format ? e.format(n[i]) : n[i];
            a.fillText(o, t.x - measureText(o) / 2, t.y - 2);
        }
    });
    a.closePath();
    a.stroke();
}

function drawRadarLabel(t, e, i, a, n, o) {
    var r = a.extra.radar || {};
    e += n.radarLabelTextMargin;
    o.beginPath();
    o.setFontSize(n.fontSize);
    o.setFillStyle(r.labelColor || '#666666');
    t.forEach(function (t, r) {
        var s = {
            x: e * Math.cos(t),
            y: e * Math.sin(t)
        };
        var l = convertCoordinateOrigin(s.x, s.y, i);
        var h = l.x;
        var c = l.y;
        if (util.approximatelyEqual(s.x, 0)) {
            h -= measureText(a.categories[r] || '') / 2;
        } else {
            if (s.x < 0) {
                h -= measureText(a.categories[r] || '');
            }
        }

        o.fillText(a.categories[r] || '', h, c + n.fontSize / 2);
    });
    o.stroke();
    o.closePath();
}

function drawPieText(t, e, i, a, n, o) {
    var r = n + i.pieChartLinePadding;
    var s = [];
    var l = null;
    t.map(function (t) {
        return {
            arc: 2 * Math.PI - (t._start_ + (2 * Math.PI * t._proportion_) / 2),
            text: t.format ? t.format(+t._proportion_.toFixed(2)) : util.toFixed(100 * t._proportion_) + '%',
            color: t.color
        };
    }).forEach(function (t) {
        var e = Math.cos(t.arc) * r;
        var a = Math.sin(t.arc) * r;
        var o = Math.cos(t.arc) * n;
        var h = Math.sin(t.arc) * n;
        var c = e >= 0 ? e + i.pieChartTextPadding : e - i.pieChartTextPadding;
        var d = a;
        var x = measureText(t.text);
        var f = d;
        if (
            l &&
            util.isSameXCoordinateArea(l.start, {
                x: c
            })
        ) {
            if (c > 0) {
                f = Math.min(d, l.start.y);
            } else {
                if (e < 0) {
                    f = Math.max(d, l.start.y);
                } else {
                    if (d > 0) {
                        f = Math.max(d, l.start.y);
                    } else {
                        f = Math.min(d, l.start.y);
                    }
                }
            }
        }

        if (c < 0) {
            c -= x;
        }

        var u = {
            lineStart: {
                x: o,
                y: h
            },
            lineEnd: {
                x: e,
                y: a
            },
            start: {
                x: c,
                y: f
            },
            width: x,
            height: i.fontSize,
            text: t.text,
            color: t.color
        };
        l = avoidCollision(u, l);
        s.push(l);
    });
    s.forEach(function (t) {
        var e = convertCoordinateOrigin(t.lineStart.x, t.lineStart.y, o);
        var n = convertCoordinateOrigin(t.lineEnd.x, t.lineEnd.y, o);
        var r = convertCoordinateOrigin(t.start.x, t.start.y, o);
        a.setLineWidth(1);
        a.setFontSize(i.fontSize);
        a.beginPath();
        a.setStrokeStyle(t.color);
        a.setFillStyle(t.color);
        a.moveTo(e.x, e.y);
        var s = t.start.x < 0 ? r.x + t.width : r.x;
        var l = t.start.x < 0 ? r.x - 5 : r.x + 5;
        a.quadraticCurveTo(n.x, n.y, s, r.y);
        a.moveTo(e.x, e.y);
        a.stroke();
        a.closePath();
        a.beginPath();
        a.moveTo(r.x + t.width, r.y);
        a.arc(s, r.y, 2, 0, 2 * Math.PI);
        a.closePath();
        a.fill();
        a.beginPath();
        a.setFillStyle('#666666');
        a.fillText(t.text, l, r.y + 3);
        a.closePath();
        a.stroke();
        a.closePath();
    });
}

function drawToolTipSplitLine(t, e, i, a) {
    var n = i.padding;
    var o = e.height - i.padding - i.xAxisHeight - i.legendHeight;
    a.beginPath();
    a.setStrokeStyle('#cccccc');
    a.setLineWidth(1);
    a.moveTo(t, n);
    a.lineTo(t, o);
    a.stroke();
    a.closePath();
}

function drawToolTip(t, e, i, a, n) {
    var o = false;
    e = assign(
        {
            x: 0,
            y: 0
        },
        e
    );
    e.y -= 8;
    var r = t.map(function (t) {
        return measureText(t.text);
    });
    var s = 9 + 4 * a.toolTipPadding + Math.max.apply(null, r);
    var l = 2 * a.toolTipPadding + t.length * a.toolTipLineHeight;
    if (e.x - Math.abs(i._scrollDistance_) + 8 + s > i.width) {
        o = true;
    }

    n.beginPath();
    n.setFillStyle(i.tooltip.option.background || a.toolTipBackground);
    n.setGlobalAlpha(a.toolTipOpacity);

    if (o) {
        n.moveTo(e.x, e.y + 10);
        n.lineTo(e.x - 8, e.y + 10 - 5);
        n.lineTo(e.x - 8, e.y + 10 + 5);
        n.moveTo(e.x, e.y + 10);
        n.fillRect(e.x - s - 8, e.y, s, l);
    } else {
        n.moveTo(e.x, e.y + 10);
        n.lineTo(e.x + 8, e.y + 10 - 5);
        n.lineTo(e.x + 8, e.y + 10 + 5);
        n.moveTo(e.x, e.y + 10);
        n.fillRect(e.x + 8, e.y, s, l);
    }

    n.closePath();
    n.fill();
    n.setGlobalAlpha(1);
    t.forEach(function (t, i) {
        n.beginPath();
        n.setFillStyle(t.color);
        var r = e.x + 8 + 2 * a.toolTipPadding;
        var l = e.y + (a.toolTipLineHeight - a.fontSize) / 2 + a.toolTipLineHeight * i + a.toolTipPadding;
        if (o) {
            r = e.x - s - 8 + 2 * a.toolTipPadding;
        }

        n.fillRect(r, l, 4, a.fontSize);
        n.closePath();
    });
    n.beginPath();
    n.setFontSize(a.fontSize);
    n.setFillStyle('#ffffff');
    t.forEach(function (t, i) {
        var r = e.x + 8 + 2 * a.toolTipPadding + 4 + 5;

        if (o) {
            r = e.x - s - 8 + 2 * a.toolTipPadding + 4 + 5;
        }

        var l = e.y + (a.toolTipLineHeight - a.fontSize) / 2 + a.toolTipLineHeight * i + a.toolTipPadding;
        n.fillText(t.text, r, l + a.fontSize);
    });
    n.stroke();
    n.closePath();
}

function drawYAxisTitle(t, e, i, a) {
    var n = i.xAxisHeight + (e.height - i.xAxisHeight - measureText(t)) / 2;
    a.save();
    a.beginPath();
    a.setFontSize(i.fontSize);
    a.setFillStyle(e.yAxis.titleFontColor || '#333333');
    a.translate(0, e.height);
    a.rotate((-90 * Math.PI) / 180);
    a.fillText(t, n, i.padding + 0.5 * i.fontSize);
    a.stroke();
    a.closePath();
    a.restore();
}

function drawColumnDataPoints(t, e, i, a) {
    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1;
    var o = calYAxisData(t, e, i);
    var r = o.ranges;
    var s = getXAxisPoints(e.categories, e, i);
    var l = s.xAxisPoints;
    var h = s.eachSpacing;
    var c = r.pop();
    var d = r.shift();
    a.save();

    if (e._scrollDistance_ && 0 !== e._scrollDistance_ && true === e.enableScroll) {
        a.translate(e._scrollDistance_, 0);
    }

    t.forEach(function (o, r) {
        var s = o.data;
        var x = getDataPoints(s, c, d, l, h, e, i, n);
        x = fixColumeData(x, h, t.length, r, i, e);
        a.beginPath();
        a.setFillStyle(o.color);
        x.forEach(function (t, n) {
            if (null !== t) {
                var o = t.x - t.width / 2 + 1;
                var r = e.height - t.y - i.padding - i.xAxisHeight - i.legendHeight;
                a.moveTo(o, t.y);
                a.rect(o, t.y, t.width - 2, r);
            }
        });
        a.closePath();
        a.fill();
    });
    t.forEach(function (o, r) {
        var s = o.data;
        var x = getDataPoints(s, c, d, l, h, e, i, n);
        x = fixColumeData(x, h, t.length, r, i, e);

        if (false !== e.dataLabel && 1 === n) {
            drawPointText(x, o, i, a);
        }
    });
    a.restore();
    return {
        xAxisPoints: l,
        eachSpacing: h
    };
}

function drawAreaDataPoints(t, e, i, a) {
    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1;
    var o = calYAxisData(t, e, i);
    var r = o.ranges;
    var s = getXAxisPoints(e.categories, e, i);
    var l = s.xAxisPoints;
    var h = s.eachSpacing;
    var c = r.pop();
    var d = r.shift();
    var x = e.height - i.padding - i.xAxisHeight - i.legendHeight;
    var f = [];
    a.save();

    if (e._scrollDistance_ && 0 !== e._scrollDistance_ && true === e.enableScroll) {
        a.translate(e._scrollDistance_, 0);
    }

    if (e.tooltip && e.tooltip.textList && e.tooltip.textList.length && 1 === n) {
        drawToolTipSplitLine(e.tooltip.offset.x, e, i, a);
    }

    t.forEach(function (t, o) {
        var r = t.data;
        var s = getDataPoints(r, c, d, l, h, e, i, n);
        f.push(s);
        splitPoints(s).forEach(function (i) {
            a.beginPath();
            a.setStrokeStyle(t.color);
            a.setFillStyle(t.color);
            a.setGlobalAlpha(0.6);
            a.setLineWidth(2);

            if (i.length > 1) {
                var n = i[0];
                var o = i[i.length - 1];
                a.moveTo(n.x, n.y);

                if ('curve' === e.extra.lineStyle) {
                    i.forEach(function (t, e) {
                        if (e > 0) {
                            var n = createCurveControlPoints(i, e - 1);
                            a.bezierCurveTo(n.ctrA.x, n.ctrA.y, n.ctrB.x, n.ctrB.y, t.x, t.y);
                        }
                    });
                } else {
                    i.forEach(function (t, e) {
                        if (e > 0) {
                            a.lineTo(t.x, t.y);
                        }
                    });
                }

                a.lineTo(o.x, x);
                a.lineTo(n.x, x);
                a.lineTo(n.x, n.y);
            } else {
                var r = i[0];
                a.moveTo(r.x - h / 2, r.y);
                a.lineTo(r.x + h / 2, r.y);
                a.lineTo(r.x + h / 2, x);
                a.lineTo(r.x - h / 2, x);
                a.moveTo(r.x - h / 2, r.y);
            }

            a.closePath();
            a.fill();
            a.setGlobalAlpha(1);
        });

        if (false !== e.dataPointShape) {
            var u = i.dataPointShape[o % i.dataPointShape.length];
            drawPointShape(s, t.color, u, a);
        }
    });

    if (false !== e.dataLabel && 1 === n) {
        t.forEach(function (t, o) {
            drawPointText(getDataPoints(t.data, c, d, l, h, e, i, n), t, i, a);
        });
    }

    a.restore();
    return {
        xAxisPoints: l,
        calPoints: f,
        eachSpacing: h
    };
}

function drawLineDataPoints(t, e, i, a) {
    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1;
    var o = calYAxisData(t, e, i);
    var r = o.ranges;
    var s = getXAxisPoints(e.categories, e, i);
    var l = s.xAxisPoints;
    var h = s.eachSpacing;
    var c = r.pop();
    var d = r.shift();
    var x = [];
    a.save();

    if (e._scrollDistance_ && 0 !== e._scrollDistance_ && true === e.enableScroll) {
        a.translate(e._scrollDistance_, 0);
    }

    if (e.tooltip && e.tooltip.textList && e.tooltip.textList.length && 1 === n) {
        drawToolTipSplitLine(e.tooltip.offset.x, e, i, a);
    }

    t.forEach(function (t, o) {
        var r = t.data;
        var s = getDataPoints(r, c, d, l, h, e, i, n);
        x.push(s);
        splitPoints(s).forEach(function (i, n) {
            a.beginPath();
            a.setStrokeStyle(t.color);
            a.setLineWidth(2);

            if (1 === i.length) {
                a.moveTo(i[0].x, i[0].y);
                a.arc(i[0].x, i[0].y, 1, 0, 2 * Math.PI);
            } else {
                a.moveTo(i[0].x, i[0].y);

                if ('curve' === e.extra.lineStyle) {
                    i.forEach(function (t, e) {
                        if (e > 0) {
                            var n = createCurveControlPoints(i, e - 1);
                            a.bezierCurveTo(n.ctrA.x, n.ctrA.y, n.ctrB.x, n.ctrB.y, t.x, t.y);
                        }
                    });
                } else {
                    i.forEach(function (t, e) {
                        if (e > 0) {
                            a.lineTo(t.x, t.y);
                        }
                    });
                }

                a.moveTo(i[0].x, i[0].y);
            }

            a.closePath();
            a.stroke();
        });

        if (false !== e.dataPointShape) {
            var f = i.dataPointShape[o % i.dataPointShape.length];
            drawPointShape(s, t.color, f, a);
        }
    });

    if (false !== e.dataLabel && 1 === n) {
        t.forEach(function (t, o) {
            drawPointText(getDataPoints(t.data, c, d, l, h, e, i, n), t, i, a);
        });
    }

    a.restore();
    return {
        xAxisPoints: l,
        calPoints: x,
        eachSpacing: h
    };
}

function drawToolTipBridge(t, e, i, a) {
    i.save();

    if (t._scrollDistance_ && 0 !== t._scrollDistance_ && true === t.enableScroll) {
        i.translate(t._scrollDistance_, 0);
    }

    if (t.tooltip && t.tooltip.textList && t.tooltip.textList.length && 1 === a) {
        drawToolTip(t.tooltip.textList, t.tooltip.offset, t, e, i);
    }

    i.restore();
}

function drawXAxis(t, e, i, a) {
    var n = getXAxisPoints(t, e, i);
    var o = n.xAxisPoints;
    var r = (n.startX, n.endX, n.eachSpacing);
    var s = e.height - i.padding - i.xAxisHeight - i.legendHeight;
    var l = s + i.xAxisLineHeight;
    a.save();

    if (e._scrollDistance_ && 0 !== e._scrollDistance_) {
        a.translate(e._scrollDistance_, 0);
    }

    a.beginPath();
    a.setStrokeStyle(e.xAxis.gridColor || '#cccccc');

    if (true !== e.xAxis.disableGrid) {
        if ('calibration' === e.xAxis.type) {
            o.forEach(function (t, e) {
                if (e > 0) {
                    a.moveTo(t - r / 2, s);
                    a.lineTo(t - r / 2, s + 4);
                }
            });
        } else {
            o.forEach(function (t, e) {
                a.moveTo(t, s);
                a.lineTo(t, l);
            });
        }
    }

    a.closePath();
    a.stroke();
    var h = e.width - 2 * i.padding - i.yAxisWidth - i.yAxisTitleWidth;
    var c = Math.min(t.length, Math.ceil(h / i.fontSize / 1.5));
    var d = Math.ceil(t.length / c);
    t = t.map(function (t, e) {
        return e % d != 0 ? '' : t;
    });

    if (0 === i._xAxisTextAngle_) {
        a.beginPath();
        a.setFontSize(i.fontSize);
        a.setFillStyle(e.xAxis.fontColor || '#666666');
        t.forEach(function (t, e) {
            var n = r / 2 - measureText(t) / 2;
            a.fillText(t, o[e] + n, s + i.fontSize + 5);
        });
        a.closePath();
        a.stroke();
    } else {
        t.forEach(function (t, n) {
            a.save();
            a.beginPath();
            a.setFontSize(i.fontSize);
            a.setFillStyle(e.xAxis.fontColor || '#666666');
            var l = measureText(t);
            var h = r / 2 - l;
            var c = calRotateTranslate(o[n] + r / 2, s + i.fontSize / 2 + 5, e.height);
            var d = c.transX;
            var x = c.transY;
            a.rotate(-1 * i._xAxisTextAngle_);
            a.translate(d, x);
            a.fillText(t, o[n] + h, s + i.fontSize + 5);
            a.closePath();
            a.stroke();
            a.restore();
        });
    }

    a.restore();
}

function drawYAxisGrid(t, e, i) {
    for (
        var a = t.height - 2 * e.padding - e.xAxisHeight - e.legendHeight,
            n = Math.floor(a / e.yAxisSplit),
            o = e.yAxisWidth + e.yAxisTitleWidth,
            r = e.padding + o,
            s = t.width - e.padding,
            l = [],
            h = 0;
        h < e.yAxisSplit;
        h++
    ) {
        l.push(e.padding + n * h);
    }

    l.push(e.padding + n * e.yAxisSplit + 2);
    i.beginPath();
    i.setStrokeStyle(t.yAxis.gridColor || '#cccccc');
    i.setLineWidth(1);
    l.forEach(function (t, e) {
        i.moveTo(r, t);
        i.lineTo(s, t);
    });
    i.closePath();
    i.stroke();
}

function drawYAxis(t, e, i, a) {
    if (true !== e.yAxis.disabled) {
        var n = calYAxisData(t, e, i);
        var o = n.rangesFormat;
        var r = i.yAxisWidth + i.yAxisTitleWidth;
        var s = e.height - 2 * i.padding - i.xAxisHeight - i.legendHeight;
        var l = Math.floor(s / i.yAxisSplit);
        var h = i.padding + r;
        var c = e.width - i.padding;
        var d = e.height - i.padding - i.xAxisHeight - i.legendHeight;
        a.setFillStyle(e.background || '#ffffff');

        if (e._scrollDistance_ < 0) {
            a.fillRect(0, 0, h, d + i.xAxisHeight + 5);
        }

        a.fillRect(c, 0, e.width, d + i.xAxisHeight + 5);
        for (var x = [], f = 0; f <= i.yAxisSplit; f++) {
            x.push(i.padding + l * f);
        }

        a.stroke();
        a.beginPath();
        a.setFontSize(i.fontSize);
        a.setFillStyle(e.yAxis.fontColor || '#666666');
        o.forEach(function (t, e) {
            var n = x[e] ? x[e] : d;
            a.fillText(t, i.padding + i.yAxisTitleWidth, n + i.fontSize / 2);
        });
        a.closePath();
        a.stroke();

        if (e.yAxis.title) {
            drawYAxisTitle(e.yAxis.title, e, i, a);
        }
    }
}

function drawLegend(t, e, i, a) {
    if (e.legend) {
        var n = calLegendData(t, e, i);
        var o = n.legendList;
        o.forEach(function (t, n) {
            var o = 0;
            t.forEach(function (t) {
                t.name = t.name || 'undefined';
                o += 15 + measureText(t.name) + 15;
            });
            var r = (e.width - o) / 2 + 5;
            var s = e.height - i.padding - i.legendHeight + n * (i.fontSize + 8) + 5 + 8;
            a.setFontSize(i.fontSize);
            t.forEach(function (t) {
                switch (e.type) {
                    case 'line':
                        a.beginPath();
                        a.setLineWidth(1);
                        a.setStrokeStyle(t.color);
                        a.moveTo(r - 2, s + 5);
                        a.lineTo(r + 17, s + 5);
                        a.stroke();
                        a.closePath();
                        a.beginPath();
                        a.setLineWidth(1);
                        a.setStrokeStyle('#ffffff');
                        a.setFillStyle(t.color);
                        a.moveTo(r + 7.5, s + 5);
                        a.arc(r + 7.5, s + 5, 4, 0, 2 * Math.PI);
                        a.fill();
                        a.stroke();
                        a.closePath();
                        break;

                    case 'pie':
                    case 'ring':
                        a.beginPath();
                        a.setFillStyle(t.color);
                        a.moveTo(r + 7.5, s + 5);
                        a.arc(r + 7.5, s + 5, 7, 0, 2 * Math.PI);
                        a.closePath();
                        a.fill();
                        break;

                    default:
                        a.beginPath();
                        a.setFillStyle(t.color);
                        a.moveTo(r, s);
                        a.rect(r, s, 15, 10);
                        a.closePath();
                        a.fill();
                }

                r += 20;
                a.beginPath();
                a.setFillStyle(e.extra.legendTextColor || '#333333');
                a.fillText(t.name, r, s + 9);
                a.closePath();
                a.stroke();
                r += measureText(t.name) + 10;
            });
        });
    }
}

function drawPieDataPoints(t, e, i, a) {
    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1;
    var o = e.extra.pie || {};
    t = getPieDataPoints(t, n);
    var r = {
        x: e.width / 2,
        y: (e.height - i.legendHeight) / 2
    };
    var s = Math.min(r.x - i.pieChartLinePadding - i.pieChartTextPadding - i._pieTextMaxLength_, r.y - i.pieChartLinePadding - i.pieChartTextPadding);
    if (e.dataLabel) {
        s -= 10;
    } else {
        s -= 2 * i.padding;
    }

    t = t.map(function (t) {
        return {};
    });
    t.forEach(function (t) {
        a.beginPath();
        a.setLineWidth(2);
        a.setStrokeStyle('#ffffff');
        a.setFillStyle(t.color);
        a.moveTo(r.x, r.y);
        a.arc(r.x, r.y, s, t._start_, t._start_ + 2 * t._proportion_ * Math.PI);
        a.closePath();
        a.fill();

        if (true !== e.disablePieStroke) {
            a.stroke();
        }
    });

    if ('ring' === e.type) {
        var l = 0.6 * s;

        if ('number' == typeof e.extra.ringWidth && e.extra.ringWidth > 0) {
            l = Math.max(0, s - e.extra.ringWidth);
        }

        a.beginPath();
        a.setFillStyle(e.background || '#ffffff');
        a.moveTo(r.x, r.y);
        a.arc(r.x, r.y, l, 0, 2 * Math.PI);
        a.closePath();
        a.fill();
    }

    if (false !== e.dataLabel && 1 === n) {
        for (var h = false, c = 0, d = t.length; c < d; c++) {
            if (t[c].data > 0) {
                h = true;
                break;
            }
        }

        if (h) {
            drawPieText(t, e, i, a, s, r);
        }
    }

    if (1 === n && 'ring' === e.type) {
        drawRingTitle(e, i, a);
    }

    return {
        center: r,
        radius: s,
        series: t
    };
}

function drawRadarDataPoints(t, e, i, a) {
    var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1;
    var o = e.extra.radar || {};
    var r = getRadarCoordinateSeries(e.categories.length);
    var s = {
        x: e.width / 2,
        y: (e.height - i.legendHeight) / 2
    };
    var l = Math.min(s.x - (getMaxTextListLength(e.categories) + i.radarLabelTextMargin), s.y - i.radarLabelTextMargin);
    l -= i.padding;
    a.beginPath();
    a.setLineWidth(1);
    a.setStrokeStyle(o.gridColor || '#cccccc');
    r.forEach(function (t) {
        var e = convertCoordinateOrigin(l * Math.cos(t), l * Math.sin(t), s);
        a.moveTo(s.x, s.y);
        a.lineTo(e.x, e.y);
    });
    a.stroke();
    a.closePath();
    for (var h = 1; h <= i.radarGridCount; h++) {
        !(function (t) {
            var e = {};
            a.beginPath();
            a.setLineWidth(1);
            a.setStrokeStyle(o.gridColor || '#cccccc');
            r.forEach(function (n, o) {
                var r = convertCoordinateOrigin((l / i.radarGridCount) * t * Math.cos(n), (l / i.radarGridCount) * t * Math.sin(n), s);

                if (0 === o) {
                    e = r;
                    a.moveTo(r.x, r.y);
                } else {
                    a.lineTo(r.x, r.y);
                }
            });
            a.lineTo(e.x, e.y);
            a.stroke();
            a.closePath();
        })(h);
    }

    getRadarDataPoints(r, s, l, t, e, n).forEach(function (t, n) {
        a.beginPath();
        a.setFillStyle(t.color);
        a.setGlobalAlpha(0.6);
        t.data.forEach(function (t, e) {
            if (0 === e) {
                a.moveTo(t.position.x, t.position.y);
            } else {
                a.lineTo(t.position.x, t.position.y);
            }
        });
        a.closePath();
        a.fill();
        a.setGlobalAlpha(1);

        if (false !== e.dataPointShape) {
            var o = i.dataPointShape[n % i.dataPointShape.length];
            drawPointShape(
                t.data.map(function (t) {
                    return t.position;
                }),
                t.color,
                o,
                a
            );
        }
    });
    drawRadarLabel(r, l, s, e, i, a);
    return {
        center: s,
        radius: l,
        angleList: r
    };
}

function drawCanvas(t, e) {
    e.draw();
}

function Animation(t) {
    this.isStop = false;

    if (void 0 === t.duration) {
        t.duration = 1000;
    } else {
        t.duration = t.duration;
    }

    t.timing = t.timing || 'linear';
    var e = (function () {
        return 'undefined' != typeof requestAnimationFrame
            ? requestAnimationFrame
            : 'undefined' != typeof setTimeout
            ? function (t, e) {
                  setTimeout(function () {
                      var e = +new Date();
                      t(e);
                  }, e);
              }
            : function (t) {
                  t(null);
              };
    })();

    var i = null;

    var a = function (n) {
        if (null === n || true === this.isStop) {
            if (t.onProcess) {
                t.onProcess(1);
            }

            return void (t.onAnimationFinish && t.onAnimationFinish());
        }

        if (null === i) {
            i = n;
        }

        if (n - i < t.duration) {
            var o = (n - i) / t.duration;
            o = (0, Timing[t.timing])(o);

            if (t.onProcess) {
                t.onProcess(o);
            }

            e(a, 17);
        } else {
            if (t.onProcess) {
                t.onProcess(1);
            }

            if (t.onAnimationFinish) {
                t.onAnimationFinish();
            }
        }
    };

    a = a.bind(this);
    e(a, 17);
}

function drawCharts(t, e, i, a) {
    var that = this;
    var o = e.series;
    var r = e.categories;
    o = fillSeriesColor(o, i);
    var s = calLegendData(o, e, i);
    var l = s.legendHeight;
    i.legendHeight = l;
    var h = calYAxisData(o, e, i);
    var c = h.yAxisWidth;
    i.yAxisWidth = c;

    if (r && r.length) {
        var d = calCategoriesData(r, e, i);
        var x = d.xAxisHeight;
        var f = d.angle;
        i.xAxisHeight = x;
        i._xAxisTextAngle_ = f;
    }

    ('pie' !== t && 'ring' !== t) || (false === e.dataLabel ? (i._pieTextMaxLength_ = 0) : (i._pieTextMaxLength_ = getPieTextMaxLength(o)));
    var u = e.animation ? 1000 : 0;

    switch ((this.animationInstance && this.animationInstance.stop(), t)) {
        case 'line':
            this.animationInstance = new Animation({
                timing: 'easeIn',
                duration: u,
                onProcess: function (t) {
                    drawYAxisGrid(e, i, a);
                    var s = drawLineDataPoints(o, e, i, a, t);
                    var l = s.xAxisPoints;
                    var h = s.calPoints;
                    var c = s.eachSpacing;
                    that.chartData.xAxisPoints = l;
                    that.chartData.calPoints = h;
                    that.chartData.eachSpacing = c;
                    drawXAxis(r, e, i, a);
                    drawLegend(e.series, e, i, a);
                    drawYAxis(o, e, i, a);
                    drawToolTipBridge(e, i, a, t);
                    drawCanvas(e, a);
                },
                onAnimationFinish: function () {
                    that.event.trigger('renderComplete');
                }
            });
            break;

        case 'column':
            this.animationInstance = new Animation({
                timing: 'easeIn',
                duration: u,
                onProcess: function (t) {
                    drawYAxisGrid(e, i, a);
                    var s = drawColumnDataPoints(o, e, i, a, t);
                    var l = s.xAxisPoints;
                    var h = s.eachSpacing;
                    that.chartData.xAxisPoints = l;
                    that.chartData.eachSpacing = h;
                    drawXAxis(r, e, i, a);
                    drawLegend(e.series, e, i, a);
                    drawYAxis(o, e, i, a);
                    drawCanvas(e, a);
                },
                onAnimationFinish: function () {
                    that.event.trigger('renderComplete');
                }
            });
            break;

        case 'area':
            this.animationInstance = new Animation({
                timing: 'easeIn',
                duration: u,
                onProcess: function (t) {
                    drawYAxisGrid(e, i, a);
                    var s = drawAreaDataPoints(o, e, i, a, t);
                    var l = s.xAxisPoints;
                    var h = s.calPoints;
                    var c = s.eachSpacing;
                    that.chartData.xAxisPoints = l;
                    that.chartData.calPoints = h;
                    that.chartData.eachSpacing = c;
                    drawXAxis(r, e, i, a);
                    drawLegend(e.series, e, i, a);
                    drawYAxis(o, e, i, a);
                    drawToolTipBridge(e, i, a, t);
                    drawCanvas(e, a);
                },
                onAnimationFinish: function () {
                    that.event.trigger('renderComplete');
                }
            });
            break;

        case 'ring':
        case 'pie':
            this.animationInstance = new Animation({
                timing: 'easeInOut',
                duration: u,
                onProcess: function (t) {
                    that.chartData.pieData = drawPieDataPoints(o, e, i, a, t);
                    drawLegend(e.series, e, i, a);
                    drawCanvas(e, a);
                },
                onAnimationFinish: function () {
                    that.event.trigger('renderComplete');
                }
            });
            break;

        case 'radar':
            this.animationInstance = new Animation({
                timing: 'easeInOut',
                duration: u,
                onProcess: function (t) {
                    that.chartData.radarData = drawRadarDataPoints(o, e, i, a, t);
                    drawLegend(e.series, e, i, a);
                    drawCanvas(e, a);
                },
                onAnimationFinish: function () {
                    that.event.trigger('renderComplete');
                }
            });
    }
}

function Event() {
    this.events = {};
}

var config = {
    yAxisWidth: 15,
    yAxisSplit: 5,
    xAxisHeight: 15,
    xAxisLineHeight: 15,
    legendHeight: 15,
    yAxisTitleWidth: 15,
    padding: 12,
    columePadding: 3,
    fontSize: 10,
    dataPointShape: ['diamond', 'circle', 'triangle', 'rect'],
    colors: ['#7cb5ec', '#f7a35c', '#434348', '#90ed7d', '#f15c80', '#8085e9'],
    pieChartLinePadding: 25,
    pieChartTextPadding: 15,
    xAxisTextPadding: 3,
    titleColor: '#333333',
    titleFontSize: 20,
    subtitleColor: '#999999',
    subtitleFontSize: 15,
    toolTipPadding: 3,
    toolTipBackground: '#000000',
    toolTipOpacity: 0.7,
    toolTipLineHeight: 14,
    radarGridCount: 3,
    radarLabelTextMargin: 15
};
var util = {
    toFixed: function (t, e) {
        return {};
    },
    isFloat: function (t) {
        return t % 1 != 0;
    },
    approximatelyEqual: function (t, e) {
        return Math.abs(t - e) < 1e-10;
    },
    isSameSign: function (t, e) {
        return (Math.abs(t) === t && Math.abs(e) === e) || (Math.abs(t) !== t && Math.abs(e) !== e);
    },
    isSameXCoordinateArea: function (t, e) {
        return this.isSameSign(t.x, e.x);
    },
    isCollision: function (t, e) {
        t.end = {};
        t.end.x = t.start.x + t.width;
        t.end.y = t.start.y - t.height;
        e.end = {};
        e.end.x = e.start.x + e.width;
        e.end.y = e.start.y - e.height;
        return !(e.start.x > t.end.x || e.end.x < t.start.x || e.end.y > t.start.y || e.start.y < t.end.y);
    }
};
var Timing = {
    easeIn: function (t) {
        return Math.pow(t, 3);
    },
    easeOut: function (t) {
        return Math.pow(t - 1, 3) + 1;
    },
    easeInOut: function (t) {
        return (t /= 0.5) < 1 ? 0.5 * Math.pow(t, 3) : 0.5 * (Math.pow(t - 2, 3) + 2);
    },
    linear: function (t) {
        return t;
    }
};
Animation.prototype.stop = function () {
    this.isStop = true;
};

Event.prototype.addEventListener = function (t, e) {
    this.events[t] = this.events[t] || [];
    this.events[t].push(e);
};

Event.prototype.trigger = function () {
    for (var t = arguments.length, e = Array(t), i = 0; i < t; i++) {
        e[i] = arguments[i];
    }

    var a = e[0];
    var n = e.slice(1);
    if (this.events[a]) {
        this.events[a].forEach(function (t) {
            try {
                t.apply(null, n);
            } catch (t) {
                console.error(t);
            }
        });
    }
};

var Charts = function (t) {
    t.title = t.title || {};
    t.subtitle = t.subtitle || {};
    t.yAxis = t.yAxis || {};
    t.xAxis = t.xAxis || {};
    t.extra = t.extra || {};
    t.legend = false !== t.legend;
    t.animation = false !== t.animation;
    var e = assign({}, config);

    if (true !== t.yAxis.disabled && t.yAxis.title) {
        e.yAxisTitleWidth = e.yAxisTitleWidth;
    } else {
        e.yAxisTitleWidth = 0;
    }

    if (false === t.dataLabel) {
        e.pieChartLinePadding = 0;
    } else {
        e.pieChartLinePadding = e.pieChartLinePadding;
    }

    if (false === t.dataLabel) {
        e.pieChartTextPadding = 0;
    } else {
        e.pieChartTextPadding = e.pieChartTextPadding;
    }

    this.opts = t;
    this.config = e;
    this.context = uni.createCanvasContext(t.canvasId);
    this.chartData = {};
    this.event = new Event();
    this.scrollOption = {
        currentOffset: 0,
        startTouchX: 0,
        distance: 0
    };
    drawCharts.call(this, t.type, t, e, this.context);
};

Charts.prototype.updateData = function () {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    this.opts.series = t.series || this.opts.series;
    this.opts.categories = t.categories || this.opts.categories;
    this.opts.title = assign({}, this.opts.title, t.title || {});
    this.opts.subtitle = assign({}, this.opts.subtitle, t.subtitle || {});
    drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

Charts.prototype.stopAnimation = function () {
    if (this.animationInstance) {
        this.animationInstance.stop();
    }
};

Charts.prototype.addEventListener = function (t, e) {
    this.event.addEventListener(t, e);
};

Charts.prototype.getCurrentDataIndex = function (t) {
    var e = t.touches && t.touches.length ? t.touches : t.changedTouches;

    if (e && e.length) {
        var i = e[0];
        var a = i.x;
        var n = i.y;
        return 'pie' === this.opts.type || 'ring' === this.opts.type
            ? findPieChartCurrentIndex(
                  {
                      x: a,
                      y: n
                  },
                  this.chartData.pieData
              )
            : 'radar' === this.opts.type
            ? findRadarChartCurrentIndex(
                  {
                      x: a,
                      y: n
                  },
                  this.chartData.radarData,
                  this.opts.categories.length
              )
            : findCurrentIndex(
                  {
                      x: a,
                      y: n
                  },
                  this.chartData.xAxisPoints,
                  this.opts,
                  this.config,
                  Math.abs(this.scrollOption.currentOffset)
              );
    }

    return -1;
};

Charts.prototype.showToolTip = function (t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};

    if ('line' === this.opts.type || 'area' === this.opts.type) {
        var i = this.getCurrentDataIndex(t);
        var a = this.scrollOption.currentOffset;
        var n = assign({}, this.opts, {
            _scrollDistance_: a,
            animation: false
        });
        if (i > -1) {
            var o = getSeriesDataItem(this.opts.series, i);

            if (0 !== o.length) {
                var r = getToolTipData(o, this.chartData.calPoints, i, this.opts.categories, e);
                var s = r.textList;
                var l = r.offset;
                n.tooltip = {
                    textList: s,
                    offset: l,
                    option: e
                };
            }
        }

        drawCharts.call(this, n.type, n, this.config, this.context);
    }
};

Charts.prototype.scrollStart = function (t) {
    if (t.touches[0] && true === this.opts.enableScroll) {
        this.scrollOption.startTouchX = t.touches[0].x;
    }
};

Charts.prototype.scroll = function (t) {
    if (t.touches[0] && true === this.opts.enableScroll) {
        var e = t.touches[0].x - this.scrollOption.startTouchX;
        var i = this.scrollOption.currentOffset;
        var a = calValidDistance(i + e, this.chartData, this.config, this.opts);
        this.scrollOption.distance = e = a - i;
        var n = assign({}, this.opts, {
            _scrollDistance_: i + e,
            animation: false
        });
        drawCharts.call(this, n.type, n, this.config, this.context);
    }
};

Charts.prototype.scrollEnd = function (t) {
    if (true === this.opts.enableScroll) {
        var e = this.scrollOption;
        var i = e.currentOffset;
        var a = e.distance;
        this.scrollOption.currentOffset = i + a;
        this.scrollOption.distance = 0;
    }
};

module.exports = Charts;
