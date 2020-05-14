<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图区 -->
<el-card>
 <el-alert
    title="当前仅提供第三级商品参数！"
    type="warning" :closable="false" show-icon>
  </el-alert>
  <!-- 选择商品分类区 -->
  <el-row class="cat-opt">
      <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品的级联 -->
          <el-cascader
    v-model="selectedCateKeys"
    :options="cateList"
    :props="{
    value: 'cat_id',
   label: 'cat_name',
   children: 'children',
   expandTrigger: 'hover'}"
   clearable @change="handleChange()"></el-cascader>
      </el-col>
  </el-row>
  <!-- tab 页签区域 -->
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="isshowAddParamsDialog = true">添加参数</el-button>
        <!-- 动态参数表格 -->
   <el-table :data="manyTableData" border stripe>
  <!-- 索引列 -->
  <el-table-column type="expand">
      <template slot-scope="scope">
          <!-- 循环渲染tgs标签 -->
          <el-tag v-for="(item,i) in scope.row.attr_vals" 
          :key="i" closable @close="handleClose(i,scope.row)">
              {{item}}
          </el-tag>
          <!-- 输入文本框 -->
          <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<!-- 添加按钮 -->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
      </template>
  </el-table-column>
  <el-table-column type="index"></el-table-column>
  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
  <el-table-column label="操作">
      <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialog(scope.row.attr_id)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
      </template>
  </el-table-column>
   </el-table>
        </el-tab-pane>
        <!-- 第二个 -->
    <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="isshowAddParamsDialog = true">添加属性</el-button>
       <el-table :data="onlyTableData" border stripe>
  <!-- 索引列 -->
  <el-table-column type="expand">
       <template slot-scope="scope">
          <!-- 循环渲染tgs标签 -->
          <el-tag v-for="(item,i) in scope.row.attr_vals" 
          :key="i" closable @close="handleClose(i,scope.row)">
              {{item}}
              
          </el-tag>
          <!-- 输入文本框 -->
          <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<!-- 添加按钮 -->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
      </template>
  </el-table-column>
  <el-table-column type="index"></el-table-column>
  <el-table-column label="属性名称" prop="attr_name"></el-table-column>
  <el-table-column label="操作">
      <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialog(scope.row.attr_id)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete"  @click="deleteDialog(scope.row.attr_id)">删除</el-button>
      </template>
  </el-table-column>
   </el-table>
        </el-tab-pane>
    <el-tab-pane label="图形展示" name="thread">配置管理</el-tab-pane>
  </el-tabs>
</el-card>
  <!-- 添加对话窗 -->
  <el-dialog
  :title="'添加' + titleText"
  :visible.sync="isshowAddParamsDialog"
  width="50%" @close="addDialogClosed">
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isshowAddParamsDialog = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改按钮 -->
 <el-dialog
  :title="'修改' + titleText"
  :visible.sync="isshowEditParamsDialog"
  width="50%" @close="editDialogClosed">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isshowEditParamsDialog = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
