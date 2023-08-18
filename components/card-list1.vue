<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import YYBanners from '@/components/YYBanners.vue'
	defineProps({
		list: Array
	})
	const goDetail = (movieId) => {
		uni.navigateTo({
			url: '/pages/playPage/playPage?id=' + movieId
		})
	}
</script>
<template>
	<view class="card-list1" v-if="list">
		<view class="card-list-item" v-for="item in list" :key="item.movieId" @tap="goDetail(item.movieId)">
			<u-image width="230rpx" height="320rpx" radius="20rpx" :src="item.image_thumb" :lazy-load="true"></u-image>
			<view class="name">{{item.nm}}</view>
		</view>
	</view>
</template>


<style lang="scss">
	.card-list1 {
		display: flex;
		flex-wrap: wrap;
		// justify-content: space-between;
		

		.card-list-item {
			position: relative;
			width: 230rpx;
			margin-bottom: 10rpx;
            margin-right: 10rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.card-list-item:nth-child(3n) {
		    margin-right: 0;
		}

		.image {
			width: 100%;
			height: 320rpx;
			border-radius: 20rpx;
		}

		.name {
			width: 100%;
			margin: 10rpx 0;
			font-size: 26rpx;
			color: #262626;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>