1. 原理
    1. 创建一个对象
    1. 指定原型
    1. 执行构造函数，上下文指向创建的对象
    1. 返回该对象，或者执行生成的对象
1. 实现
    ```js
    function myNew() {
        const obj = {};
        const constructor = Array.prototype.shift.call(arguments);
        obj.__proto__ = constructor.prototype;
        const result = constructor.call(obj);
        return result && typeof result === 'object' ? result : obj;
    }
    ```
1. 注意点
    1. 构造函数返回是对象，或者是数组、函数这种，那么new出来的实例就是函数执行的返回值