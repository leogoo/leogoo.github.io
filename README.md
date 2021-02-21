# myBlog
做点小笔记，就当blog

## 深入js
1. [闭包](./js/bibao)
1. [函数](./js/function)
1. [es6之class](./js/class)
1. [es6之Async](./js/async)
1. [es6之proxy](./js/proxy)
1. [浅拷贝与深拷贝](./js/clone)
1. [js内存机制](./js/memory)
1. [js运行机制](./js/run)
1. [js类与继承](./js/instance)
1. [利用Event Bus实现组件通信](./js/event)
1. [localStorage使用](./js/localStorage)
1. [手写promise](./js/promise)
1. [js设计模式](./js/pattern)
1. [小知识](./js/index)

## react
1. [react入门知识点](./react/react)
1. [react源码](./react/yuanma)
1. [react中Context API](./react/context)
1. [react提供的Hook Api](./react/hook)
1. [react上的lodash——recompose](./react/recompose)
1. [深入理解redux](./react/redux)
1. [学习react-redux](./react/react-redux)
1. [redux-saga](./react/saga)
1. [react-router](./react/router)
1. [自定义hook](./react/hook2)

## 工程化
1. [node使用](./project/node)
1. [webpack基础系列](./project/webpack)
1. [webpack loader和plugin](./project/loader)
1. [前端模块化](./project/module)
1. [Git](./project/git)
1. [babel基础系列](./project/babel)
1. [ts](./project/ts)
1. [错误手机与上报](./project/error)

## 知识点
1. [iframe的使用](./point/iframe)
1. [iframe与浏览器浏览记录](./point/iframe2)
1. [IntersectionObserver](./point/observer)
1. [node环境下文件路径问题](./point/path)
1. [img标签与image对象](./point/image)
1. [开发业务组件自定义下拉框，实现点击组件外关闭下拉框](./point/sloganSelect)
1. [跨域](./point/access)
1. [前端路由](./point/route)
1. [前端与http请求](./point/http)
1. [promise并发数](./point/promise)


## 算法与数据结构
1. [链表](./algorithm/linked_list)

## [工具方法（函数式）](https://leogoo.github.io/utils)

## CSS
1. [多行截断问题](./css/line)
1. background-size，设置背景图片的尺寸
    1. length: 直接限制图片的宽高,第一个值设置宽度，第二个值设置高度。只设置一个，第二个则为auto
    1. percent: 以父元素的百分比来设置背景图像的宽度和高度，第一个值设置宽度，第二个值设置高度。如果只设置一个值，则第二个值会被设置为 "auto"
    1. cover: 把背景图像以长的一边扩展至足够大，以使背景图像完全覆盖背景区域。背景图像的某些部分也许无法显示在背景定位区域中
    1. contain：把图像图像扩展至最大尺寸，以使其宽度和高度完全适应内容区域，不覆盖容器
1. 移动端滑动
    ```css
    .container {
        overflow: hidden;
        ul {
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            // ios设备滑动
            -webkit-overflow-scrolling: touch;
            // 不换行
            white-space: nowrap;
            // 隐藏滚动条，将滚动条推出可视区
            padding-bottom: .2rem;
            li {
                display: inline-block;
            }
        }
    }
    ```
1. 实现移动端0.5px，可以使用transfrom: scaleY(.5);需要注意
    1. transform会影响垂直显示的优先级，类似加了一个position:relative
    2. transform-origin 改变被转换元素的位置
1. 对于inline-block，不能使用margin: 0 auto
1. 利用getBoundingClientRect方法获取元素对应盒子的宽高和位置属性
1. 安卓居中问题，可以设置字体font-family: PingFang SC, miui, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, sans-serif;
1. 安卓机上经常出现头像不够圆的问题，可以针对安卓对图像放大3，4倍