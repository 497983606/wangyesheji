// ALL GENERATE FUNCTION AND UTILS

const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");
const marked = require("marked");
const highlight = require("highlight.js");
const { config } = require('../package.json')

// ALL DIR PATH
const _tmplPath = path.join(__dirname, "../_tmpl"),
      _postPath = path.join(__dirname, "../_post"),
      _htmlPath = path.join(__dirname, "../docs")
const Regs = require('./regs');

// CONFIG MARKED
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  codePrefix:"hljs",
  tableClass:"table",
  highlight: (code,lang) => {
      return highlight.highlightAuto(code,[lang]).value;
  }
});

// GENERATE 
module.exports = ( tmpls, markdowns ) => {
  // RECREATE DIR ADN MOVE ASSET DIR TO HTML DIR
  console.log('delete html dir.')
  deleteAll(_htmlPath) 
  console.log('make html dir.')
  fs.mkdirSync(_htmlPath)
  console.log('copy asset to html dir.')
  fsExtra.copy(_tmplPath + '/assets', _htmlPath+ '/assets')
  fsExtra.copy(path.join(__dirname, '../images'), _htmlPath + '/images')
  
  if(fs.statSync(path.join(__dirname, '../CNAME')).isFile() ){
    
    let _cname = fs.readFileSync(path.join(__dirname, '../CNAME'))
    fs.writeFileSync(_htmlPath + '/CNAME', _cname)
  }

  const files = {}, 
        allFullFile = {'index.htm': "", 'list.htm': "", 'arc.htm': "", 'rss.htm': "", 'page.htm': ""},
        mds = [],
        webSite = config.website,
        arcList = {},
        allArc = []
  let nav = "", baseUrl = webSite.baseUrl
  const tmplFiles = tmpls.filter(i => i.indexOf('.htm') > -1)
        tmplFiles.forEach(i => {
          let file = fs.readFileSync(_tmplPath + '\\' + i)
              files[i] = file.toString()
        })
  console.log('Begin to reander .md ')
  markdowns.forEach(i => {
    let md = fs.readFileSync(_postPath + '\\' + i, 'utf-8').toString()
    let contentArr = md.split('-->').map(str => str.replace(/<!-- |\n|\r|' '/g, ''))
        mds.push({ 
            time:Number(contentArr[0]),
            title:contentArr[1],
            describe: contentArr[2],
            img: contentArr[3],
            type: contentArr[4] ,
            html: marked.marked(md)
        })
  })

  console.log('Begin to create Nav ')
  // CREATE NAV
  for(key in webSite.nav){
    let i = webSite.nav[key]
    fs.mkdirSync(_htmlPath +'/'+ key)
    if(i.type == 'list') fs.mkdirSync(_htmlPath +'/'+ key + '/post')
    nav += `<a href="${ baseUrl + '/'+ key }/"> ${ i.title } </a>` 
  }
  
  console.log('Begin to create common tags ')
  // REPLACE ALL COMMON TAG
  for(key in files){
    let commonReg = [{ 
          reg: Regs.websiteTitleReg,
          content: config.website.title
        },{
          reg: Regs.websiteBaseUrlReg,
          content: config.website.baseUrl
        }, {
          reg: Regs.navReg,
          content: nav
        }]
        commonReg.forEach(i => {
          files[key] = files[key].replace(new RegExp(i.reg), i.content)
        })
  }

  console.log('Begin to marge file ')
  // FINASH FILE MARGE
  for(key in allFullFile){
    let file = files[key];
    let includeFiles = file.match(Regs.includeReg)
    if( includeFiles ){
      let _file = ""
      for(let i in includeFiles){
        let item = includeFiles[i]
            _file = _file || file
            _file = _file.replace('{$include:'+item+' end/}', files[item])
      }
      allFullFile[key] = _file
    }else{
      allFullFile[key] = file
    }

  }

  console.log('Begin to genrante arc.')
  // GENRANTE ARC
  for(let key in webSite.nav){
    let navItme = webSite.nav[key]
    let arcs = mds.filter(m => m.type.replace(/\s*/g, '') == navItme.title.replace(/\s*/g, '')).sort((x, y) => y.time - x.time)
    arcList[key] = []
    arcs.forEach((i, idx) => {
      let arcRegs = ['arcPreReg', 'arcNextReg', 'arcTypeReg', 'arcBodyReg', 'titleReg', 'dateReg', 'thumbReg', 'descReg']
      let arc = navItme.type == 'list' ? allFullFile['arc.htm'] : allFullFile['page.htm']
      arcRegs.forEach(ar => {
        let _cont = ""
        if(ar == 'titleReg') _cont = i.title
        else if(ar == 'arcBodyReg') _cont = i.html
        else if(ar == 'dateReg') _cont = dateFormat(webSite.dateFmt, new Date(i.time))
        else if(ar == 'thumbReg') _cont = i.img
        else if(ar == 'descReg') _cont = i.describe
        else if(ar == 'arcTypeReg') _cont = `<a href='/${key}'>${i.type}</a>`
        else if(ar == 'arcPreReg' && idx !== 0  && navItme.type == 'list' ) _cont = `<a class="_pre_arc" href= "/${key}/post/${( Number(idx - 1) + webSite.postStart ) }.html">${  webSite.lang.next}</a>`
        else if(ar == 'arcNextReg' && idx+1 !== arcs.length && navItme.type == 'list') _cont = `<a class="_next_arc" href="/${key}/post/${( Number(idx + 1) + webSite.postStart ) }.html"> ${ webSite.lang.pre } </a>`
        arc = arc.replace(new RegExp(Regs[ar]), _cont)
      })
      let path = "", webPath = ""
      if(navItme.type == 'page'){
        path = _htmlPath + '/' + key + '/index.html'
        webPath = baseUrl + '/' + key + '/index.html'
      }else{
        path = _htmlPath + '/' + key + '/post/' + (Number(idx) + webSite.postStart) + '.html'
        webPath = baseUrl + '/' + key + '/post/' + (Number(idx) + webSite.postStart) + '.html'
        allArc.push({ 
          title: i.title, 
          img: i.img,
          time: i.time, 
          describe: i.describe,
          type: key, path: webPath
        })
      } 
      fs.writeFileSync( path, arc)
      arcList[key].push({ ...i, type: key, path: webPath})
      
    })
  }

  const list = {}

  console.log('Begin to genrante list.')
  // GENERATE LIST
  for(let key in arcList){
    if(webSite.nav[key].type == 'page') continue;
    list[key] = {};
    let item = arcList[key]
    for(let i in item){
      let page = (parseInt((i / webSite.listlen )) + 1)
      if(list[key][page]) list[key][page].push(item[i])
      else list[key][page] = [item[i]]
    }
  }
  
  for(let key in list){
    let item = list[key], listFile = allFullFile['list.htm'];
    let pageNum = Object.keys(item);
    for(let page in item){
      let _arcs = item[page], listStr = "<ul class='arc_list'>", pageStr = "";
      _arcs.forEach(i => {
        listStr += `
        <li> 
          <h3> <a href="${i.path}">${ i.title }</a></h3>
          <p class="bottom_box"> 
            ${ i.img ? '<img src='+ i.img +'/>' : ''} 
            <span class="_date"><i class="iconfont icon-riqi"></i>  ${ dateFormat(webSite.dateFmt, new Date(i.time)) }</span>
            <span class="_desc">
              ${ i.describe }...
            </span>
          </p>
        </li>`
      })
      pageNum.forEach(i => {
        pageStr += `<a ${ i == page ? 'class="cur_page"' : "" } href="${baseUrl}/${key}/${i == 1 ? 'index' : i}.html"> ${ i } </a>`
      })

      let newListFile = listFile.replace(new RegExp(Regs.listReg), listStr)
          newListFile = newListFile.replace(new RegExp(Regs.titleReg), webSite.nav[key].title)
          newListFile =  newListFile.replace(new RegExp(Regs.curPage), page == 1 ? '' : 'page_' + page)
          newListFile = newListFile.replace(new RegExp(Regs.pageNumReg), pageStr)

      fs.writeFileSync( _htmlPath + `/${ key }/${page == 1 ? 'index' : page}.html`, newListFile, 'utf8')
    }
  }

  console.log('Begin to genrante rss and news')

  const _allArc = allArc.sort((a, b) => b.time - a.time)
  
  let _rss = "<ul class='arc_rss'>", _new = "<ul class='arc_news'>"; 
  for(let o in _allArc){
    let item = _allArc[o]
    let _itemHtml = `
    <li>
      <span>${ dateFormat(webSite.dateFmt, new Date(item.time))}</span>
      <a href="${item.path}"> ${item.title} </a>
      <a class="_type" href="${baseUrl}/${item.type}">${ webSite.nav[item.type].title }</a>
    </li>
    `
    if( o <= webSite.news && !webSite.isBlog) _new += _itemHtml;
    _rss += _itemHtml
  }
  
  allFullFile['rss.htm'] = allFullFile['rss.htm'].replace(new RegExp(Regs.rssReg), _rss + '</ul>')
  fs.writeFileSync(_htmlPath + '/rss.html', allFullFile['rss.htm'], 'utf8')
  
  if(!webSite.isBlog){
    allFullFile['index.htm'] = allFullFile['index.htm'].replace(new RegExp(Regs.newsReg), _new + '</ul>')
    fs.writeFileSync(_htmlPath + '/index.html', allFullFile['index.htm'], 'utf8')
  }else{
    let listlen = webSite.listlen

    let pageAll = parseInt(allArc.length / listlen) + ((allArc.length % listlen == 0) ? 0 : 1)
    
    for(let i = 0; i < pageAll; i++){
      
      let _list = "<ul class='arc_list'>", pageStr = "";
      for(let j = 0; j < listlen; j++){
        if(i*listlen+j > _allArc.length - 1) break;
        
        let item = _allArc[i*listlen + j]

        _list += `
        <li> 
        <h3><a href="${item.path}"> ${item.title} </a></h3>
        <p class="bottom_box">
          ${ item.img ? ('<img src='+item.img+' />') : '' }
          <span class="_date">
            <i class="iconfont icon-riqi"></i> ${ dateFormat(webSite.dateFmt, new Date(item.time))} 
            <a class="_type" href="${baseUrl}/${item.type}">${ webSite.nav[item.type].title }</a>
          </span>
          <span class="_desc">
              ${ item.describe }...
          </span>
        </p>
        </li>
        `
      }
      

      for(let _i = 0; _i < pageAll; _i++){
        pageStr += `<a ${ _i == i ? 'class="cur_page"' : "" } href="${baseUrl}/${_i == 0 ? 'index' : 'page_'+ _i}.html"> ${ _i + 1 } </a>`
      }
      
      

      let _indexFile = allFullFile['index.htm'].replace(new RegExp(Regs.listReg), _list + '</ul>')
          _indexFile =  _indexFile.replace(new RegExp(Regs.curPage), i == 0 ? '' : 'page_' + (i+1) )
          _indexFile = _indexFile.replace(new RegExp(Regs.pageNumReg), pageStr)

      fs.writeFileSync( _htmlPath + `/${i == 0 ? 'index' : 'page_'+ (i + 1) }.html`, _indexFile, 'utf8')
      
    }
  }
  
}

// CLEAR DIR
function deleteAll(path) {
  let files = [];
  if( fs.existsSync(path) ) {
    files = fs.readdirSync(path);
    files.forEach(file => {
      let curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { 
        deleteAll(curPath);
      } else { 
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// DATE FORMT
function dateFormat(fmt, date){
  let ret;
  let opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString(),         // 秒
      "s+": (date.getTime()/1000).toString().split('.')[1],         // 豪秒
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k]?.padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}