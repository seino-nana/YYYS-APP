<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getUserInfo,updateUserInfo } from '@/api/data.js'
import { useMemberStore } from '@/store/module/member.js'

const memberStore = useMemberStore()
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const profile = ref()
onLoad( async () => {
	const res = await getUserInfo()
	profile.value = res
})
const uploadImage = (event) => {
	uni.chooseImage({
	    count: 1, // 选择图片的数量
	    success: (chooseResult) => {
	      const tempFilePaths = chooseResult.tempFilePaths[0] // 获取选择的图片临时路径
	      uni.uploadFile({
	        url: 'https://www.3154movie.cn/upload/avatar', // 替换为你的后端接口地址
	        filePath: tempFilePaths, // 选择的图片临时路径
	        name: 'avatar', // 后端接口上传时需要的字段名，保持与后端一致
	        success: (uploadResult) => {
	          const imageUrl = uploadResult.data // 上传成功后返回的图片地址
	          // 更新头像地址到profile对象
	          profile.value.avatar = imageUrl
	        },
	        fail: (error) => {
	          uni.showToast({
	          	title: '图片过大，上传图片失败'
	          })
	        }
	      })
	    },
	    fail: (error) => {
	      console.error('选择图片失败：', error)
		  
	    }
	  })
}
const onSubmit = async () => {
	if(memberStore.profile) {
		await updateUserInfo(profile.value)
		uni.navigateBack({
			delta: 1
		})
	}
	
}

</script>
<template>
	<view class="viewport" :style="{ paddingTop: safeAreaInsets?.top + 'px' }" v-if="profile">
	  <!-- 头像 -->
	  <view class="avatar">
	      <u-image v-if="profile.avatar" :src="profile.avatar" mode="aspectFill" width="160rpx" height="160rpx" shape="circle"/>
		  <u-icon v-else class="avatar-icon" name="account" size="100rpx" color="#fff"></u-icon>
		  <text class="text" @tap="uploadImage">点击修改头像</text>
	  </view>
	  
	  <!-- 表单 -->
	  <view class="form">
	    <!-- 表单内容 -->
	    <view class="form-content">
	      <view class="form-item">
	        <text class="label">昵称</text> 
	        <input class="input" type="text" placeholder="请填写昵称" v-model="profile.name" />
	      </view>
		  <view class="form-item">
		    <text class="label">手机号</text> 
		    <input class="input" type="number" placeholder="请填写手机号" v-model="profile.phone" />
		  </view>
		  <view class="form-item">
		    <text class="label">个性签名</text> 
		    <input class="input" type="text" placeholder="请填写个性签名" v-model="profile.introduction" />
		  </view>
	    </view>
	    <!-- 提交按钮 -->
	    <button class="form-button" @tap="onSubmit">保 存</button>
	  </view>
	</view>
</template>



<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #27ba9b;
  .avatar-icon {
	  border: 4rpx solid #fff;
	  padding: 30rpx;
	  border-radius: 100%;
  }
  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }
    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>
