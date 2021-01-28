html中插入img标签实际上也是创建一个Image对象，而在js中创建一个Image对象则是相当于给浏览器缓存一张图片，需要将图片挂载到dom上

### 图片加载
通过创建Image并挂载到dom上时，并不能获取到img的width和height,这是因为html的加载要早于图片的加载。利用Image对象的onload事件
```js
var img = document.getElementById('img');
// 创建 Image对象
var imgObj = new Image();
// 为 src 属性赋值
imgObj.src = "img/demo.jpg";
// 将 Image对象插入到 img元素中
img.appendChild(imgObj);
// 当 imgObj 加载完毕后触发事件
imgObj.onload = function () {
    // 控制台打印 Image对象的 宽 和 高
    console.log(imgObj.width + "----" + imgObj.height);
};
```

### 图片预加载
图片预加载就是利用Image对象来缓存一个图片，待图片加载完了在挂载到dom
```js
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChlid(imgNode);

    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();

var proxyImage = (function() {
    var img = new Image;
    img.onload = function() {
        // 需要的图片加载完成后,直接加载缓存中的图片
        myImage.setsrc(this.src);
    };
    return {
        setSrc:function(src) {
            myImage.setSrc('');// 占位图片
            img.src = src;
        }
    }
})();
proxyImage.setSrc('');
```