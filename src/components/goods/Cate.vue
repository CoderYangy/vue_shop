<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图 -->
<el-card>
   <el-row>
       <el-col>
           <el-button type="primary" @click="addCateDialog">添加分类</el-button>
       </el-col>
   </el-row>

   <!-- 表格 -->
    <tree-table :data="cateList" :columns="columns" class="treeTable"
    :selection-type="false" :expand-type="false" show-index index-text="#" border>
    <!-- 是否有效 -->
    <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
        <i class="el-icon-error" v-else style="color: red;"></i>
        </template>    
    <!-- 排序 -->
    <template slot-scope="scope" slot="order">
      <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
      <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
      <el-tag type="warning" size="mini" v-else>三级</el-tag>
    </template>
    <!-- 操作 -->
    <template slot="opt" slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCateDailog(scope.row.cat_id)">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCateDailog(scope.row.cat_id)">删除</el-button>
    </template>
    </tree-table>
   <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<!-- 添加分类对话框 -->
<el-dialog
  title="提示"
  :visible.sync="isshowAddCateDialog"
  width="50%" @close="addCateDialogClosed"
  >
 <el-form :model="addCateForm"  :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称：" prop="cat_name">
    <el-input  v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类：" >
      <!-- opotions 用来指定数据源 -->
      <!-- props指定配置对象 -->
  <el-cascader
    v-model="selectedKeys"
    :options="parentCateList"
    :props="{checkStrictly: true,
    value: 'cat_id',
   label: 'cat_name',
   children: 'children',
   expandTrigger: 'hover'}"
   clearable @change="parentCateChanged" ></el-cascader>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isshowAddCateDialog = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>

<!-- 编辑框 -->
<el-dialog
  title="提示"
  :visible.sync="isshowEditCateDialog"
  width="50%"
  >
<el-form :model="editCateForm"  :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
  <el-form-item label="分类名称：" prop="cat_name">
    <el-input  v-model="editCateForm.cat_name"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isshowEditCateDialog = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
data() {
    return {
        // 商品分类列表
     cateList: [],
    //   分页   查询条件
    querInfo: {
        type: 3,
       pagenum: 1,
        pagesize: 5
    },
    // 总数据条数
    total: 0,
    // 显示添加商品分类
    isshowAddCateDialog: false,
    isshowEditCateDialog: false,
    // 添加分类的表单数据对象
      addCateForm: {
    // 将要天际的分类名称
  cat_name: '',
//   父级分类id
  cat_pid: 0,
//   分类等级
  cat_level: 0
      },
      editCateForm: {
     cat_name: ''
      },
      puteditId: '',
    //   父级分类列表
    parentCateList: [],
    // 选中父级分类的ID数据
    selectedKeys: [],
    // 指定级联选择器的配置对象

    //   添加分类表单验证规则对象
    addCateFormRules: {
         cat_name: [
             {required:true, message: '请输入分类名称', trigger: 'blur'}
         ]
    },
    editCateFormRules: {
         cat_name: [
             {required:true, message: '请输入分类名称', trigger: 'blur'}
         ]
    },
// 为table指定列
    columns: [{
        label: '分类名称',
        prop: 'cat_name'
    },
    {
        label: '是否有效',
        // 将当前列定义为模板列
        type: 'template',
        // 当前这一列使用模板名称
        template: 'isok'
    },
    {
        label: '排序',
        // 将当前列定义为模板列
        type: 'template',
        // 当前这一列使用模板名称
        template: 'order'
    },
    {
        label: '操作',
        // 将当前列定义为模板列
        type: 'template',
        // 当前这一列使用模板名称
        template: 'opt'
    }
    ]
    }
},
created() {
   this.getCateList()
},
methods: {
    // 获取商品分类数据
 async getCateList() {
   const {data: res} = await this.$http.get('categories',{ params: this.querInfo})
   if( res.meta.status !== 200) {return this.$message.error('获取用户列表失败！')}
//    数据列表赋值给数组
   this.cateList = res.data.result
   console.log(res.data)
   
   this.total = res.data.total
  },
//   监听pagesize改变
  handleSizeChange(newSize) {
  this.querInfo.pagesize = newSize
  this.getCateList()
  },
//   监听pagenum改变
handleCurrentChange(newPage) {
    this.querInfo.pagenum = newPage
  this.getCateList()
},
// 打开添加按钮，出现列表
addCateDialog() {
    // 获取父级数据列表
    this.getParentCateList()
    this.isshowAddCateDialog = true
},
// 获取父级分类的数据列表
async getParentCateList() {
 const {data :res} = await this.$http.get('categories', {params: {type: 2}})
 if(res.meta.status !== 200) {return this.$message.error('获取数据失败！')}
  this.parentCateList = res.data
  console.log(this.parentCateList);
  
},
// 选择项发生变化触发这个函数
parentCateChanged() {
    // 如果selecttedKeys  数组中length大于0，证明选择的父级分类，反之为0
    if(this.selectedKeys.length > 0) {
        // 父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
    //   当前分类的等级赋值
      this.addCateForm.cat_level = this.selectedKeys.length
      return
    } else {
         // 父级分类id
        this.addCateForm.cat_pid = 0
    //   当前分类的等级赋值
      this.addCateForm.cat_level = 0
    }
},
// 点击按钮添加新的分类
addCate() {
this.$refs.addCateFormRef.validate(async valid => {
    if(!valid) return
    const {data: res} = await this.$http.post('categories', this.addCateForm)
    if(res.meta.status !== 201) {return this.$message.error('添加分类失败！')}
    this.$message.success('添加分类成功！')
    this.getCateList()
    this.isshowAddCateDialog = false
})    
},
// 监听对话框关闭事件
addCateDialogClosed() {
this.$refs.addCateFormRef.resetFields()
this.selectedKeys = []
this.addCateForm.cat_level = 0
this.addCateForm.cat_pid = 0
},
 async editCateDailog(editId) {
    console.log(editId);
    const {data: res} = await this.$http.get('categories/' + editId)
    if(res.meta.status !== 200) { return this.$message.error('获取数据失败！')}
    this.editCateForm.cat_name = res.data.cat_name
    this.editCateForm.cat_pid =res.data.cat_pid
    this.puteditId = editId
    this.isshowEditCateDialog = true
},
// 编辑修改商品名称
 editCate() {
   this.$refs.editCateFormRef.validate( async valid => {
    if(!valid) return
    const {data: res} = await this.$http.put('categories/'+ this.puteditId, this.editCateForm) 
   if(res.meta.status !== 200) {return this.$message.error('修改商品信息失败！')}
   this.$message.success('修改商品名称成功！')
   this.getCateList()
   this.isshowEditCateDialog = false
  })
 },
 async deleteCateDailog(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品，是否继续？', '提示', {
         confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
    }).catch(err => err)
      console.log(confirmResult)
       if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.delete('categories/' + id)
      if(res.meta.status !== 200) {return this.$message.error('删除此商品失败！')}
      this.$message.success('删除商品成功！')
      this.getCateList()
 }
}
}
</script>

<style lang="scss" scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}

</style>