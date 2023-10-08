<script setup>
	import {
		ref
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		useMemberStore
	} from '@/store/module/member.js'
	import {
		getUserInfo
	} from '@/api/data.js'
	import SignInPopup from '@/components/sign-in-popup.vue'
	const memberStore = useMemberStore()
	onShow(async () => {
		if (memberStore.profile) {
			const res = await getUserInfo(memberStore.profile.userId)
			profile.value = res
		}
	})
	const profile = ref({})
	// 每日签到是否打开
	const showSignIn = ref(false)
	const showShare = ref(false);
	// 点击登录
	const goLogin = () => {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
	// 点击修改用户信息
	const goProfile = () => {
		uni.navigateTo({
			url: '/pages/user/user-profile/user-profile'
		})
	}
	// 点击设置
	const goSetting = () => {
		uni.navigateTo({
			url: '/pages/setting/setting'
		})
	}
	// 跳转历史记录
	const goHistory = () => {
		uni.navigateTo({
			url: '/pages/history/history'
		})
	}
	// 跳转我的收藏
	const goCollect = () => {
		uni.navigateTo({
			url: '/pages/collect/collect'
		})
	}
	// 点击每日签到
	const open = () => {
		show.value = true
	}
	// 点击我的抽奖
	const goLottery = () => {
		uni.navigateTo({
			url: '/pages/lottery/lottery'
		})
	}
</script>
<template>
	<view class="viewport" scroll-y enable-back-to-top>
		<view class="profile">
			<view class="overview" v-if="memberStore.profile">
				<view @tap="goProfile" hover-class="none">
					<view class="avatar">
						<u-image v-if="profile.avatar" :src="profile.avatar" width="120rpx" height="120rpx"
							shape="circle" bg-color="#eee"></u-image>
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
			<view class="overview" v-else>
				<view @tap="goLogin" hover-class="none">
					<view class="avatar">
						<u-icon class="user-icon" name="account" size="32" color="#D0D0D0"></u-icon>
					</view>
				</view>
				<view class="meta">
					<view hover-class="none" class="nickname">
						未登录
					</view>
					<view class="extra" @tap="goLogin">
						<text class="tips">点击登录账号</text>
					</view>
				</view>
			</view>
		</view>
		<view class="tj-sction">
			<view class="tit">积分统计</view>
			<view class="tj-content">
				<view class="tj-item">
					<text class="num">0</text>
					<text>剩余积分</text>
				</view>
				<view class="tj-item">
					<text class="num">0</text>
					<text>今日使用</text>
				</view>

				<view class="tj-item">
					<text class="num">0</text>
					<text>今日获得</text>
				</view>
			</view>
		</view>
		<!-- 功能列表 -->
		<view class="function-section">
			<uni-list-item title="每日签到" showArrow rightText="免费领积分" :border="false" :clickable="true"
				show-extra-icon="true" :extra-icon="{color:'#0F2E58',size: '45rpx',type: 'calendar-filled'}"
				@click="showSignIn=true" />
			<uni-list-item title="推广分佣" showArrow rightText="得积分赚佣金" :border="true" :clickable="true"
				show-extra-icon="true" :extra-icon="{color:'#0F2E58',size: '45rpx',type: 'paperplane-filled'}"
				@click="showShare=true" />
			<uni-list-item title="我的抽奖" showArrow :border="true" :clickable="true" show-extra-icon="true"
				:extra-icon="{color:'#0F2E58',size: '45rpx',type: 'gift-filled'}" @tap="goLottery" />
			<uni-list-item title="历史记录" showArrow :border="true" :clickable="true" show-extra-icon="true"
				:extra-icon="{color:'#0F2E58',size: '45rpx',type: 'refresh-filled'}" @tap="goHistory" />
			<uni-list-item title="我的收藏" showArrow :border="true" :clickable="true" show-extra-icon="true"
				:extra-icon="{color:'#0F2E58',size: '45rpx',type: 'star-filled'}" @tap="goCollect" />

		</view>
		<!-- 其他 -->
		<view class="function-section">
			<uni-list-item title="提出问题" showArrow :border="true" :clickable="true" show-extra-icon="true"
				:extra-icon="{color:'#0F2E58',size: '45rpx',type: 'chatbubble-filled'}" />
			<uni-list-item title="隐私协议与使用条款" showArrow :border="true" :clickable="true" show-extra-icon="true"
				:extra-icon="{color:'#0F2E58',size: '45rpx',type: 'help-filled'}" />
		</view>
		<view class="function-section">
			<uni-list-item title="设置" showArrow :border="false" :clickable="true" show-extra-icon="true"
				:extra-icon="{color:'#0F2E58',size: '45rpx',type: 'gear-filled'}" @tap="goSetting" />
		</view>
		<SignInPopup :showSignIn="showSignIn"></SignInPopup>
		<!-- 分享示例 -->
		<u-popup :show="showShare" type="share" @close="showShare=false" safeArea backgroundColor="#fff">
			请选择以下推广方式
		</u-popup>
	</view>
</template>



<style lang="scss">
	page {
		background: #f5f5f5;
	}

	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 25upx;
	}

	.tj-sction {
		@extend %section;
		flex-direction: column;
		background-color: #0F2E58;
		margin: 40rpx 20rpx 20rpx;

		.tit {
			color: #FFF;
			font-size: 30upx;
			padding: 30upx 0 0 40upx;
		}

		.tj-content {
			display: flex;
			flex-direction: row;
			align-content: center;
			justify-content: space-around;
			margin: 0 0 15upx 0;
		}

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: 27upx;
			color: #A1A1A1;
		}

		.num {
			font-weight: bold;
			font-size: 39upx;
			color: #F8C480;
			margin-bottom: 8upx;
		}
	}

	.function-section {
		margin: 20rpx 20rpx 0;
		background: #fff;
		border-radius: 25upx;
	}

	.viewport {
		height: 100%;
		// background-repeat: no-repeat;
		// background-image: url('@/static/user/bg.png');
		// background-size: 100% auto;
		padding-top: 50rpx;
        /* #ifdef H5 */
	    padding-top: 10rpx;  
	    /* #endif */
		/* 用户信息 */
		.profile {
			margin-top: 60rpx;
			position: relative;
			color: #9e9e9e;

			.overview {
				display: flex;
				height: 120rpx;
				padding: 0 36rpx;

				.avatar {
					width: 120rpx;
					height: 120rpx;
					position: relative;
					border-radius: 50%;
					background-color: #0F2E58;

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

					.tips {}

					.tips_user {
						color: #ff7f00;
						padding: 4rpx 16rpx;
						border-radius: 22rpx;
						border: 2rpx solid #ff7f00;
					}
				}
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