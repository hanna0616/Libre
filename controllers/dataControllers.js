const {
  LibreLinkUpClient,
} = require("./../libre-link-up-api-client-main/src/client.js");
require("dotenv").config();
const libreAccountName = process.env.LIBREACCOUNT_NAME;
const libreAccountPassword = process.env.LIBREACCOUNT_PW;

async function getGlucose() {
  const username = libreAccountName;
  const password = libreAccountPassword;
  const libreClient = LibreLinkUpClient({
    username,
    password,
  });
  const data = await libreClient.read();
  console.log("data", data);
}

module.exports = getGlucose;
