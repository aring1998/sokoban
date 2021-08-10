// 深拷贝对象
export const deepCloneObj = obj => {
  return JSON.parse(JSON.stringify(obj))
}

<<<<<<< HEAD
export const isArr = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

export const deepClone = (quote) => {
  if (typeof quote !== 'object' || quote === null || quote === 'null') return quote;
  const result = isArr(quote) ? [] : {};
  for (const key in quote) {
    if (quote.hasOwnProperty(key)) {
      if (quote[key] instanceof Object) {
        result[key] = deepClone(quote[key])
      } else {
        result[key] = quote[key];
      }
    }
  }
  return result;
}
=======
// 深拷贝二维数组
export const deepClone2Arr = arr => {
  let out = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      out[i] = deepClone2Arr(arr[i])
    } else {
      out[i] = arr[i]
    }
  }
  return out
}

// 判断是否为空对象
export const isEmptyObject = (data) => {
  return JSON.stringify(data) == '{}'
}
>>>>>>> master
