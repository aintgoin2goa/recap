if "%1" == "\d" (
	node --debug-brk ./node_modules/jasmine-node/lib/jasmine-node/cli.js --captureExceptions test/tempdir.spec.js
) else (
	node ./node_modules/jasmine-node/lib/jasmine-node/cli.js --captureExceptions test/tempdir.spec.js
)
