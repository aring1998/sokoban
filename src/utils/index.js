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
