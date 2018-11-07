import clickflow from './src/worker/clickflow'

// HARD CODED FOR TESTING PURPOSES
// const websiteId = 634 // clickflow.com
const websiteId = 108 // amishtables.com
const token = 'yTtAVzzqkzJ5_xC4f6_1RWyThKxg4KMncpKVyaK2tDV5JY2wTQ'

function getWebsiteId() {
  return websiteId
}

function getAuthToken() {
  return token
}

addEventListener('fetch', event => {
  // event.passThroughOnException()
  event.respondWith(fetchAndModify(event.request))
})

async function fetchAndModify(request) {
  try {
    // console.log(INSTALL_OPTIONS, INSTALL_PRODUCT, INSTALL_ID)

    const defaultResponse = await fetch(request)
    const response = new Response(defaultResponse.body, defaultResponse)
    const contentType = response.headers.get("content-type") || ''
    const isHtml = contentType.indexOf("text/html") !== -1

    response.headers.set('X-Clickflow', 'true')

    if (!isHtml) {
      return response
    }

    console.log('[INFO] fetching info for ', request.url);

    const responseBody = await response.text()
    const html = await clickflow.enhance(getWebsiteId(), getAuthToken(), request.url, responseBody)

    return new Response(html, {
      headers: response.headers
    })
  } catch (e) {
    return new Response(e.stack)
  }
}
