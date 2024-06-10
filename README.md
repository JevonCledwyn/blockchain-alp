## Prerequisites
Run `setup.sh`

## Begin
Run `npx hardhat node`

## exec if theres change on smartcontract
Run `npx hardhat compile`

Run `npx hardhat run scripts/deploy.cjs --network localhost`

## Test
Run `npx hardhat test`

Open new tab, run `node src/js/server.js`/ `npm run start`

Open from browser `localhost:3000`