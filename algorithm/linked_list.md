### 定义列表结构
```js
function Node(value) {
    this.val = value;
    this.next = null;
}

class List {
    constructor() {
        this.head = new Node('root');
    }
    get end() {
        let cur = this.head;
        while(cur.next) {
            cur = cur.next;
        }
        return cur;
    }
    push(...arr) {
        let end = this.end;
        arr.forEach(v => {
            const newNode = new Node(v);
            end.next = newNode;
            end = end.next;
        });
    }
    insert(preVal, val) {

    }
    print() {
        let cur = this.head;
        let result = [];
        while(cur) {
            result.push(cur.val);
            cur = cur.next;
        }
        console.log(...result);
        return result;
    }
    reverse() {
        let pre = null;
        let cur = this.head;
        while(cur) {
            const next = cur.next;
            cur.next = pre;
            pre = cur;
            cur = next;
        }
        this.head = pre;
    }
}
const list = new List();
list.push(1, 2, 3, 4, 5, 6);
list.print();
list.reverse();
list.print();
```

### 反转列表
1. 循环迭代
    ```js
    reverse(head) {
        // 用两个指针往后挪
        // 用指针记录next，防止直接对next赋值，链表断掉取不到后面的节点
        let pre = null;
        let cur = head;
        while(cur) {
            const next = cur.next;
            cur.next = pre;
            pre = cur;
            cur = next;
        }
        return pre;
    }
    ```
1. 递归
    ```js
    function reverse(pre, cur) {
        if (!cur) return pre;
        const next = cur.next;
        cur.next = pre;
        return reverse(cur, next);
    }
    ```

### 两个一组翻转
```js
function reverseTwo(head) {
    if (head === null || head.next === null) return head;
    // 根节点固定住，指向第一个节点
    let p = new Node(null);
    const newHead = p;
    p.next = head;
    while((node1 = p.next) && (node2 = p.next.next)) {
        node1.next = node2.next;
        node2.next = node1;
        p.next = node2;
        p = node1;
    }
    return newHead.next;
}
```

### 判断链表是否有环
1. set
    ```js
    hasCycle = (head) => {
        let set = new Set();
        let p = head;
        while(p) {
            // 同一个节点再次碰到，表示有环
            if(set.has(p)) return true;
            set.add(p);
            p = p.next;
        }
        return false;
    }
    ```
1. 快慢指针，快指针一步两个，慢指针一步一个，快指针相对慢指针就是一步一个元素，如果有环肯定会遇到
    ```js
    
    ```