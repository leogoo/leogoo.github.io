1. 服务端会忽视链接中#后的内容，浏览器中#后的内容用来定位到业内元素，如果是有用信息可以用正则从location.href捕获出来
1. 对于inline-block，不能使用margin: 0 auto
1. 字符集合[]中., * 等特殊字符没有特殊意义，不用转义，转义也不起作用\
1. 每秒查询率QPS是对一个特定的查询服务器在规定时间内所处理流量多少的衡量标准
1. node解析excel文件，返回一个二维数组，一行是一个数组
    ```
    var xlsx = require('node-xlsx');
    var obj = xlsx.parse("./" + "keyword.xlsx");
    ```
1. node读写文件
    ```
    fs.readFile(filename, funciton (err, data) {

    });

    fs.writeFile('./keyword.json', JSON.stringify(obj), function (err) {
        if (err) {
            console.log('写文件操作失败');
        }
        else{
            console.log('写文件操作成功');
        }
    });
    ```
1. 使用for in来遍历，判断对象是否存在属性还是用obj.hasOwnProperty()
1. npm 5.0出现一个packjson-lock.json，这个文件是自动产生的用于限制packjson内模块的版本号，直接修改packjson内版本，执行npm i，模板的版本还是按照packjson-lock.json
1. String.fromCharCode()可以将unicode转为html实体字符
1. 使用高版本jQuery的ajax时，会对传的数据进行深度序列化，这样在后端得到的数组属性会有问题，加上traditional:true
    ```
    // post请求
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            fields: ['image', 'name']
        },
        success: success
    });
    
    // 浏览器
    fields[]: image
    fields[]: name

    // 后端
    console.log(req.body);
    {
        'fields[]': [ 'name', 'image' ]
    }
    ```
1. Plain Object指的是通过字面量形式或者new Object()形式定义的对象
    ```
    function isPlainObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        let proto = obj;
        // 找到原型的顶端
        // Object.getPrototypeOf({})为Object
        // Object.getPrototypeOf(Object)为null
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto);
        }
        // 判断原型是否只有一层
        return Object.getPrototypeOf(obj) === proto
    }
    ```
1. redux中触发action的方式有
    1. dispatch(action)
    1. dispatch(actioncreator()),bindActionCreators(actionCreators, dispatch)的作用就是dispatch原actioncreator返回的结果的函数
        ```
        // 关键代码
        function bindActionCreator(actionCreator, dispatch) {
            return (...args) => dispatch(actionCreator(...args));
        }
        ```
    1. 利用redux-thunk中间件执行异步action
        ```
        // redux-thunk就是将dispatch塞入actioncreator
        function createThunkMiddleware(extraArgument) {
            return ({ dispatch, getState }) => next => action => {
                if (typeof action === 'function') {
                    return action(dispatch, getState, extraArgument);
                }

                return next(action);
            };
        }

        const thunk = createThunkMiddleware();


        // actioncreator
        const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

        function increment() {
            return {
                type: INCREMENT_COUNTER
            };
        }

        function incrementAsync() {
            return dispatch => {
                setTimeout(() => {
                    // Yay! Can invoke sync or async actions with `dispatch`
                    dispatch(increment());
                }, 1000);
            };
        }
        ```
1. 箭头函数没有自身的this，所以只能根据作用域链往上层查找。箭头函数的this无法通过bind，call，apply来直接修改，可以利用闭包改变箭头函数外部函数的this
1. setState的异步性
    - 指在setState之后使用this.state可能读取的仍然是未更新的state,使用匿名函数
        ```
        this.setState((preState, props) => ({
            counter: preState.quantity + 1; 
        }))
        ```
    - 多次使用setState并没有关系,会合并
        ```
        state = {
            a: 1，
            b: 2,
            c: 3
        }
        this.setState({a:4})
        this.setState({b:5})
        this.setState({c:6})
        // 相当于下面这样的结果
        this.setState({a:4, b:5, c:6})
        ```
1. 扩展对象
    - 对象是可扩展的：即可以为他们添加新的属性。以及它们的 __proto__ 属性可以被更改
    - Object.preventExtensions:创建一个不可扩展的对象，对属性没有限制
    - Object.isExtensible(obj):判断是否可扩展对象
1. 密封对象
    - 密封对象是指那些不能添加新的属性，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性，但可能可以修改已有属性的值的对象
    - Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变
    - Object.isSealed(obj):判断密封对象
1. 冻结对象
    - 冻结对象是指那些不能添加新的属性，不能修改已有属性的值，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性的对象。也就是说，这个对象永远是不可变的
    - Object.freeze() 方法可以冻结一个对象
    - Object.isFrozen：判断对象是否是冻结对象（不可扩展，且属性为对象时也不可扩展）
    ```
    var oneProp = { p: 42 };
    console.log(Object.isFrozen(oneProp)) // false
    Object.preventExtensions(oneProp);
    console.log(Object.isSealed(oneProp));// false, 属性p可配置，可写
    console.log(Object.isFrozen(oneProp)) // false
    Object.seal(oneProp);
    console.log(Object.isSealed(oneProp));// true
    console.log(Object.isFrozen(oneProp));// false， 属性p可写
    ```
1. Array.from() 方法从一个类似数组或*可迭代对象*中创建一个新的数组实例
    ```
    console.log(Array.from([1, 2, 3], x => x + x));
    // expected output: Array [2, 4, 6]
    ```
1. arr.concat()参数可是**序列化数值**，或者是数组
    ```
    let arr = [1, 2];
    arr.concat(3, 4); //[1, 2, 3, 4]
    arr.concat([3, 4]); //[1, 2, 3, 4]
    arr.concat(3, [4]); //[1, 2, 3, 4]
    ```
1. slice(start, end)
    - 没有end则选取start到结尾
    - 参数为负数，表示从数组尾部开始
    - slice(0)克隆数组

1. arr.findIndex(callback(element, index, array), thisArg): 返回满足条件的第一个元素下标
1. 防抖debounce：触发n秒后执行，以新的事件的时间为准，n 秒后才执行
1. 节流throttle：持续触发事件，每隔n秒时间，只执行一次事件
1. 类的内部所有定义的方法，都是不可枚举的， 所以不能用...展开class内的方法会
1. event.target返回触发事件的元素, event.currentTarget返回绑定事件的元素
1. ref用在react组件上得到的是一个ReactElement对象，在原生组件上则是dom