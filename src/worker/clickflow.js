import htmlExtractor from './html-extractor'

const clickflowHost = 'https://clickflow-api.ngrok.io'
const fetchRuleApiUrl = `${clickflowHost}/api/v1/cdn/page_rules`

export default {
  async getRules(siteId, token, url) {
    const encodedUrl = encodeURIComponent(url)
    const pageRuleUrl = `${fetchRuleApiUrl}.json?website_id=${siteId}&url=${encodedUrl}`
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }

    var request = new Request(pageRuleUrl, {
      headers: new Headers(headers)
    });

    try {
      const response = await fetch(request)
      const responseBody = await response.json()
      const rulesArr = responseBody.experiments
      let rules = []

      if (!rulesArr.length) {
        return []
      }

      rulesArr.forEach(_rules => {
        rules = [...rules, ..._rules.rules]
      })

      return rules
    } catch (e) {
      console.log('[ERROR] clickflow.getRules', e)
      return []
    }
  },

  async enhance(siteId, token, url, responseBody) {
    const rules = await this.getRules(siteId, token, url)

    if (!rules.length) {
      console.log('[INFO] No rules found for: ', url)
      return responseBody
    }

    try {
      return htmlExtractor.replace(responseBody, rules)
    } catch (e) {
      return e
    }
  }
}
