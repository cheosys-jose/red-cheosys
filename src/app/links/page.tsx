'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ExternalLink {
  id: string
  title: string
  url: string
  description: string
  category: string
  verified: boolean
  createdAt: string
}

export default function LinksPage() {
  const [links, setLinks] = useState<ExternalLink[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchLinks()
  }, [selectedCategory])

  const fetchLinks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.set('category', selectedCategory)
      
      const res = await fetch(`/api/v1/links?${params.toString()}`)
      const data = await res.json()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'official': return '🏛️ Organismos Oficiales'
      case 'missing': return '👤 Personas Desaparecidas'
      case 'centers': return '📦 Centros de Acopio'
      case 'news': return '📰 Información y Noticias'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'official': return 'border-l-blue-500 bg-blue-50'
      case 'missing': return 'border-l-yellow-500 bg-yellow-50'
      case 'centers': return 'border-l-green-500 bg-green-50'
      case 'news': return 'border-l-purple-500 bg-purple-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-3xl font-bold text-gray-900 hover:text-blue-600">
            Links de Interés
          </Link>
          <Link href="/links/add" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-lg">
            + Agregar Link
          </Link>
        </div>

        <div className="mb-6 bg-white rounded-lg p-4 shadow">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('official')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === 'official' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏛️ Oficiales
            </button>
            <button
              onClick={() => setSelectedCategory('missing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === 'missing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👤 Desaparecidos
            </button>
            <button
              onClick={() => setSelectedCategory('centers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === 'centers' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 Centros
            </button>
            <button
              onClick={() => setSelectedCategory('news')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === 'news' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📰 Noticias
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : links.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No hay links en esta categoría aún</p>
            <Link href="/links/add" className="text-blue-600 hover:underline mt-2 inline-block">
              ¡Sé el primero en agregar uno!
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 p-6 ${getCategoryColor(link.category)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{link.title}</h3>
                      {link.verified && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          ✓ Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                    <p className="text-xs text-blue-600 truncate">{link.url}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {getCategoryLabel(link.category)} • {new Date(link.createdAt).toLocaleDateString('es-VE')}
                    </p>
                  </div>
                  <span className="text-2xl">↗</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
