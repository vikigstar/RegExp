import htmlExtractor from './html-extractor'

const clickflowHost = 'http://localhost:5000'
const rulesUrl = 'api/v1/cdn/webpage_opportunities/page_rules'

// const mockApiCall = [{
//   name: 'page_title',
//   location: 'header',
//   action: 'rewrite',
//   value: 'OLD {{page_title}} NEW TITLE',
// }, {
//   name: 'h1',
//   location: 'body',
//   action: 'rewrite',
//   value: 'NEW H1 TITLE',
// }]

export default {
  async getRules(siteId, url) {
    const response = await fetch(`${clickflowHost}/${rulesUrl}?website_id=${siteId}&url=${url}`)
    const responseBody = await response.json()
    const rulesArr = responseBody.experiments
    let rules = []

    rulesArr.forEach(_rules => {
      rules = [...rules, ..._rules.rules]
    })
    return rules
  },

  async enhance(siteId, url, responseBody) {
    const rules = await this.getRules(siteId, url)
    return htmlExtractor.replace(responseBody, rules)
  }
}
