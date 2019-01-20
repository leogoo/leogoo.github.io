const deepClone = obj => {
    let clone = Object.assign({}, obj);
    Object.keys(clone).forEach(
        key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
    );
    return Array.isArray(obj) && obj.length
                // 利用Array.from生成数组
                ? (clone.length = obj.length) && Array.from(clone)
                : Array.isArray(obj)
                    ? Array.from(clone)
                    : clone;
};

let arr = [];
let arr2 = deepClone(arr);
console.log(arr, arr2);
