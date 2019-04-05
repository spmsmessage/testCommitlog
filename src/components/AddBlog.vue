<template>
    <div>
      <h2>添加博客</h2>
      <form>
        <label>博客标题：</label>
        <input type="text" v-model="blog.title" required/>
        <br>
        <label>博客内容：</label>
        <textarea v-model="blog.content"></textarea>
        <label>分类：</label>
        <div id="checkboxes">
          <label>Vue.js</label>
          <input type="checkbox" value="Vue.js" v-model="blog.categories"/>
          <label>Node.js</label>
          <input type="checkbox" value="Node.js" v-model="blog.categories"/>
          <label>Angular</label>
          <input type="checkbox" value="Angular" v-model="blog.categories"/>
        </div>
        <label>作者：</label>
        <select v-model="blog.author">
          <option v-for="author in authors">{{author}}</option>
        </select>
        <button v-on:click.prevent="post">添加博客</button>
      </form>
      <hr>
      <div id="preview">
        <h3>博客总览</h3>
        <p>博客标题：{{blog.title | toUpper}}</p>
        <p>博客内容：</p>
        <p>{{blog.content}}</p>
        <p>选择的种类：</p>
        <ul>
          <li v-for="category in blog.categories">
            {{category}}
          </li>
        </ul>
        <p>作者:{{blog.author}}</p>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'AddBlog',
        data() {
            return {
                blog:{
                  title:"",
                  content:"",
                  categories:[],
                  author:""
                },
              authors:["haha","xuixi","kk"]
            }
        },
      methods:{
          post:function () {
            this.$http.post("http://jsonplaceholder.typicode.com/posts",{
              title:this.blog.title,
              body:this.blog.content
            }).then(function (data) {
              console.log(data)
            })
          }
      },
      filters:{
          toUpper:function (value) {
            return value.toUpperCase()
          }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
