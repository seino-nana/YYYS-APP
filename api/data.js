import { request } from '@/api/request.js'
// 获取首页数据
export const getRecommends = (typeDesc) => { 
	return request({
		methods: 'GET',
		url:'/home/data',
		data:{
			typeDesc
		}
	})
}
// 查询id详情
export const getDetail = (movieId) => { 
  return request({
    method: 'GET',
    url: '/movies/detail',
    data: {
		movieId
	},
  })
}
// 分类查询
export const getCategory = (data) => { 
  return request({
    method: 'GET',
    url: '/movies/category',
    data,
  })
}
// 模糊查询
export const getSearch = (data) => { 
	return request({
		method: 'GET',
		url: '/movies/search',
		data
	})
}
// 增加点击量
export const addPlayCount = (movieId) => {
	return request({
		method: 'POST',
		url: '/movies/addPlayCount',
		data: {
			movieId
		}
	})
}
// 用户登录获取token
export const getToken = (data) => { 
	return request({
		method: 'POST',
		url: '/login',
		data
	})
}
// 获取用户信息
export const getUserInfo = () => {
	return request({
		method: 'GET',
		url: '/user/info'
	})
}
// 编辑用户信息
export const updateUserInfo = (data) => {
	return request({
		method:'POST',
		url: '/user/info/update',
		data
	})
}

// 获取用户历史记录
export const getHistory = () => {
	return request({
		method: 'GET',
		url:'/user/history'
	})
}

// 添加历史记录
export const addHistory = (data) => {
	return request({
		method: 'POST',
		url: '/user/history/add',
		data
	})
}

// 批量删除历史记录
export const deleteHistory = (ids) => {
	return request({
		method: 'POST',
		url: '/user/history/delete',
		data: {
			ids
		}
	})
}

// 获取用户收藏
export const getCollect = () => {
	return request({
		method: 'GET',
		url: '/user/collect'
	})
}
// 添加收藏
export const addCollect = (movieId) => {
	return request({
		method: 'POST',
		url: '/user/collect/add',
		data: {
			movieId
		}
	})
}
// 取消收藏
export const deleteCollect= (ids) => {
	return request({
		method: 'POST',
		url: '/user/collect/delete',
		data: {
			ids
		}
	})
}

