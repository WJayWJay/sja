
/**
 * {from, to, duration, callback, calVal: defaltCal}
 * @param {number} option.from
 * @param {number} option.to
 * @param {number} option.duration
 * @param {Function} option.callback
 * @param {Function} option.calVal
 * @param {Function} option.complete
 * @returns {Function}
 */
export function animation (
    option
) {
    var options = Object.assign({
        context: null,
        duration: 300,
        easing: 'Linear',
        calVal: defaltCal,
        callback: function() {},
        complete: function() {},
    }, option || {});

    var calVal = options.calVal;
    var start = 0;
    var req = null;
    var during = Math.ceil(options.duration / 16);

    var from = options.from;
    var to = options.to;

    var completeFn = [];

    const raf = (fn) => {
        window.requestAnimationFrame(fn);
    }

    const cancelRaf = () => {
        window.cancelAnimationFrame(req);
    }

    const getProgress = (start, from , range, dura) => {
        if (calVal) {
            return calVal(start, from , range, dura);
        }
        return range * start / dura + from;
    };

    const tick = function() {
        var value = getProgress(start, from, to - from, during);
        start++;
        if (start <= during) {
            options.callback(value);
            req = raf(tick);
        } else {
            options.callback(to, true);
            options.complete(to);
            if (completeFn.length) {
                for (let i = 0; i < completeFn.length; i++) {
                    completeFn[i].call(options.context, to);
                }
            }
        }
    }
    const resume = () => {
        tick();
    }
    
    const stopAtEnd = () => {
        completeFn.length = 0;
    }

    const reverse = () => {
        var tmp = options.from;
        options.from = options.to;
        options.to = tmp;
        start = 0;
        tick();
    }
    const reverseAtStop = () => {
        tick();
    }
    const reset = () => {
        start = 0;
    }

    const getStatus = () => {
        return start / during;
    }
    const startFn = () => {
        return tick();
    }
    const getOption = () => {
        return options;
    }

    tick();

    return returnFn();

    function returnFn() {
        return {
            getOption,
            start: startFn,
            getStatus,
            reset,
            cancelRaf,
            stop: cancelRaf,
            stopAtEnd,
            resume,
            repeat,
            reverse,
            reverseAtStop
        };
    }
}