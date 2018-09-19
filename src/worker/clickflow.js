import htmlExtractor from './html-extractor'

const mockApiCall = {
  experiments: [{
    rules: [{
      name: 'page_title',
      location: 'header',
      action: 'rewrite',
      value: 'OLD {{page_title}} NEW TITLE',
    }, {
      name: 'h1',
      location: 'body',
      action: 'rewrite',
      value: 'NEW H1 TITLE',
    }]
  }]
}

export default {
  getRules: (url) => {
    // TODO: ADD API CALL TO CLICKFLOW HERE
    // GET: "api/v1/cdn/webpage_opportunities/page_rules"
    // PARAMS: { url: url }
    // RESPONSE:
    // {
    //   experiments: [{ rules: [] }]
    // }
    return mockApiCall[0].rules
  },

  async enhance(url, html) {
    const rules = this.getRules(url)

    if (!rules.length) {
      return html
    }

    return htmlExtractor.replace(html, rules)
  }
}
