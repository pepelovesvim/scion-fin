const { CryptoStatsSDK } = require('@cryptostats/sdk');
const fs = require('fs');

const retry = async (fn, maxAttempts) => {
  const execute = async (attempt) => {
    try {
        return await fn()
    } catch (err) {
        if (attempt <= maxAttempts) {
            const nextAttempt = attempt + 1
            const delayInSeconds = Math.max(Math.min(Math.pow(2, nextAttempt)
              + randInt(-nextAttempt, nextAttempt), 600), 1)
            console.error(`Retrying after ${delayInSeconds} seconds due to:`, err)
            return delay(() => execute(nextAttempt), delayInSeconds * 1000)
        } else {
            throw err
        }
    }
  }
  return execute(1)
}
const delay = (fn, ms) => new Promise((resolve) => setTimeout(() => resolve(fn()), ms))
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const sdk = new CryptoStatsSDK();
async function test() {
  const collection = sdk.getCollection('bridged-value')
  await collection.fetchAdapters()
  const all_adapters = (collection.getAdapters())
  // console.log(Symbol.iterator in adapter)
  const query_results = [];
  for (let [_, adapter] of Object.entries(all_adapters)) {
    try{
      const bridged_value = await adapter.queries.currentValueBridgedAToB()
      const chainA = adapter.metadata.metadata['chainA'];
      const chainB = adapter.metadata.metadata['chainB'];
      var json_value = {
        'id': adapter.id,
        'chainA': chainA,
        'chainB': chainB,
        'currentValueBridgedAToB': bridged_value
      }
      query_results.push(json_value);
      console.log(json_value);
    }
    catch (err) {
      console.log(err);
    }
  }
  var query_results_str = JSON.stringify(query_results);
  console.log(query_results_str)
  var fs = require('fs')
  fs.writeFile("./bridged_values.json", query_results_str, function(err, results) {
    if (err) console.log('error', err)
  })
}

test();
