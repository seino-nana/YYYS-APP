<script setup>
	const {
		safeAreaInsets
	} = uni.getSystemInfoSync()
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getCategory
	} from '@/api/data.js'
	const List = ref([{
			title: '电影',
			movieList: [],
			page: 0
		},
		{
			title: '连续剧',
			movieList: [],
			page: 0
		},
		{
			title: '综艺',
			movieList: [],
			page: 0
		},
		{
			title: '动漫',
			movieList: [],
			page: 0
		}
	])
	const currentIndex = ref(0)
	onLoad(async () => {
		await _getCategory(0)
		await _getCategory(1)
		await _getCategory(2)
		await _getCategory(3)
	})
	const _getCategory = async (index) => {
		List.value[index].page ++
		const res = await getCategory({
			typeDesc: List.value[index].title,
			page: List.value[index].page,
			num: 10,
			sort: 2
		})
		List.value[index].movieList.push(...res.movieList)
	}
	const tabClick = (index) => { 
		currentIndex.value = index
	}
	const onScrolltolower = async () => {
		await _getCategory(currentIndex.value)
	}
	const goDetail = (movieId) => {
		uni.navigateTo({
			url: '/pages/playPage/playPage?id=' + movieId
		})
	}
</script>
<template>
	<view class="rank" >
		<view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
			<view class="title">高分电影</view>
			<view class="tab-control">
				<view class="tab-control-item" :class="currentIndex == index ? 'active':''" v-for="(item,index) in List"
					@tap="tabClick(index)">
					{{item.title}}
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="scroll-view" @scrolltolower="onScrolltolower">
			<view class="movie-list">
				<view class="movie-list-item" v-for="item in List[currentIndex].movieList"  @tap="goDetail(item.movieId)">
					<u-image width="150rpx" height="220rpx" :src="item.image_thumb" :lazy-load="true"></u-image>
					<view class="movie-list-item-info">
						<view class="nm info-item">{{item.nm}}</view>
						<view class="score info-item">{{item.score}}</view>
						<view class="dir info-item">导演:{{item.dir}}</view>
						<view class="intro info-item">{{item.intro}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>



<style lang="scss">
	.rank {
		display: flex;
		height: 100%;
		flex-direction: column;

		.navbar {
			background-color: #010101;

			.title {
				height: 100rpx;
				line-height: 100rpx;
				color: #fff;
				text-align: center;
			}

			.tab-control {
				display: flex;
				flex-direction: nowrap;

				.tab-control-item {
					color: #fff;
					padding: 40rpx;
				}

				.active {
					color: #f0ad4e;
				}
			}
		}

		.scroll-view {
			flex: 1;
			height: 100%;

			.movie-list {
				padding: 0 20rpx;

				.movie-list-item {
					display: flex;
					height: 260rpx;

					position: relative;
					color: #D0D0D0;
					font-size: 24rpx;
					padding: 20rpx 0;
					border-bottom: 1rpx dotted #9e9e9e;
					.movie-list-item-info {
						display: flex;
						flex-direction: column;
						width: 500rpx;
						margin-left: 20rpx;

						.info-item {
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
						}

						.nm {
							-webkit-line-clamp: 1;
							/* 设置最大行数为1行 */
							font-size: 32rpx;
							color: #000;
							margin-top: 5rpx;
						}

						.dir {
							-webkit-line-clamp: 1;
							/* 设置最大行数为1行 */
							color: #010101;
							margin-top: 5rpx;
						}

						.score {
							color: #f0ad4e;
							margin-top: 10rpx;
						}

						.categorys {
							color: #010101;
							margin-top: 10rpx;
						}

						.intro {
							-webkit-line-clamp: 2;
							/* 设置最大行数为1行 */
							color: #9e9e9e;
							margin-top: 20rpx;
						}
					}
				}
			}
		}
	}
</style>