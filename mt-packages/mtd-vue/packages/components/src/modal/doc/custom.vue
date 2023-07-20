<template>
  <div class="demo-full-width">
    <div class="demo-modal-btn-groups">
      <mtd-button type="primary" @click="openModal6">驳回原因</mtd-button>
      <mtd-button type="primary" @click="openModal7">收货地址</mtd-button>
      <mtd-button type="primary" @click="openModal8">添加成员</mtd-button>
      <!-- <mtd-button type='primary' @click="openModal9">请假申请</mtd-button> -->
    </div>
    <mtd-modal v-model="visible6" title="申请被驳回">
      您的申请已被驳回，如有疑问请联系123456
      <template v-slot:footer>
        <div class="demo-modal-footer">
          <mtd-button type="primary" @click="closeModal6">我知道了</mtd-button>
        </div>
      </template>
    </mtd-modal>

    <mtd-modal v-model="visible7" title="收货地址" width="400px">
      <mtd-table
        :data="addrData"
        style="
          border: 1px solid #ebeef5;
          border-bottom: none;
        "
      >
        <mtd-table-column prop="id" label="Id" width="80px" />
        <mtd-table-column prop="name" label="姓名" width="80px" />
        <mtd-table-column prop="addr" label="地址" />
      </mtd-table>
      <template v-slot:footer>
        <div class="demo-modal-footer">
          <mtd-button type="primary" @click="closeModal7">我知道了</mtd-button>
        </div>
      </template>
    </mtd-modal>

    <mtd-modal v-model="visible8" title="添加成员">
      <mtd-input
        placeholder="输入姓名或mis号搜索"
        v-model="search"
        style="margin-bottom: 10px; width: 100%;"
      />
      <div
        style="
          overflow: auto;
          height: 400px;
          margin-left: -30px;
          margin-right: -30px;
          padding: 0px 30px;
        "
      >
        <mtd-checkbox-group v-model="selected" style="width: 100px;">
          <mtd-checkbox
            v-for="m in filterMembers"
            :key="m"
            :value="m"
            style="display: block;"
            >{{ m }}
          </mtd-checkbox>
        </mtd-checkbox-group>
      </div>
      <template v-slot:footer>
        <div class="demo-modal-footer">
          <mtd-button @click="resetMember" type="panel">取消</mtd-button
          ><mtd-button
            type="primary"
            :loading="submitting"
            @click="submitMember"
            >确定</mtd-button
          >
        </div>
      </template>
    </mtd-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible6: false,
      visible7: false,
      visible8: false,
      submitting: false,
      search: '',
      members: [
        '张三',
        '李四',
        '王五',
        '赵六',
        '田七',
        '胡八',
        '赵婧文',
        '赵竹林',
        '赵威皓',
        '赵冬梅',
        '赵中锴',
        '赵山川',
        '赵吾光',
        '赵璇海',
        '赵学海',
        '赵午光',
        '赵绚海',
        '赵玉',
        '赵吾行',
        '赵晓珲',
        '赵吾航',
        '钱卫国',
        '钱虹君',
        '钱东亮',
        '钱品阎',
        '钱品妍',
        '钱奕宣',
        '钱品颜',
        '钱浩宇',
        '钱品闫',
        '钱韵澄',
        '钱亚男',
        '钱晓初',
        '钱潆龙',
        '钱桂英',
        '钱浩然',
      ],
      selected: ['张三', '李四', '王五'],
      selectMembers: ['张三', '李四', '王五'],
      addrData: [
        {
          id: '0001',
          name: '小美',
          addr: '北京市望京恒基伟业B/C座',
        },
        {
          id: '0002',
          name: '小团',
          addr: '北京市望京恒基伟业B/C座',
        },
        {
          id: '0003',
          name: '小王',
          addr: '北京市望京恒基伟业B/C座',
        },
      ],
    };
  },
  computed: {
    filterMembers() {
      const { search } = this;
      if (!search) {
        return this.members;
      }
      return this.members.filter((m) => m.indexOf(search) > -1);
    },
  },
  methods: {
    openModal6() {
      this.visible6 = true;
    },
    closeModal6() {
      this.visible6 = false;
    },
    openModal7() {
      this.visible7 = true;
    },
    closeModal7() {
      this.visible7 = false;
    },
    openModal8() {
      this.visible8 = true;
    },
    resetMember() {
      this.visible8 = false;
      this.selected = this.selectMembers;
    },
    submitMember() {
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        this.selectMembers = this.selected;
        this.visible8 = false;
      }, 3000);
    },
  },
};
</script>
