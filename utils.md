[30-seconds of code](https://github.com/30-seconds/30-seconds-of-code)

# js
### Adapter
1. [ary:生成函数，指定函数参数个数](#ary)
1. [flip](#flip)
1. [over:将参数传给一组函数执行](#over)
1. [pipeAsyncFunctions: 异步函数串行](#pipeAsyncFunctions)
1. [pipeFunctions: 按序执行](#pipeFunctions)
1. [unary: 只传入一个参数](#unary) 

### Array
1. [all: 所有元素符合断言函数](#all)
1. [bifurcateBy: 根据断言函数将数组元素分为两拨](#bifurcateBy)
1. [chunk:拆分数组](#chunk)
1. [compact](#compact)
1. [countBy:按各个元素对应属性分类，对应的个数](#countBy)
1. [deepFlatten:打平数组](#deepFlatten)

- <div id="ary">ary</div>
    ```js
    const ary = (fn, n) => (...args) => fn(...args.slice(0, n));
    ```
- <div id="flip">flip</div>
    ```js
    const flip = fn => (first, ...reset) => fn(...reset, first);
    ```
- <div id="over">over</div>
    ```js
    const over = (...fns) => (...args) => fns.map(fn => fn.call(null, args));
    ```
- <div id="pipeAsyncFunctions">pipeAsyncFunctions</div>
    new Promise(resolve => resolve(x + 2))等同于Promise.resolve(xxx),直接返回执行结果
    ```js
    const pipeAsyncFunctions = (...fns) => arg => fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
    ```
- <div id="pipeFunctions">pipeFunctions</div>
    ```js
    const pipeFunctions = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

    // 等同于
    const pipeFunctions = (...fns) => (...args) => fns.reduce((f, g) => g(f(...args)));
    ```

- <div id="unary>unary</div>
    ```js
    const unary = fn => val => fn(val);
    // [6, 8, 10]
    ['6', '8', '10'].map(unary(parseInt));

    // [ 6, NaN, 2 ]
    ['6', '8', '10'].map(parseInt);
    ```
- <div id="all">all</div>
    ```js
    const all = (arr, fn = Boolean) => arr.every(fn)
    ```
- <div id="bifurcateBy">bifurcateBy</div>
    ```js
    const bifurcateBy = (arr, fn) => 
        arr.reduce((acc, val, i) => (acc[fn(val, i) ? 0 : 1].push(val), acc), [[], []])
    ```
- <div id="chunk">chunk</div>
    ```js
    // 小数组长度size
    const chunk = (arr, size) => 
        Array.from({length: Math.ceil(arr.length / size)}, (value, index) => 
            arr.slice(index * size, index * size + size)
        )
    ```
- <div id="compact">compact</div>
    ```js
    const compact = arr => arr.filter(Boolean);
    ```
- <div id="countBy">countBy</div>
    ```js
    const countBy = (arr, fn) =>
        arr.map(typeof fn === 'function' ? fn : val => val[fn])
        .reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});

    countBy(['one', 'two', 'three'], 'length'); // {3: 2, 5: 1}
    ```
- <div id="deepFlatten">deepFlatten</div>
    ```js
    const deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v));
    
    // 其他写法
    const flatten = arr => arr.reduce((acc, val) => {
        return acc.concat(Array.isArray(val) ? flatten(val) : val);
    }, []);
    ```