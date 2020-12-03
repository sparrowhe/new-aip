const Compression = require('compression-webpack-plugin');

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
      return {
        plugins: [
          new Compression({
            test: /\.js$|\.html$|\.css/,
            threshold: 10240,
            deleteOriginalAssets: false
          })
        ]
      }
    }
  },
};
