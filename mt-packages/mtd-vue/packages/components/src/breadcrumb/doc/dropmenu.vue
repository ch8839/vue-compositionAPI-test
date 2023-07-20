<template>
  <div>

    <mtd-breadcrumb style="margin-bottom:32px">
      <mtd-breadcrumb-item tag="router-link" to="/"
        >面包屑1</mtd-breadcrumb-item
      >
      <mtd-breadcrumb-item-group>
        <template slot="text">
          <div>
            <span>面包屑2</span>
            <i class="mtdicon mtdicon-down-thick" style="font-size:16px;margin-left:4px;vertical-align: -15%"/>
          </div>
        </template>
        <mtd-dropdown-menu-item tag="router-link" to="/">
          面包屑2.1
        </mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item tag="router-link" to="/">
          面包屑2.2
        </mtd-dropdown-menu-item>
      </mtd-breadcrumb-item-group>
      <mtd-breadcrumb-item tag="router-link" to="/"
        >面包屑3</mtd-breadcrumb-item
      >
    </mtd-breadcrumb>
    
    <br>

    <mtd-breadcrumb style="margin-bottom:32px">
      <mtd-breadcrumb-item tag="router-link" to="/"
        >面包屑1</mtd-breadcrumb-item
      >
      <mtd-breadcrumb-item-group>
        <mtd-dropdown-menu-item tag="router-link" to="/">
          面包屑2.1
        </mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item tag="router-link" to="/">
          面包屑2.2
        </mtd-dropdown-menu-item>
      </mtd-breadcrumb-item-group>
      <mtd-breadcrumb-item tag="router-link" to="/"
        >面包屑3</mtd-breadcrumb-item
      >
    </mtd-breadcrumb>

    <br>

    <mtd-breadcrumb>
      <mtd-breadcrumb-item-group>
        <mtd-dropdown-menu-item tag="router-link" to="/">
          面包屑1.1
        </mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item tag="router-link" to="/">
          面包屑1.2
        </mtd-dropdown-menu-item>
      </mtd-breadcrumb-item-group>
      <mtd-breadcrumb-item tag="router-link" to="/"
        >面包屑2</mtd-breadcrumb-item
      >
      <mtd-breadcrumb-item tag="router-link" to="/"
        >面包屑3</mtd-breadcrumb-item
      >
    </mtd-breadcrumb>

  </div>
</template>
