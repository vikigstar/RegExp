import clickflow from "./clickflow"

const SITE_ID = 108
const AUTH_TOKEN = "yTtAVzzqkzJ5_xC4f6_1RWyThKxg4KMncpKVyaK2tDV5JY2wTQ"

addEventListener('fetch', event => {
  // event.passThroughOnException()
  event.respondWith(fetchAndModify(event))
})

function isCloudflareApp() {
  return typeof INSTALL_OPTIONS !== "undefined"
}

function getSettings() {
  if (isCloudflareApp()) {
    console.log(INSTALL_OPTIONS)
    return {
      siteId: INSTALL_OPTIONS.site_id,
      token: INSTALL_OPTIONS.auth_token,
    }
  }

  return {
    siteId: SITE_ID,
    token: AUTH_TOKEN,
  }
}

async function fetchAndModify(event) {
  try {
    // console.log(INSTALL_OPTIONS, INSTALL_PRODUCT, INSTALL_ID)
    const request = await fetch(event.request)
    const response = new Response(request.body, request)
    const contentType = response.headers.get("content-type") || ""
    const isHtml = contentType.indexOf("text/html") !== -1
    const settings = getSettings()

    // add in a special header so we can confirm our worker is running
    response.headers.set("X-Clickflow", "true")

    // this script runs for all files including images.
    // We only care about text/html
    if (!isHtml) {
      return response
    }

    console.log("[INFO] Fetching info for ", request.url)

    const responseHtml = await response.text()
    const result = await clickflow.enhance(
      settings.siteId,
      settings.token,
      request.url,
      responseHtml,
    )

    console.log("[INFO] Success! Returning modified HTML")

    if (result.errors.length) {
      console.log("[ERROR] there was an error with clickflow.enhance", result.errors[0], result.errors[0].stack)
      response.headers.set("X-Clickflow-Error-Count", result.errors.length)
      response.headers.set("X-Clickflow-Error-Message", result.errors[0].message)
    }

    return new Response(result.html, response)
  } catch (err) {
    return new Response(err.stack || err)
  }
}
