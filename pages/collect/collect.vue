<script setup>
	import {
		ref
	} from 'vue'
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app'
	import {
		useMemberStore
	} from '@/store/module/member.js'
	import {
		getCollect
	} from '@/api/data.js'
	const memberStore = useMemberStore()
	const movieList = ref([])
	onLoad(async () => {
		const res = await getCollect()
		movieList.value = res
	})
	const goDetail = (movieId) => {
		uni.navigateTo({
			url: '/pages/playPage/playPage?id=' + movieId
		})
	}
</script>
<template>
	<view>
		<scroll-view scroll-y class="scroll-view">
			<template v-if="memberStore.profile">
				<view class="movie-list" v-if="movieList.length">
					<view class="movie-list-item" v-for="(item,index) in movieList">
						<u-image width="220rpx" height="280rpx" :src="item.image_thumb" :lazy-load="true"
							@tap="goDetail(item.movieId)"></u-image>
						<view class="movie-list-item-info" @tap="goDetail(item.movieId)">
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
				<view class="noLogin" v-else size="mini">收藏为空</view>
			</template>
			<view v-else>尚未登录</view>
		</scroll-view>
	</view>
</template>
<style lang="scss">
	.movie-list {
		margin-top: 20rpx;

		.movie-list-item {
			display: flex;
			height: 320rpx;
			position: relative;
			color: #D0D0D0;
			font-size: 24rpx;
			padding: 20rpx;
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
</style>