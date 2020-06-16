# Sobre el curso de Solidity
Esta práctica es para el curso de Programación con Solidity de Coding Bootcamps: http://coding-bootcamps.com/es/ 
Para más información sobre este curso, visite el siguiente enlace: https://learn.coding-bootcamps.com/p/programacion-de-solidity-en-espanol 

Para más información sobre cursos de Blockchain en Español, visite el siguiente enlace: https://learn.coding-bootcamps.com/p/coding-bootcamps-espanol 


# Voting_DApp
 ## Coding Bootcamps - Voting_DApp

Voting DApp permitirá a los usuarios participar en una votación para seleccionar el candidato que quierán utilizando token.
Los usuarios podrán comprar tokens con ether y usarlos para votar a su candidato seleccionado.

## Fases

1. Preparación del entorno de trabajo y creación del Smart Contract. 
2. Desplegamos el Smart Contract en Remix y Truffle e interactuamos con él.
3. Testeando el Smart Contract.
4. Front end e interfaz. 
5. Desplegando el Smart Contract en una testnet de Ethereum. 


## Descripción Voting DApp

La organización (propietaria del smart contract) desplegará un smart contract con todos los candidatos disponibles.
Los usuarios/votantes podrán comprar tokens usando ether. Podrán usar estos tokens para votar a su candidatos seleccionado.
El propietario del smart contract podrá transferir los fondos de ether que almacena el smart contract a una dirección de Ethereum. 
La información de la votación se puede consultar en cualquier momento por cualquier usuario.


## Requisitos del entorno de trabajo

- Node.js instalado: https://nodejs.org/es/download/
- Ganache instalado: https://www.trufflesuite.com/ganache 
- Truffle instalado: https://www.trufflesuite.com/docs/truffle/getting-started/installation `npm install -g truffle`
- Extensión de Solidity de Visual Studio Code: https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity 
- Metamask instalado en navegador: https://metamask.io/ 
- Lite Server: https://www.npmjs.com/package/lite-server


## Primeros pasos

1. Crear carpeta directorio de nuestro proyecto: Voting_DApp
2. Dentro de la carpeta de nuestro proyecto, ejecutamos: `truffle init` e indicamos Y (Yes). Se nos crea la estructura de carpetas: contracts, migrations, test y el archivo truffle-config.js
3. Ejecutamos `npm init`, se nos crea el archivo package.json. 
4. Instalamos Lite Server: `npm install lite-server --save-dev`. En el archivo package.json, apartado scripts, añadimos: `"dev": "lite_server"`
5. En nuestra carpeta del proyecto creamos el archivo: bs-config.json, introducimos el siguiente código, para configurar Lite Server:
`{
    "server": {
      "baseDir": ["./src", "./build/contracts"]
    }
  }`
6. Instalar Truffle Contract: `npm install @truffle/contract`
7. Web3.js instalado: https://github.com/ethereum/web3.js/ `npm install web3`
8. Instalar Truffle hdwaller provider: `npm install truffle-hdwallet-provider`


## Creación del Smart Contract

1. Accedemos a la carpeta contracts y creamos el archivo Voting.sol. El código del Smart Contract se puede encontrar en: https://github.com/jordiguirao92/Voting_DApp/blob/master/contracts/Voting.sol
2. Compilamos el smart contract. En la carpeta de nuestro proyecto ejecutamos el comando: `truffle compile`. Se nos creará la carpeta build.


## Desplegando e interactuando con el Smart Contract en Remix

1. Abrimos Remix y creamos un nuevo archivo de Solidity. 
2. Copiamos el código de nuestro contrato. 
3. Compilamos el contrato. 
4. Desplegamos el contrato. 
5. Interactuamos desde Remix con el contrato.


## Desplegando el Smart Contract con Truffle 

1. En la carpeta migrations, creamos el archivo: 2_Voting_migration.js. El código se encuentra en: https://github.com/jordiguirao92/Voting_DApp/blob/master/migrations/2_Voting_migration.js
2. Modificamos el archivo truffle-config.js. Donde configuraremos nuestra red local de Ethereum para el despliegue del contrato. El código está: https://github.com/jordiguirao92/Voting_DApp/blob/master/truffle-config.js 
3. Iniciamos Ganache y comprobamos que los datos RPC SERVER sean los mismos que están en nuestro archivo truffle-config.js.
4. En la carpeta raiz de nuestro proyecto ejecutamos el comando: `truffle migrate --network development`, se iniciará el despligue de nuestro smart contract. 


## Interactuamos con nuestro Smart Contract con Truffle Console

1. En la carpeta raiz de nuestro proyecto, ejecutamos `truffle console`, para acceder a la consola de truffle y poder interactuar con nuestro smart contract. Ejecutamos los siguientes comandos: 

### Dirección del contrato:

`voter = await Voting.deployed()`

`voter.address`

### Consultando propietario del contrato:

`ownerAddress = await voter.get_owner()`

`ownerAddress`

### Consultando el total de tokens:

`voterTotalTokens = await voter.totalTokens.call()`

`voterTotalTokens`

`voterTotalTokens.toString()`

### Comprando tokens:

`tokensBuy = await voter.buy({value:2000000000000000000})`

`tokensBuy`

### Consultando el balance de tokens:
`tokensBalance = await voter.balanceTokens.call()`

`tokensBalance`

`tokensBalance.toString()`



## Testing Voting DApp con Truffle

En la carpeta test, cremos el archivo Voting_test.js, donde escribiremos los diferentes test de nuestra DApp.
El código de los test está en: https://github.com/jordiguirao92/Voting_DApp/blob/master/test/Voting_test.js

Para comprobar nuestros test, ejecutamos: `truffle test`
Podremos ver en la terminal el resultado de nuestros test. 



## Front End e Interfaz

Creamos la carpeta src dentro de la carpeta de nuestro proyecto. Dentro de la carpeta src, creamos la carpeta js y el archivo index.html.

#### index.html  

En este archivo crearemos la interfaz gráfica y visual de nuestra DApp. 
El código está: https://github.com/jordiguirao92/Voting_DApp/blob/master/src/index.html 


#### js

Contiene los archivos: 

- app.js: En este archivo crearemos el código necesario para poder conectar con nuestro smart contract. El código está: https://github.com/jordiguirao92/Voting_DApp/blob/master/src/js/app.js 
- truffle-contract.js:El código está: https://github.com/jordiguirao92/Voting_DApp/blob/master/src/js/truffle-contract.js 
- web3.min-js: El código está: https://github.com/jordiguirao92/Voting_DApp/blob/master/src/js/web3.min.js 



## Desplegando Smart Contract en una testnet de Ethereum

1. Acceder a https://infura.io/ y creamos un nuevo proyecto. 
2. Actualizamos el archivo truffle-config.js. Añadimos la configuración de la red RINKEBY, indicamos las características de nuestra conexión a Infura y indicamos las palabras clave mnemonic de nuestra wallet. 
3. Desplegamos el smart contract en la red de Rinkeby. `truffle migrate --network rinkeby`.

Si queremos resetear el contrato desplegado utilizar el comando: `truffle migrate --network rinkeby --reset`



## Ejecutamos nuestra DApp

1. Tener nuestro Smart Contract desplegado. `truffle migrate`. Indicar que network queremos utilizar `truffle migrate --network nombredelared`
2. Inicializar nuestra DApp, ejecutando el comando: `npm run dev`.
3. Conectar Metamask a la red donde está desplegado nuestro Smart Contract. 
4. Ya tenemos nuestra DApp preparada para interactuar con ella. 