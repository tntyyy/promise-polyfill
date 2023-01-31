const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const filename = (name, extension) => isDev ? `${name}.${extension}` : `${name}.[hash].${extension}`

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        clean: true
    },
    resolve: {
        extensions: ['.js', '.ts', '.css', '.scss', '.sass'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: {
        minimizer: [
            new TerserWebpackPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 1,
            minChunks: 2
        }
    },
    devServer: {
        port: 8888
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            minify: {
                removeComments: isProd
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/favicon/favicon.ico"),
                    to: path.resolve(__dirname, "dist")
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename("bundle", "css")
        })
    ]
}