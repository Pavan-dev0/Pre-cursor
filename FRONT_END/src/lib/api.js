const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function runFullScan(topic, demoMode = false) {
  const response = await fetch(`${BASE_URL}/api/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topic, demoMode })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.error || 'Scan failed')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
