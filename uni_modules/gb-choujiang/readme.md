##简单粗暴的抽奖系统，可前端控制中奖概率 也可以后端控制概率，非常简单使用

##步骤

1.导入

2.使用示例
```html
<template>
	<view class="">
		<gb-choujiang :nImg='nImg' :AwardList="AwardList" :sjNum="sjNum"
			@updateMoney="updateMoney"></gb-choujiang>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 背景图，可网络地址，可本地
				nImg:'../../static/luck.png',
				// 中奖的索引，也就是AwardList数组的索引，sjNum不能等于4，4是立即抽奖
				sjNum: 0,
				// false前端，true前端
				isQd:false,
				// 可自己后端获取，也可以后端  percentage为概率 10代表10%   100代表100%   注意：必须要有一个概率为100%，
				AwardList: [{
						image: '../../static/smdj.png',
						name: '神秘大奖',
						percentage:0,
						index_num:0
					},
					{
						image: '../../static/fhb.png',
						name: '0.5个金币',
						percentage:30,
						index_num:1
					},
					{
						image: '../../static/fhb.png',
						name: '0.1个金币',
						percentage:100,
						index_num:2
					},
					{
						image: '../../static/fhb.png',
						name: '1.00个金币',
						percentage:30,
						index_num:3
					},
					{
						image: '../../static/begin.png',
						name: '1.00元/次',
						percentage:-1, 
						index_num:4
					},
					{
						image: '../../static/fhb.png',
						name: '0.50个金币',
						percentage:20,
						index_num:5
					},
					{
						image: '../../static/fhb.png',
						name: '1.00个金币',
						percentage:10,
						index_num:6
					},
					{
						image: '../../static/fhb.png',
						name: '5.00个金币',
						percentage:0,
						index_num:7
					},
					{
						image: '../../static/dehb.png',
						name: '大额红包',
						percentage:0,
						index_num:8
					}
				]
			}
		},
		onLoad() {
           this.getData()
		},
		methods: {
			// 中奖后的逻辑
			updateMoney(money) {
				uni.showToast({
					title: '恭喜获得：' + this.AwardList[money].name,
					icon: "none",
					position: 'bottom'
				})
				// 中奖后获取最新状态
				this.getData()
			},
			// 获取本次中奖的
			getData(){
				
				// 概率指定，如果是前端控制，如果后端控制下面步骤判断步骤可以省略  直接后端获取sjNum值即可
				if(this.isQd){
					// ------------------------------这里写获取后端中奖索引
					// 后端赋值
					this.sjNum = this.sjNum || 0
				}else{
					// 概率控制  概率100%
					let sj = Math.round(Math.random() * 99 + 1)
					// 前端控制概率
					let arr = []
					console.log("sj: ",sj);
					
					for (let i = 0; i < this.AwardList.length; i++) {
						if(this.AwardList[i].percentage>=sj){
							arr.push(this.AwardList[i])
						}
					}
					console.log("arr: ",arr);
					// 随机获得索引
					if(arr.length>1){
						this.sjNum = arr[Math.round(Math.random() * arr.length)].index_num
					}else{
						this.sjNum = arr[0].index_num
					}
					
					console.log(this.sjNum);
				}
			}
			
		}
	}
</script>

<style>
	
</style>



```

###温馨提示：前端处理判定的话 容易被篡改，最好是后端处理判定本次中奖概率以及根据你设定的百分比去处理相关逻辑，然后搞个字段去存储这次指定的索引，然后返回给前端这次抽奖他中奖的索引，然后前端他会根据你提供的索引随机转动，最终到指定索引的奖品，然后抽奖结束之后后端执行逻辑，核对下存储的索引是否和执行中奖后传过来的值是否一致 等一些逻辑