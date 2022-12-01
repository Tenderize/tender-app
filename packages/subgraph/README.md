## @project/subgraph

The Graph is a tool for for indexing events emitted on the Ethereum blockchain. It provides you with an easy-to-use GraphQL API.

## Available Scripts

In the project directory, you can run:

### Subgraph

#### `yarn prepare:[network]`

Generate subgraph manifest for the provided network from a pre-made template. This links the necessary contract addresses and starting blocks. E.g. for rinkeby: `yarn prepare:rinkeby`

#### `yarn codegen`

Generates AssemblyScript types for smart contract ABIs and the subgraph schema.

#### `yarn build`

Compiles the subgraph to WebAssembly.

#### `yarn auth`

Before deploying your subgraph, you need to sign up on the
[Graph Explorer](https://thegraph.com/explorer/). There, you will be given an access token. Drop it in the command
below:

```sh
GRAPH_ACCESS_TOKEN=your-access-token-here yarn subgraph:auth
```

#### `yarn deploy`

Deploys the subgraph to the official Graph Node.<br/>

Replace `paulrberg/create-eth-app` in the package.json script with your subgraph's name.

You may also want to [read more about the hosted service](https://thegraph.com/docs/quick-start#hosted-service).

## Deploy Subgraph Locally

1. Install [Docker](https://docs.docker.com) and [Docker Compose](https://docs.docker.com/compose/install/)
2. Inside `docker-compose.yml`, set the `ethereum` value under the `environment` section to an archive node that has tracing enabled. If you don't have access to an archive node we recommend using [Alchemy](https://alchemyapi.io/).
3. In the root of this project run `docker-compose up`. This command will look for the `docker-compose.yml` file and automatically provision a server with rust, postgres, and ipfs, and spin up a graph node with a GraphiQL interface at `http://127.0.0.1:8000/`.

4. Run `yarn create:local` to create the subgraph
5. Run `yarn deploy:local` to deploy it

After downloading the latest blocks from Ethereum, you should begin to see smart contract events flying in. Open a GraphiQL browser at
localhost:8000 to query the Graph Node.s

## Common Errors

### Failed to Compile

> ✖ Failed to compile subgraph: Failed to compile data source mapping: Import file 'src/types/schema.ts' not found.
> Error: Failed to compile data source mapping: Import file 'src/types/schema.ts' not found.

Run the `yarn subgraph` and this error will go away.

### No Access Token

> ✖ No access token provided

Make sure that you followed the instructions listed above for [yarn auth](#yarn-auth).

### Failed to Deploy

> ✖ Failed to deploy to Graph node <https://api.thegraph.com/deploy/>: Invalid account name or access token

Make sure that you:

1. Signed up on the [Graph Explorer](https://thegraph.com/explorer)
2. Followed the instructions listed above for [yarn auth](#yarn-auth)
3. Replaced `paulrberg/create-eth-app` with your subgraph's name
