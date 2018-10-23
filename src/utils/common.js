//判断 dom  是否贴于某一边  是否在最上边或者最下边
function isEdged(direction, element = document.documentElement, isGlobal = true) {
  let directions = ['top', 'right', 'bottom', 'left']
  if (!directions.includes(direction))
    throw new Error("function utils/common/isEdged:the 1st must be specified as ('top', 'right', 'bottom', 'left')")
  let {
    top,
    right,
    bottom,
    left
  } = element.getBoundingClientRect();
  let {
    width,
    height
  } = isGlobal ? {
    width: window.innerWidth,
    height: window.innerHeight
  } : {
    width: element.parentElement.offsetWidth,
    height: element.parentElement.offsetHeight
  }
  switch (direction) {
    case 'left':
      return left === 0 ? true : false
    case 'top':
      return top === 0 ? true : false
    case 'right':
      return Math.abs(width - right) < 15 ? true : false
    case 'bottom':
      return Math.abs(bottom - height) < 15 ? true : false
    default:
      return false
  }
}

export {
  isEdged
}
