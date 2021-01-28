### 组件的销毁
> react中props和state的修改触发组件的重渲染，但是不会执行子组件的constructor，可以通过修改key来强制重新加载子组件

1. 场景：使用倒计时组件来显示新人券活动倒计时，在落地页领取新人券回退到领券中心主页，发请求更新数据，此时倒计时显示券过期倒计时
1. 问题：使用mobx监听endTime，作为属性传入countDown。重渲染不会改变倒计时，刷新页面倒计时组件会更新
1. 原因：倒计时组件在constructor里面初始化内部的endTime，重渲染不会执行constructor
1. 解决方法：
    1. 改变key
        ```js
        <CountDown
            // 设置key，强制重新加载组件
            key={endTime}
            className={s.red}
            startTime={serverTime * 1000}
            endTime={endTime * 1000}
            fmtStr='<b>hh</b>:<b>mm</b>:<b>ss</b>'
        />
        ```
    1. 反向继承， 一是渲染劫持，二是操作state
        ```js
        function ReverseInheritance(Com) {
            return class extends Com {
                constructor(props) {
                    super(props);
                }
                render() {
                    super.constructor(this.props);
                    let renderchild = super.render();
                    let newProps = {};
                    const newRenderchild = React.cloneElement(
                        renderchild,
                        newProps
                    );
                    return newRenderchild;
                }
            }
        }
        ```