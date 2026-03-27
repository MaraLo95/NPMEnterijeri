import { createContext, useContext, useState, useEffect } from 'react'

const GalleryContext = createContext()

// Initial gallery data
const initialGalleryData = [
  {
    id: 1,
    title: 'Kuhinja sa sankom',
    description: 'Kompletna izrada kuhinje sa sankom.',
    image: '/images/gallery/kuhinja-po-meri-9.jpg',
    category: 'kreacije',
    featured: true,
    createdAt: '2024-12-01'
  },
  {
    id: 2,
    title: 'Montaža kuhinje',
    description: 'Montaža kuhinje rađene po meri sa šankom',
    image: '/images/gallery/kuhinja-po-meri-10.jpg',
    category: 'kreacije',
    featured: false,
    createdAt: '2024-11-28'
  },
  {
    id: 3,
    title: 'Izrada i montaža kuhinje',
    description: 'Izrada i montaža kuhinje po meri',
    image: '/images/gallery/kuhinja-npm-1.png',
    category: 'kreacije',
    featured: true,
    createdAt: '2024-11-25'
  },
  {
    id: 4,
    title: 'Kuhinja 3D Render',
    description: 'Izrada kuhinje u 3D-u',
    image: '/images/gallery/render-kuhinja-1.jpg',
    category: 'renderi',
    featured: false,
    createdAt: '2024-11-20'
  },
  {
    id: 5,
    title: 'Montaža lavaboa',
    description: 'Profesionalna montaža lavaboa',
    image: '/images/gallery/montaza-lavabo.png',
    category: 'montaza',
    featured: false,
    createdAt: '2024-11-18'
  },
  {
    id: 6,
    title: 'Montaža kuhinje po meri',
    description: 'Kompletna montaža kuhinje',
    image: '/images/gallery/montaza-kuhinja-1.png',
    category: 'montaza',
    featured: true,
    createdAt: '2024-11-15'
  },
  {
    id: 7,
    title: 'Montaža vrata',
    description: 'Profesionalna montaža vrata',
    image: '/images/gallery/montaza-vrata.png',
    category: 'montaza',
    featured: false,
    createdAt: '2024-11-12'
  },
  {
    id: 8,
    title: 'Montaža ormara',
    description: 'Montaža ugradnog ormara',
    image: '/images/gallery/montaza-ormar.png',
    category: 'montaza',
    featured: false,
    createdAt: '2024-11-10'
  },
  {
    id: 9,
    title: 'Izrada kreveta po meri',
    description: 'Krevet izrađen po meri klijenta',
    image: '/images/gallery/krevet-po-meri.png',
    category: 'kreacije',
    featured: true,
    createdAt: '2024-11-05'
  }
]

const STORAGE_KEY = 'npm_gallery_data'

export function GalleryProvider({ children }) {
  const [galleryItems, setGalleryItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load gallery data from localStorage on mount
  useEffect(() => {
    const loadGalleryData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setGalleryItems(JSON.parse(stored))
        } else {
          // Initialize with default data
          setGalleryItems(initialGalleryData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGalleryData))
        }
      } catch (error) {
        console.error('Error loading gallery data:', error)
        setGalleryItems(initialGalleryData)
      } finally {
        setIsLoading(false)
      }
    }

    loadGalleryData()
  }, [])

  // Save to localStorage whenever galleryItems changes
  useEffect(() => {
    if (!isLoading && galleryItems.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(galleryItems))
    }
  }, [galleryItems, isLoading])

  // Add new gallery item
  const addGalleryItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setGalleryItems(prev => [newItem, ...prev])
    return newItem
  }

  // Update gallery item
  const updateGalleryItem = (id, updates) => {
    setGalleryItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  // Delete gallery item
  const deleteGalleryItem = (id) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id))
  }

  // Get items by category
  const getItemsByCategory = (category) => {
    if (category === 'all') return galleryItems
    return galleryItems.filter(item => item.category === category)
  }

  // Get featured items
  const getFeaturedItems = () => {
    return galleryItems.filter(item => item.featured)
  }

  const value = {
    galleryItems,
    isLoading,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    getItemsByCategory,
    getFeaturedItems
  }

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery() {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider')
  }
  return context
}




