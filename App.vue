<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-plus/index.scss";
	/*每个页面公共css */
	/* 不显示滚动条 */
	::-webkit-scrollbar {
	    display: none;
	    width: 0 !important;
	    height: 0 !important;
	    -webkit-appearance: none;
	    background: transparent;
	    color: transparent;
	  }
	/*每个页面公共css */
	view,
	navigator,
	input,
	scroll-view {
		box-sizing: border-box;
	}
	
	button::after {
		border: none;
	}
	
	// swiper,
	// scroll-view {
	// 	flex: 1;
	// 	height: 100%;
	// 	overflow: hidden;
	// }
	
	image {
		width: 100%;
		height: 100%;
		vertical-align: middle;
	}
	
	// 两行省略
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
