const curry = (fn, ...args) => {
    return (args.length >= fn.length)
        ? fn(...args)
        : (...argsNew) => curry(fn, ...args, ...argsNew)
};
const sum = (a, b, c, d, e) => a + b+ c+d+e;

const fn = curry(sum, 1, 2, 3);
console.log(fn(4, 5))
console.log(curry(sum, 1, 2, 3, 4, 5));
console.log(curry(sum, 1, 2, 3, 4, 5, 6))