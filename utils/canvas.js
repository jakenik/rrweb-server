const canvasToBuffer = function (page, canvasSelector, type, quality) {
  return page.evaluate(function (canvasSelector, type, quality) {
    var canvasElement = document.querySelector(canvasSelector);
    return canvasElement.toDataURL(type, quality);
  }, canvasSelector, type, quality).then(function (dataUrl) {
    var data = dataUrl.slice(dataUrl.indexOf(',') + 1);
    return new Buffer(data, 'base64');
  });
}

module.exports.appendCanvasText = function (ctx, txt, options = {}) {
  const {
    center,
    top = 10,
    font = "20px Arial",
    left = 10,
    canvasWidth
  } = options
  ctx.font = font
  if (center) {
    let width = ctx.measureText(txt).width
    ctx.fillText(txt, (canvasWidth / 2) - (width / 2), top);
  } else {
    ctx.fillText(txt, left, top);
  }
}

module.exports.createCanvas = function (options = {}) {
  const {
    width,
    heigth
  } = options
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.heigth = heigth
  return canvas
}

module.exports.getCanvasImg = function (options = {}) {
  
}