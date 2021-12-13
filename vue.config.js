module.exports = {
    lintOnSave: false, //是否开启eslint
    publicPath: process.env.NODE_ENV == 'production' ? './' : '/',
    outputDir: 'docs'
}