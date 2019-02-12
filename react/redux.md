### 关于状态管理
react作为view层，一般不会操作dom，而是通过状态的改变来实现dom的修改
不用状态管理工具也是可以开发react的应用的，直接使用props和state
    - state是组件内的状态
    - props是组件外的状态
    - 数据流由外到内，事件执行时有内而外的，即在组件内部调用经props传入的函数，修改外部组件是state

### redux结合react-redux使用
[利用hook实现react-redux](./react-redux)
1. 最外层父组件利用redux.createStore创建全局store，利用<Provider>将store传入
    ```
    let store = createStore(reducers);

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    )
    ```
1. reducer是用来更新状态的纯函数
    ```
    const todos = (state = [], action) => {
        switch (action.type) {
            case 'ADD_TODO':
                return [
                    ...state,
                    {
                        id: action.id,
                    }
                ]
            default:
                return state
        }
    }

    export default todos
    ```
1. actioncreateor
    ```
    export const toggleTodo = id => {
        return {
            type: 'ADD_TODO',
            id
        }
    }
    ```
1. 容器组件，利用connect获取全局状态
    ```
    const mapStateToProps = state => {
        return {
            todos: doSomething(state.todos)
        }
    };

    const mapDispatchToProps = dispatch => {
        return {
            onTodoClick: id => {
                dispatch(toggleTodo(id))
            }
        }
    };

    const VisibleTodoList = connect(
        mapStateToProps,
        mapDispatchToProps
    )(Component)
    ```

### redux源码分析
最核心的api就是createStore
    ```js
    const createStore = (reducer, initialState ={}) => {
        // 当前state
        let state = initialState;
        // 当前订阅的listeners
        let listeners = [];
        // getstate用于获取当前的state
        const getState = () => state;
        // dispatch一个action，调用reducer生成一个新的state
        const dispatch = (action) => {
            state = reducer(state, action);
            listeners.forEach(l => l());
        };

        // sunscribe用于订阅一个listener
        // 返回一个函数，用于取消该listener订阅的unsubscribe函数
        const subscribe = (listener) => {
            listeners.push(listener);
            return () => {
                listeners = listeners.fileter(l => l !== listener)
            }
        };

        return {
            getState,
            dispatch,
            subscribe
        };
    }
    ```