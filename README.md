# Bitcoin Energy Consumption API

A **GraphQL API** to monitor the energy consumed by Bitcoin transactions and blocks.  
Built with **TypeScript**, **Serverless Framework**, and **Node.js**, this project calculates approximate energy usage for Bitcoin blocks and transactions using public Blockchain.com endpoints.

## ✨ Features

- **Block Energy Consumption** – Per-transaction energy for a specific block
- **Daily Energy Stats** – Total energy consumption per day for the last `x` days
- **(Optional)** Caching to reduce calls to the Blockchain API
- **(Optional)** Total energy consumption of transactions by a specific wallet address

## 🛠 Tech Stack

- Node.js 16.x
- TypeScript
- GraphQL (Apollo-style schema/resolvers)
- Serverless Framework (AWS Lambda + HTTP API)
- Bundling via `serverless-esbuild`

## ⚡ Assumptions

- Bitcoin network consists of blocks (by `hash` or `index`), each with transactions (`hash`).
- Each transaction has a `size` (bytes).
- **Energy cost** is assumed: **4.56 kWh per byte**.

## 🌐 Blockchain API References

- Latest block: `https://blockchain.info/latestblock`
- Blocks in a day: `https://blockchain.info/blocks/$time_in_milliseconds?format=json`
- Single block: `https://blockchain.info/rawblock/$block_hash`
- Single transaction: `https://blockchain.info/rawtx/$tx_hash`
- Address transactions: `https://blockchain.info/rawaddr/$bitcoin_address`

---

## 🚀 Getting Started (Local)

### Requirements
- Node.js 16.x
- Yarn
- Serverless Framework (v3+):
  ```bash
  npm install -g serverless
  ```

### Install
```bash
yarn
```

### Run Offline
```bash
yarn start
# or:
sls offline start
```

Local endpoints (offline):
- **GraphQL Explorer (GET):** `http://localhost:4000/graphql`
- **GraphQL (POST):** `http://localhost:4000/graphql`
- **REST (POST):** `http://localhost:4000/calculateSingleDayEnergyConsumption`

---

## ☁️ Deploy to AWS

This project is configured for AWS via Serverless:

```yaml
service: sf-assignment-pow
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs16.x
  stage: ${opt:stage, 'dev'}
  region: eu-west-1
  lambdaHashingVersion: 20201221
  memorySize: 256
  logRetentionInDays: 14
  timeout: 300

plugins:
  - serverless-esbuild
  - serverless-offline

functions:
  explorer:
    handler: handlers.explorerHandler
    events:
      - httpApi:
          path: /graphql
          method: get
  graphql:
    handler: handlers.graphQLHandler
    events:
      - httpApi:
          path: /graphql
          method: post
  calculateSingleDayEnergyConsumption:
    handler: handlers.getBlockDataForDay
    events:
      - httpApi:
          path: /calculateSingleDayEnergyConsumption
          method: post
```

### Deploy
```bash
sls deploy --stage dev --region eu-west-1
```

After deploy, note the **base URL** from the output. Your endpoints will be:

- **GET** `{baseUrl}/graphql` (Explorer)
- **POST** `{baseUrl}/graphql` (GraphQL)
- **POST** `{baseUrl}/calculateSingleDayEnergyConsumption` (REST)

### Logs & Remove
```bash
sls logs -f graphql -t
sls remove --stage dev --region eu-west-1
```

---

## 🔌 Endpoints & Examples

### GraphQL (POST `/graphql`)
**Example query – block energy consumption:**
```graphql
query {
  blockEnergy(hash: "00000000000000000007d0...") {
    blockHash
    totalEnergyKwh
    transactions {
      hash
      size
      energyKwh
    }
  }
}
```

**Example query – daily energy (last 7 days):**
```graphql
query {
  dailyEnergy(days: 7) {
    date
    totalEnergyKwh
  }
}
```

**cURL:**
```bash
curl -X POST "$BASE_URL/graphql"   -H "Content-Type: application/json"   -d '{"query":"query { dailyEnergy(days: 7) { date totalEnergyKwh } }"}'
```

### REST (POST `/calculateSingleDayEnergyConsumption`)
This endpoint calculates the total energy consumption for a **single day**.

**Request body (example):**
```json
{
  "date": "2024-03-21"
}
```

**cURL:**
```bash
curl -X POST "$BASE_URL/calculateSingleDayEnergyConsumption"   -H "Content-Type: application/json"   -d '{"date":"2024-03-21"}'
```

## 🧰 Development Notes

- **Rate limiting:** Blockchain.com may rate-limit; consider in-memory caching or batching (e.g., cache by block hash / tx hash).
- **Timeouts & memory:** Current Lambda config allows up to **300s** timeout and **256 MB** memory; adjust per workload.
- **CORS:** If calling from browsers, enable CORS on `httpApi` as needed.
- **Runtime:** Uses `nodejs16.x` (ensure your AWS account supports it in the chosen region).

