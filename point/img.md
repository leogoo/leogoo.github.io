>img是一个特别常见的html标签，正常情况下使用也就是在src里放一个图片地址,然后页面也就会加载图片

### img请求
1. img标签实际是发送一个get请求，而且和script一样是可以跨域的
1. img请求获取到图片的**二进制流**。src内请求不能返回字符串(也就是返回的不是图片地址，这个刚开始不大好理解,src内直接放图片地址也是去请求一个图片类型的资源）
1. 同一个页面内加载同一张图片，只会发送一次请求

### 利用img发前端埋点监控
1. img请求可以应用于只需要向服务器发送数据(日志数据)的场合，且无需服务器有消息体回应，比如收集访问者的统计信息
1. 前端发送1*1的图片，后端不用返回内容，返回响应头表示响应成功就行

### 动态请求后端图片
1. 请求后端图片，也就是img发送后端请求，返回图片流
1. 服务端本地图片
    ```
    // 客户端
    <img src = 'http://hz01-msa-mes26.hz01.baidu.com:8085/getMaodouPicture' />

    // 服务端
    fs.readFile(__dirname+ '/a.png','binary',function(err,  file)  {
        if  (err)  {
            console.log(err);
            return;
        }else{
            console.log("输出文件");
            // 设置响应头
            res.writeHead(200,  {'Content-Type':'image/jpeg'});
            // 输出二进制流
            res.write(file,'binary');
            res.end();
        }
    });
    ```
1. 远程图片
    ```
    // 服务端
    let request = require("request");
    let opts = {
        url: 'http://pa-web-static.cdn.bcebos.com/jinrong-for-landing.jpg',
        encoding: null
    }
    request.get(opts, function(err, response, body) {
        res.writeHead(200,  {'Content-Type':'image/jpeg'});
        res.write(body);
        res.end();
    })
    ```