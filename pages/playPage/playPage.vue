<script setup>
	const {
		safeAreaInsets
	} = uni.getSystemInfoSync()
	import controlSSDPEvent from '@/uni_modules/w-dlna/index.js'
	import {
		useMemberStore
	} from '@/store/module/member.js'
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import CardList1 from '@/components/card-list1.vue'
	import {
		getDetail,
		addHistory,
		getHistory,
		getCollect,
		addCollect,
		deleteCollect,
		addPlayCount,
		getSearch
	} from '@/api/data.js'
	const query = defineProps({
		id: String
	})
	onLoad(async () => {
		await _getDetail()
		await _getCollect()
		await _getHistory()
		await addPlayCount(query.id)
		await getRecommend()
		isShow.value = true
	})
	// 页面是否渲染
	const isShow = ref(false)
	// 是否显示集数
	const showNumber = ref(true)
	// 是否显示弹窗
	const popupShow = ref(false)
	// 正在播放的集数
	const numberIndex = ref(0)
	const warning = ref('视频资源皆由网络采集而来,不要相信任何广告！')
	// 影片信息
	const movie = ref()
	// 分集
	const movieUrl = ref([])
	// 当前播放
	const showUrl = ref('')
	// 是否收藏
	const isCollect = ref(false)
	// store
	const memberStore = useMemberStore()
	// 导演相关
	const recommend = ref()
	const parserIndex = ref(0)
	const parserUrl = ref([{
			name: '1号线',
			url: 'https://sljxsl.com/?url='
		},
		{
			name: '2号线',
			url: 'https://www.xinlangjiexi.com/m3u8/?url='
		},
		{
			name: '3号线',
			url: 'https://jiexi.ttbfp1.com/m3u8/?url='
		},
		{
			name: '4号线',
			url: 'https://vip.zykbf.com/?url='
		},
		{
			name: '5号线',
			url: 'https://lziplayer.com/?url='
		}
	])
	// 解析接口
	const vipUrl = ref('https://sljxsl.com/?url=')
	// 获取接口数据
	const _getDetail = async () => {
		const res = await getDetail(query.id)
		movie.value = res
		// 改变标题
		uni.setNavigationBarTitle({
			title: movie.value.nm,
		})
		// 将url提取出来
		const oldUrl = movie.value.url
		const arr = oldUrl.split('#')
		arr.forEach(item => {
			const parts = item.split('$')
			const obj = {
				number: parts[0],
				url: parts[1]
			}
			movieUrl.value.push(obj)
		})
		if (!movie.value.url) {
			showNumber.value = false
		}
	}
	// 收藏夹中查找
	const _getCollect = async () => {
		if (memberStore.profile) {
			const res = await getCollect()
			isCollect.value = res.some(item => item.movieId === movie.value.movieId)
		}
	}
	const _getHistory = () => {
		// 查询有没有历史记录
		if (memberStore.profile) {
			// 获取该用户所有历史记录（用来遍历查找）
			getHistory().then((res) => {
				res.forEach(item => {
					// 历史记录里找有没有这部
					if (item.movieId == query.id) {
						// 找到后，看有没有历史集数
						if (item.oldnumber) {
							showUrl.value = movieUrl.value[item
								.oldnumber].url
							numberIndex.value = item.oldnumber
							
							// 没有历史集数
						} else {
							showUrl.value = movieUrl.value[0].url
						}
						// 没有这部
					} else {
						showUrl.value = movieUrl.value[0].url
					}
					warning.value = '当前正在播放: ' + movie.value.nm + movieUrl.value[numberIndex.value].number
				})
				
				const data = {
					movieId: query.id,
					oldnumber: numberIndex.value
				}
				addHistory(data)
			})
		} else {
			showUrl.value = movieUrl.value[0].url
			warning.value = '当前正在播放: ' + movie.value.nm + movieUrl.value[numberIndex.value].number
		}
	}
	// 关闭选集菜单
	const close = () => {
		popupShow.value = false
	}
	// 打开选集菜单
	const open = () => {

	}
	// 点击集数
	const numberClick = (url, index) => {
		showUrl.value = url
		numberIndex.value = index
		warning.value = '当前正在播放: ' + movie.value.nm + movieUrl.value[numberIndex.value].number
		// 添加历史记录
		if (memberStore.profile) {
			const data = {
				movieId: query.id,
				oldnumber: numberIndex.value
			}
			addHistory(data)
		}
	}
	// 点击线路
	const parserClick = (url, index) => {
		parserIndex.value = index
		vipUrl.value = url
	}
	// 点击收藏
	const collectClick = () => {
		if (memberStore.profile) {
			if (isCollect.value) { // 已收藏
				deleteCollect([movie.value.movieId]).then(res => {
					isCollect.value = !isCollect.value
					uni.showToast({
						title: '取消收藏'
					})
				})
			} else { // 没有收藏
				addCollect(movie.value.movieId).then(res => {
					isCollect.value = !isCollect.value
					uni.showToast({
						title: '已收藏'
					})

				})
			}
		}
		// isCollect.value = !isCollect.value
	}
	// 获取推荐列表
	const getRecommend = async () => {
		const res = await getSearch({
			keywords: movie.value.dir,
			range: 1,
			num: 6,
			page: 1
		})
		recommend.value = res.movieList
	}
	const toupin = () => {
		console.log(123);
		controlSSDPEvent.ssdp().search()
		// controlSSDPEvent.event()
		// controlSSDPEvent.control()
	}
