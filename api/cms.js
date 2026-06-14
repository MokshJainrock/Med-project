// Vercel serverless function: proxies data.cms.gov server-side.
// The browser calls /api/cms?url=<encoded CMS url> on the SAME origin,
// so there's no CORS involved at all. This function fetches CMS and
// returns the JSON.

export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    res.status(400).json({ error: "Missing url parameter" });
    return;
  }

  // Only allow proxying CMS, so this can't be used as an open proxy.
  let host;
  try {
    host = new URL(target).hostname;
  } catch (e) {
    res.status(400).json({ error: "Bad url" });
    return;
  }
  if (host !== "data.cms.gov") {
    res.status(403).json({ error: "Host not allowed" });
    return;
  }

  try {
    const upstream = await fetch(target, { headers: { Accept: "application/json" } });
    const text = await upstream.text();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=300"); // cache 5 min at the edge
    res.status(upstream.status).send(text);
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
}
