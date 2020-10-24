const processTypescriptFiles = {
  test: /\.ts?$/,
  use: 'ts-loader',
  exclude: /node_modules/,
};

const processSassFiles = {
  test: /scss$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    'sass-loader',
  ],
};

const processImages = {
  test: /\.(png|jpg|gif|webp)$/,
  use: ['file-loader'],
};

const lintTypescript = {
  test: /\.(js|tsx?)$/,
  enforce: 'pre',
  use: [
    {
      options: {
        eslintPath: require.resolve('eslint'),
      },
      loader: require.resolve('eslint-loader'),
    },
  ],
  exclude: /node_modules/,
};

module.exports = {
  processTypescriptFiles,
  processSassFiles,
  processImages,
  lintTypescript,
};
