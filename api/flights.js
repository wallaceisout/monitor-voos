export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios: from, to, date' });
  }

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'SERPAPI_KEY não configurada no servidor' });
  }

  const params = new URLSearchParams({
    engine: 'google_flights',
    departure_id: from,
    arrival_id: to,
    outbound_date: date,
    currency: 'BRL',
    hl: 'pt',
    api_key: apiKey,
    type: '2',
  });

  try {
    const response = await fetch(`https://serpapi.com/search.json?${params}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao consultar SerpAPI: ' + err.message });
  }
}
