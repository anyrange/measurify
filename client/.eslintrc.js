module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  plugins: ["vue"],
  rules: {
    "vue/no-unused-vars": "error",
  },
};
