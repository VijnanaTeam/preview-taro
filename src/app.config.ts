export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/payment/index',
    'pages/success/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#16171b',
    navigationBarTitleText: '泊车票',
    navigationBarTextStyle: 'white',
    backgroundColor: '#16171b'
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json'
})
