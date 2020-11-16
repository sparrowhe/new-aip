const JSEncodePlugin = require('./js-encode-plugin');

module.exports = {
  productionSourceMap: false,
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
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
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
