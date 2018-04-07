const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const myPath = {
    scripts: {
        entry: './src/assets/scripts/index.js',
        resolve: 'src/assets/scipts',
        output: './assets/build/app.js'
    },
    styles: {
        entry: './src/assets/styles/main.scss',
        resolve: 'src/assets/styles',
        output: './assets/build/app.css'
    },
    html: {
        entry: './src/html/views',
        resolve: 'src/html/includes',
    },
    dist: 'dist'
}

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false,
        })
    })
}

const htmlPlugins = generateHtmlPlugins(myPath.html.entry);

module.exports = {
    entry: [
        myPath.scripts.entry,
        myPath.styles.entry,
    ],
    output: {
        filename: myPath.scripts.output
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, myPath.scripts.resolve),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: 'env'
                }
            }
        }, {
            test: /\.(sass|scss)$/,
            include: path.resolve(__dirname, myPath.styles.resolve),
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            minimize: true,
                            url: false
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }))
        }, {
            test: /\.html$/,
            include: path.resolve(__dirname, myPath.html.resolve),
            use: ['raw-loader']
        }, ]
    },
    devServer: {
        // contentBase: path.join(__dirname, 'src'),
        contentBase: './src',
        watchContentBase: true
    },
    plugins: [
        new CleanWebpackPlugin([myPath.dist]),
        new ExtractTextPlugin({
            filename: myPath.styles.output,
            allChunks: true,
        }),
        new CopyWebpackPlugin([{
            from: './src/assets/fonts',
            to: './assets/fonts'
          },
          {
            from: './src/assets/favicon',
            to: './assets/favicon'
          },
          {
            from: './src/assets/images',
            to: './assets/images'
          },
          {
            from: './src/assets/uploads',
            to: './assets/uploads'
          }
        ]),
    ].concat(htmlPlugins)
};