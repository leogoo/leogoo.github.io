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
// list.reverse();
// list.print();

function reverse(pre, cur) {
    if (!cur) return pre;
    const next = cur.next;
    cur.next = pre;
    return reverse(cur, next);
}
function print(head) {
    let cur = head;
    let result = [];
    while(cur) {
        result.push(cur.val);
        cur = cur.next;
    }
    console.log(...result);
    return result;
}
const listNew = reverse(null, list.head);
print(listNew);
