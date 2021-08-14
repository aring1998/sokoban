// 深拷贝对象
export const deepCloneObj = obj => {
  return JSON.parse(JSON.stringify(obj))
}

// 深拷贝二维数组
export const deepClone2Arr = arr => {
  let res = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      res[i] = deepClone2Arr(arr[i])
    } else {
      res[i] = arr[i]
    }
  }
  return res
}

// 判断是否为空对象
export const isEmptyObject = (data) => {
  return JSON.stringify(data) == '{}'
}
