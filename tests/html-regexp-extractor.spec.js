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

  // describe("#parse", () => {
  //   it("should return the page title and meta information", () => {
  //     const rawHtml = readFixture("test-page.html")
  //     console.time('start')
  //     console.timeEnd('start')
  //   })

  //   it("should return the page title and meta information", () => {
  //     const html = readFixture("test-page.html")
  //     const variables = htmlExtractor.parse(html)

  //     const html = Parser(html);

  //     assert.equal(variables.page_title, '14 Seater Dining Tables | Shop Dining Tables That Seat 14+ People')
  //     assert.equal(variables.h1, 'Extendable Dining Tables for 14 or More')
  //   })
  // })
})
