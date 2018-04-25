function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  var len = _arr.length
  for (let i = 0; i < len; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce (func, delay) {
  let time
  return function (...args) {
    if (time) {
      clearTimeout(time)
    }

    time = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
