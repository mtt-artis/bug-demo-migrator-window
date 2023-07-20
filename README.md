# reproduce the migration bug on window

cjs = ok
```
// remove "type": "module", in package.json
npm install
npm run migrate:latest:cjs
```

esm = ko
```
npm install
npm run migrate:latest:esm
```
