# Tender-App

This project was bootstrapped with [Create Eth App](https://github.com/paulrberg/create-eth-app).

## HackMoney 2021

### Demo

Live demo available at https://tender-app.vercel.app/ 

[video demo](https://www.youtube.com/watch?v=q8YEaLYKCP4)

### Subgraph

[subgraph](https://thegraph.com/explorer/subgraph/reubenr0d/tenderizersamplegraph?selected=logs)

### Figma

[Figma doc](https://www.figma.com/file/cjn6txX55cEOII83BvzC2M/tenderize?node-id=0%3A1)

### Contracts

#### Whitepaper

[Whitepaper](https://github.com/Tenderize/Whitepaper/blob/main/README.md)

#### Rinkeby

##### Registry

0xef9Edb94bF7Ee9071999089b768db580033A6aAB

###### Livepeer

- BondingManager: 0x1Ea74442e6Da97DB604Cfd147BA142b7f5FC3Cc3
- RoundsManager: 0x3F7476F93F3D07DB2931b90e7ad7cEa433394296
- LivepeerToken: 0xe80110C0a290c493C543148c5445a23D3403a096
- LivepeerTokenFaucet: 0x4868A5e950e386E3d99038B141FcfA53362E67Ba


- TenderFarm: 0xEf078e54495cBa7A7932f1753D4A6A3b806A010D
- TenderToken: 0x6b903e6751e10d9F8AEa932891DED743F2F22616
- Tenderizer: 0x21AbB50cf89Ab2Ccf685b5671C06b5577279CC15
- ESP: 0xfb852b5F27B29394d2b51062BF677C6539279807
- BPOOL: 0x132101F2F131B93cB5AaDe8b6568e431F32F64D7
- Controller: 0x3891FB6b6B145Ad104FE98aC6EFAFc7d8feDD63C
- TokenFaucet: 0x99e3A045Fb28E44d23e1eDBa6ED0d49F4Db38d47

## Project Structure

The default template is a monorepo created with [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

Workspaces makes it possible to setup multiple packages in such a way that we only need to run `yarn install` once to install all of them in
a single pass. Dependencies are hoisted at the root.

```
my-eth-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
└── packages
    ├── contracts
    │   ├── README.json
    │   ├── package.json
    │   └── src
    │       ├── abis
    │       │   ├── erc20.json
    │       │   └── ownable.json
    │       ├── addresses.js
    │       └── index.js
    ├── react-app
    │   ├── README.md
    │   ├── node_modules
    │   ├── package.json
    │   ├── public
    │   │   ├── favicon.ico
    │   │   ├── index.html
    │   │   ├── logo192.png
    │   │   ├── logo512.png
    │   │   ├── manifest.json
    │   │   └── robots.txt
    │   └── src
    │       ├── App.css
    │       ├── App.js
    │       ├── App.test.js
    │       ├── ethereumLogo.svg
    │       ├── index.css
    │       ├── index.js
    │       ├── serviceWorker.js
    │       └── setupTests.js
    └── subgraph
        ├── README.md
        ├── abis
        │   └── erc20.json
        ├── package.json
        ├── schema.graphql
        ├── src
        │   └── mappings
        │       ├── tokens.ts
        │       └── transfers.ts
        └── subgraph.yaml
```

Owing to this dependency on Yarn Workspaces, Create Eth App can't be used with npm.

## Available Scripts

In the project directory, you can run:

### React App

#### `yarn react-app:start`

Runs the React app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

#### `yarn react-app:test`

Runs the React test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

[Read more about testing React.](https://facebook.github.io/create-react-app/docs/running-tests)

#### `yarn react-app:build`

Builds the React app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the React documentation on [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn react-app:eject`

**Note: this is a one-way operation. Once you `react-app:eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` the React app at any time. This command will
remove the single build dependency from your React package.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right
into the `react-app` package so you have full control over them. All of the commands except `react-app:eject` will still work,
but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `react-app:eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Subgraph

The Graph is a tool for for indexing events emitted on the Ethereum blockchain. It provides you with an easy-to-use GraphQL API. <br/>

To learn more, check out the [The Graph documentation](https://thegraph.com/docs).

#### `yarn subgraph:codegen`

Generates AssemblyScript types for smart contract ABIs and the subgraph schema.

#### `yarn subgraph:build`

Compiles the subgraph to WebAssembly.

#### `yarn subgraph:auth`

Before deploying your subgraph, you need to sign up on the
[Graph Explorer](https://thegraph.com/explorer/). There, you will be given an access token. Drop it in the command
below:

```sh
GRAPH_ACCESS_TOKEN=your-access-token-here yarn subgraph:auth
```

#### `yarn subgraph:deploy`

Deploys the subgraph to the official Graph Node.<br/>

Replace `paulrberg/create-eth-app` in the package.json script with your subgraph's name.

You may also want to [read more about the hosted service](https://thegraph.com/docs/quick-start#hosted-service).
