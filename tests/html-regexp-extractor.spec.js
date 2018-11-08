import assert from "assert"
import {
  readFixture
} from "./test-utils"
import htmlExtractor from "../workers/html-regexp-extractor"
describe("htmlExtractor", () => {
  it("should return the page title and meta information", () => {

    const str = readFixture("test-page.html")

    console.time('regexp')
    const regex = /<meta[^>]+/gm;
    const regex2 = /([a-zA-Z]+)\=\"([^\"]+)/gm;
    let m;

    const attrs = {}

    // getting all the meta tags
    while ((m = regex.exec(str)) !== null) {
      m.forEach((match, groupIndex) => {
        let m2
        while ((m2 = regex2.exec(match)) !== null) {
          if (m2.length == 3) {
            var key = "meta_" + m2[1]
            var value = m2[2]
            attrs[key] = value;
          }
        };
      });
    };
    // console.log(attrs);
    console.timeEnd('regexp')

    // getting H1
    let h1;
    h1 = /<[hH]1>([^<]+)/gm.exec(str)
    console.log('h1', h1[1])

    // setting h1
    console.log('<div><h1>This</h1></div>'.replace(new RegExp(/<[hH]1>[^<]+<\/[hH]1>/gm), "That"))

  })

  it("should return the page title and meta information", () => {
    var cheerio = require('cheerio')
    var Parser = require('html-dom-parser')
    var htmlparser = require("htmlparser2");
    var parse5 = require('parse5');
    var htmlparser = require("htmlparser2");
    var HTMLParser = require('fast-html-parser');
    var HtmlParseStringify = require('html-parse-stringify')

    const rawHtml = readFixture("test-page.html")

    console.time('html-parse-stringify')
    var ast = HtmlParseStringify.parse(rawHtml, {
      ignoreWhitespace: true
    });
    HtmlParseStringify.stringify(ast)
    console.timeEnd('html-parse-stringify')

    console.time('fast-html-parser')
    var root = HTMLParser.parse(rawHtml);
    console.timeEnd('fast-html-parser')

    console.time('parse5')
    var document = parse5.parse(rawHtml)
    console.timeEnd('parse5')

    console.time('cheerio')
    var document = cheerio.load(rawHtml)
    console.timeEnd('cheerio')

    console.time('htmlparser2')
    var handler = new htmlparser.DomHandler(function (error, dom) {});
    var parser = new htmlparser.Parser(handler);
    parser.write(rawHtml);
    parser.end();
    console.timeEnd('htmlparser2')
  })

  describe("RegExp", () => {

    it("should return variables from the page", () => {
      const html = readFixture("test-page.html")
      const variables = htmlExtractor.parse(html)
      var vars = {"page_title":"14 Seater Dining Tables | Shop Dining Tables That Seat 14+ People","h1":"Extendable Dining Tables for 14 or More","viewport":"width=device-width,initial-scale=1","theme-color":"#2ca6bc","referrer":"origin","description":"Looking for the perfect hardwood table that can extend to seat 14 or more people? We carry Amish-made dining tables that can comfortably seat everyone at your next gathering. Shop now.","twitter:site":"@amishhome","twitter:card":"summary_large_image","twitter:title":"14 Seater Dining Tables | Shop Dining Tables That Seat 14+ People","twitter:description":"Looking for the perfect hardwood table that can extend to seat 14 or more people? We carry Amish-made dining tables that can comfortably seat everyone at your next gathering. Shop now.","p:domain_verify":"018208c28be8826181503034907cdfe3","google-site-verification":"f2KMcDq4cJYUywO1WcG7h9BHPuPhvtHbR-6NAkmkZuQ","shopify-digital-wallet":"/8093571/digital_wallets/dialog","shopify-checkout-api-token":"5bbb7241062678c0732e511451ea0d3a"};

      assert.equal(JSON.stringify(variables), JSON.stringify(vars));
    })

    it("should get the contents of the page <title> tag", () => {
      const html = readFixture("test-page.html")
      const title = htmlExtractor.getTitle(html)
      

      assert.equal(title, '14 Seater Dining Tables | Shop Dining Tables That Seat 14+ People');
    })

    it("should set the page title in the HTML", () => {
      const html = readFixture("test-page.html")
      var testTitle = "Test Title";
      var modified_html = htmlExtractor.setTitle(html,testTitle);
      var new_title = htmlExtractor.getTitle(modified_html);
      // const variables = Parser(html);

      assert.equal(new_title, testTitle);
    })

    it("should return the text of the H1 tag", () => {
      const html = readFixture("test-page.html")
      var h1_text = htmlExtractor.getH1(html);
      

      assert.equal(h1_text, 'Extendable Dining Tables for 14 or More');
    })

    it("should set the contents of the H1 tag", () => {
      const html = readFixture("test-page.html")
      var testH1 = "Test H1";
      var modified_html = htmlExtractor.setH1(html,testH1);
      var new_H1 = htmlExtractor.getH1(modified_html);
      

      assert.equal(new_H1, testH1);
    })

    it("should return the meta description content value", () => {
      const html = readFixture("test-page.html")
      var description = htmlExtractor.getMetaTag(html,"description");
      

      assert.equal(description, 'Looking for the perfect hardwood table that can extend to seat 14 or more people? We carry Amish-made dining tables that can comfortably seat everyone at your next gathering. Shop now.');
    })

    it("should set the meta description content value", () => {
      const html = readFixture("test-page.html")
      var testDesc = "Test description";
      var modified_html = htmlExtractor.setMetaTag(html,"description",testDesc);
      var new_Desc = htmlExtractor.getMetaTag(modified_html,"description");
      

      assert.equal(new_Desc, testDesc);
    })
  })
})
