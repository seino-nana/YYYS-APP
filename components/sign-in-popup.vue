<script setup>
	defineProps({
		showSignIn: Boolean
	})
</script>
<template>
	<u-popup :show="showSignIn" mode="center" bgColor="#2980b9" :round="10">
	    <view style="color:#fff;width: 690rpx;height: 600rpx;padding:20rpx">
	        <view class="" style="font-size: 42rpx;">每日签到</view>
			<view class="" style="color: #eee">连续签到可获得额外积分</view>
			<view class="" style="height: 300rpx;color:#0F2E58;background-color: #fff;padding:20rpx;margin: 40rpx 0;border-radius: 20rpx;font-weight: 700;">签到得积分</view>
	        <u-button type="primary" icon="calendar" shape="circle" text="立即签到" color="#f39c12"></u-button>
			<!-- 自定义关闭按钮 -->
			<view class="close" @click="showSignIn=false">✕</view>
	    </view>
	</u-popup>
</template>
<style lang="scss">
	.close {
	    width: 80rpx;
	    height: 80rpx;
		font-size: 44rpx;
	    color: #FFFFFF;
		background-color: #9e9e9e;
	    line-height: 80rpx;
	    text-align: center;
	    border-radius: 50%;
	    position: absolute;
	    bottom: -100rpx;
	    left: 50%;
	    transform: translateX(-50%);
	}
</style>