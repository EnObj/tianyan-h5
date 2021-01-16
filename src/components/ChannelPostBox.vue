<template>
    <div>
        <h1>考古</h1>
        <div class="channel-posts">
            <div class="channel-post" v-for="channelPost in channelPosts" :key="channelPost._id">
                <div class="channel-post-time">{{channelPost.postTime | formatPass}}</div>
                <div class="channel-post-content">
                    <el-link :href="channelPost.openResourceUrl" target="_blank">{{channelPost.content}}</el-link>
                </div>
            </div>
        </div>
        <div v-show="more" class="load-more">
            <el-link v-on:click="loadChannelPosts(channelPosts)" type="primary">加载更多</el-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChannelPostBox',
    props: ["id"],
    data: function(){
        return {
            channelPosts: [],
            more: false
        }
    },
    created(){
        this.loadChannelPosts()
    },
    watch:{
        'id':'loadChannelPosts'
    },
    methods: {
        loadChannelPosts(channelPosts=[]){
            const loading = this.$loading();
            const pageLimit = 20
            this.cloud.callFunction({
                name: 'loadTyChannelPost',
                data: {
                    channelId: this.id,
                    skip: channelPosts.length,
                    limit: pageLimit
                }
            }).then(res=>{
                this.channelPosts = channelPosts.concat(res.result)
                this.more = res.result.length == pageLimit
                // 关闭loading
                loading.close()
            }).catch(()=>{
                // 关闭loading
                loading.close()
            })
        }
    }
}
</script>

<style scoped>
.channel-post{
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.channel-post-time{
    color: gray;
    font-size: 14px;
    margin-bottom: 5px;
}
.channel-post-content{
    background: #eee;
    border-radius: 10px;
    padding: 10px;
}
.load-more{
  text-align: center;
  margin: 20px 0;
}
</style>