# Adapter
- [ary:忽略多余的参数](#ary)
- [collectInto:传入参数合并成数组](#collectInto)
- [over:对相同的参数同时执行多个函数](#over)
- [pipeFunctions:从左至右依次执行函数](#pipeFunctions)
- [rearg:利用indexes数组调整参数的顺序](#rearg)
- [spreadOver:将数组参数序列化](#spreadOver)
- [unary:只接受一个参数，忽略多余的参数](#unary)



# Array
- [chunk](#chunk)
- [compact](#compact)
- [countBy](#countBy)
- [countOccurrences](#countOccurrences)
- [deepFlatten](#deepFlatten)
- [difference:返回第一个数组中不在第二个数组的元素](#difference)

### Adapter
1. <div id="ary">ary</div>
    ```
    // ...args这样写，在函数执行传入序列化参数时，塞入数组args中
    const ary = (fn, n) => (...args) => fn(...args.slice(0, n));

    // example
    const firstTwoMax = ary(Math.max, 2);
    [[2, 6, 'a'], [8, 4, 6], [10]].map(x => firstToMax(...x));// [6, 8, 10]
    ```
1. <div id="collectInto">collectInto</div>
    ```
    const collectInto = fn => (...args) => fn(args);
    ```
1. <div id="over">over</div>
    ```
    const over = (...fns) => (...args) => fns.map(fn => fn.call(null, args));

    // example
    cosnt minMax = over(Math.min, Math.max);
    minMax(1,2,3,4,5); // [1, 5]
    ```
1. <div id="pipeFunctions">pipeFunctions</div>
    ```
    const pipeFunctions = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

    // example
    const add5 = x => x + 5;
    const multiply = (x, y) => x * y;
    const multiplyAndAdd5 = pipeFunctions(multiply, add5);
    multiplyAndAdd5(5, 2);// 15
    ```
1. <div id="rearg">rearg</div>
    ```
    const rearg = (fn, indexes) => (...args) =>
        fn(
            ...args.reduce(
                // 等价于 acc[indexes.indexOf(i)] = val; return acc;
                // indexes.indexOf(i)找到索引i在indexes中的位置
                (acc, val, i) => ((acc[indexes.indexOf(i)] = val), acc),
                Array.from({length: indexes.length})
            )
        );

    // example
    var rearged = rearg(
        function(a, b, c) {
            return [a, b, c];
        },
        [2, 0, 1]
    );
    rearged('b', 'c', 'a');// ['a', 'b', 'c']
    ```
1. <div id="spreadOver">spreadOver</div>
    ```
    const spreadOver = fn => argsArr => fn(...argsArr);

    // example
    const arrayMax = spreadOver(Math.max);
    arrayMax([1, 2, 3]);
    ```
1. <div id="unary">unary</div>
    ```
    const unary = fn => val => fn(val);

    // example
    ['6', '8', '10'].map(unary(parseInt));// [6, 8, 10]
    ```


### Array
Array.from() 方法从一个类似数组或*可迭代对象*中创建一个新的数组实例
    ```
    console.log(Array.from([1, 2, 3], x => x + x));
    // expected output: Array [2, 4, 6]
    ```
Boolean(a) 返回参数a的布尔值
arr.concat()参数可是序列化数值，或者是数组
    ```
    let arr = [1, 2];
    arr.concat(3, 4); //[1, 2, 3, 4]
    arr.concat([3, 4]); //[1, 2, 3, 4]
    arr.concat(3, [4]); //[1, 2, 3, 4]
    ```
slice(start, end)
    - 没有end则选取start到结尾
    - 参数为负数，表示从数组尾部开始
    - slice(0)克隆数组

arr.findIndex(callback(element, index, array), thisArg): 返回满足条件的第一个元素下标
1. <div id="chunk">chunk</div>
    ```
    const chunk = (arr, size) => 
        Array.from({length: Math.ceil(arr.length / size)}, (v, i) => {
            // v是前面可迭代对象的元素
            arr.slice(i * size, i * size + size)
        });
    ```
1. <div id="compact">compact</div>
    ```
    const compact = arr => arr.filter(Boolean);

    // example
    compact([0, 1, false, 2, '', 3, 'a', 'e' * 23, NaN, 's', 34]); // [ 1, 2, 3, 'a', 's', 34 ]
    ```
1. <div id="countBy">countBy</div>
    ```
    const countBy = (arr, fn) => 
        arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});

    // example
    countBy([6.1, 4.2, 6.3], Math.floor); // {4: 1, 6: 2}
    countBy(['one', 'two', 'three'], 'length'); // {3: 2, 5: 1}
    ```
1. <div id="countOccurrences">countOccurrences</div>
    ```
    const countOccurrences = (arr, val) =>
        arr.reduce((a, v) => (v === val ? a + 1 : a + 0), 0);

    // example
    countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3
    ```

1. <div id="deepFlatten">deepFlatten</div>
    ```
    const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));

    // example
    deepFlatten([1, [2], [[3], 4], 5]); // [1,2,3,4,5]
    ```
1. <div id="difference">difference</div>
    ```
    const difference = (a, b) => {
        const s = new Set(b);
        return a.filter(v => !s.has(v));
    }

    // example
    difference([1, 2, 3], [1, 2, 4]); // [3]
    ```
1. <div id="differenceBy">differenceBy</div>
    ```
    const differenceBy = (a, b, fn) => {
        const s = new Set(b.map(v => fn(v)));
        return a.filter(v => !s.has(fn(v)));
    }
    ```
1. <div id="drop">drop</div>: 剔除左侧前n个元素
    ```
    const drop = (arr, n = 1) => arr.slice(n);

    // example
    drop([1, 2, 3]); // [2,3]
    drop([1, 2, 3], 2); // [3]
    drop([1, 2, 3], 42); // []
    ```
1. <div id="dropRight">dropRight</div>
    ```
    const dropRight = (arr, n = 1) => arr.slice(0, -n);

    // example
    dropRight([1, 2, 3]); // [1,2]
    dropRight([1, 2, 3], 2); // [1]
    dropRight([1, 2, 3], 42); // []
    ```
1. <div id="everyNth">everyNth</div>
    ```
    const everyNth = (arr, Nth) => arr.filter((e, i) => i % nth === nth - 1);
    // example
    everyNth([1, 2, 3, 4, 5, 6], 2); // [ 2, 4, 6 ]
    ```
1. <div id="filterNonUnique">filterNonUnique</div>
    ```
    const filterNonUnique = arr => arr.filter(a => arr.indexOf(a) === arr.lastIndexOf(a));
    // example
    filterNonUnique([1, 2, 2, 3, 4, 4, 5]); // [1,3,5]
    ```
1. <div id="flatten">flatten</div>
    ```
    const flatten = (arr, depth = 1) =>
        depth !== 1
            ? arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? flatten(v, depth - 1) : v), [])
            : arr.reduce((acc, v) => acc.concat(v), [])

    // example
    flatten([1, [2], 3, 4]); // [1, 2, 3, 4]
    flatten([1, [2, [3, [4, 5], 6], 7], 8], 2); // [1, 2, 3, [4, 5], 6, 7, 8]
    ```
1. <div id="groupBy">groupBy</div>
    ```
    const groupBy = (arr, fn) =>
        arr.map(typeof fn === 'function' ? fn : val => val[fn])
            .reduce((acc, v, i) => {
                acc[v] = (acc[v] || []).concat(arr[i]);
                return acc;
            }, {});
    ```
1. initial: 返回除最后一个元素的数组
    ```
    const initial = arr => arr.slice(0, -1);
    ```
1. initialize2DArray
    ```
    const initialize2DArray = (w, h, val = null) =>
        Array.from({length: h}).map(() => Array.from({length: w})).fill(val);

    // example
    initialize2DArray(2, 2, 0); // [[0,0], [0,0]]
    ```
1. initializeArrayWithRange
    ```
    const initializeArrayWithRange = (end, start = 0, step = 1) =>
        Array.from({length: Math.ceil(end + 1 - start / step)}).map((v, i) => i * step + start);

    // example
    initializeArrayWithRange(5); // [0,1,2,3,4,5]
    initializeArrayWithRange(7, 3); // [3,4,5,6,7]
    initializeArrayWithRange(9, 0, 2); // [0,2,4,6,8]
    ```
1. intersection: 两个数组交集
    ```
    const intersection = (a, b) =>
        const s = new Set(b);
        return a.filter(x => s.has(x));
    ```
1. isSorted:是否排序，1为正序，-1为降序，0为未排序
    ```
    const isSorted = arr => {
        const direction = arr[0] > arr[1] ? -1 : 1;
        for (let [i, val] of arr.entries())
            if (i === arr.length - 1) return direction;
            else if ((val - arr[i + 1]) * direction > 0) return 0;
    };
    ```
1. maxN
    ```
    // [...arr]作用是克隆一个数组，sort会修改原数组
    const maxN = (arr, n = 1) => [...arr].sort((a, b) => b - a).slice(0, n);
    ```
1. partition: 将数组内元素分为两类
    ```
    const partition = (arr, fn) =>
        arr.reduce(
            (acc, v, i, arr) => {
                acc[fn(v, i, arr) ? 0 : 1].push(v);
                return acc;
            },
            [[], []]
        );

    // example
    const users = [{ user: 'barney', age: 36, active: false }, { user: 'fred', age: 40, active: true }];
    partition(users, o => o.active);
    ```
1. reduceWhich：返回最大或最小值
    ```
    const reduceWhich = (arr, comparator = (a, b) => a - b)) =>
        arr.reduce((a, b) => (comparator(a, b) > 0 ? b : a));


    reduceWhich(
        [{ name: 'Tom', age: 12 }, { name: 'Jack', age: 18 }, { name: 'Lucy', age: 9 }],
        (a, b) => a.age - b.age
    ); // {name: "Lucy", age: 9}
    ```
1. remove:过滤数组，并在原数组中去掉这些过滤出来的值
    ```
    const remove = (arr, func) =>
        Array.isArray(arr)
            ? arr.filter(func)
                .reduce((acc, v) => {
                    arr.splice(arr.indexOf(v)), 1);
                    return acc.concat(v);    // 返回过滤出来的元素
                }, [])
            : [];


    const arr = [1,2,4,5,6,7,9];
    console.log(remove(arr, n => n % 2 === 0)); // [ 2, 4, 6 ]
    console.log(arr);// [ 1, 5, 7, 9 ]
    ```
1. sample: 随机返回数组元素
    ```
    const sample = arr => arr[Math.floor(Math.random() * arr.length)];
    ```
1. shuffle
    ```
    const shuffle = ([...arr]) => {
        let m = arr.length;
        while(m) {
            const i = Math.floor(Math.random() * m--);
            [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr;
    };
    ```
1. similarity: 交集
    ```
    const similarity = (arr, values) => arr.filter(v => values.includes(v));
    ```
1. sortedIndex
    ```
    const sortedIndex = (arr, n) => {
        // 判断是否是降序
        const isDescending = arr[0] > arr[arr.length - 1];
        const index = arr.findIndex(el => isDescending ? el <= n : el > n);
        return index === -1 ? arr.length : index;
    };
    ```
1. symmetricDifference: a与b的并集-a与b的交集
    ```
    const symmetricDifference = (a, b) => {
        const sA = new Set(a);
        const sB = new Set(b);
        return [...a.filter(v => !sB.has(v)), ...b.filter(v => !sA.has(v))];
    };

    // 等价于
    const symmetricDifference = (a, b) => {
        return [...a.filter(v => !b.includes(v)), ...b.filter(v => !a.includes(v))];
    };
    ```
1. symmetricDifferenceWith
    ```
    const symmetricDifferenceWith = (a, b, comp) => [
        ...a.filter(x => b.findIndex(y => comp(x, y)) === -1),
        ...b.filter(x => a.findIndex(y => comp(x, y)) === -1)
    ];

    // example
    symmetricDifferenceWith(
        [1, 1.2, 1.5, 3, 0],
        [1.9, 3, 0, 3.9],
        (a, b) => Math.round(a) === Math.round(b)
    ); // [1, 1.2, 3.9]
    ```
1. tail:返回数组所有元素除了第一个
    ```
    const tail = arr => arr.length > 1 ? arr.slice(1) : arr;
    ```
1. takeRight：去数组后面几位
    ```
    const takeRight = (arr, n = 1) => arr.slice(arr.length - n, arr.length);
    // 等价于
    const takeRight = (arr, n = 1) => arr.slice(-n);
    ```
1. union
    ```
    const union = (a, b) => Array.from(new Set([...a, ...b]));
    ```
1. unzip
    ```
    const unzip = arr =>
        arr.reduce(
            // 将每个元素数组中的每个元素按下标加入到acc
            (acc, val) => (val.forEach((v, i) => acc[i].push(v)), acc),
            Array.from({
                // 获取子元素的最大长度,得到最终返回数组的长度
                length: Math.max(...arr.map(x => x.length))
            }).map(x => []);
        );
    

    unzip([['a', 1, true], ['b', 2, false]]); // [['a', 'b'], [1, 2], [true, false]]
    unzip([['a', 1, true], ['b', 2]]); // [['a', 'b'], [1, 2], [true]]
    ```
1. without
    ```
    const withou = (arr, ...args) => arr.filter(v => !args.includes(v))
    ```
1. xProd
    ```
    // example
    xProd([1, 2], ['a', 'b']); // [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]

    const xProd = (a, b) =>
        a.reduce((acc, x) => acc.concat(b.map(y => [x, y])), [])
    ```

### Function
1. compose
    ```
    const compose = (...fns) => fns.reduce((f,g) => （...args）=> f(g(...args)));
    ```
1. curry：利用bind，提前传入参数
    ```
    const curry = (fn, arity = fn.length, ...args) =>
    // arity为fn形参个数
        arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
    ```
1. debounce：防抖，间隔到一定时间才会执行
    ```
    const debounce = (fn, ms = 0) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), ms);
        };
    };

    // example
    window.addEventListener(
        'resize',
        debounce(() => {
            console.log(window.innerWidth);
            console.log(window.innerHeight);
        }, 250)
    ); // Will log the window dimensions at most every 250ms
    ```
1. defer： 延迟调用function直到当前调用栈清空为止，类似使用延时为0的setTimeout方法。对于执行开销大的计算和无阻塞UI线程的HTML渲染时候非常有用
    ```
    // setTimeout第二个参数后面的参数都是传入fn作为参数
    const defer = (fn, ...args) => setTimeout(fn, 1, ...args);
    ```
1. delay
    ```
    const delay = (fn, wait, ...args) => setTimeout(fn, wait, ...args);
    ```
1. hz: 函数每秒执行的次数
    ```
    const hz = (fn, iterations = 100) => {
        // 和Date.now)不同的是,window.performance.now()返回的时间戳没有被限制在一毫秒的精确度内,而它使用了一个浮点数来达到微秒级别的精确度
        // 另外一个不同点是,window.performance.now()是以一个恒定的速率慢慢增加的,它不会受到系统时间的影响
        const before = performance.now();
        for (let i = 0; i < iterations; i++) fn();
        return (1000 * iterations) / (performance.now() - before);
    }
    ```
1. memoize
    ```
    const memoize = fn => {
        const cache = new Map();
        const cached = function(val) {
            return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val);
        };
        cached.cache = cache;
        return cached;
    }
    ```
1. negate: 取否一个谓词函数
    ```
    const negate = fn => (...args) => !fn(...args);
    // example
    [1, 2, 3, 4, 5, 6].filter(negate(n => n % 2 === 0)); // [ 1, 3, 5 ]
    ```
1. once
    ```
    const once = fn =>
        let called = false;
        return function(...args) {
            if (called) return;
            called = true;
            return fn.apply(this, args);
        }
    ```
1. partial
    ```
    const partial = (fn, ...partials) => (...args) => fn(...partials, ...args);
    ```
1. sleep
    ```
    const sleep = ms => new Promise(resolve) => setTimeout(resolve, ms));
    ```
1. times: 迭代n次
    ```
    const times = (n, fn, context = undefined) => {
        let i = 0;
        while (fn.call(context, i) !== false && ++i < n) {}
    };

    // example
    var output = '';
    times(5, i => (output += i));
    console.log(output); // 01234
    ```

1. uncurry: 一次传入过个参数
    ```
    const uncurry = (fn, n = 1) {
        const next = acc => args => args.reduce((x, y) => x(y), acc);
        if (n < args.length) throw new RangeError('Arguments too few');
        return next(fn)(args.slice(0, n));
    }

    const add = x => y => z => x + y + z;
    const uncurriedAdd = uncurry(add, 3);
    uncurriedAdd(1, 2, 3); // 6
    ```

1. when
    ```
    // 第一个断言函数为true时，返回执行第二个函数的结果
    const when = (pred, whenTrue) => x => (pred(x) ? whenTure(x) : x);

    // example
    const doubleEvenNumbers = when(x => x % 2 === 0, x => x * 2);
    doubleEvenNumbers(2); // 4
    doubleEvenNumbers(1); // 1
    ```
### Obejct
1. deepClone
    ```
    const deepClone = obj => {
        let clone = Object.assign({}, obj);
        Object.keys(clone).foreach(
            key => (clone[key] = typeof obj[obj] === 'object' ? deepClone(obj[key]) : obj[key]);
        );
        return Array.isArray(obj) ? (clone.length = obj.length) && Array.from(clone) : clone;
    }
    ```
1. deepFreeze
    ```
    const deepFreeze = obj => {
        Object.keys(obj).forEach(
            prop =>
                (typeof obj[prop] === 'object') && !Object.isFrozen(obj[prop]) ? deepFreeze(obj[prop]) : null;
        );
        return Object.freeze(obj);
    }
    ```
1. dig: 读取深层次的属性
    ```
    const dig = (obj, target) =>
        target in obj
        ? obj[target]
        : Object.values(obj).reduce((acc, val) => {
            if (acc !== undefined) return acc;
            if (typeof val === 'object') return dig(val, target);
        }, undefined);
    ```
1. findKey
    ```
    const findKey = (obj, fn) => Object.keys(obj).find(key => fn(obj[key], key, obj));
    ```

1. flattenObject
    ```
    const flattenObject = (obj, prefix = '') =>
        Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k));
            else acc[pre + k] = obj[k];
            return acc;
        }, {});

    flattenObject({ a: { b: { c: 1 } }, d: 1 }); // { 'a.b.c': 1, d: 1 }
    ```
1. forOwn
Object.keys()用于获取对象自身所有的可枚举的属性值，但不包括原型中的属性，然后返回一个由属性名组成的数组
    ```
    const forOwn = (obj, fn) => Object.keys(obj).forEach(key => fn(obj[key], key, obj));
    ```
1. functions
    ```
    const functions = (obj, inherited = false) =>
        (inherited
            ? [...Object.keys(obj), ...Object.keys(Object.getPrototypeOf(obj))]
            : Object.keys(obj)
        ).filter(key => typeof obj[key] === 'function');

    // example
    function Foo() {
        this.a = () => 1;
        this.b = () => 2;
    }
    Foo.prototype.c = () => 3;
    functions(new Foo()); // ['a', 'b']
    functions(new Foo(), true); // ['a', 'b', 'c']
    ```

1. invertKeyValues
    ```
    const invertKeyValues = (obj, fn) => 
        Object.keys(obj).reduce((acc, key) => {
            let val = fn ? fn(obj[key]) : obj[key];
            acc[val] = acc[val] || [];
            acc[val].push(key);
            return acc;
        }, {});
    ```
1. mapKeys
    ```
    const mapKeys = (obj, fn) => {
        Object.keys(obj).reduce((acc, key) => {
            acc[fn(obj[key], key, obj)] = obj[key];
            return acc;
        }, {})
    }
    ```
1. matches: 第一个对象包含第二个对象的所有属性
    ```
    const matches = (obj, source) =>
        Object.keys(source).every(key => obj.hasOwnProperty(key) && obj[key] === source[key]);
    ```
1. merge:合并两个对象，对象的属性也是合并，而不是extend的覆盖
    ```
    const merge = (...objs) =>
        [...objs].reduce(
            (acc, obj) =>
                Object.keys(obj).reduce((a, k) => {
                    // acc[k]不一定是数组，所以[].concat(acc[k])
                    acc[k] = acc.hasOwnProperty(k) ? [].concat(acc[k]).concat(obj[k]) : obj[k];
                    return acc;
                }, {}),
            {}
        );
    ``` 
