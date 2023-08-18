<script setup>
	import {
		ref
	} from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { getCategory } from '@/api/data.js'
	const {
		safeAreaInsets
	} = uni.getSystemInfoSync()
	
	onShow(() => {
		_getCategory()
	})
	const page = ref(0)
	const movieList = ref([])
	const navList = ref([
		['电影','连续剧','动漫','综艺'],
		['全部','动作','科幻','喜剧','爱情','恐怖','战争','犯罪','纪录','剧情','动画'],
		['全部','大陆','香港','台湾','日本','韩国','美国','英国'],
		['全部','2023','2022','2021','2020','2019','2018','2017','2016','2015','2014','2013','2012','2011','2010'],
	    ['最新','最热'],
	])
	const currentNav = ref([
		{type:'电影',index:0},
		{type:'',index:0},
		{type:'',index:0},
		{type:'',index:0},
		{type:'',index:0},
	])
	const _getCategory = async () => {
		await page.value ++
		const res= await getCategory({
			typeDesc: currentNav.value[0].type,
			cat: currentNav.value[1].type,
			area: currentNav.value[2].type,
			year: currentNav.value[3].type,
			num:18,
			page:page.value
		})
		if(res.movieList.length !== 0) {
		  movieList.value.push(...res.movieList)	
		} else {
			uni.showToast({
				title:'已经没有了',
				duration:2000
			})
			
		}
	}
	const navClick = (i,index,item) => {
		if(item == '全部') {
		  currentNav.value[i].type = ''
		} else {
		  currentNav.value[i].type = item
		}
		currentNav.value[i].index = index
		// 排序点击
		if(i == 4) {
			if(item == '最新') {
				currentNav.value[4].type = 0
			} else if (item == '最热') {
				currentNav.value[4].type = 1
			}
		}
		// 分类点击
		if(i == 0) {
			if(item == '电影') {
			   navList.value[1] = ['全部','动作','科幻','喜剧','爱情','恐怖','战争','犯罪','纪录','剧情','动画'] 
			} else if(item == '连续剧'){  
			   navList.value[1] = ['全部','国产剧','香港剧','日本剧','韩国剧','欧美剧','泰国剧']
			} else if(item == '动漫'){
			   navList.value[1] = ['全部','国产动漫','日韩动漫','欧美动漫']
			} else if(item == '综艺'){
			  navList.value[1] = ['全部','大陆综艺','港台综艺','日韩综艺','欧美综艺']
			}
			// 重置cat
			currentNav.value[1].type = ''
			currentNav.value[1].index = 0
		}
		// 还原
		movieList.value = []
		page.value = 0
		_getCategory()
	}
	const goDetail = (movieId) => {
		uni.navigateTo({
			url: '/pages/playPage/playPage?id=' + movieId
		})
	}
	const onScrolltolower = () => {
		_getCategory()
	}
</script>
<template>
	<view class="category">
		<view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
			<view class="title">分类</view>
			<scroll-view scroll-x="true" class="hd-list" v-for="(item,ind) in navList">
			 	<view  
			 	  v-for="(item,index) in navList[ind]" 
			 	  :key="index" 
			 	  class="hd-list-item"
			 	  :class="currentNav[ind].index==index?'active':''"
			 	  @click="navClick(ind,index,item)">
			 	  {{item}}
			 	</view>
			</scroll-view>
		</view>
		<scroll-view class="content-scroll-view" scroll-y enable-back-to-top @scrolltolower="onScrolltolower"> 
			<view class="movie-list">
			  <view class="movie-list-item" v-for="item in movieList" @tap="goDetail(item.movieId)">
			    <u-image width="230rpx" height="320rpx" radius="20rpx" :src="item.image_thumb" :lazy-load="true"></u-image>
			    <view class="name">{{item.nm}}</view>
			  </view>	
			</view>
		</scroll-view>
	</view>
	
</template>



<style lang="scss">
.category {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 20rpx;
  .content-scroll-view {
	  flex: 1;
	  height: 100%;
	  overflow: hidden;
  }
  .navbar {
	.title {
		text-align: center;
		font-size: 36rpx;
		margin: 20rpx 0;
	}
    .hd-list {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      margin-bottom: 20rpx;
      .hd-list-item {
        display: inline-block;
        color: #000;
        font-size: 30rpx;
        padding: 14rpx 28rpx;
        margin-right: 10rpx;
        border-radius: 30rpx;
      }
      .active {
        color:#1abc9c;
        background-color: #f8f8f8;
      }
    }
  }
  .movie-list {
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: space-between;
	  .movie-list-item {
		  width: 230rpx;
		  margin-bottom: 10rpx;
		  .name {
		  	// height: 35rpx;
		    width: 100%;
		  	font-size: 26rpx;
		  	color: #262626;
		  	white-space: nowrap;
		  	overflow: hidden;
		  	text-overflow: ellipsis;	
			margin: 10rpx 0;
		  }
	  }
  }
}
</style>
