const path = require('path');
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        vendors: ['lodash'],
        react: ['react','react-dom']
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',   // 这里必须和上面的library一致 要不然找不到
            path: path.resolve(__dirname, '../dll/[name].manifest.json') // 这是映射文件
        })
    ]
}