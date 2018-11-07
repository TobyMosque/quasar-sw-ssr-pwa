// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    preFetch: true,
    plugins: [
      'axios',
      'database',
      'components'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons' // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        });

        [
          'pouchdb',
          'pouchdb-ajax',
          'pouchdb-fetch',
          'pouchdb-find',
          'pouchdb-md5',
          'pouchdb-utils'
        ].forEach(function (lib) {
          cfg.resolve.alias[lib + '$'] = lib + '/lib/index-browser.js'
        });

        [
          'pouchdb-authentication'
        ].forEach(function (lib) {
          cfg.resolve.alias[lib + '$'] = lib + '/lib/index.js'
        });

        [
          'pouchdb-abstract-mapreduce',
          'pouchdb-collate',
          'pouchdb-collections',
          'pouchdb-errors',
          'pouchdb-mapreduce-utils',
          'pouchdb-promise',
          'pouchdb-selector-core'
        ].forEach(function (lib) {
          cfg.resolve.alias[lib + '$'] = lib + '/lib/index.js'
        })
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QTable',
        'QCard',
        'QCardActions',
        'QCardTitle',
        'QCardSeparator',
        'QCardMain',
        'QItemTile',
        'QSearch',
        'QDatetime',
        'QInput',
        'QEditor',
        'QSelect',
        'QField',
        'QCheckbox',
        'QTableColumns',
        'QCollapsible'
      ],
      directives: [
        'Ripple'
      ],
      // Quasar plugins
      plugins: [
        'Dialog',
        'Loading',
        'Notify'
      ]
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: true
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
