const JSEncodePlugin = require('./js-encode-plugin');

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Charts';
        return args;
      });
    // config.optimization.minimizer([
    //   new TerserPlugin({
    //     terserOptions: {
    //       mangle: true,
    //       compress: {
    //         drop_debugger: false
    //       }
    //     }
    //   })
    // ]);
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = false;
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
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
