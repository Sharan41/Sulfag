import { flushSync } from 'react-dom'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

export const canUseViewTransitions = () =>
  typeof document !== 'undefined' && typeof document.startViewTransition === 'function' && !prefersReducedMotion()

/**
 * Runs a React state update inside a View Transition so matching elements morph.
 *
 * `names` maps a view-transition-name to:
 *   from: element carrying the name before the update (or null)
 *   to:   () => element that should carry the name after the update (or null)
 *
 * Browsers without View Transitions (or with reduced motion) just apply the update.
 */
export const transitionUpdate = (update, names = {}) => {
  if (!canUseViewTransitions()) {
    update()
    return Promise.resolve(false)
  }

  const entries = Object.entries(names)
  entries.forEach(([name, { from }]) => {
    if (from) from.style.viewTransitionName = name
  })

  const newElements = []
  const transition = document.startViewTransition(() => {
    entries.forEach(([, { from }]) => {
      if (from) from.style.viewTransitionName = ''
    })
    flushSync(update)
    entries.forEach(([name, { to }]) => {
      const element = to?.()
      if (element) {
        element.style.viewTransitionName = name
        newElements.push(element)
      }
    })
  })

  const cleanup = () => {
    entries.forEach(([, { from }]) => {
      if (from) from.style.viewTransitionName = ''
    })
    newElements.forEach((element) => {
      element.style.viewTransitionName = ''
    })
  }

  return transition.finished.then(
    () => {
      cleanup()
      return true
    },
    () => {
      cleanup()
      return false
    }
  )
}

/** True when an element is at least partly inside the viewport. */
export const isInViewport = (element) => {
  if (!element || !element.isConnected) return false
  const rect = element.getBoundingClientRect()
  return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight
}
