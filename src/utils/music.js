const bgm = uni.createInnerAudioContext()
bgm.src = 'http://81.68.189.158:88/project/sokoban-static/audio/bgm.mp3'
bgm.loop = true

export const music = {
  bgmPlay(isPlay) {
    if (!bgm) return
    if (isPlay) bgm.play()
    else bgm.pause()
  }
}
