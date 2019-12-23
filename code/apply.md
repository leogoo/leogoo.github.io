1. 实现
    ```js
    Function.prototype.apply = function(thisArg, argsArr) {
        const context = thisArg || window;

        // 缓存原有的fn方法
        let savedFn = null; 
        if (context.fn) {
            savedFn = context.fn;
        }
        context.fn = this;

        let result;
        if (!argsArr) {
            context.fn();
        } else {
            let args = [];
            for (let i = 0; i< argsArr.length; i++) {
                args.push('argsArr[' + i + ']');
            }
            // 展开参数context.fn(argsArr[0], argsArr[1],...)
            // 等同于eval(`context.fn(${args})`)
            result = eval('context.fn(' + args + ')');
            
            // es6
            result = context.fn(...argsArr);
        }

        if (savedFn) {
            context.fn = savedFn;
        } else {
            delete context.fn;
        }
        return result;
    }
    ```
1. 原理
    1. 先在指定的上下文上添加函数，并执行
    2. 删除函数
    1. 返回执行结果