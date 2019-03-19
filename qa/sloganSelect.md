### 取消冒泡
1. 在react组件开发过程中，这种点击组件外关闭什么的需求，都是用e.nativeEvent.stopImmediatePropagation();取消冒泡来实现
```js
class SloganSelect extends Component {
    this.state ={
        selectClicked: false
    };

    onClickHandler = () => {
        e.nativeEvent.stopImmediatePropagation();
        this.setState(prevState => ({
            selectClicked: !prevState.selectClicked
        }));
    };

    hideSelectBox = () => {
        this.setState({selectClicked: false});
    };

    componentDidMount() {
        document.addEventListener('click', this.hideSelectBox, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.hideSelectBox, false);
    }

    render() {
        const boxClassName = classNames({
            [box]: true,
            [boxOpen]: !!selectClicked
        });
        return (
            <div>
                <div onClick={this.onClickHandler}></div>
                <Box className={boxClassName} ></Box>
            </div>
        )
    }
}
```
1. react事件与原生事件
    - 阻止合成事件的冒泡不会阻止原生事件的冒泡，但是阻止原生事件的冒泡会阻止合成事件的冒泡

### activeElement
1. document.activeElement可以用来取到当前focus的dom元素，一般也就是点击的button、input
1. ref在原生dom上时直接取到原生dom，在react组件上时ref取到的也是ReactElement对象，这时候需要用ReactDom.findDOMNode去dom。当然用原生js取dom也不是不行
```js
class SloganSelect extends Component {
    this.state ={
        selectClicked: false
    };

    onClickHandler = () => {
        this.setState(prevState => ({
            selectClicked: !prevState.selectClicked
        }));
    };

    hideSelectBox = () => {
        const btnDom = ReactDom.findDOMNode(this.btnRef);
        if (document.activeElement !== btnDom) {
            this.setState({selectClicked: false});
        }
    };

    componentDidMount() {
        document.addEventListener('click', this.hideSelectBox, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.hideSelectBox, false);
    }

    render() {
        const boxClassName = classNames({
            [box]: true,
            [boxOpen]: !!selectClicked
        });
        return (
            <div>
                <Button ref={item => this.btnRef=item} onClick={this.onClickHandler}></Button>
                <Box className={boxClassName} ></Box>
            </div>
        )
    }
}
```

### 判断mouseEnter
```js
class SloganSelect extends Component {
    this.state ={
        selectClicked: false,
        inSelect: false
    };

    onClickHandler = () => {
        this.setState(prevState => ({
            selectClicked: !prevState.selectClicked
        }));
    };

    enterSelect = () => {
        this.setState({
            inSelect: true
        });
    };

    leaveSelect = () => {
        this.setState({
            inSelect: false
        });
    };

    hideSelectBox = () => {
        if (!this.state.inSelect) {
            this.setState({selectClicked: false});
        }
    };

    componentDidMount() {
        document.addEventListener('click', this.hideSelectBox, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.hideSelectBox, false);
    }

    render() {
        const boxClassName = classNames({
            [box]: true,
            [boxOpen]: !!selectClicked
        });
        return (
            <div onMouseEnter={this.enterSelect} onMouseLeave={this.leaveSelect}>
                <div onClick={this.onClickHandler}></div>
                <Box className={boxClassName} ></Box>
            </div>
        )
    }
}
```