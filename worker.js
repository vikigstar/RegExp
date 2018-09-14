import clickflow from './src/worker/clickflow'

addEventListener('fetch', event => {
  event.passThroughOnException()

  event.respondWith(fetchAndModify(event.request))
})

async function fetchAndModify(request) {
  const response = await fetch(request)
  const responseBody = await response.text()
  const html = await clickflow.enhance(request.url, responseBody)

  return new Response(html, {
    headers: response.headers
  })
}
