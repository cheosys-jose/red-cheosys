'use client'

import { useEffect } from 'react'

export default function VisitCounter() {
  useEffect(() => {
    // Solo registrar visita, no mostrar widget
    fetch('/api/metrics/visit', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('Visita registrada:', data.country)
        }
      })
      .catch(console.error)
  }, [])

  // No renderizar nada
  return null
}
