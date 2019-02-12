>Hooks 是一个 React 函数组件内一类特殊的函数（通常以 "use" 开头，比如 "useState"），使开发者能够在 function component 里使用 state 和 life-cycles，以及使用 custom hook 复用业务逻辑

### 使用hooks
Hooks主要分三种：
- State hooks(在方法组件function component中使用state)
- Effect hooks(在function component使用生命周期和side effect)
- Custom hooks(自定义hooks用来复用组件逻辑)

##### State hooks

##### Effect hooks
所有的生命周期函数（例如componentDidMount，componentDidUpdate，shouldUpdate等等）都集合成一个hook，useEffect。类似redux中的subscribe，每当react组件因为state或props而重新render之后，会触发useEffect里的callnback listener（第一次render和每次update后触发）
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