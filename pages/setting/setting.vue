<script setup>
import { ref } from 'vue'
import { useMemberStore } from '@/store/module/member.js'
const memberStore = useMemberStore()

const onLogout = () => {
  // 模态弹窗
  uni.showModal({
    content: '是否退出登录？',
    success: (res) => {
      if (res.confirm) {
        // 清理用户信息
        memberStore.clearProfile()
        // 返回上一页
        uni.navigateBack()
      }
    },
  })
}
</script>
<template>
	<view class="setting">
		<view class="list">
			<button hover-class="none" class="item" open-type="openSetting">
				授权管理
				<view class="arrow">
					<uni-icons type="forward" size="24" color="#ccc"></uni-icons>
				</view>
			</button>
			<button hover-class="none" class="item" open-type="feedback">
				问题反馈
				<view class="arrow">
					<uni-icons type="forward" size="24" color="#ccc"></uni-icons>
				</view>
			</button>
			<button hover-class="none" class="item" open-type="contact">
				联系我们
				<view class="arrow">
					<uni-icons type="forward" size="24" color="#ccc"></uni-icons>
				</view>
			</button>
		</view>
		<!-- 列表3 -->
		<view class="list">
			<navigator hover-class="none" class="item" url=" ">关于我们</navigator>
		</view>
		<!-- 操作按钮 -->
		<view class="action" v-if="memberStore.profile">
			<view @tap="onLogout" class="button">退出登录</view>
		</view>
	</view>
</template>

<style lang="scss">
	page {
		background-color: #f4f4f4;
	}

	.setting {
		padding: 20rpx;
	}

	/* 列表 */
	.list {
		padding: 0 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		border-radius: 10rpx;

		.item {
			line-height: 90rpx;
			padding-left: 10rpx;
			font-size: 30rpx;
			color: #333;
			border-top: 1rpx solid #ddd;
			position: relative;
			text-align: left;
			border-radius: 0;
			background-color: #fff;

			&::after {
				width: auto;
				height: auto;
				left: auto;
				border: none;
			}

			&:first-child {
				border: none;
			}

			&::after {
				right: 5rpx;
			}
		}

		.arrow {
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	/* 操作按钮 */
	.action {
		text-align: center;
		line-height: 90rpx;
		margin-top: 40rpx;
		font-size: 32rpx;
		color: #333;

		.button {
			background-color: #fff;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
		}
	}
</style>