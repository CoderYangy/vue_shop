<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
  <el-breadcrumb-item>数据报表</el-breadcrumb-item>
</el-breadcrumb>
 <!-- 卡片视图区 -->
  <el-card>
    <!-- 为echarts 准备一个宽高的位置 -->
    <div id="main" style="width: 900px;height:500px"></div>
  </el-card>
  </div>
</template>

<script>
// 2.引入echarts包 
import echarts from 'echarts'
import _ from 'lodash'
export default {
    created() {
  
    },
    // 此时元素已经渲染完毕
    async mounted() {
 //3. 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))
    const {data: res} = await this.$http.get('reports/type/1')
    if(res.meta.status !== 200) { return this.$message.error('获取报表数据失败！')}

        //4. 指定图表的配置项和数据
        const result =  _.merge(res.data, this.options)
    //    5.调用函数渲染数据
         myChart.setOption(result);
    },
    data() {
        return {
            // 需要合并数据
option : {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
        }
    },
 methods: {

 }
}
</script>

<style>

</style>