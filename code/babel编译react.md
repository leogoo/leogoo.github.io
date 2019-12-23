1. react组件编译react组件常用的方法
    - _inherits
    - _classCallCheck: _classCallCheck(this, App)利用instanceof判断this是不是组件的实例，也就是否是new出来的
    - _possibleConstructorReturn
    - _createClass2
    ```js
    var App =
    /*#__PURE__*/
    function (_React$Component) {
        (0, _inherits2["default"])(App, _React$Component);

        function App(props) {
            var _this;

            (0, _classCallCheck2["default"])(this, App);
            _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(App).call(this, props));
            console.log(111);
            return _this;
        }

        (0, _createClass2["default"])(App, [{
            key: "componentWillMount",
            value: function componentWillMount() {
            console.log(222);
            }
        }, {
            key: "render",
            value: function render() {
            return _react["default"].createElement("div", null, "1111");
            }
        }]);
        return App;
    }(_react["default"].Component);
    ```
1. _inherits
    ```js
    function _inherits(subClass, superClass) {
        // 指定constructor
        subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        // subClass.__proto__ = superClass;
        // 继承一些类的静态方法？
        if (superClass) setPrototypeOf(subClass, superClass);
    }
    ```
1. _possibleConstructorReturn
    ```js
    // 调用父类的构造函数
    // subClass.__proto__ = superClass
    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    ```
    ```js
    function _possibleConstructorReturn(self, call) {
        if (call && (_typeof(call) === "object" || typeof call === "function")) {
            return call;
        }
        return self;
    }
    ```
1. _createClass
    ```js
    var _createClass = function () { 
        // 给对象添加属性
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) { 
                var descriptor = props[i];
                // class默认不可枚举
                descriptor.enumerable = descriptor.enumerable || false; 
                descriptor.configurable = true;//可配置修改属性
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);//给target添加属性
            } 
        }
        // 返回函数
        return function (Constructor, protoProps, staticProps) { 
            // 加到原型对象上的属性
            if (protoProps) defineProperties(Constructor.prototype, protoProps); 
            // 加到构造函数上的静态属性
            if (staticProps) defineProperties(Constructor, staticProps); 
            return Constructor; 
        }; 
    }();//立即执行
    ```
    1. 使用
        ```js
        _createClass2["default"](App, [{
            key: "componentWillMount",
            value: function componentWillMount() {
            console.log(222);
            }
        }, {
            key: "render",
            value: function render() {
            return _react["default"].createElement("div", null, "1111");
            }
        }]);
        ```
1. 扩展
    1. Object.create(proto, [ propertiesObjecy ])，第二个参数是给创建的新对象添加一些属性