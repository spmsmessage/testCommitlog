<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="dateValue"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-select v-model="taskType" clearable placeholder="请选择任务类型">
        <el-option
          v-for="item in taskTypes"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-select v-model="taskLevel" clearable placeholder="请选择任务级别">
        <el-option label="P1" value="1" />
        <el-option label="P2" value="2" />
        <el-option label="P3" value="3" />
        <el-option label="P4" value="4" />
        <el-option label="P5" value="5" />
      </el-select>
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="getTasks">搜索</el-button>
    </div>
    <div>
      <draggable   style="width: 100%;overflow-y: hidden;overflow-x: scroll"  :options="foptions">
        <kanban v-for="item,index in taskTypes"  :options="options"  :headerItem="item" :taskType="item" :key="index" v-on:deleteType="handleDeleteType" v-on:edit="EditTask"></kanban>
        <el-input
          placeholder="请输入新增类型名称"
          v-model="newTypeName"
          v-if="newTypeShow"
          style="width: 200px;margin-top: 20px"
          clearable>
        </el-input>
        <el-button type="success" style="margin-left: 120px;margin-top: 20px" v-if="newTypeShow" :loading="newTypeLoading" @click="handleAddTaskType">新增</el-button>
        <el-button slot="footer" type="text" v-if="!newTypeShow" @click="newTypeShow=true" >新增列表类型</el-button>
      </draggable>
    </div>


    <el-dialog title="任务信息" :visible.sync="dialogVisible" :loading="loading">
      <el-form :model="taskInfo">
        <el-form-item label="任务标题" label-width="120px">
          <el-input v-model="taskInfo.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="任务描述" label-width="120px">
          <el-input v-model="taskInfo.content" type="textarea" />
        </el-form-item>
        <el-form-item label="预期时间" label-width="120px">
          <el-date-picker
            v-model="taskInfo.expectedTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="任务级别" label-width="120px">
          <el-select v-model="taskInfo.taskLevel">
            <el-option label="P1" value="1" />
            <el-option label="P2" value="2" />
            <el-option label="P3" value="3" />
            <el-option label="P4" value="4" />
            <el-option label="P5" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" label-width="120px">
          <el-select v-model="taskInfo.taskType" placeholder="请选择类型">
            <el-option
              v-for="item in taskTypes"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" label-width="120px">
          <el-select
            v-model="taskInfo.users"
            multiple
            default-first-option
            placeholder="请选择负责人"
            @focus="fetchUsers"
            :loading="loading"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="disposeDialog">取 消</el-button>
        <el-button type="primary" @click="createTask">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getAllTaskType,getTasksByCondition,addTask,deleteTaskById,getTaskById,getTypesBypd,addTaskType,deleteTypeById} from '../../../api/task'
  import {getUsersByPid} from '../../../api/user'
  import Kanban from './components/TaskTodo'
  import draggable from 'vuedraggable'
  export default {
    name: 'task',
    data() {
      return {
        taskType: '',
        taskTypes: [],
        taskInfo: {},
        dialogVisible: false,
        users: [],
        dateValue:"",
        taskLevel:'',
        options: {
          group: 'mission'
        },
        foptions:{
          group:'foptions'
        },
        todos: [
        ],
        doings: [
        ],
        dones: [
        ],
        isEdit:false,
        loading:false,
        newTypeName:'',
        newTypeShow:false,
        newTypeLoading:false
      }
    },
    props: {
      pId: {
        default: 0
      }
    },
    components:{Kanban,draggable},
    created() {
      this.getAllType();
      this.getTasks();
    },
    methods: {
      getLevelName(id){
        return 'P'+id;
      },
      getAllType() {
        getTypesBypd(this.pId).then(res => {
          this.taskTypes = res.data.data
        })
      },
      handleCreate() {
        this.taskInfo ={}
        this.dialogVisible = true
      },
      disposeDialog() {
        this.dialogVisible = false
      },
      createTask(data) {
        data.projectId = this.pId
        addTask(data).then(value => {
          if (value.data.code === 200) {
            this.$notify({
              title: '成功',
              message: '任务创建成功',
              type: 'success'
            })
            this.dialogVisible = false
            const body = {}
            body.type = this.taskType
            if (this.dateValue.length === 2) {
              body.startTime = this.dateValue[0]
              body.endTime = this.dateValue[1]
            }
            this.$emit('upd', body)
          } else {
            this.$notify.error({
              title: '错误',
              message: '任务创建失败'
            })
          }
        })
      },
      getTasks(){
        let body = {};
        body.type = this.taskType;
        body.taskLevel = this.taskLevel;
        if(this.dateValue.length === 2){
          body.startTime = this.dateValue[0];
          body.endTime = this.dateValue[1];
        }
        body.pid = this.pId
        getTasksByCondition(body).then(res =>{
          let tasks = res.data.data;
          this.todos = tasks.todos;
          this.doings = tasks.doings;
          this.dones = tasks.dones;
        })
      },
      createTask(){
        this.taskInfo.projectId = this.pId;
        addTask(this.taskInfo).then(value =>{
          if (value.data.code == 200){
            this.$notify({
              title: '成功',
              message: '任务创建成功',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getTasks();
          }else {
            this.$notify.error({
              title: '错误',
              message: '任务创建失败'
            });
          }
        })
      },
      refresh(){
        this.taskType = '';
        this.taskLevel = '';
        this.dateValue = [];
        this.getTasks();
      },
      EditTask(id){
        this.getTaskItem(id);
      },
      getTaskItem(id){
        this.loading = true
        getTaskById(id).then(res =>{
          this.taskInfo = res.data.data;
          this.dialogVisible = true;
          this.isEdit = true
        })
        this.loading = false
      },
      fetchUsers(){
        this.loading = true;
        getUsersByPid(this.pId).then(res =>{
          if (res.data.code === 200){
            this.users = res.data.data;
          } else {
            this.$notify.error({
              title:"获取用户失败"
            })
          }
        });
        this.loading = false
      },
      handleAddTaskType(){
        this.newTypeLoading = true;
        let  data = {
          name:this.newTypeName,
          pId:this.pId
        }
        addTaskType(data).then(res => {
          if (res.data.code === 200){
            this.taskTypes.push(res.data.data)
          } else{
            this.$notify.error({
              title:'新增类型失败'
            })
          }
          console.log(this.taskTypes)
        })
        this.newTypeLoading = false;
        this.newTypeShow = false;
      },
      handleDeleteType(id){
        deleteTypeById(id).then(res =>{
          if (res.data.code === 200){
            this.taskTypes.splice(this.taskTypes.findIndex(item => item.id===id),1);
          }else {
            this.$notify.error({
              title:'删除任务类型失败'
            })
          }
        })
      }
    }

  }
</script>
<style lang="scss">
  .board {
    width: 1000px;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }
  .kanban {
    &.todo {
      .board-column-header {
        background: #4A9FF9;
      }
    }
    &.working {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.done {
      .board-column-header {
        background: #2ac06d;
      }
    }
  }
</style>

