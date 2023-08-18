<script setup>
	import {
		ref
	} from 'vue'
	
	const activeIndex = ref(0)
	const onChange = (e) => {
		activeIndex.value = e.detail.current
	}
	defineProps({
		list: Array
	})
	const onImageLoad = () => {
		console.log('图片加载完成');
	}
</script> 
<template>
  <view class="banners" style="position: relative;padding-top: 20rpx;" v-if="list">
  	<swiper style="height:350rpx" :circular="true" :autoplay="false" :interval="3000"
  		:duration="1000" @change="onChange">
  		<swiper-item v-for="(item,index) in list">
			<image style="width: 100%;height: 100%;border-radius: 20rpx;" :src="item.img" @load="onImageLoad"></image>
			<view class="nm">{{item.nm}}</view> 
  		</swiper-item>
  	</swiper>
  	<!-- 指示点 -->
  	<view class="indicator">
  		<text v-for="(item, index) in list.length" :key="item" class="dot"
  			:class="{ active: index === activeIndex }"></text>
  	</view>
  </view>
</template>



<style lang="scss">
	.nm {
		position: absolute;
		left: 20rpx;
		bottom: 10rpx;
		color: #fff;
		font-size: 24rpx;
		background-color: rgba(155, 217, 187, 0.8);	
		padding: 5rpx 10rpx;
	}
	
	.indicator {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 16rpx;
		display: flex;
		justify-content: center;
	
		.dot {
			width: 30rpx;
			height: 6rpx;
			margin: 0 8rpx;
			border-radius: 6rpx;
			background-color: #eee;
		}
	
		.active {
			background-color: #9bd9bb;
		}
	}
	
	.banners {
		width: 100%;
	}
</style>