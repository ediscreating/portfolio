const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const htmlplugins = [];

['main', 'skills', 'works'].forEach(entry => {
  htmlplugins.push(new HtmlWebpackPlugin({
    filename: (entry === 'main' ? 'index' : entry)  + '.html',
    inject: false,
    template: './' + entry + '/html/index.ejs',
    minify: isProduction && {
      collapseWhitespace: true,
      removeComments: true,
      quoteCharacter: '"',
      minifyJS: true
    }
  }))
});

const extractMainCSS = new ExtractTextPlugin({ filename: 'assets/css/main.css' });
const extractSkillsCSS = new ExtractTextPlugin({ filename: 'assets/css/skills.css' });
const extractWorksCSS = new ExtractTextPlugin({ filename: 'assets/css/works.css' });
const extractCommonCSS = new ExtractTextPlugin({ filename: 'assets/css/common.css' });

const extractOptions = {
  fallback: "style-loader",
  use: [
    {
      loader: 'css-loader',
      options: {
        minimize: isProduction,
        importLoaders: 1
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          require('autoprefixer')(),
        ]
      }
    }
  ]
};

const webpackConfig = {
  context: path.join(path.resolve(__dirname, 'src'), 'pages'),
  entry: {
    pagesmanager: ['core-js/es6/array', 'core-js/fn/promise', './pagesmanager/']
  },
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'assets/js/[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ['env'],
          parserOpts: {
            allowImportExportEverywhere: true
          },
          plugins: ["syntax-dynamic-import"]
        }
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/pages/main/css/'),
        use: extractMainCSS.extract(extractOptions)
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/pages/skills/css/'),
        use: extractSkillsCSS.extract(extractOptions)
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/pages/works/css/'),
        use: extractWorksCSS.extract(extractOptions)
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/common/css/'),
        use: extractCommonCSS.extract(extractOptions)
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/img/[name]-[hash:6].[ext]'
            }
          },
          {
            loader: 'img-loader',
            options: {
              enabled: isProduction,
              optipng: false,
              pngquant: {
                quality: '100',
                speed: 2
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[name]-[hash:6].[ext]'
        }
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: false,
              interpolate: true,
              minimize: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src/common'), 'node_modules']
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        output: { comments: false }
      }
    }),
    new CommonsChunkPlugin({
      children: true,
      minChunks: 3
    }),
    extractMainCSS,
    extractSkillsCSS,
    extractWorksCSS,
    extractCommonCSS
  ].concat(htmlplugins),
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '192.168.0.132',
    port: 3030
  }
};

if (isProduction) {
  webpackConfig.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      output: { comments: false }
    }
  }))
}

module.exports = webpackConfig;
