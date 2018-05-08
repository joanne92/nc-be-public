const config = {
  dev: {
    DB_URL: "mongodb://localhost:27017/nc_news",
    PORT: 9090,
    COMMENTS: 500
  },
  test: {
    DB_URL: "mongodb://localhost:27017/nc_news_test",
    PORT: 3000,
    COMMENTS: 5
  },
  production: {
    DB_URL: "mongodb://jo:passWord123@ds227469.mlab.com:27469/nc_news",
    COMMENTS: 500,
    USERNAME: "jo",
    PASSWORD: "passWord123"
  }
};
module.exports = config;
