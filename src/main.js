import './style.css'

// ==================== SPA ROUTER ====================

const pages = ['home', 'about', 'services', 'contact']
let currentPage = 'home'

function showPage(pageId) {
  // Validate page
  if (!pages.includes(pageId)) pageId = 'home'
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active')
  })
  
  // Show target page
  const target = document.getElementById(pageId)
  if (target) {
    target.classList.add('active')
    currentPage = pageId
  }
  
  // Scroll to top instantly (no scroll animation between pages)
  window.scrollTo({ top: 0, behavior: 'instant' })
  
  // Update nav active state
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href')
    // Handle both direct page links and home anchors (team)
    const isActive = href === `#${pageId}` || (pageId === 'home' && href === '#team')
    link.classList.toggle('active', isActive)
  })
  
  // Close mobile menu
  document.querySelector('.main-nav').classList.remove('active')
  
  // Update URL without jumping
  if (history.pushState) {
    history.pushState({ page: pageId }, '', `#${pageId}`)
  }
}

// ==================== EVENT HANDLERS ====================

// Handle all navigation clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-nav]')
  if (!link) return
  
  e.preventDefault()
  const href = link.getAttribute('href')
  if (!href || !href.startsWith('#')) return
  
  const pageId = href.slice(1)
  
  // If it's a home anchor like #team, just go to home and scroll
  if (pageId === 'team') {
    showPage('home')
    setTimeout(() => {
      const teamSection = document.getElementById('team')
      if (teamSection) {
        teamSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
    return
  }
  
  showPage(pageId)
})

// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn')
const mainNav = document.querySelector('.main-nav')

mobileBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  mainNav.classList.toggle('active')
})

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.site-header')) {
    mainNav.classList.remove('active')
  }
})

// Browser back/forward buttons
window.addEventListener('popstate', (e) => {
  const state = e.state
  const hash = window.location.hash.replace('#', '')
  const pageId = state?.page || hash || 'home'
  showPage(pageId)
})

// ==================== SCROLL ANIMATIONS ====================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, observerOptions)

// Observe elements for animation
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.service-card, .feature-item, .team-card, .testimonial-card, .stat, ' +
    '.value-item, .showcase-card, .process-step, .direct-item'
  )
  
  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll')
    observer.observe(el)
  })
}

// ==================== FORM HANDLING ====================

const contactForm = document.getElementById('contactForm')
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // Simple feedback - in production, send to backend
    const btn = contactForm.querySelector('button[type="submit"]')
    const originalText = btn.textContent
    btn.textContent = 'Message Sent!'
    btn.style.background = '#f57f39'
    
    setTimeout(() => {
      btn.textContent = originalText
      btn.style.background = ''
      contactForm.reset()
    }, 3000)
  })
}

// ==================== INITIALIZATION ====================

function init() {
  // Determine initial page from URL
  const hash = window.location.hash.replace('#', '')
  const initialPage = pages.includes(hash) ? hash : 'home'
  
  // Set initial state
  if (history.replaceState) {
    history.replaceState({ page: initialPage }, '', `#${initialPage}`)
  }
  
  showPage(initialPage)
  initScrollAnimations()
}

// Start
init()

console.log('Sky Q SPA loaded')