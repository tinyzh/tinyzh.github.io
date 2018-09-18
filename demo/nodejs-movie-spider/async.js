var fs = require('fs');
var path = require('path');
var request = require('request');

var movieDir = __dirname + '/movies',
    exts = [".mkv",".avi",".mp4",".txt"]; // 合法后缀

    
// 读取文件列表
var readFiles = function(){
    return new Promise(function(resolve, reject){
        fs.readdir(movieDir, function(err, files){
            // 过滤文件
            resolve(files.filter(v => exts.includes(path.parse(v).ext)))
        })
    })
}


// 获取海报
var getPoster = function(movieName){
    var url = `https://api.douban.com/v2/movie/search?q=${encodeURI(movieName)}`

    return new Promise(function(resolve, reject){
        request({url: url, json: true}, function(err, response, body){
            if(err) return reject(err);

            resolve(body.subjects[0].images.large);
        })
    })
};
 
// 保存海报
var savePoster = function(moveName,url){
    request.get(url).pipe(fs.createWriteStream(path.join(movieDir, moveName + '.jpg')));
};

(async () => {
    
    let files = await readFiles();

    for(var file of files){
        var name = path.parse(file).name;

        console.log(`正在获取【${name}】的海报`);
        savePoster(name, await getPoster(name));
    }

    console.log('===获取海报完成===');
})()