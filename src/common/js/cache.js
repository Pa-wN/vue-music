// 这是提供修改vuex的一些方法
import storage from 'good-storage'  // 储存库

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

// 在一个数组里插入一条新数据
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)

  if (index === 0) {
    return
  }

  if (index > 0) {
    arr.splice(index, 1)
  }

  arr.unshift(val)

  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 保存历史记录方法
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches)
  return searches
}

// 读取历史记录方法
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

// 删除历史记录方法
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 保存歌曲历史播放
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])

  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)

  storage.set(PLAY_KEY, songs)
  return songs
}

// 读取歌曲历史播放
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 保存我的喜欢
export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])

  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)

  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除我的喜欢

export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])

  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })

  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 读取王我的喜欢
export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
