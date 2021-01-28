1. 实现
    ```js
    // 定义Promise的三种状态常量
    const PENDING = 'PENDING';
    const FULFILLED = 'FULFILLED';
    const REJECTED = 'REJECTED';
    const isFunction = fn => Object.prototype.toString.call(fn) === '[object Function]';
    const isPending = status => status === PENDING;
    const isPromise = target => target instanceof Promise;
    class Promise {
        constructor(executor) {
            this.status = PENDING;
            this.value;
            this.reason;
            // 添加成功回调函数队列
            this.fulfilledQueues = [];
            // 添加失败回调函数队列
            this.rejectedQueues = [];
            // 执行handle
            try {
                executor(this._resolve.bind(this), this._reject.bind(this)); 
            } catch (err) {
                this.reject(err);
            }
        }
        _resolve(val) {
            const self = this;
            const resolveFn = () => {
                if (self.status === PENDING) {
                    self.status = FULFILLED;
                    self.value = val;
                    let cb;
                    while(cb = self.fulfilledQueues.shift()) {
                        cb(val);
                    }
                }
            };
            setTimeOut(resolveFn, 0);
        }
        _reject(err) {
            const self = this;
            const rejectFn = () => {
                if (self.status === PENDING) {
                    self.status = REJECTED;
                    self.reason = err;
                    let cb;
                    while(cb = self.rejectedQueues.shift()) {
                        cb(err);
                    }
                }
            };
            setTimeOut(rejectFn, 0);
        }
        then(onFulfilled, onRejected) {
            const self = this;
            const {status, value, reason, fulfilledQueues, rejectedQueues} = self;
            return new Promise((reslove, reject) => {
                let fulfilledHandle = value => {
                    try {
                        if (isFunction(onFulfilled)) {
                            const result = onFulfilled(value);
                            // 如果当前回调函数返回值为promise实例，需要等待其状态变化后再执行下一个回调
                            if (isPromise(result)) {
                                // 同步reslut的状态
                                result.then(resolve, reject);
                            } else {
                                // 执行下一个then的回调
                                reslove(result);
                            }
                        }
                    } catch (err) {
                        // 新的promise出错，改变状态
                        reject(err);
                    }
                };

                let rejectedHandle = (reason) => {
                    const self = this;
                    try {
                        if (isFunction(onRejected)) {
                            const result = onRejected(reason);
                            if (isPromise(result)) {
                                result.then(resolve, reject);
                            } else {
                                reject(result);
                            }
                        }
                    } catch (err) {
                        reject(err);
                    }
                };

                switch(status) {
                    case PENDING:
                        fulfilledQueues.push(fulfilledHandle);
                        rejectedQueues.push(rejectedHandle);
                        break;
                    case FULFILLED:
                        fulfilledHandle(value);
                        break;
                    case REJECTED:
                        rejectedHandle(reason);
                        break;
                }
            })
        }

        static resolve (value) {
            if (value instanceof Promise) return value;
            return new Promise(resolve => resolve(value))
        }

        static reject (value) {
            return new Promise((resolve ,reject) => reject(value))
        }
    }
    ```
1. 注意点
    1. 状态只能由 pending 转到 fulfilled 或 rejected 状态，且状态不能再改变
    1. then返回一个新的promise，用于链式调用，为什么不直接返回this
        ```js
        // 如果返回的是this，promise2 === promise1
        // promise2 状态也应该等于 promise1 同为 resolved, 但执行onResolved回调需要改变状态为reject,这就出现矛盾了
        var promise2 = promise1.then(function (value) {
            return Promise.reject(3)
        });
        ```
    1. then中返回新的promise实例,then的onFulfilled方法如果没有返回值，`resolve(undefined)`,生成的promise实例也没有value值，后续的then方法正常执行
        ```js
        if (self.status === FULFILLED) {
            return bridgePromise = new MyPromise((resolve, reject) => {
                try {
                    // 状态变为成功，会有相应的 self.value
                    let x = onFulfilled(self.value);
                    // 暂时可以理解为 resolve(x)，后面具体实现中有拆解的过程
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        }
        ```