<script setup>
	const {
		safeAreaInsets
	} = uni.getSystemInfoSync()
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		ref
	} from 'vue'
	import {
		getHistory,
		deleteHistory
	} from '@/api/data.js'
	import {
		useMemberStore
	} from '@/store/module/member.js'
	// 获取会员store
	const memberStore = useMemberStore()
	const movieList = ref([])
	const isShow = ref(false)
	// 是否为编辑状态
	const isEdit = ref(false)
	// 全选按钮
	const isSelectAll = ref(false)
	onLoad(async () => {
		const res = await getHistory()
		movieList.value = res
		// 加上selected
		movieList.value.forEach((item) => {
			item.isSelected = false
		})
	})
	const goDetail = (movieId) => {
		uni.navigateTo({
			url: '/pages/playPage/playPage?id=' + movieId
		})
	}
	// 退回按钮
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	// 编辑按钮
	const edit = () => {
		isEdit.value = !isEdit.value
	}
	// 单选
	const checkItem = (index) => {
		movieList.value[index].isSelected = !movieList.value[index].isSelected
	}
	// 全选
	const selectAll = () => {
		isSelectAll.value = !isSelectAll.value
		if (isSelectAll.value == true) {
			movieList.value.forEach((item) => {
				item.isSelected = true
			})
		} else {
			movieList.value.forEach((item) => {
				item.isSelected = false
			})
		}
	}
	const deleteHistoryClick = () => {
		const selectedHistory = movieList.value.filter(history => history.isSelected === true);
		const selectedIds = selectedHistory.map(history => history.movieId);
		deleteHistory(selectedIds).then(res => {
			// 删除成功后刷新页面
			getHistory().then(newList => {
				movieList.value = newList;
				// 重置编辑状态和全选状态
				isEdit.value = false;
				isSelectAll.value = false;
				// 重置每个历史记录的选中状态
				movieList.value.forEach(item => {
					item.isSelected = false;
				});
			});
		})
	}
</script>
<template>
	<view class="history" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
		<view class="navbar">
			<view class="return" @tap="back">
				<uni-icons type="arrow-left" size="28" color="#9e9e9e"></uni-icons>
			</view>
			<view class="title">历史记录</view>
			<view class="edit" @tap="edit">                     
				<view v-if="isEdit">取消</view>
				<view v-else>编辑</view>
			</view>
		</view>
		<scroll-view scroll-y class="scroll-view">
			<template v-if="memberStore.profile">
				<view class="movie-list" v-if="movieList.length">
					<view class="movie-list-item" v-for="(item,index) in movieList">
						<view class="check" v-if="isEdit" @tap="checkItem(index)">
							<view class="check-icon-active" v-if="item.isSelected">
								<uni-icons type="checkmarkempty" color="#fff"></uni-icons>
							</view>
							<view class="check-icon" v-else>
							</view>
						</view>
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
				<view class="noLogin" v-else size="mini">历史记录为空</view>
				<view class="toolbar" v-if="isEdit">
					<view class="select-all" @tap="selectAll">
						<view class="check-icon-active" v-if="isSelectAll">
							<uni-icons type="checkmarkempty" color="#fff"></uni-icons>
						</view>
						<view class="check-icon" v-else></view>
						<view class="select-all-text">全选</view>
					</view>
					<view class="delete" @tap="deleteHistoryClick">删除</view>
				</view>
			</template>
			<view v-else>尚未登录</view>
		</scroll-view>
	</view>
</template>


<style lang="scss">
	.history {
		height: 100%;
		display: flex;
		flex-direction: column;

		.navbar {
			display: flex;
			flex-wrap: nowrap;
			height: 100rpx;
			line-height: 100rpx;
			border-bottom: 2rpx solid #ccc;
			padding: 0 20rpx;

			.return {
				width: 64rpx;
			}

			.title {
				flex: 1;
				font-size: 36rpx;
				margin-left: 40rpx;
			}

			.edit {
				width: 64rpx;
				color: #9e9e9e;
			}
		}

		// 吸底工具栏
		.toolbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
			height: 100rpx;
			padding: 0 20rpx;
			color: #9e9e9e;
			border-top: 1rpx solid #ededed;
			border-bottom: 1rpx solid #ededed;
			background-color: #fff;

			.select-all {
				.select-all-text {
					margin-left: 64rpx;
				}
			}
		}

		.scroll-view {
			flex: 1;
			height: 100%;
			overflow: hidden;

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

					.check {
						position: relative;
						margin-right: 64rpx;
					}

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

		.check-icon,
		.check-icon-active {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			width: 44rpx;
			height: 44rpx;
			border-radius: 100%;
			text-align: center;
			line-height: 44rpx;
		}

		.check-icon {
			border: 2rpx solid #ccc;
		}

		.check-icon-active {
			background-color: #4cd964;
		}

		.noLogin {}
	}
</style>