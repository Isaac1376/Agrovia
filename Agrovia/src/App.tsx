import { useEffect, useState } from 'react'
import parse from 'html-react-parser'
import homePage from '../../index.html?raw'
import aboutPage from '../../about.html?raw'
import blogPage from '../../blog.html?raw'
import contactPage from '../../contact.html?raw'
import featurePage from '../../feature.html?raw'
import notFoundPage from '../../404.html?raw'
import servicePage from '../../service.html?raw'
import teamPage from '../../team.html?raw'
import testimonialPage from '../../testimonial.html?raw'

const imageAssets = import.meta.glob<string>('../../img/*', {
  eager: true,
  import: 'default',
  query: '?url',
})

const pages: Record<string, string> = {
  '/': homePage,
  '/about': aboutPage,
  '/blog': blogPage,
  '/contact': contactPage,
  '/feature': featurePage,
  '/404': notFoundPage,
  '/service': servicePage,
  '/team': teamPage,
  '/testimonial': testimonialPage,
}

const personalDetails: Record<string, string> = {
  '123 Street, New York, USA': 'Maduravoyal, Chennai',
  '+012 345 67890': '+91 73584 04880',
  'info@example.com': 'dhivagar1376@gmail.com',
}

const produceIcons = [
  ['fa-apple-whole', '#c64b3f'],
  ['fa-carrot', '#e27b35'],
  ['fa-lemon', '#c6a52f'],
  ['fa-pepper-hot', '#bd503e'],
  ['fa-seedling', '#548348'],
  ['fa-leaf', '#4d8954'],
  ['fa-wheat-awn', '#b49a4b'],
  ['fa-apple-whole', '#8d4252'],
  ['fa-carrot', '#d8863d'],
  ['fa-lemon', '#b6a33b'],
]

function getCurrentPath() {
  const hashPath = window.location.hash.startsWith('#/')
    ? window.location.hash.slice(1).split(/[?#]/)[0]
    : '/'

  return pages[hashPath] ? hashPath : '/'
}

function getPageMarkup(source: string) {
  const pageDocument = new DOMParser().parseFromString(source, 'text/html')
  pageDocument.body.querySelectorAll('script').forEach((script) => script.remove())
  pageDocument.body.querySelectorAll('.wow').forEach((element) => element.classList.remove('wow'))

  pageDocument.body.querySelectorAll('*').forEach((element) => {
    element.childNodes.forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent) return

      const text = node.textContent.trim()
      if (personalDetails[text]) {
        node.textContent = node.textContent.replace(text, personalDetails[text])
      }
    })
  })

  pageDocument.body.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    const icon = link.querySelector('i')
    if (!icon) return

    if (icon.classList.contains('fa-x-twitter') || icon.classList.contains('fa-facebook-f')) {
      link.remove()
      return
    }

    if (icon.classList.contains('fa-youtube')) {
      link.href = 'https://www.youtube.com/@dhivagarm931'
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.setAttribute('aria-label', 'YouTube')
    }

    if (icon.classList.contains('fa-linkedin-in')) {
      link.href = 'https://www.linkedin.com/in/dhivagar1376/'
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.setAttribute('aria-label', 'LinkedIn')
    }
  })

  const map = pageDocument.querySelector<HTMLIFrameElement>('iframe[src*="New%20York"]')
  if (map) map.src = 'https://maps.google.com/maps?q=Maduravoyal%2C%20Chennai&output=embed'

  pageDocument.body.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    const href = link.getAttribute('href')
    if (!href || href.startsWith('#')) return

    const destination = new URL(href, window.location.origin)
    if (destination.origin !== window.location.origin) return

    const route = destination.pathname.replace(/\.html$/, '').replace(/^\/index$/, '/') || '/'
    if (pages[route]) link.setAttribute('href', `#${route}`)
  })

  pageDocument.body.querySelectorAll<HTMLImageElement>('img[src^="img/"]').forEach((image) => {
    const assetPath = `../../${image.getAttribute('src')}`
    if (imageAssets[assetPath]) image.src = imageAssets[assetPath]
  })

  return pageDocument.body.innerHTML
}

function FloatingProduce() {
  return (
    <div className="floating-produce" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => {
        const [icon, color] = produceIcons[index % produceIcons.length]
        const side = index % 2 === 0 ? 'left' : 'right'
        const row = Math.floor(index / 2)
        const edgeOffset = 3 + (row % 2) * 2

        return (
          <i
            key={index}
            className={`fa-solid ${icon} floating-produce__icon floating-produce__icon--${row % 3}`}
            style={{
              color,
              [side]: `${edgeOffset}%`,
              top: `${8 + row * 27}%`,
              animationDelay: `-${row * 1.1 + index * 0.35}s`,
              animationDuration: `${8 + row * 1.5}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function App() {
  const [path, setPath] = useState(getCurrentPath)

  useEffect(() => {
    const updatePath = () => setPath(getCurrentPath())
    const updateNavbar = () => {
      document.querySelector('.navbar')?.classList.toggle('position-fixed', window.scrollY > 0)
      document.querySelector('.navbar')?.classList.toggle('bg-dark', window.scrollY > 0)
      document.querySelector('.navbar')?.classList.toggle('shadow-sm', window.scrollY > 0)
      const backToTop = document.querySelector<HTMLElement>('.back-to-top')
      if (backToTop) backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none'
    }
    const handleBackToTop = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('.back-to-top')) {
        event.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    window.addEventListener('hashchange', updatePath)
    window.addEventListener('scroll', updateNavbar)
    document.addEventListener('click', handleBackToTop)
    updateNavbar()
    const spinner = document.querySelector('#spinner')
    if (spinner) window.setTimeout(() => spinner.classList.remove('show'), 1)

    return () => {
      window.removeEventListener('hashchange', updatePath)
      window.removeEventListener('scroll', updateNavbar)
      document.removeEventListener('click', handleBackToTop)
    }
  }, [path])

  return (
    <>
      {parse(getPageMarkup(pages[path] ?? notFoundPage))}
      <FloatingProduce />
    </>
  )
}