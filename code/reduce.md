1. 实现
    ```js
    Array.prototype.reduce = function (cb, initialValue) {
        const arr = this;
        let acc = initialValue || arr[0];
        const startIndex = initialValue ? 0 : 1;

        for (let i = startIndex; i < arr.length; i++) {
            acc = cb.call(undefined, acc, arr[i], i, arr);
        }
        return acc;
    }
    ```
1. 递归实现
    ```js
    Array.prototype.fakeReduce = function (fn, initialValue) {
        const arr = this;
        const [head, ...tail] = arr;
        let startIndex = 0;
        if (initialValue === undefined || initialValue === null) {
            startIndex = 1;
            return reduceHelper(fn, head, startIndex, arr);
        } else {
            return reducehelper(fn, initialValue, startIndex, tail);
        }
        const startIndex = (initialValue === undefined || initialValue === null) ? 1 : 0;
        return reduceHelper(fn, initialValue, arr);
    };
    function reduceHelper(fn, acc, idx, arr) {
        if (arr.length === 0) return acc;
        const [head, ...tail] = arr;
        idx ++;
        return reduceHelper(fn, fn(acc, head, idx, arr), tail);
    }
    ```