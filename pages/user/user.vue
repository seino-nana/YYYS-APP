<script setup>
	import {
		ref
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import { useMemberStore } from '@/store/module/member.js'
	import { getUserInfo } from '@/api/data.js'
    const memberStore = useMemberStore()
	onShow( async () => {
		if(memberStore.profile) {
			const res = await getUserInfo()
			profile.value = res
		}
	})
	const profile = ref({})
	// 列表
	const types = [
	  { type: 1, text: '观看历史', icon:'clock' },
	  { type: 2, text: '我的收藏', icon:'star' },
	  { type: 3, text: '分享给TA', icon:'share' }
	]
	const goLogin = () => {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
	const goProfile = () => {
		uni.navigateTo({
			url:'/pages/user/user-profile/user-profile'
		})
	}
	const handleClick = (type) => {
		if(type == 1) {
			uni.navigateTo({
				url:'/pages/history/history'
			})
		} else if(type == 2) {
			uni.navigateTo({
				url:'/pages/collect/collect'
			})
		} else if(type == 3) {
			
		}
	}
	const goSetting = () => {
		uni.navigateTo({
			url:'/pages/setting/setting'
		})
	}
</script>
<template>
	<view class="viewport" scroll-y enable-back-to-top>
		<view class="profile">
			<view class="overview" v-if="memberStore.profile" >
				<view @tap="goProfile" hover-class="none">
					<view class="avatar">
						<u-image v-if="profile.avatar" :src="profile.avatar" width="120rpx" height="120rpx" shape="circle" bg-color="#eee"></u-image>  
						<u-icon v-else class="user-icon" name="account" size="32" color="#D0D0D0"></u-icon>  
					</view>
				</view>
				<view class="meta">
					<text hover-class="none" class="nickname nickname_user">
						{{profile.name}}
					</text>
					<view class="extra" @tap="goProfile">
						<text class="tips tips_user">修改账户信息</text>
					</view>
				</view>
			</view>
			<view class="overview" v-else >
				<view @tap="goLogin" hover-class="none">
					<view class="avatar">
						<u-icon class="user-icon" name="account" size="32" color="#D0D0D0"></u-icon>  
					</view>
				</view>
				<view class="meta">
					<view  hover-class="none" class="nickname">
						未登录
					</view>
					<view class="extra" @tap="goLogin">
						<text class="tips">点击登录账号</text>
					</view>
				</view>
			</view>
			<view class="settings" @tap="goSetting">设置</view>
		</view>
		<view class="extens">
			<view class="title">
				已推广：0人
			</view>
			<view class="sign">每日签到</view>
		</view>
		<view class="u-list">
			<view hover-class="none" class="u-list-item" v-for="item in types" open-type="openSetting" @tap="handleClick(item.type)">
				<u-icon :name="item.icon" color="#27ba9b" size="30"></u-icon>
				<view class="list-item-text">{{item.text}}</view>
				<view class="arrow">
					<uni-icons type="forward" size="24" color="#ccc"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>



<style lang="scss">
.viewport {
	height: 100%;
	background-repeat: no-repeat;
	background-image: url('@/static/user/bg.png');
	background-size: 100% auto;
	padding-top: 60rpx;
	/* 用户信息 */
	.profile {
		margin-top: 60rpx;
		position: relative;
		color: #fff;
		.overview {
			display: flex;
			height: 120rpx;
			padding: 0 36rpx;
			.avatar {
				width: 120rpx;
				height: 120rpx;
				position: relative;
				border-radius: 50%;
				background-color: #eee;
				.user-icon {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
			.meta {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				font-size: 30rpx;
				line-height: 30rpx;
				padding: 16rpx 0;
				margin-left: 20rpx;
				.nickname {
					max-width: 350rpx;
					margin-bottom: 16rpx;
					
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.nickname_user {
					color: #ff7f00;
				}
			}
			.extra {
				display: flex;
				font-size: 22rpx;
				.tips {
					
				}
				.tips_user {
				  color: #ff7f00;
				  padding: 4rpx 8rpx;
				  border-radius: 22rpx;
				  border: 2rpx solid #ff7f00;
				}
			}
		}
		.settings {
			position: absolute;
			bottom: 0;
			right: 40rpx;
			font-size: 32rpx;
		}
		
	}
	.extens {
		height: 160rpx;
		position: relative;
		z-index: 99;
		padding: 30rpx;
		margin: 50rpx 20rpx 0;
		font-size: 36rpx;
		background: url(@/static/user/extens.png) repeat fixed center;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
		.title {
		  color: #fff;
		  position: absolute;
		  top: 50%;
		  left: 50rpx;
		  transform: translateY(-50%);
		}
		.sign {
		  position: absolute;
		  top: 50%;
		  right: 30rpx; 
		  transform: translateY(-50%);
		  display: inline-block;
		  color: #d81e06;
		  background-color: #fff;
		  padding: 10rpx 30rpx;
		  border-radius: 36rpx;
		}
	}
	/* 列表 */
	.u-list {
		padding: 0 20rpx;
		background-color: #fff;
		margin-top: 50rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
	
		.u-list-item {
			display: flex;
			line-height: 90rpx;
			padding-left: 10rpx;
			font-size: 30rpx;
			color: #333;
			border-bottom: 2rpx solid #ddd;
			position: relative;
			text-align: left;
			border-radius: 0;
			background-color: #fff;
            
			.list-item-text {
				padding-left: 20rpx;
			}
			.arrow {
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	
		
	}
}
</style>