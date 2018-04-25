// 数据
import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},
  playing: false, // 播放暂停
  fullScreen: false, // 全屏
  playlist: [], // 播放列表
  sequenceList: [], // 这个用来记录正常的排序
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 播放索引
  disc: {},
  topList: {},
  searchHistory: loadSearch(),  // 搜索历史
  playHistory: loadPlay(), // 播放历史
  favoriteList: loadFavorite() // 喜欢歌曲列表
}

export default state
