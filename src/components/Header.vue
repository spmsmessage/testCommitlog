<template>
  <nav>
    <ul>
      <li>
        <router-link to="/addBlog">写博客</router-link>
        <router-link to="/showBlog">博客</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
    export default {
        name: 'blog-header',
        data() {
            return {
                msg: ''
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a{
    color: azure;
    padding: 12px;
    border-radius: 5px;
    text-decoration: none;
  }
nav{
  background: crimson;
  padding: 30px 0;
}
</style>
