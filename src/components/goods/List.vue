<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图区 -->
<el-card>
   <!-- 搜索与添加 -->
  <el-row :gutter="20">
  <el-col :span="8"> <el-input placeholder="请输入内容"  clearable v-model="queryInfo.query" @clear="getGoodsList">
    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
    <el-button type="primary" @click="goAddpage">添加商品</el-button>
  </el-col>
</el-row>
<el-table
      :data="goodsList"
      border stripe
      style="width: 100%">
        <el-table-column
      type="index" >
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="goods_number"
        label="商品数量"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="80px">
      </el-table-column>
       <el-table-column
        label="创建时间"
         width="180px">
        <template slot-scope="scope">
       {{scope.row.add_time | fmtdate}}
        </template>
      </el-table-column> 
       <el-table-column
        label="操作" width="130px">
        <template slot-scope="scope" >
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editById(scope.row.goods_id)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
</el-card>
<el-dialog
  title="修改商品信息"
  :visible.sync="isshowEditDialog"
  width="50%">
 <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
   <el-form-item label="商品ID">
    <el-input v-model="editForm.goods_id" disabled></el-input>
  </el-form-item>
  <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="editForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="价格" prop="goods_price">
    <el-input v-model="editForm.goods_price"></el-input>
  </el-form-item>
   <el-form-item label="数量" prop="goods_number">
    <el-input v-model="editForm.goods_number"></el-input>
  </el-form-item>
  <el-form-item label="重量" prop="goods_weight">
    <el-input v-model="editForm.goods_weight"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isshowEditDialog = false">取 消</el-button>
    <el-button type="primary" @click="editFormPass">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
created() {
this.getGoodsList()
},
data() {
    return {
  queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 10
  },
//   数据列表
  goodsList: [],
  total: 0,
  isshowEditDialog: false,
  // 修改商品数组
  editForm: {
    goods_id: 0,
    goods_name: '',
    goods_price: 0,
    goods_number: 0,
    goods_weight: 0
  },
  // 修改规则
  editFormRules:{
        goods_name: [{required: true, message: '请输入修改后的商品名称', trigger: 'blur' }],
        goods_price:  [{required: true, message: '请输入修改后的商品价格', trigger: 'blur' }],
        goods_number:  [{required: true, message: '请输入修改后的商品数量', trigger: 'blur' }],
        goods_weight:  [{required: true, message: '请输入修改后的商品重量', trigger: 'blur' }]
       }
    }
},
methods: {
// 根据分页获取对应商品列表
async getGoodsList() {
   const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
    if(res.meta.status !== 200) { return this.$message.error('获取列表失败！')}
    this.$message.success('更新商品成功！')
    this.goodsList = res.data.goods
    this.total = res.data.total
},
handleSizeChange(newSize) {
this.queryInfo.pagesize = newSize
this.getGoodsList()
},
handleCurrentChange(newPage) {
this.queryInfo.pagenum = newPage
this.getGoodsList()
},
// 删除数据
async removeById(id) {
  const confirmResult = await this.$confirm('此操作将永久删除该商品，是否继续？', '提示', {
         confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
    }).catch(err => err)
      console.log(confirmResult)
       if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.delete(`goods/${id}`)
      if(res.meta.status !== 200) {return this.$message.error('删除此商品失败！')}
      this.$message.success('删除商品成功！')
      this.getGoodsList()
},
// 添加跳转
goAddpage() {
  this.$router.push('/goods/add')
},
// 修改商品 
async editById(id) {
 this.isshowEditDialog = true
 const {data: res} = await this.$http.get(`goods/${id}`)
 if(res.meta.status !== 200) {return this.$message.error('获取商品数据失败！')}
 this.editForm = res.data
 console.log(this.editForm);
},
editFormPass() {
this.$refs.editFormRef.validate(async valid => {
  if(!valid) return
  const {data: res} = await this.$http.put('goods/'+ this.editForm.goods_id, this.editForm)
  if( res.meta.status !== 200) {return this.message.error('修改商品数据失败！')}
  this.$message.success('修改数据成功！')
  this.getGoodsList()
  this.isshowEditDialog = false 
})
}
}
}
</script>

<style>

</style>