created() {
this.getCateList()
},
data() {
    return {
        // 商品分类列表
     cateList: [],
    //  选择的值 双向绑定的数组
    selectedCateKeys: [],
    // 动态标签转换 被激活
     activeName: 'many',
    //  动态参数数据
    manyTableData: [],
    // 静态属性的数据
    onlyTableData: [],
    // 是否显示添加对话框
    isshowAddParamsDialog: false,
    // 是否显示修改对话框
    isshowEditParamsDialog: false,
    // 添加表单数据对象
    addForm: {
        attr_name: ''
    },
    // 修改表单数据对象
    editForm: {
        attr_name: ''
    },
    // 添加验证规则
    addFormRules: {
       attr_name: [{required: true, message: '请输入添加的参数名称', trigger: 'blur'}]
    },
    //修改验证规则
    editFormRules: {
       attr_name: [{required: true, message: '请输入添加的参数名称', trigger: 'blur'}]
    } 
    }
},
computed: {
    // 如果按钮被禁用，则返回true，否则 false
   isBtnDisabled() {
    if(this.selectedCateKeys.length !== 3) {
        return true
    }
    return false
   },
//    拿到当前分类id值
cateId() {
  if(this.selectedCateKeys.length === 3) {
      return this.selectedCateKeys[2]
  }
  return null
},
// 判断添加标签名
titleText() {
    if(this.activeName === 'many') {
        return '动态参数'
    }
    return '静态属性'
}
},
methods: {
 async getCateList() {
   const {data: res} = await this.$http.get('categories')
   if(res.meta.status !== 200) {return this.$message.error('获取数据失败！')}
   this.cateList = res.data 
   console.log(this.cateList);
 },
//  获取参数的抽离方法
async getParamsData() {
       if(this.selectedCateKeys.length !== 3) {
         this.selectedCateKeys =[]
         this.manyTableData = []
         this.onlyTableData = []
         return
     }
// 根据所选id获取 对应参数
 const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
     params: {sel: this.activeName}
 })
 if(res.meta.status !== 200) { return this.$message.error('获取参数失败！')}
 
 res.data.forEach(item => {
     //    控制文本框的显示与隐藏
item.inputVisible = false
// //  文本框中输入的值
item.inputValue = ''
// 切割成数组变量
   item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

if(this.activeName === 'many') {
     this.manyTableData = res.data
 } else if(this.activeName === 'only'){
     this.onlyTableData = res.data
 }
 })
 console.log(res.data);
},
//  选择框发现变化
 async handleChange() {
     this.getParamsData()
  },
//  tab页签点击处理函数
handleTabClick() {
     this.getParamsData()
    console.log(this.activeName);
    
},
// 添加关闭时重置
addDialogClosed() {
this.$refs.addFormRef.resetFields()
},
// 修改关闭时重置
editDialogClosed() {
this.$refs.editFormRef.resetFields()
},
// 添加动态参数
 addParams() {
this.$refs.addFormRef.validate(async valid => {
    if(!valid) return 
   const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
        attr_name: this.addForm.attr_name,
        attr_sel: this.activeName
    })
    if(res.meta.status !== 201) {return this.$message.error('添加参数失败！')}
    this.$message.success('添加参数成功！')
    this.isshowAddParamsDialog = false
    this.getParamsData()
})
},
// 通过id显出修改数据
async editDialog(attr_id) {
 const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
     params: {attr_sel: this.activeName}
 })
 if(res.meta.status !== 200) {return this.$message.error('获取参数失败！')}
 this.editForm = res.data
 this.isshowEditParamsDialog = true
},
// 修改参数
editParams() {
this.$refs.editFormRef.validate(async valid => {
    if(!valid) return
     const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
       attr_name: this.editForm.attr_name,
        attr_sel: this.activeName
    })
    if(res.meta.status !== 200) {return this.$message.error('修改参数失败！')}
    this.$message.success('修改参数成功！')
    this.getParamsData()
    this.isshowEditParamsDialog = false
})
},
// 删除按钮
async deleteDialog(attr_id) {
     const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm') {
            return this.$message.info('已取消删除！')
        }

        // 删除逻辑
        const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !== 200) {return this.$message.error('删除参数失败！')}
        this.$message.success('删除参数成功！')
        this.getParamsData()
},
// 文本框失去焦点，按下enter触发事件
async handleInputConfirm(row) {
    if(row.inputValue.trim().length === 0) {
  row.inputValue = ''
row.inputVisible = false    
 return
    }
    // 如果没有return，则输入的内容需要做后续处理
    row.attr_vals.push(row.inputValue.trim())
    row.inputValue = '' 
    row.inputVisible = false
    // 保存到数据库
   this.saveAttrVals(row)
},
// 点击按钮展示文本输入框
showInput(row,i) {
    row.inputVisible = true
    // 让文本框自动获得焦点
   this.$nextTick( () => {
          this.$refs.saveTagInput.$refs.input.focus()
        })  
console.log(row);
},
async saveAttrVals(row) {
    const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
    })
    if(res.meta.status !== 200) { return this.$message.error('修改参数项失败！')}
    this.$message.success('修改参数项成功！')
},
// 删除标记对应
handleClose(i,row) {
 row.attr_vals.splice(i,1)
 this.saveAttrVals(row)
}
}

}
</script>

<style lang="scss" scoped>
.cat-opt {
    margin: 15px 0px;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 120px;
}
</style>