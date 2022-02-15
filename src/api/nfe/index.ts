export default (app) => {
    app.post(
      `/nfe/json`,
      require('./nfeJson').default,
    );
    app.post(
      `/nfe/xml`,
      require('./nfeXml').default,
    );
  };
  