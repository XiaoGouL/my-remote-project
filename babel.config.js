module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    'babel-plugin-macros', // 必须项
    ['@lingui/babel-plugin-lingui-macro', {
      sourceLocale: 'zh',
      format: 'po'
    }]
  ]
};