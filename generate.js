const fs = require('fs')
const args = process.argv                        // 传参
const path = require('path');                    //路径
const filePath = path.resolve('./public/post/md');    //文件路径

let json = []

const fileDisplay = filePath => {
    //根据文件路径读取文件，返回文件列表
    console.log('准备读取文件……')
    fs.readdir(filePath,(err,files) => {
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(filename => {
                let filedir = path.join(filePath, filename);
                fs.stat(filedir,(eror, stats) => {
                    console.log('正在读取文件……')
                    if(eror){
                        console.warn('读取错误：', eror)
                    }else{
                        let isFile = stats.isFile();//是文件
                        if(isFile){
                            let content = fs.readFileSync(filedir, 'utf-8');
                            let contentArr = content.split('-->').map(str => str.replace(/<!-- |\n|\r|' '/g, ''))
                            json.push({ 
                                time:Number(contentArr[0]),
                                title:contentArr[1],
                                describe: contentArr[2],
                                img: contentArr[3],
                                path:'./post/md/'+ filename
                            })
                            let error = fs.writeFileSync('./public/post/db.json', JSON.stringify(json), 'utf8')
                            if(!error) console.log('生成文档列表成功！')
                        }
                    }
                })
                
            })
        }
    })
}

const newMD = title => {
    
    let date = new Date().getTime()
    let str = `<!-- ${date} -->\n<!-- ${title} -->\n<!-- ${title} 的前言 -->\n<!-- ${title} 的缩略图url -->\n`
    let error = fs.writeFileSync('./public/post/md/'+title+'.md', str, 'utf8')
        if(!error) console.log('文章：'+title+'.md 创建成功--'+date)
}

if(args.length < 3) fileDisplay(filePath)
else { newMD(args[2]) }