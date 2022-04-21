#!/usr/bin/env ts-node
import createTestCafe from 'testcafe';

const defaultWindowSize = { width: 1280, height: 1024 };

(async () => {
  const config: Partial<TestCafeConfigurationOptions> = {
    screenshots: {
      path: 'artifacts/screenshots',
      takeOnFails: true,
      pathPattern: '${FIXTURE}.${TEST}.${TEST_ID}.${RUN_ID}.${FILE_INDEX}'
    },
    compilerOptions: {
      typescript: {
        customCompilerModulePath: './node_modules/typescript',
        configPath: 'tsconfig.json'
      }
    },
    cache: false
  };

  const testcafe = await createTestCafe(config);
  try {
    const runOptions: Partial<RunOptions> = {
      skipJsErrors: true,
      assertionTimeout: 10000,
      selectorTimeout: 30000,
      pageLoadTimeout: 30000,
      quarantineMode: {
        attemptLimit: '5',
        successThreshold: '1'
      }
    };
    const runner = testcafe.createRunner();
    await runner
      .src('./dist/tests/(percy|types.d).js')
      .browsers(`chrome:headless --window-size=${defaultWindowSize.width},${defaultWindowSize.height}`)
      .concurrency(3)
      .reporter(['spec'])
      .run(runOptions);
  } finally {
    setTimeout(() => {
      console.log('Forcibly terminating process');
      process.exit();
    }, 60000);
    console.log('await testcafe.close()');
    await testcafe.close();
    console.log('await testcafe.close() - done');
  }
})();
