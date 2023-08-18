<script setup>
	const {
		safeAreaInsets
	} = uni.getSystemInfoSync()
	import {
		ref
	} from 'vue'
	import {
		getSearch
	} from '@/api/data.js'
	// 搜索关键词
	const keywords = ref('')
	// 搜索列表
	const movieList = ref([])
	// 搜索总数
	const total = ref(0)
	// 是否显示搜索列表
	const showSearch = ref(false)
	const data = ref({
		keywords,
		range: 0,
		num: 10,
		page: 1
	})
	const change = () => {
	  if(keywords.value) {
		  // 重置page
		  data.value.page = 1
		  movieList.value = []
		  // 搜索接口
		  getSearch(data.value).then((res) => {
			  movieList.value = res.movieList
			  total.value = res.count
		  })
		  showSearch.value = true
	  } else {
		  showSearch.value = false
	  }
	}

	// 点击取消
	const returnHome = () => {
		uni.switchTab({
			url: '/pages/index/index'
		})
	}
	// 跳转详情
	const goDetail = (movieId) => {
		uni.navigateTo({
			url: '/pages/playPage/playPage?id=' + movieId
		})
	}
	// 触底
	const onScrolltolower = async () => {
		data.value.page ++
		const res = await getSearch(data.value)
		if(res.movieList.length !== 0) {
		  movieList.value.push(...res.movieList)	
		} else {
			uni.showToast({
				title:'已经没有了',
				duration:2000
			})
			
		}
	}
</script>
<template>
	<view class="search">
		<view class="search-bar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
			<u-search :clearabled="true" bgColor="#eee" actionText="取消" shape="square" v-model="keywords"
				@change="change" @custom="returnHome"></u-search>
		</view>
		<scroll-view scroll-y class="scroll-view" @scrolltolower="onScrolltolower">
			<view v-if="showSearch">
				<view class="total">查询到有{{total}}个相关数据</view>
				<view class="movie-list">
					<view class="movie-list-item" v-for="item in movieList" @tap="goDetail(item.movieId)">
						<u-image width="220rpx" height="280rpx" :src="item.image_thumb" :lazy-load="true"></u-image>
						<view class="movie-list-item-info">
							<view style="font-size: 32rpx;color:#f39c12;">{{item.nm}}</view>
							<view class="info-item">年份：{{item.year}} · {{item.typeDesc}} · {{item.area}}</view>
							<view class="info-item">主演：{{item.actors}}</view>
							<view class="info-item">类型：{{item.categorys}}</view>
							<view class="info-item">状态：{{item.ut}}</view>
							<view class="info-item">播放次数：{{item.play_count}}</view>
						</view>
						<view class="score">{{item.score}}</view>
					</view>
				</view>
			</view>
			<view v-else style="padding-top: 20rpx;">历史记录</view>
		</scroll-view>
	</view>
</template>
<style lang="scss">
	.search {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 0 20rpx;

		.search-bar {
			position: relative;
			margin-bottom: 10rpx;
		}
        .scroll-view {
			flex: 1;
			height: 100%;
			overflow: hidden;
		}
		.total {
			// color: #4cd964;
			margin-top: 20rpx;
		}

		.movie-list {

			.movie-list-item {
				display: flex;
				height: 320rpx;
		        position: relative;
				color: #D0D0D0;
				font-size: 24rpx;
				padding: 20rpx 0;
				border-bottom: 1rpx dotted #9e9e9e;
                .score {
				  position: absolute;
				  right: 40rpx;
				  bottom: 20rpx;
				  color: #4cd964;
				  font-size: 32rpx;
				}
				.movie-list-item-info {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 20rpx;
					.info-item {
					  width: 450rpx;
					  white-space: nowrap;
					  overflow: hidden;
					  text-overflow: ellipsis;	
					}
				}
			}
		}
	}
</style>