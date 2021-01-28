>Hooks 是一个 React 函数组件内一类特殊的函数（通常以 "use" 开头，比如 "useState"），使开发者能够在 function component 里使用 state 和 life-cycles，以及使用 custom hook 复用业务逻辑

### 最基本的两个hook是useState和useEffect
1. useEffect内的回调是组件初始化和每次重渲染都会执行
  - 第二个参数来决定是否执行里面的操作，传入一个空数组 [ ]，那么该 effect 只会在组件 mount 和 unmount 时期执行
  - 添加依赖后，会在组件 mount 和 unmount 以及didUpdate的时候执行
1. useState来修改state值会引起重渲染
  - state是一个异步过程，setState的时候不要用变量
  - 可以使用匿名函数(prevState) => {setState(prevState + 1)}
```js
import {useState, useEffect} from 'react';

function Example() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `you clicked ${count} times`;
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                click me
            </button>
        </div>
    )
}
```

### useReducer
官方有useReducer这个hook，也可以通过useState来实现。useReducer可以用来当做redux
```js
function useReducer(reducer, initialState) {
    const [state, setState] = useState(initialState);
    
    function dispatch(action) {
        const nextState = reducer(state, action);
        setState(nextState);
    }

    return [state, dispatch];
}

// 一个 Action
function useTodos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: "add", text });
  }

  return [todos, { handleAddClick }];
}

// 绑定 Todos 的 UI
function TodosUI() {
  const [todos, actions] = useTodos();
  return (
    <>
      {todos.map((todo, index) => (
        <div>{todo.text}</div>
      ))}
      <button onClick={actions.handleAddClick}>Add Todo</button>
    </>
  );
}
```
只提供状态处理方法，不会持久化状态。使用TodosUI创建不同的组件不能共享状态，这时候需要useContext来维护全局的一份状态

### useContext
关于context的使用，还是比较简单的，利用createContext来生成provider和consumer
```js
const { Provider, Consumer } = React.createContext(null);
function Bar() {
  return (
    <Consumer>
      {color => <div>{color}</div>}
    </Consumer>
  );
}
function Foo() {
  return <Bar />;
}
function App() {
  return (
    <Provider value={"grey"}>
      <Foo />
    </Provider>
  );
}
```
使用useContext可以简化consumer嵌套的问题。返回值即是想要透传给consumer的数据
```js
const colorContext = React.createContext("gray");
function Bar() {
    // 传入的是context，不是consumer
    const color = useContext(colorContext);
    return <div>{color}</div>
}
function Foo() {
    return <Bar />;
}
function App() {
    return (
        <colorContext.Provider value={"red"}>
            <Foo />
        </colorContext.Provider>
    );
}
```

### useCallback
useCallback用来防止组件的重渲染(父组件的)
```js
function App() {
    const memoizedHandleClick = useCallback(() => {
        console.log('Click happened')
    }, []); // 空数组代表无论什么情况下该函数都不会发生改变
    // 不会生成新的memoizedHandleClick
    return <SomeComponent onClick={memoizedHandleClick}>Click Me</SomeComponent>;
}
```

### useMemo 记忆组件
useCallback的功能完全可以由useMemo所取代，差别是useMemo会执行第一个函数并返回
```js
function App() {
    const memoizedHandleClick = useMemo(() => () => {
        console.log('click happened');
    }, []);

    return <SomeComponent onClick={memoizedHandleClick}>Click Me</SomeComponent>;
}
```

### useRef
和react16里的createRef一样，用于获取组件的ref
```js
function TextInputWithFocusButton() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
        //inputEl 的 current 属性指向 input 组件的 dom 节点
        inputEl.current.focus();
    };
    return (
        <>
        <input ref={inputEl} type="text" />
        <button onClick={onButtonClick}>Focus the input</button>
        </>
    );
}
```