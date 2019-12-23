1. 实现
    ```js
    const curry = (fn, ...args) => {
        return (args.length >= fn.length)
            ? fn(...args)
            : (...argsNew) => curry(fn, ...args, ...argsNew)
    };
    ```