<template>
<el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :default-active="$route.path"
    router
>
    <el-menu-item disabled>CAFPC</el-menu-item>
    <el-menu-item index="/">机场图</el-menu-item>
    <el-menu-item index="/erc">航路图</el-menu-item>
</el-menu>
</template>

<script>
export default {
  name: 'navbar',
};
</script>

<style>

#nav {
  padding: 0px;
}
</style>
