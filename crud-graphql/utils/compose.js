function compose(...fns) {
  return function $compose(x) {
    return fns.reduceRight(function inCompose(result, fn) {
      return fn(result);
    }, x);
  };
}

module.exports = compose;
