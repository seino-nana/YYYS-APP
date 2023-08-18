import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'

export const useMemberStore = defineStore(
	'member',
	() => {
		// 用户信息
		const profile = ref()
		// 保存用户信息
		const setProfile = (val) => {
			profile.value = val
		}
		// 清除用户信息
		const clearProfile = () => {
			profile.value = ''
		}
		return {
			profile,
			setProfile,
			clearProfile
		}
	}
)