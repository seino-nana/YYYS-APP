<script setup>
	const {
		safeAreaInsets
	} = uni.getSystemInfoSync()
	import {
		ref,watch
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getRecommends
	} from '@/api/data.js'
	import tabsItem from './cpns/tabs-item.vue'
	const tabs = [{
		name: '推荐'
	}, {
		name: '电影'
	}, {
		name: '连续剧'
	}, {
		name: '综艺'
	}, {
		name: '动漫'
	}]
	const recommends = ref([])
	// 页面加载
	onLoad(async () => {
		await getRecommendsData()
	})
	const getRecommendsData = async () => {
		const res = await getRecommends(tabs[tabsCurrent.value].name)
		recommends.value = res
	}
	const goHistory = () => {
		uni.navigateTo({
			url: '/pages/history/history'
		})
	}
	const goSearch = () => {
		uni.navigateTo({
			url: '/pages/search/search'
		})
	}
	const changeTabs = (index) => {
		tabsCurrent.value = index.index
		getRecommendsData()
		uni.pageScrollTo({
			duration: 0,
			scrollTop: 0
		})
	}
	const changeTabsContent = (e) => {
		let thisCurr = e.detail.current || e.currentTarget.dataset.index || 0;
		tabsCurrent.value = thisCurr
	}
	const animationfinish = () => {
		uni.pageScrollTo({
			scrollTop: 0
		})
	}
	const tabsCurrent = ref(0)
	const isShow = ref(true)
	// 下拉刷新状态
	const isTriggered = ref(false)
	// 自定义下拉刷新被触发
	const onRefresherrefresh = async () => {
	 	// 开启动画
		isTriggered.value = true
		await console.log(tabs[tabsCurrent.value].name); 
		isTriggered.value = false
	}
	
</script>
<template>
	<view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
		<view class="head">
			<view class="left">
				<image src="@/static/logo.png"></image>
			</view>
			<view class="center" @tap="goSearch">
				<view class="search">
					<uni-icons type="search" size="22" color="#34495e"></uni-icons>
					<text class="icon-search">搜片名</text>
				</view>
			</view>
			<view class="right">
				<view class="history" @tap="goHistory">
					<image src="/static/common/clock.png" style="width: 88rpx;height: 88rpx;">
					</image>		
				</view>
			</view>
		</view>
		<view class="content">
			<u-tabs :list="tabs" lineColor="#34495e" lineWidth="30" @change="changeTabs" :current="tabsCurrent"
				:activeStyle="{
				   color: '#34495e',
				   fontWeight: 'bold',
				   transform: 'scale(1.05)'}" :inactiveStyle="{
				   color: '#000',
				   transform: 'scale(1)'}">
			</u-tabs>
		</view>
	</view>
	<scroll-view scroll-y class="scroll-view" >
		<tabs-item :list="recommends.list" :banners="recommends.banners" :tabsCurrent="tabsCurrent"/>
	</scroll-view>
	<!-- <swiper class="swiper-box" :current="tabsCurrent" @change="changeTabsContent"
			@animationfinish="animationfinish">
            <swiper-item class="swiper-item" v-for="(item,index) in recommends">
				<scroll-view scroll-y v-if="tabsCurrent==index" class="scroll-view" refresher-enabled
					@refresherrefresh="onRefresherrefresh(item.typeDesc)" :refresher-triggered="isTriggered">
					<view class="page-box">
						<tabs-item :list="item.list" :banners="item.banners"/>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper> -->
</template>
<style lang="scss">
	page {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.scroll-view {
		flex: 1;
		padding: 268rpx 20rpx 0;
	}

	/* 自定义导航条 */
	.navbar {
		position: fixed;
		top: 0;
		width: 100%;
		// position: relative;
		background-size: cover;
		background-image: url(@/static/user/bg.png);
		z-index: 1;

		.head {
			display: flex;
			width: 100%;
			height: 100%;

			.left {
				position: relative;
				width: 140rpx;

				image {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 72rpx;
					height: 72rpx;
				}
			}

			.center {
				position: relative;
				flex: 1;

				.search {
					display: flex;
					align-items: center;
					padding: 0 10rpx 0 26rpx;
					height: 60rpx;
					width: 100%;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: #ccc;
					font-size: 28rpx;
					border-radius: 32rpx;
					background-color: #f8f8f8;

					.icon-search {
						margin-left: 10rpx;
					}
				}
			}

			.right {
				position: relative;
				display: flex;
				width: 120rpx;

				.history {
					flex: 1;
					text-align: center;
					line-height: 88rpx;
				}
			}
		}
	}

	// .swiper-box {
	// 	height: 1300rpx;
	// 	margin: 0 20rpx;

	// 	.scroll-view {
	// 		width: 100%;
	// 		height: 100%;
	// 	}
	// }
</style>