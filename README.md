# queue-to-do

NPM build script to compile TSX & JSX

> npm run-script build:js

Babel JSX Preprocessor

> npx babel --watch jsx --out-dir ./src/js --extensions ".js,.jsx,.ts,.tsx"

Old command : Previously encountered errors with async/await usage

 > npx babel --watch jsx --out-dir ./src/js --presets react-app/prod
 
 JSX & JS files in jsx, which will be processed into src\js

 Troubleshooting
 * Cannot find module napi-: [Stackoverflow](https://stackoverflow.com/questions/65754113/cannot-find-module-e-node-modules-sqlite3-lib-binding-napi-v6-win32-x64-node-s)