// ALL TMPLATE SUPPORTS DYNAMIC TAG
module.exports = {
  includeReg: /(?<=\{\$include:).+(?= end\/\})/g,
  titleReg: /\{\$title:end\/\}/g,
  dateReg: /\{\$date:end\/\}/g,
  thumbReg: /\{\$thumb:end\/\}/g,
  descReg: /\{\$desc:end\/\}/g ,
  arcNextReg: /\{\$arcNext:end\/\}/g,
  arcPreReg: /\{\$arcPre:end\/\}/g,
  pageNumReg: /\{\$pageNum:end\/\}/g,
  arcBodyReg: /\{\$arcBody:end\/\}/g,
  listReg: /\{\$list:end\/\}/g,
  newsReg: /\{\$news:end\/\}/g,
  rssReg: /\{\$rss:end\/\}/g,
  websiteTitleReg: /\{\$websiteTitle:end\/\}/g,
  websiteBaseUrlReg: /\{\$websiteBaseUrl:end\/\}/g,
  discussReg: /(?<=\{\$discuss:).+(?= end\/\})/g,
  navReg: /\{\$nav:end\/\}/g
}