</script>
<template>
	<view class="playPage" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
		<view class="player">
			<iframe :src="vipUrl + showUrl" marginwidth="0" marginheight="0" border="0" scrolling="no" frameborder="0"
				topmargin="0" width="100%" height="100%" allowfullscreen="allowfullscreen"
				mozallowfullscreen="mozallowfullscreen" msallowfullscreen=" msallowfullscreen"
				oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen">
			</iframe>
		</view>
		<u-button @tap="toupin">投屏</u-button>
		<view class="wrap" v-if="isShow">
			<view class="detail">
				<u-notice-bar :text="warning"></u-notice-bar>
				<view class="detail-info">
					<view class="left">
						<view class="title">{{movie.nm}}</view>
						<view class="score">{{movie.score}}分</view>
						<view class="info">{{movie.area}} {{movie.year}} {{movie.cat}}</view>
					</view>
					<view class="right" @tap="collectClick">
						<view class="collect-active" v-if="isCollect">
							<uni-icons type="star-filled" size="32" color="#f1c40f"></uni-icons>
						</view>
						<view class="collect" v-else>
							<uni-icons type="star" size="32"></uni-icons>
						</view>
					</view>
				</view>
				<view class="introduction">
					<text>{{movie.intro}}</text>
				</view>
			</view>
			
			<view class="number" v-if="showNumber">
				<view class="number-hd">选集</view>
				<view class="number-bd">
					<scroll-view scroll-x="true" class="scroll-view">
						<view v-for="(item,index) in movieUrl" class="number-bd-item"
							:class="numberIndex == index ? 'active' : ''" @tap="numberClick(item.url,index)">
							{{item.number}}
						</view>
					</scroll-view>
					<!-- <u-button @click="popupShow = true">选集</u-button> -->
				</view>
				
				<!-- <u-popup :show="popupShow" @close="close" @open="open" closeable catchtouchmove>
					<view class="popup-number">
						<view class="popup-number-title">
							选集
						</view>
						<view class="popup-number-content">
							<scroll-view scroll-y="true" style="height: 1000rpx;" scroll-with-animation="true">
								<text class="popup-number-item" :class="numberIndex == index ? 'number-active' : ''"
									v-for="(item,index) in movieUrl" @click="numberClick(item.url,index)">
									{{item.number}}
								</text>
							</scroll-view>
						</view>
					</view>
				</u-popup> -->
			</view>
			<view v-else>暂时没有资源</view>
			<view class="number">
				<view class="number-hd">线路</view>
				<view class="number-bd">
					<scroll-view scroll-x="true" class="scroll-view">
						<view v-for="(item,index) in parserUrl" class="number-bd-item" style="padding: 10rpx 20rpx;"
							:class="parserIndex == index ? 'active' : ''" @tap="parserClick(item.url,index)">
							{{item.name}}
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="recommend-dir">
				<view style="font-size: 34rpx;font-weight: 700;margin: 30rpx 0;">导演相关</view>
				<CardList1 v-if="recommend" :list="recommend" />
				<view v-else>该导演没有其它作品</view>
			</view>
		</view>
	</view>
</template>



<style lang="scss">
	.playPage {
		.player {
			// height: 400rpx;
			position: sticky;
			top: 0;
			z-index: 99;

			.return {
				position: absolute;
				top: 60rpx;
				left: 20rpx;
			}
		}

		.wrap {
			padding: 20rpx;

			.detail {
				.warning {
					text-align: center;
					color: #d81e06;
					background-color: #D0D0D0;
				}

				.detail-info {
					display: flex;
					margin-top: 20rpx;

					.left {
						flex: 500rpx;

						.title {
							display: inline-block;
							font-size: 32rpx;
							font-weight: 700;
							color: #434343;
						}

						.score {
							display: inline-block;
							padding: 0 20rpx;
							font-size: 24rpx;
							color: #f1c40f;
						}

						.info {
							font-size: 24rpx;
							color: #9e9e9e;
							padding-top: 10rpx;
						}
					}

					.right {
						position: relative;
						flex: 1;

						.right-collect {
							position: absolute;
							top: 20rpx;
							right: 20rpx;
						}
					}
				}

				.introduction {
					font-size: 24rpx;
					color: #D0D0D0;
					padding: 20rpx 0;
					text-indent: 2em;
				}
			}
		}
	}

	.number {
		padding: 20rpx 0;
		border-top: 1rpx dotted #eee;
		border-bottom: 1rpx dotted #eee;

		.number-hd {
			font-size: 32rpx;
			font-weight: 700;
		}

		.number-bd {
			display: flex;
			flex-wrap: wrap;
			margin-top: 20rpx;

			.scroll-view {
				width: 100%;
				overflow: hidden;
				white-space: nowrap;

				.number-bd-item {
					display: inline-block;
					flex: 1;
					color: #fff;
					font-size: 24rpx;
					background-color: #000;
					padding: 20rpx;
					margin-right: 20rpx;
				}

				.active {
					color: #f1c40f;
				}
			}

		}

		// .popup-number {
		// 	height: 70vh;

		// 	.popup-number-title {
		// 		font-size: 32rpx;
		// 		padding: 40rpx;
		// 	}

		// 	.popup-number-content {
		// 		margin: 0 40rpx;

		// 		.popup-number-item {
		// 			display: flex;
		// 			background-color: #eee;
		// 			padding: 30rpx;
		// 			margin: 0 20rpx 20rpx;
		// 		}

		// 		.number-active {
		// 			color: #fff;
		// 			background-color: #56887d;
		// 		}
		// 	}
		// }
	}
</style>