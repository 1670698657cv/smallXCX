


  <template>
    <view>
      <!-- 轮播图区域 -->
      <!--  indicator-dots控制底部圆点 
      autoplay 自动播放   interval切换的间隔时间   duration切换时候的滚动速度
      -->
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
        <!-- 循环渲染轮播图的 item 项 -->
        <swiper-item v-for="(item, i) in swiperList" :key="i">
          <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
            <!-- 动态绑定图片的 src 属性 -->
            <image :src="item.image_src"></image>
          </navigator>
        </swiper-item>
      </swiper>

      <!-- 分类导航区域 -->
      <view class="nav-list">
        <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
          <image :src="item.image_src" class="nav-img"></image>
        </view>
      </view>

      <!-- 楼层区域 -->
      <view class="floor-list">
        <!-- 楼层 item 项 -->
        <view class="floor-item" v-for="(item, i) in floorList" :key="i">
          <!-- 楼层标题 -->
          <image :src="item.floor_title.image_src" class="floor-title"></image>
          <!-- 楼层图片区域 -->
          <!-- 楼层图片区域 -->
          <view class="floor-img-box">
            <!-- 楼层图片区域 -->
            <view class="floor-img-box">
              <!-- 左侧大图片的盒子 -->
              <navigator class="left-img-box" :url="item.product_list[0].url">
                <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
                  mode="widthFix"></image>
              </navigator>
              <!-- 右侧 4 个小图片的盒子 -->
              <view class="right-img-box">
                <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"
                  :url="item2.url">
                  <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
                </navigator>
              </view>
            </view>
          </view>
        </view>
      </view>

    </view>

  </template>

  <script>
    export default {
      data() {
        return {
          // 1.1轮播图
          swiperList: [],
          // 2. 分类导航的数据列表
          navList: [],
          // 3. 楼层的数据列表
          floorList: [],
        };
      },
      onLoad() {
        // 1.2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
        this.getSwiperList()
        // 2.1获取数据的方法分页导航
        this.getNavList()
        // 3.1 在 onLoad 中调用获取楼层数据的方法
        this.getFloorList()
      },

      methods: {
        // 1.3. 获取轮播图数据的方法
        async getSwiperList() {
          // 1.3.1 发起请求
          // 解构  把data结构为res
          const {
            data: res
          } = await uni.$http.get('api/public/v1/home/swiperdata')
          console.log((res))
          // 1.3.2 请求失败（请求不到数据）  例如网址错误
          if (res.meta.status !== 200) {
            return uni.showToast({
              title: '数据请求失败！',
              duration: 1500,
              icon: 'none',
            })
          }
          // 1.3.3 请求成功，为 data 中的数据赋值
          this.swiperList = res.message
          console.log(this.swiperList)
        },
        // 2.2. 在 methods 中定义获取分页导航数据的方法
        async getNavList() {
          const {
            data: res
          } = await uni.$http.get('api/public/v1/home/catitems')
          if (res.meta.status !== 200) return uni.$showMsg()
          this.navList = res.message
        },
        // 2.3nav-item 项被点击时候的事件处理函数，点击分类跳转
        navClickHandler(item) {
          // 判断点击的是哪个 nav
          if (item.name === '分类') {
            // switchTab跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
            uni.switchTab({
              url: '/pages/cate/cate'
            })
          }
        },
        // 3. 定义获取楼层列表数据的方法
        // 获取楼层列表数据
        async getFloorList() {
          const {
            data: res
          } = await uni.$http.get('api/public/v1/home/floordata')
          if (res.meta.status !== 200) return uni.$showMsg()

          // 通过双层 forEach 循环，处理 URL 地址
          res.message.forEach(floor => {
            floor.product_list.forEach(prod => {
              prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
            })
          })

          this.floorList = res.message
        }
      }
    }
  </script>

  <style lang="scss">
    // 轮播图 样式
    swiper {
      height: 330rpx;

      .swiper-item,
      image {
        width: 100%;
        height: 100%;
      }
    }

    // 分类导航样式
    .nav-list {
      display: flex;
      justify-content: space-around;
      margin: 15px 0;

      .nav-img {
        width: 128rpx;
        height: 140rpx;
      }
    }

    // 楼层
    .floor-title {
      height: 60rpx;
      width: 100%;
      display: flex;
    }

    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }

    .floor-img-box {
      display: flex;
      padding-left: 10rpx;
    }
  </style>
