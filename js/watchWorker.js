// 检测按键
window.onkeydown = function (e) {
  if (e.keyCode === 123) {
    btf.snackbarShow('开发者模式已打开，请遵循GPL协议', false, 3000)
  }
}