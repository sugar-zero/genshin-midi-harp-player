/* eslint-disable no-unused-vars */
const MidiPlayer = require('midi-player-js')
const throttle = require('lodash/throttle')
const robot = require('robotjs')
const fs = require('fs')
const path = require('path')
const countdown = require('node-countdown')

const KEYBOARD_NOTENUMBER = JSON.parse(fs.readFileSync(
  path.join('.', 'keyboard.json')
  , 'utf-8'))

/**
 * 按键/支持按多个
 */
const pressKey = throttle(function (keys) {
  keys.split('').forEach(key => robot.keyTap(key))
}, 50)

const Player = new MidiPlayer.Player(function ({ noteNumber, noteName }) {
  const pianoNoteNumber = noteNumber - 20
  const key = KEYBOARD_NOTENUMBER[pianoNoteNumber + '']

  if (isNaN(pianoNoteNumber)) {
    console.log('空音节')
  }

  if (key) {
    pressKey(key)
    console.log('按下：', noteName, pianoNoteNumber, key)
  } else {
    console.log('未找到对应按键：', noteName, pianoNoteNumber)
  }
})

const filePath = path.join('.', 'data.mid')

if (fs.existsSync(filePath)) {
// Load a MIDI file
  Player.loadFile(filePath)
  countdown.start(5000, { suffix: '后开始模拟按键，请打开游戏' }, function (err) {
    err
      ? console.log(err.message)
      : Player.play()
  })
} else {
  console.log('请在当前目录放置data.mid', filePath)
}
