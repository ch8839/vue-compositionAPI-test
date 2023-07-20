<template>
  <div class="demo-full-width">
    <mtd-container>
      <mtd-header>Header</mtd-header>
      <mtd-main>Main</mtd-main>
    </mtd-container>
    <br />
    <mtd-container>
      <mtd-header>Header</mtd-header>
      <mtd-main>Main</mtd-main>
      <mtd-footer>Footer</mtd-footer>
    </mtd-container>
    <br />
    <mtd-container>
      <mtd-aside width="200px">Aside</mtd-aside>
      <mtd-main>Main</mtd-main>
    </mtd-container>
    <br />
    <mtd-container>
      <mtd-header>Header</mtd-header>
      <mtd-container>
        <mtd-aside width="200px">Aside</mtd-aside>
        <mtd-main>Main</mtd-main>
      </mtd-container>
    </mtd-container>
    <br />
    <mtd-container>
      <mtd-header>Header</mtd-header>
      <mtd-container>
        <mtd-aside width="200px">Aside</mtd-aside>
        <mtd-container>
          <mtd-main>Main</mtd-main>
          <mtd-footer>Footer</mtd-footer>
        </mtd-container>
      </mtd-container>
    </mtd-container>
    <br />
    <mtd-container>
      <mtd-aside width="200px">Aside</mtd-aside>
      <mtd-container>
        <mtd-header>Header</mtd-header>
        <mtd-main>Main</mtd-main>
      </mtd-container>
    </mtd-container>
    <br />
    <mtd-container>
      <mtd-aside width="200px">Aside</mtd-aside>
      <mtd-container>
        <mtd-header>Header</mtd-header>
        <mtd-main>Main</mtd-main>
        <mtd-footer>Footer</mtd-footer>
      </mtd-container>
    </mtd-container>
  </div>
</template>
<style>
.mtd-header,
.mtd-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.mtd-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.mtd-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.mtd-container:nth-child(5) .mtd-aside,
.mtd-container:nth-child(6) .mtd-aside {
  line-height: 260px;
}

.mtd-container:nth-child(7) .mtd-aside {
  line-height: 320px;
}
</style>
