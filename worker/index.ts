export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return Response.json({
        ok: true,
        service: 'english-orbit',
      })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
