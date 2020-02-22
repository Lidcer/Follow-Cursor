const pack = require("./package.json");
module.exports = {
  //mode: 'development',
  mode: "production",
  entry: {
    content: "./src/assets/scripts/content.ts",
    popup: "./src/assets/scripts/popup.ts",
    background: "./src/assets/scripts/background.ts"
  },
  output: {
    path: __dirname,
    filename: `./build/Follow-Cursor-${pack.version}/assets/scripts/[name].js`
  },
  resolve: {
    extensions: ["*", ".js", ".ts"]
  },
  module: {
    rules: [{
      test: /\.(js|ts)$/,
      exclude: /node_modules/,
      loaders: ["ts-loader"]
    }]
  }
};