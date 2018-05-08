const app = require("./app.js");

const PORT = process.env.PORT || require("./config")[process.env.NODE_ENV].PORT;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
