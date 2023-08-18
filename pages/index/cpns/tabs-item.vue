<script setup>
	import {
		ref,
		watch
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import CardList1 from '@/components/card-list1.vue'
	// 父组件传过来的参数
	const props = defineProps({
		list: Array,
		banners: Array,
		tabsCurrent: Number
	})
	// 当前页面参数
	const dataList = ref({
		list:[],
		banners:[]
	})
	const isLoading = ref(false)
	// 监听tabs改变
	watch(
	  () => [props.tabsCurrent],
	  ([newTabsCurrent]) => {
		  isLoading.value = false
	  }
	)
	// 监听数据改变
	watch(
	  () => [props.list, props.banners],
	  ([newList, newBanners]) => {
	    // 处理 "list" 和 "banners" 的变化
	   dataList.value.list = newList
	   dataList.value.banners = newBanners
	   isLoading.value = true
	  }
	)
	// 轮播图
	const activeIndex = ref(0)
	const onChange = (e) => {
		activeIndex.value = e.detail.current
	}
	// 轮播图跳转
	const goDetail = (movieId) => {
		uni.navigateTo({
			url: '/pages/playPage/playPage?id=' + movieId
		})
	}
</script>
<template>
	<view class="tabs-item" v-if="isLoading">
		<view class="banners" style="position: relative;padding-top: 20rpx;" v-if="list">
			<swiper style="height:350rpx" :circular="true" :autoplay="false" :interval="3000" :duration="1000"
				@change="onChange">
				<swiper-item v-for="(item,index) in dataList.banners">
					<image style="width: 100%;height: 100%;border-radius: 20rpx;" :src="item.img" @tap="goDetail(item.movieId)">
					</image>
					<view class="nm">{{item.nm}}</view>
				</swiper-item>
			</swiper>
			<!-- 指示点 -->
			<view class="indicator">
				<text v-for="(item, index) in dataList.banners.length" :key="item" class="dot"
					:class="{ active: index === activeIndex }"></text>
			</view>
		</view>
		<view class="" v-for="item in dataList.list">
			<view style="font-size: 34rpx;font-weight: 700;margin: 30rpx 0;">{{item.title}}</view>
			<CardList1 :list="item.movieList" />
		</view>
	</view>
	<u-loading-icon color="#9bd9bb" size="36" v-else></u-loading-icon>
</template>
<style lang="scss">
	.banners {
		width: 100%;

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
	}
</style>