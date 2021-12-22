module.exports = {
  publicPath: './',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "/src/static/styles/var.scss";'
      }
    }
  },
  transpileDependencies: ['uview-ui'],
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 999999 }))
  }
}
