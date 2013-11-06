if "%1" == "debug" (
	node --debug-brk ./node_modules/jasmine-node/lib/jasmine-node/cli.js --captureExceptions test/fileSystemDestination.spec.js
) else (
	node ./node_modules/jasmine-node/lib/jasmine-node/cli.js --captureExceptions test/fileSystemDestination.spec.js
)
