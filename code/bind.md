1. 实现
    ```js
    Function.prototype.bind = function (target) {
        target = target || window;//如果没有传入,就为window
        const self = this;//谁调用myBind，this就指向谁
        const args = [].slice.call(arguments, 1);
        const temp = function () {};

        const bound = function () {
            const fnArgs = args.concat(Array.prototype.slice.call(arguments));
            self.apply(
                // 如果是new的，那么this是bound的实例
                // this.__proto__ = bound.prototype
                this instanceof temp ? this : target,
                fnArgs
            );
        };

        // 如果直接bound.prototype = this.prototype就变成同一个引用
        // 修改bound.prototype会修改this.prototype
        // 等同于bound.prototype = Object.create(this.prototype)
        temp.prototype = this.prototype;
        bound.prototype = new temp(); // bound.prototype.__proto__ = this.prototype
        return bound;
    }
    ```
1. 注意
    1. 箭头函数不能使用arguments
    1. 箭头函数没有prototype
    1. 箭头函数没有this，箭头函数this永远指向它所在的作用域
        ```js
        function foo() {
            let a = {
                c: function() {
                    console.log(this);
                },
                d: () => {
                    console.log(this);
                }
            }
        }

        // babel
        function foo() {
            var _this = this;
            var a = {
                c: function c() {
                    console.log(this);
                },
                d: function d() {
                    console.log(_this);
                }
            };
        }
        ```
    1. Object.create(), new一个空的构造函数，构造了原型链
        ```js
        Object.create = function (o) {
            function f(){}
            f.prototype = o;
            return new f();
        }

        const obj = Object.create(o);
        obj.__proto__ = f.prototype = o;
        ```