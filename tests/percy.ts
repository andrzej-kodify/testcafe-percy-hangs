import _percySnapshot from '@percy/testcafe';

fixture('Percy');

test('Test', async (browser) => {
  await browser.navigateTo('https://www.google.com/');
});
