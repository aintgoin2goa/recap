if "%1" == "\d" (
	node --debug-brk ./node_modules/jasmine-node/lib/jasmine-node/cli.js --captureExceptions test/
) else (
	node ./node_modules/jasmine-node/lib/jasmine-node/cli.js --captureExceptions test/
)
