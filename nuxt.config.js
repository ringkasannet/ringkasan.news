export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  // loading: {
  //   name: 'circle',
  //   color: '#30495E',
  //   background: 'white',
  //   duration:10000,
  //   height:'5px'
  // },

  cloudinary: {
    cloudName:'ringkasan-net',
    apiKey: '129267694791879',
    apiSecret:'jtZtIKQfpTa6U0MdazzajrSzA3Q'
  },

  loading:'~/components/LoadingBar.vue',
  head: {
    title: 'ringkasan.news',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // '~/plugins/firestore.js',
    // '~/plugins/coba.js',
    // '~/plugins/db.js'
    '~/plugins/quill.client.js',
    {src:'~/plugins/ctkpicker.client.js',mode:'client'},
    '~/plugins/checkAuth.js',
    '~/plugins/vueimageupload.client.js',
    '~plugins/ringkasan.js'

  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/cloudinary',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyDeXC42DgrTo80fx-rKv-Yx1P2g7L8E6bw",
          authDomain: "ringkasan-news.firebaseapp.com",
          projectId: "ringkasan-news",
          storageBucket: "ringkasan-news.appspot.com",
          messagingSenderId: "24259332039",
          appId: "1:24259332039:web:d6aa9ab8f27bc25be2fbe2",
          measurementId: "G-87H175L45W"      
        },
        services: {
          auth: true, // Just as example. Can be any other service.
          firestore:true
        }
      },
      '@nuxtjs/axios',

    ]

      ],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  server: {
    host: "0.0.0.0"
}


}
