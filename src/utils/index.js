// 深拷贝对象数组
export const deepCloneObjArr = data => {
  const res = data instanceof Array ? [] : {}
  for (let item in data) {
    res[item] = typeof data[item] === 'object' ? deepCloneObjArr(data[item]) : data[item]
  }
  return res
}