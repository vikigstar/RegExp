import clickflow from './src/worker/clickflow'

/*
 * Get the website id by connecting with the installed cloudflare app
 * implementation: Todo
 */
function getWebsiteId() {
  return 1
}

addEventListener('fetch', event => {
  event.passThroughOnException()

  event.respondWith(fetchAndModify(event.request))
})

async function fetchAndModify(request) {
  const response = await fetch(request)
  const responseBody = await response.text()
  const html = await clickflow.enhance(getWebsiteId(), request.url, responseBody)

  return new Response(html, {
    headers: response.headers
  })
}
