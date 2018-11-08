import cheerio from "cheerio"

/**
 * Format double braced template string
 * @param {string} name
 * @returns {string}
 */
const toMethodName = (str = "") => str.replace(/_\w/g, m => m[1].toUpperCase())

export default {
  /**
   * parses HTML and extracts all the possible variables for use in rules
   * @param {string} html
   * @returns {object}
   */
  parse(html) {
    const $ = cheerio.load(html)
    // const attrs = {
    //   page_title: this.getPageTitle($),
    //   h1: this.getH1($)
    // }

    // $('meta').each(function (i, elem) {
    //   const content = $(this).attr('content')
    //   const name = $(this).attr('name') || $(this).attr('property')
    //   attrs['meta_' + name] = content
    // })

    return attrs
  },

  getVariables($) {
    const attrs = {
      page_title: this.getPageTitle($),
      h1: this.getH1($),
    }

    $("meta").each(function(i, elem) {
      const content = $(this).attr("content")
      const name = $(this).attr("name") || $(this).attr("property")
      attrs[`meta_${name}`] = content
    })

    return attrs
  },

  replace(html, rules = []) {
    const $ = cheerio.load(html)
    const variables = this.getVariables($)

    $("meta").each(function(i, elem) {
      const content = $(this).attr("content")
      const name = $(this).attr("name") || $(this).attr("property")
      variables[`meta_${name}`] = content
    })

    rules.forEach(rule => {
      try {
        console.log("[INFO] html-extractor.replace applying rule:", rule)
        this.applyRule($, variables, rule)
      } catch (err) {
        // do nothing
      }
    })

    return $.html()
  },

  replaceRule(html, rule = {}) {
    const $ = cheerio.load(html)
    const variables = this.parse(html)

    this.applyRule($, variables, rule)
    return this.getValue($, rule.name)
  },

  getCurrentValue(html, key) {
    const $ = cheerio.load(html)

    return this.getValue($, key)
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
    const variablesInString = value.match(new RegExp("{{(.*?)}}", "ig"))

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
    const variableName = variable.replace(/{{|}}/g, "")
    const variableValue = variables[variableName]
    const regexp = new RegExp(`{{${variableName}}}`, "ig")

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
    const prefix = (name || "").split("_")[0]

    switch (name) {
      case "page_title":
        return this.getPageTitle($)
      case "h1":
        return this.getH1($)
      default:
        const value = (name || "").split("_")[1]
        if (prefix === "meta") {
          return this.getMetaByProperty($, value)
        }
    }
  },

  getH1($) {
    return $("h1")
      .first()
      .text()
  },

  getPageTitle($) {
    return ($("title").text() || "").trim()
  },

  getMetaByProperty($, property) {
    return $(`meta[name="${property}"]`)
      .first()
      .attr("content")
  },

  setMetaByProperty($, property, content) {
    return $(`meta[name="${property}"]`)
      .first()
      .attr("content", content)
  },

  setPageTitle($, value) {
    $("title").text(value)
  },

  setH1($, value) {
    return $("h1")
      .first()
      .text(value)
  },

  // -------------------------------------------------------------
  // UTILS
  // -------------------------------------------------------------

  // Checks to make sure the current rule value is valid and the
  // variables were properly replaced
  validateRuleValue(html, rule) {
    try {
      this.replaceRule(html, rule)
      return true
    } catch (err) {
      return false
    }
  },

  isValidRule(rule) {
    if (rule.name && rule.action && rule.location) {
      return true
    }

    return false
  },

  // if the rule still has template variables after it's been replaced, it's
  // broken and we shouldn't apply it to the template
  isInvalidValue(value) {
    return (value || "").search("{{") !== -1
  },

  isInvalidValueRaise(value) {
    if (this.isInvalidValue(value)) {
      throw new Error(`Variable ${value} wasn't replaced`)
    }
  },

  applyRule($, variables, rule) {
    const method = toMethodName(`${rule.name}_${rule.action}_rule`)

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
    this.isInvalidValueRaise(value)
    this.setPageTitle($, value)
  },

  metaDescriptionRewriteRule($, variables, rule) {
    const value = this.replaceTemplateString(rule.value, variables)
    this.isInvalidValueRaise(value)
    this.setMetaByProperty($, "description", value)
  },

  metaKeywordsRewriteRule($, variables, rule) {
    const value = this.replaceTemplateString(rule.value, variables)
    this.isInvalidValueRaise(value)
    this.setMetaByProperty($, "keywords", value)
  },

  // -------------------------------------------------------------
  // BODY
  // -------------------------------------------------------------

  h1RewriteRule($, variables, rule) {
    const value = this.replaceTemplateString(rule.value, variables)
    this.isInvalidValueRaise(value)
    this.setH1($, value)
  },
}
