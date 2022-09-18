const { CryptoStatsSDK } = require('@cryptostats/sdk');
const fs = require('fs');

const sdk = new CryptoStatsSDK();
async function test() {
  const collection = sdk.getCollection('bridged-value')
  await collection.fetchAdapters()
  const adapter = (collection.getAdapters())
  // console.log(Symbol.iterator in adapter)
  for (let [_, value] of Object.entries(adapter)) {
    metadata = value.metadata.metadata;
    console.log(value.metadata.metadata);
  }
  const data = JSON.stringify(Object.entries(adapter));
  fs.writeFile('bridges.json', data, (err) => {
    if (err) {
      throw err;
    }
  })
}

test();
