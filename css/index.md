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