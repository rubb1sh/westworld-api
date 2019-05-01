# Node + Express + Typescript

## Requirements

-   **_Node.js_** version 10+ with **_npm_** (mandatory)
-   **_Git_** (mandatory)

## Recommendations

-   **_Yarn_** - An alternative dependencies manager
-   **_Visual Studio Code_** - A popular editor, especially for `Javascript | Typescript`

## Installation

1. Clone the repository

```shell
git clone
```

2. Install the dependencies

```shell
yarn install
```

3. Start your development server

```shell
yarn dev
```

Or with docker

```shell
yarn dockerize
```

The above command will start the server in a docker service (mapped to http://localhost:<SERVER_PORT>)

In this case, you may need to override the default environment variables.
Copy the `.env.dist` template in your custom `.env` file.

```shell
cp .env.dist .env
```

```ini
# .env
NODE_ENV=development
SERVER_PORT=4000
```

4. Add your `.ts` files into the `src` directory

## Start working !

When saving a file :

1. The `.ts` files will be transpiled in `.js` files and output in the `dist` directory
2. The server will automatically restart

### Adding routes

1. Create a new `.ts` file in the `routes` folder.  
   The file _MUST_ export an Express Router
2. Add the router inside the `router.ts`

That's it ! (^\_^)

## Deployment

To run the server :

1. Build the `.js` files

```shell
yarn build
```

2. Start the server

```shell
yarn serve
```
