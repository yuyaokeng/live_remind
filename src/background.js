// 后台获取数据
let axios = require('axios')
const attentionUrl = 'https://api.live.bilibili.com/xlive/web-ucenter/user/following'
const liveUrl = 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users?size=10'

// 获取关注列表
function attentionList(n){
    return new Promise((resolve,reject)=>{
        axios.get(attentionUrl,{
            params:{
                page:n,
                page_size:9
            }
        }).then(function(res){
            resolve(res.data.data.list)
        }).catch(function(error){
            reject(error)
        })
    })
}
//获取直播列表
function getLiveList(){
    return new Promise((resolve,reject)=>{
            axios.get(liveUrl).then(function(res){
                resolve(res.data)
            }).catch(function(error){
                reject(error)
            })
    })
}
// 获取关注总数
function getTotalPage(){
    return new Promise((resolve,reject)=>{
        axios.get(attentionUrl,{
            params:{
                page:1,
                page_size:9
            }
        }).then(function(res){
            resolve(res.data.data.totalPage)
        }).catch(function(error){
            reject(error)
        })
    })
}

// 读取localStorage中的数据
function showInfo(){  
    var array = [];  
    for(let i=0;i<localStorage.length;i++){
        let getKey = localStorage.key(i)
        let getVal = localStorage.getItem(getKey)
        array.push(getVal) 
    }  
    return array
} 
// 在指定的时间可以进行通知
if (window.Notification){
    var now = new Date()
    let start = localStorage.getItem('start')
    let end = localStorage.getItem('end')
    if(now.getHours()<=end&&now.getHours()>=start){
        setInterval(function(){
            make()// 每10s向服务端访问数据
        },10000)
    }
}
// 收集需要发的通知
async function make(){
    let res = await getLiveList()
    let array = await showInfo()
    let liveList = []
    if(Object.keys(res.data).includes('items')){
        for(let i of res.data.items){
            liveList.push(i.uname)
        }
        if(array.length != 0){
            for(let i of array){
                for(let j of liveList){
                    if(i.split(',')[0] == j && i.split(',')[1]=='false'){
                        localStorage.setItem(i.split(',')[0], [i.split(',')[0],true])
                        notifications(i.split(',')[0])
                    }
                }
            }
        }
    }
}
// 桌面通知形式
function notifications(i){
    chrome.notifications.create(
          {
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'B站直播提醒',
            message: `${i}的直播开始了`,
            eventTime: Date.now() + 10000
          }, 
        );
}

export {getTotalPage,attentionList}