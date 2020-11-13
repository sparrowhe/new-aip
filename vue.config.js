const JSEncodePlugin = require('./js-encode-plugin');

module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Charts';
        return args;
      });
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置
      config.plugins.push(
        new JSEncodePlugin({
          global: '___',
          jsReg: /^app\..+\.js$/,
          assetsPath: './dist/js',
        }),
      );
    }
  },
};
