import { Configuration } from 'webpack'
import { resolve } from 'path'

const dev = process.env.NODE_ENV === 'development'
const webpackconfig: Configuration = {
    entry: {
        index: resolve('./src/index.tsx')
    },
    output: {
        path: resolve('./lib'),
        filename: '[name].js',
        library: {
            name: 'try-graphql',
            type: 'umd'
        },
        clean: true
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    target: 'web',
    mode: dev ? 'development' : 'production',
    devtool: dev ? 'source-map' : undefined,
    resolve: {
        extensions: ['.tsx', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                loader: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64]'
                            }
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        react: 'react'
    }
}

export default webpackconfig