const cheerio = require('cheerio')

/**
 * Format double braced template string
 * @param {string} name
 * @returns {string}
 */
const toMethodName = (str = '') => {
  return str.replace(/_\w/g, m => m[1].toUpperCase())
}

export default {
  /**
   * parses HTML and extracts all the possible variables for use in rules
   * @param {string} html
   * @returns {object}
   */
  parse(html) {
    const $ = cheerio.load(html)

    const attrs = {
      page_title: this.getPageTitle($),
      h1: this.getH1($),
    }

    $('meta').each(function (i, elem) {
      const content = $(this).attr('content')
      const name = $(this).attr('name') || $(this).attr('property')
      attrs['meta_' + name] = content
    })

    return attrs
  },

  replace(html, rules = []) {
    const $ = cheerio.load(html)
    const variables = this.parse(html)
    rules.forEach(rule => this.applyRule($, variables, rule))
    return $.html()
  },

  replaceRule(html, rule = {}) {
    const $ = cheerio.load(html)
    const variables = this.parse(html)
    this.applyRule($, variables, rule)

    return this.getValue($, rule.name)
  },

  // --------------------------------------------
  // PRIVATE
  // --------------------------------------------

  /**
   * Replaces template vars with actual values extracted from the DOM
   * @param {string} value
   * @param { array } variables
   * @returns {string}
   */
  replaceTemplateString(value, variables) {
    // matches all variables within the string "{{test}} is the {{best}}"
    // returns ["{{test}}", "{{best}}"]
    const variablesInString = value.match(new RegExp('{{(.*?)}}', 'ig'))

    if (!variablesInString) {
      return value
    }

    variablesInString.forEach(variable => {
      value = this.replaceTemplateVariable(value, variable, variables)
    })

    return value
  },

  /**
   * Replaces a single template variable {{meta_description}} with "new_value"
   * @param {string} value
   * @param { string } variable
   * @param { array } variables
   * @returns {string}
   */
  replaceTemplateVariable(value, variable, variables) {
    // returns just the name without any curly braces
    const variableName = variable.replace(/{{|}}/g, '')
    const variableValue = variables[variableName]
    const regexp = new RegExp('{{' + variableName + '}}', 'ig')

    if (!variableValue) {
      return value
    }

    return value.replace(regexp, variableValue)
  },

  /**
   * An abstract method to get any value on the page, by it's key
   * @param {string} value
   * @param { string } variable
   * @param { array } variables
   * @returns {string}
   */
  getValue($, name) {
    const prefix = (name || '').split('_')[0]

    switch (name) {
      case 'page_title':
        return this.getPageTitle($)
      case 'h1':
        return this.getH1($)
      default:
        const value = (name || '').split('_')[1]
        if (prefix === 'meta') {
          return this.getMetaByProperty($, value)
        }
    }
  },

  getH1($) {
    return $('h1')
      .first()
      .text()
  },

  getPageTitle($) {
    return ($('title').text() || '').trim()
  },

  getMetaByProperty($, property) {
    return $('meta[name="' + property + '"]')
      .first()
      .attr('content')
  },

  setMetaByProperty($, property, content) {
    return $('meta[name="' + property + '"]')
      .first()
      .attr('content', content)
  },

  setPageTitle($, value) {
    $('title').text(value)
  },

  setH1($, value) {
    return $('h1')
      .first()
      .text(value)
  },

  // -------------------------------------------------------------
  // UTILS
  // -------------------------------------------------------------

  isValidRule(rule) {
    if (rule.name && rule.action && rule.location) {
      return true
    }

    return false
  },

  applyRule($, variables, rule) {
    const method = toMethodName(rule.name + '_' + rule.action + '_rule')

    const func = this[method]

    if (!func) {
      // eslint-disable-next-line no-console
      console.log(`[ERROR] Cant find ${method} in applyRule`)
      return false
    }

    func.apply(this, [$, variables, rule])
  },

  // -------------------------------------------------------------
  // RULES
  // -------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------

  pageTitleRewriteRule($, variables, rule) {
    const value = this.replaceTemplateString(rule.value, variables)
    this.setPageTitle($, value)
  },

  metaDescriptionRewriteRule($, variables, rule) {
    const value = this.replaceTemplateString(rule.value, variables)
    this.setMetaByProperty($, 'description', value)
  },

  metaKeywordsRewriteRule($, variables, rule) {
    const value = this.replaceTemplateString(rule.value, variables)
    this.setMetaByProperty($, 'keywords', value)
  },

  // -------------------------------------------------------------
  // BODY
  // -------------------------------------------------------------

  h1RewriteRule($, variables, rule) {
    const value = this.replaceTemplateString(rule.value, variables)
    this.setH1($, value)
  },
}
