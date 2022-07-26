/* eslint-disable no-unused-vars */
const webpack = require("webpack");
const path = require('path')

const {
  when,
  whenDev,
  whenProd,
  whenTest,
  ESLINT_MODES,
  POSTCSS_MODES,
  getLoader,
  loaderByName,
  getPlugin,
  pluginByName
} = require("@craco/craco");

const {
  getWebpackTools
} = require("react-native-monorepo-tools");

const monorepoWebpackTools = getWebpackTools();

module.exports = function({
  env
}) {
  return {
    babel: {
      plugins: [
        ["module-resolver", {
          "alias": {
            "^react-native$": "react-native-web"
          }
        }]
      ],
    },
    webpack: {
      configure: (webpackConfig) => {

        const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
          ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
        );
  
        webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

        // Allow importing from external workspaces.
        monorepoWebpackTools.enableWorkspacesResolution(webpackConfig);
        // Ensure nohoisted libraries are resolved from this workspace.
        monorepoWebpackTools.addNohoistAliases(webpackConfig);

        return webpackConfig;
      },
      plugins: {
        add: [
          // Inject the "__DEV__" global variable.
          new webpack.DefinePlugin({
            __DEV__: process.env.NODE_ENV !== "production",
          }),
        ],
        remove: ["ManifestPlugin", "WebpackManifestPlugin"]
      }
    },
  }
};