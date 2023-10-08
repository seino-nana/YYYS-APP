<script setup>
	import {
		ref
	} from 'vue'
	const sel = ref('')
	// 中奖索引
	const sjNum = ref(0)
	const FastNums = ref(0)
	const SlowNums = ref(0)
	const time = ref(1000)
	const LoopStatus = ref(true)
	const noClick = ref(true)
	const AwardList = [{
			image: '/components/choujiang/static/fhb.png',
			name: '10积分',
			parcentage: 50,
			index_num:0
		},
		{
			image: '/components/choujiang/static/fhb.png',
			name: '20积分',
			parcentage: 100,
			index_num:1
		},
		{
			image: '/components/choujiang/static/smdj.png',
			name: '神秘大奖',
			parcentage: 20,
			index_num:2
		},
		{
			image: '/components/choujiang/static/fhb.png',
			name: '10积分',
			parcentage: 50,
			index_num:3
		},
		{
			image: '/components/choujiang/static/begin.png',
			name: '剩余次数:0',
			percentage: 0,
			index_num:4
		},

		{
			image: '/components/choujiang/static/fhb.png',
			name: '50积分',
			parcentage: 30,
			index_num:5
		},
		{
			image: '/components/choujiang/static/fhb.png',
			name: '20积分',
			parcentage: 100,
			index_num:6
		},
		{
			image: '/components/choujiang/static/dehb.png',
			name: '大额红包',
			parcentage: 0,
			index_num:7
		},
		{
			image: '/components/choujiang/static/fhb.png',
			name: '10积分',
			parcentage: 50,
			index_num:8
		}
	]
	const begin = (index) => {
		if (index == 4) {
			if (!noClick.value) {
				uni.showToast({
					title: '请勿频繁点击',
					icon: "none",
					position: 'bottom'
				});
				return
			};
			noClick.value = false;
			FastNums.value = 0
			SlowNums.value = 0
			time.value = 200
			LoopStatus.value = true
			// 概率计算
			console.log('开始计算');
			getSJNum()
			// 开始抽奖
			console.log('开始抽奖');
			loop()
		}
	}
	const getSJNum = () => {
		// 概率控制  概率100%
		let sj = Math.round(Math.random() * 99 + 1)
		// 前端控制概率
		let arr = ref([])
		console.log("sj: ", sj);

		for (let i = 0; i < AwardList.length; i++) {
			if (AwardList[i].parcentage >= sj) {
				arr.value.push(AwardList[i])
			}
		}
		// console.log("arr: ", arr.value);
		// 随机获得索引
		if (arr.value.length > 1) {
			sjNum.value = arr.value[Math.round(Math.random() * arr.value.length)].index_num
		} else {
			sjNum.value = arr.value[0].index_num
		}

		console.log(sjNum.value);
		console.log('结束计算');
	}
	const loop = () => {

		let SJNum = sjNum.value
		if (!sel.value || sel.value < 9) {
			if (sel.value == 3) {
				sel.value = 0
			} else if (sel.value === '') {
				sel.value = 0
			} else if (sel.value == 2) {
				sel.value = 5
			} else if (sel.value == 5) {
				sel.value = 8
			} else if (sel.value == 8) {
				sel.value = 7
			} else if (sel.value == 7) {
				sel.value = 6
			} else if (sel.value == 6) {
				sel.value = 3
			} else {
				sel.value++
			}
			FastNums.value++
			if (FastNums.value == 4) {
				FastNums.value = 0
				time.value = 50
				SlowNums.value++
			}
			if (SlowNums.value == 8) {
				SlowNums.value = 0
				time.value = 500
				FastNums.value = 5
			}
			if (FastNums.value > 5) {
				if (sel.value == SJNum) {
					noClick.value = true;
					LoopStatus.value = false
					// 成功的逻辑
					// this.updateMoney(sjNum)
					// updateMoney(SJNum)
					console.log('获得' + AwardList[SJNum].name);
					uni.showToast({
						title: '恭喜获得：' + AwardList[SJNum].name,
						icon: "none",
						position: 'bottom'
					})
				}
			}
			if (LoopStatus.value) {
				setTimeout(() => {
					loop()
				}, time.value);
			}
		}

	}
</script>
<template>
	<view class="lottery">
		<!-- 背景图 -->
		<view class="bgc">
			<image src="../choujiang/static/luck.png" mode="aspectFill" style="height: 1338rpx; width: 750rpx;"></image>
		</view>
		<!-- 转盘 -->
		<view class="luck-list">
			<view v-for="(item,index) in AwardList" :key="index">
				<view class="cell-item" :class="index==4||index===sel?'y-b':'w-b'" @tap="begin(index)">
					<view class="cell-content" :class="index==4||index===sel?'y':'w'">
						<image :src="item.image" mode="widthFix" style="width: 60rpx; height: 60rpx;" v-if="item.image">
						</image>
						<view style="margin-top: 5rpx;">
							<text style="font-size: 21rpx; font-weight: bold;">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss">
	.lottery {
        
		// 背景图
		.bgc {
			position: relative;
			height: 100%;
			background-repeat: no-repeat;
			background-image: url('static/luck.png');
		}

		/* 抽奖 */
		.luck-list {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			position: absolute;
			top: 415rpx;
			right: 0;
			left: 72rpx;
			width: 600rpx;
		}

		.cell-item {
			width: 150rpx;
			height: 158rpx;
			border-radius: 30rpx;
			margin: 5rpx;
		}

		.cell-content {
			width: 150rpx;
			height: 138rpx;
			border-radius: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.w {
			background-color: #fdf2ee;
		}

		.w-b {
			background-color: #f8d0c3;
		}

		.y {
			background-color: #fee610;
		}

		.y-b {
			background-color: #EFCD22;
		}
	}
</style>