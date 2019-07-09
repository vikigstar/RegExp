// import htmlExtractor from "./html-extractor"
import {
  parse
} from 'node-html-parser';
const clickflowHost = "https://clickflow-api.ngrok.io"
const fetchRuleApiUrl = `${clickflowHost}/api/v1/cdn/page_rules`

export default {
  async getRules(siteId, token, url) {
    try {
      const encodedUrl = encodeURIComponent(url)
      const pageRuleUrl = `${fetchRuleApiUrl}.json?website_id=${siteId}&url=${encodedUrl}`
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      const request = new Request(pageRuleUrl, {
        headers: new Headers(headers),
      })

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
      console.log("[ERROR] clickflow.getRules", e)
      return []
    }
  },

  async enhance(siteId, token, url, html) {
    const rules = await this.getRules(siteId, token, url)
    const result = {
      html,
      errors: []
    }

    if (!rules.length) {
      console.log("[INFO] No rules found for: ", url)
      return result
    }

    try {
      const root = parse(html)
      const title = root.querySelector('title')
      title.childNodes[0].rawText = 'Here'
      console.log(title, 'good...')
      result.html = root.toString()
      return result
    } catch (err) {
      result.errors = [err.stack || err]
      return result
    }
  },
}
