module.exports.pause = async function (page) {
  await page.evaluateHandle(() => replayer.pause())
}
module.exports.play = async function (page) {
  await page.evaluateHandle(() => replayer.play(replayer.getCurrentTime()))
}
module.exports.mandatoryPlay = async function (page) {
  return await page.evaluateHandle(() => replayer.play(replayer.getCurrentTime()))
}
