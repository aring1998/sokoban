const bgm = uni.createInnerAudioContext()
bgm.src = '../static/audio/bgm.mp3'
bgm.loop = true

export const music = {
  bgmPlay(isPlay) {
    if (!bgm) return
    if (isPlay) bgm.play()
    else bgm.pause()
  }
}
