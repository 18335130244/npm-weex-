/**
 * dev 开发环境调试内容
 * */
const {CmdSync,Cmd} = require("./utils/cmd")
const fsDir = require('./utils/dir')
const {setVueTemplateInner,setExportsTemplateInner,setAllExportsTemplateInner} = require('./utils/packFileInner')
const fs = require('fs');
const path = require('path')
function getDirName (pathDir){
    return path.join(__dirname + pathDir);
}
// 用来存放包名字数组
let packagesTmp = {
    exist:[],
    doesNotExist:[],
};
/**
 * 校验文件夹是否存在
 * */
function existsDir(path,name,scourPack){
    let dirName = getDirName(path);
    let dirExists = fs.existsSync(dirName);
    // 如果目录不存在
    if(!dirExists){
        createdDirForPackages(dirName,name,scourPack);
        if(packagesTmp.doesNotExist.indexOf(name) < 0){
            packagesTmp.doesNotExist.push(name)
        }
    }
    // 如果目录存在
    else{
        if(packagesTmp.exist.indexOf(name) < 0){
            packagesTmp.exist.push(name)
        }
    }
}

/**
 * 创建文件夹
 * */
function createdDirForPackages(dirPath,dirName,scourPack){
    // 创建文件夹 名字
    fsDir.createdDir(dirPath);
    fsDir.createdDir(dirPath+'/src');
    // 被导出的文件内容
    let exportIndexJs = setExportsTemplateInner(dirName)
    // 写入被导出的文件内容
    fsDir.writeFile(dirPath+'/index.js',exportIndexJs);
    // vue 组件内容
    let vueInnerVue = setVueTemplateInner(dirName)
    // 写入 vue 组件
    fsDir.writeFile(`${dirPath}/src/${dirName}.vue`,vueInnerVue)
}

/**
 * 监听 packages.json 是否有变化
 * */
function watchPackagesChange(){

}

/**
 * 循环 配置包是否有变化
 * */
const pages = require('./packages.json');
for(let i in pages){
    let exists = existsDir(`/packages/${i}`,i,pages[i])
}
if(packagesTmp.doesNotExist.length){
    let packagesName = [];
    packagesTmp.doesNotExist.forEach(item => {packagesName.push(item)})
    packagesTmp.exist.forEach(item => {packagesName.push(item)})
    fsDir.hardWriteFile(getDirName('/packages/index.js'),setAllExportsTemplateInner(packagesName))
}

// 监听文件 packages.json 包文件是否有变化 ， 动态添加文件夹 并创建文件 并加入 版本控制
// fs.watch(getDirName(`/packages.json`),(event,filename)=>{
//     console.log(event);
//     console.log(filename);
// })

