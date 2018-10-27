# Node + Express + Typescript

## Requirements

- ___Node.js___ version 8+ with ___npm___ (mandatory)
- ___Git___ (mandatory)

## Recommendations

- ___Yarn___ - A better package manager alternative
- ___Visual Studio Code___ - A great editor, especially for `Javascript | Typescript`

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

4. Add your `.ts` files into the `src` directory

## Start working !

When saving a file :  

1. The `.ts` files will be transpiled in `.js` files and output in the `dist` directory
2. The server will automatically restart

### Adding routes

1. Create a new `.ts` file in the `routes` folder.  
The file _MUST_ export an Express Router
2. Add the router inside the `router.ts`

That's it ! (^_^)

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
