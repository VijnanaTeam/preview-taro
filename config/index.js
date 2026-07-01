const path = require('path')

const config = {
  projectName: 'parking-pay',
  date: '2026-7-1',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    375: 2,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }
  },
  cache: {
    enable: false
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    router: {
      mode: 'hash'
    },
    devServer: {
      host: '0.0.0.0',
      port: 10086,
      open: false,
      allowedHosts: 'all',
      // Taro's H5 target does not emit an entry index.html and serves a static
      // dir at "/". Point it at the committed public/ folder whose index.html
      // loads the in-memory dev bundle (runtime.js / taro.js / app.js).
      static: [{
        directory: path.join(__dirname, '..', 'public'),
        publicPath: '/',
        watch: false
      }]
    },
    postcss: {
      autoprefixer: { enable: true },
      cssModules: { enable: false }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
