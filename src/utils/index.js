export const checkClass = (el, value) => {
  return el.classList.toString().indexOf(value)
}

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