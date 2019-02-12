>用Hooks实现Provider和connect，把store绑定到 Provider 上，用connect来获取store里的数据

### 新的Context Api
>新的Context Api采用声明式写法，且可以透过shouldComponentUpdate返回false的组件继续向下传播
- React.createContext用于初始化一个Context
- xxxContext.Provider作为顶层组件接受一个名为value的prop，可以接收任意需要被放入Context中的字符串、数字、甚至函数
- xxxContext.Consumer作为目标组件可以出现在组件树的任意位置（Provider之后），接收children prop，这里的children必须是一个函数（context => ()）用来接收顶层传来的Context

### Provider
将store绑定到Provider组件上
```js
import React, {createContext, useEffect, useState} from 'react';

const Context = createContext(null);

export const Provider = (props) => {
    // 保存store.subscribe返回的unsubscribe函数
    let unsubscribe = null;
    const {store} = props;
    
    const [storeState, setState] = useState(store.getState());

    useEffiect(() => {
        unsubscribe = store.subscribe(() => {
            const newState = store.getState();
            setState(prevState => (prevState === newState ? prevState : newState));
        });

        return () => unsubscribe && unsubscribe();
    }, [props.store])

    return (
        <Context.Provider value={{
            storeState,
            store
        }}
        >
            {props.children}
        </Context.Provider>
    )
}
```

### connect
用connect来获取store里的数据
```js
const empty = () => ({});
export const connect = (
    mapStateToProps = empty,
    mapDispatchToProps = empty
) => BaseComponent => props => (
    <Context.Consumer>
        {({storeState, store}) => (
            <BaseComponent
                {...mapStateToProps(storeState, props)}
                {...mapDispatchToProps(store.dispatch, props)}
            />
        )}
    </Context.Consumer>
)
```