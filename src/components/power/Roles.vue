<template>
  <div>
        <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
 <!-- 卡片视图 -->
  <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
          <el-col>
              <el-button type="primary" @click="isShowAddDialog = true">添加角色</el-button>
          </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
          <!-- 展开列 -->
   <el-table-column type="expand">
     <template slot-scope="scope">
       <el-row :class="['dbright','bdbottom', i1 === 0 ? 'bdtop' : '', 'vccenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
         <!-- 渲染一级权限 -->
         <el-col :span="5">
           <el-tag closable @close="removeRightById(scope.row, item3.id)">
           {{item1.authName}}
           </el-tag>
           <i class="el-icon-caret-right"></i>
         </el-col>
         <!-- 渲染二级权限 -->
         <el-col :span="19">
           <!-- 通过for循环 嵌套渲染二级权限 -->
           <el-row :class="['bdleft', i2 === 0 ? '' : 'bdtop', 'vccenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
             <el-col :span="6">
               <el-tag closable type="success" @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
           <i class="el-icon-caret-right"></i>
             </el-col>
             <el-col :span="18" :class="['bdleft']"> 
               <el-tag closable type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" @close="removeRightById(scope.row, item3.id)">
                 {{item3.authName}}
           <i class="el-icon-caret-right"></i>
               </el-tag>
             </el-col>
           </el-row>
         </el-col>
       </el-row>
     </template>
   </el-table-column>
   <!-- 索引列 -->
   <el-table-column type="index"></el-table-column>
   <el-table-column label="角色名称" prop="roleName"></el-table-column>
   <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
   <el-table-column label="操作" width="300px">
       <template slot-scope="scope">
           <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
           <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRoleById(scope.row.id)">删除</el-button>
           <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
       </template>
   </el-table-column>
      </el-table>
  </el-card>
  <!-- 添加用户表单 -->
  <el-dialog
  title="提示"
  :visible.sync="isShowAddDialog"
  width="50%" @close="addRoleClosed">
  <!-- 内容主体区 -->
<el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="70px" >
  <el-form-item label="角色名称" prop="roleName" label-width="80px">
    <el-input v-model="addRoleForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="用户描述"  label-width="80px">
    <el-input v-model="addRoleForm.roleDesc"></el-input>
  </el-form-item>
 </el-form>
  <!-- 内容底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="isShowAddDialog = false">取 消</el-button>
    <el-button type="primary" @click="addRoleDialog">确 定</el-button>
  </span>
</el-dialog>
  <!-- 编辑用户表单 -->
 <el-dialog
  title="提示"
  :visible.sync="isShowEditDialog"
  width="50%" @close="editRoleClosed">
  <!-- 内容主体区 -->
<el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="70px" >
  <el-form-item label="角色ID" prop="roleId" label-width="80px">
    <el-input v-model="editRoleForm.roleId" disabled></el-input>
  </el-form-item>
  <el-form-item label="角色名称" prop="roleName" label-width="80px">
    <el-input v-model="editRoleForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="用户描述"  label-width="80px">
    <el-input v-model="editRoleForm.roleDesc"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isShowEditDialog = false">取 消</el-button>
    <el-button type="primary" @click="editRoleDialog">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配权限dialog -->
<el-dialog
  title="权限管理"
  :visible.sync="isShowsetRightDialog"
  width="50%" @close="setRightDialogClosed">
  <!-- 树形控件 -->
  <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isShowsetRightDialog = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
