import assert from 'assert'
import cheerio from 'cheerio'
import sinon from 'sinon'

import {
  readFixture
} from './test-utils'
import clickflow from '../src/worker/clickflow'

describe('clickflow', function () {
  describe('enchance()', function () {
    it('should return true', async function () {
      const html = readFixture('test-page.html')
      const h1 = 'NEW H1 DUDE.'
      const url = 'https://www.good.com'

      sinon.stub(clickflow, 'getRules').callsFake(url => {
        return [{
          name: 'h1',
          location: 'body',
          action: 'rewrite',
          value: h1,
        }]
      })

      const actual = await clickflow.enhance(url, html)
      const $ = cheerio.load(actual)

      assert.equal(h1, $('h1').first().text());
    });
  })
});
