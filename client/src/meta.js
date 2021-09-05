const meta = {
  setTitle: (title) => (document.title = title),
};

export default (app) => {
  app.config.globalProperties.$meta = meta;
};
