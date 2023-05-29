<template>
  <mtd-row :gutter="20">
    <mtd-col :span="8">
      <mtd-card>常显阴影</mtd-card>
    </mtd-col>
    <mtd-col :span="8">
      <mtd-card shadow="hover">悬浮显示阴影</mtd-card>
    </mtd-col>
    <mtd-col :span="8">
      <mtd-card shadow="never">不显示阴影</mtd-card>
    </mtd-col>
  </mtd-row>
</template>
