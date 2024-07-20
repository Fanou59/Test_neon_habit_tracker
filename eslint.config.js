import globals from "globals";
import pluginJs from "@eslint/js";

export default {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node, // Ajoute les variables globales de Node.js
    },
    ecmaVersion: 2021, // Utilise les fonctionnalités ECMAScript 2021
    sourceType: "module", // Utilise les modules ES
  },
  plugins: {
    "eslint-plugin-node": require("eslint-plugin-node"), // Assure que le plugin node est installé
  },
  extends: [
    pluginJs.configs.recommended,
    "plugin:node/recommended", // Utilise les règles recommandées pour Node.js
  ],
  rules: {
    // Ajoutez des règles spécifiques ici si nécessaire
  },
};