data() {
    return {
        // 所有角色的列表数据
        roleList: [],
        // 添加表单取消
        isShowAddDialog: false,
        // 编辑表单取消
        isShowEditDialog: false,
        // 分配权限取消
        isShowsetRightDialog: false,
        // 用户提交表单
        addRoleForm: {
            roleName: '',
            roleDesc: ''
        },
        // 编辑表单请求列表
         editRoleForm: {
            roleId: '',
            roleName: '',
            roleDesc: ''
        },
        // 添加用户权限规则
        addRoleFormRules: {
            roleName: [
        { required: true, message: '请输入用户名称', trigger: 'blur'},
        {min: 2, max: 10, message: '用户名的长度在2-10个字符之间', trigger: 'blur'}
      ]
        },
        // ID用户修改规则
        editRoleFormRules: {
            roleName: [
        { required: true, message: '请输入用户名称', trigger: 'blur'},
        {min: 2, max: 10, message: '用户名的长度在2-10个字符之间', trigger: 'blur'}
      ]
        },
        // 权限列表数据
        rightsList: [],
        // 树形控件属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 默认数组展示
        defKeys: [],
        // 当前分配权限的角色id
        roleId: ''
    }
},
created() {
    this.getRolesList()
},
methods: {
    // 获取所有角色的列表
   async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if(res.meta.status !== 200) {return this.$message.error('获取用户信息失败！')}
        this.roleList = res.data
        console.log(this.roleList);
    },
    // 添加用户取消重置
    addRoleClosed() {
    this.$refs.addRoleFormRef.resetFields()
    },
    //添加角色
     addRoleDialog(){
         this.$refs.addRoleFormRef.validate( async valid => {
             if(!valid) return 
 const {data: res} = await this.$http.post('roles', this.addRoleForm)
      if(res.meta.status !== 201) {return this.$message.error('添加角色用户失败！')}
      this.$message.success('添加角色用户成功！')
      this.isShowAddDialog =false
      this.getRolesList()
         })
     },
    //  通过id获取显示修改列表
    async showEditDialog(id) {
this.isShowEditDialog = true
 const {data: res} = await this.$http.get('roles/'+ id)
 if(res.meta.status !== 200)  {return this.$message.error('获取当前用户数据失败！')}
  this.editRoleForm = res.data
    },
    //  修改用户
 editRoleDialog() {
    this.$refs.editRoleFormRef.validate(async valid => {
        if(!valid) return
  const {data: res} = await this.$http.put('roles/'+ this.editRoleForm.roleId, this.editRoleForm)
    if(res.meta.status !== 200) {return this.$message.error('修改角色数据失败！')}
    this.$message.success('修改角色数据成功！')
    this.isShowEditDialog = false
    this.getRolesList()
    })
},
// 关闭修改表单
editRoleClosed() {
 this.$refs.editRoleFormRef.resetFields()
},
// 删除角色
async deleteRoleById(id) {
    const confirmResult = await this.$confirm('此操作将永久删除该角色，是否继续？', '提示', {
         confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
    }).catch(err => err)
      console.log(confirmResult)
       if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
 const {data: res} = await this.$http.delete('roles/' + id)
 if( res.meta.status !== 200) {return this.$message.error('删除角色失败!')}
 this.$message.success('删除角色成功！')
 this.getRolesList()
},
// 根据id删除相应权限
async removeRightById(role, rightsId) {
const confirmResult = await this.$confirm('此操作将永久删除该角色，是否继续？', '提示', {
         confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
    }).catch(err => err)
     if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
  const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)      
  if(res.meta.status !== 200) {return this.$message.error('删除权限失败！')}
  this.$message.success('删除权限成功!')
 
 role.children = res.data
},
// 展示分配权限的对话框
async showSetRightDialog(role){
  this.roleId = role.id
  // 获取所有权限数据
 const {data: res} = await this.$http.get('rights/tree')
 if(res.meta.status !== 200) {return this.$message.error('获取权限列表失败！')}
//  获取到的权限数据，保存到数组中
 this.rightsList = res.data
console.log(this.rightsList);
this.getLeafKeys(role, this.defKeys)
 this.isShowsetRightDialog = true
},
   // 通过地柜，获取所有三级权限的id
getLeafKeys(node, arr) {
if(!node.children) {
  return arr.push(node.id)
}
// 递归
node.children.forEach(item => this.getLeafKeys(item, arr))
} ,
// 监听分配权限对话框关闭事件
setRightDialogClosed() {
  this.defKeys = []
},
// 点击为角色分配权限
async allotRights() {
 const keys = [
   ...this.$refs.treeRef.getCheckedKeys(),
   ...this.$refs.treeRef.getHalfCheckedKeys()
 ]

 const idStr = keys.join(',')
 const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr})
if(res.meta.status !== 200) { return this.$message.error('分配权限失败！')}
this.$message.success('分配权限成功！')
this.getRolesList()
this.isShowsetRightDialog = false
}
}

}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdleft {
  border-left: 1px solid #eee;
}
.dbright {
  border-right: 1px solid #eee;
}
.vccenter {
  display: flex;
  align-items: center;
}
</style>