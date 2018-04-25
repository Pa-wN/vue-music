// 异步修改数据,批处理mutations
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, deleteFavorite, saveFavorite} from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)

  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }

  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random) // 播放模式
  commit(types.SET_SEQUENCE_LIST, list) // 音乐列表
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)  // 播放列表
  commit(types.SET_CURRENT_INDEX, 0) // 歌曲索引
  commit(types.SET_FULL_SCREEN, true) // 是否全屏
  commit(types.SET_PLAYING_STATE, true) // 是否播放
}

// 搜索插入歌曲到列表
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]

  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)

  // 应为是插入歌曲，所以加1
  currentIndex++

  // 插入这首歌到当前位置
  playlist.splice(currentIndex, 0, song)

  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      // 如果当前播放的歌曲在要插入歌曲的前面，
      // 那么就直接删除
      // 然后让index减一，以确保当前的索引是应为减少一个元素带来的索引改变
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 如果当前播放的歌曲在要插入歌曲的前面
      // 那么找到以前的索引再加壹，才可以找到要删除的那个重复的元素
      playlist.splice(fpIndex + 1, 1)
    }
  }

  // sequenceList的处理
  //
  // 找到要插入的位置，应为是索引，所以要加1
  let currentSindex = findIndex(sequenceList, currentSong) + 1 //

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSindex, 0, song)

  if (fsIndex > -1) {
    if (currentSindex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true) // 是否全屏
  commit(types.SET_PLAYING_STATE, true) // 是否播放
}

// 添加搜索历史记录
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除搜索历史记录
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空搜索历史记录
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除一首歌
export const deleteSong = function ({commit, state}, song) {
  // slice 是为了拿到他的副本，因为在actions里面不允许直接操作state
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  // 如果当前播放的歌曲在删除歌曲的后面，
  // 他的索引就会受到影响
  // 所以要减一
  // 或者删除最后一首
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  // 如果播放列表为空了
  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({commit}) {
  // 清空播放列表
  // 直接重置属性
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// 保存历史播放
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 保存我的喜欢
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

// 删除我的喜欢
export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
