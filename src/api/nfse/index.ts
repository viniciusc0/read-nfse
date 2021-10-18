export default (app) => {
    app.post(
      `/nfse/json`,
      require('./nfseJson').default,
    );
    app.post(
      `/nfse/xml`,
      require('./nfseXml').default,
    );
  };
  