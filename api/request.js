let baseUrl = 'https://www.3154movie.cn'; //域名或选取所有接口不变的那一部分
// let baseUrl = 'http://localhost:3000'; //域名或选取所有接口不变的那一部分
import { useMemberStore } from '@/store/module/member.js'

export const request = (options = {}) => {
	
	//异步封装接口，使用Promise处理异步请求
	return new Promise((resolve, reject) => {
		const memberStore = useMemberStore()
		const token = memberStore.profile?.token
		// 发送请求
		uni.request({
			url: baseUrl + options.url || '', //接收请求的API
			method: options.method || 'GET', //接收请求的方式,如果不传默认为GET
			data: options.data || {}, //接收请求的data,不传默认为空,
			header:{
				Authorization:`Bearer ${token}`
			},
			// 响应成功
			success(res) {
			  // 状态码 2xx， axios 就是这样设计的
			  if (res.statusCode >= 200 && res.statusCode < 300) {
			    // 2.1 提取核心数据 res.data
			    resolve(res.data)
			  } else if (res.statusCode === 401) {
			    // 401错误  -> 清理用户信息，跳转到登录页
			    const memberStore = useMemberStore()
			    memberStore.clearProfile()
			    uni.navigateTo({ url: '/pages/login/login' })
			    reject(res)
			  } else {
			    // 其他错误 -> 根据后端错误信息轻提示
			    uni.showToast({
			      icon: 'none',
			      title: (res.data).msg || '请求错误',
			    })
			    reject(res)
			  }
			},
			// 响应失败
			fail(err) {
			  uni.showToast({
			    icon: 'none',
			    title: '网络错误，换个网络试试',
			  })
			  reject(err)
			},
        })
	})
}