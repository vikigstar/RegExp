import htmlExtractor from './html-extractor'

const mockApiCall = [{
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

export default {
  getRules: (url) => {
    // TODO: ADD API CALL TO CLICKFLOW HERE
    return mockApiCall
  },

  async enhance(url, responseBody) {
    const rules = this.getRules(url)
    return htmlExtractor.replace(responseBody, rules)
  }
}
