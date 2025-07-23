import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * Interface for URL parameters hook return value
 */
interface UseURLParamsReturn {
  /** Get a specific URL parameter value */
  getParam: (key: string) => string | null
  /** Set a URL parameter and update the URL */
  setParam: (key: string, value: string) => void
  /** Remove a URL parameter */
  removeParam: (key: string) => void
  /** Get all URL parameters as an object */
  getAllParams: () => Record<string, string>
  /** Update multiple URL parameters at once */
  updateURL: (params: Record<string, string>) => void
  /** Check if a parameter exists */
  hasParam: (key: string) => boolean
}

/**
 * Custom hook for managing URL search parameters
 * Provides reactive updates when URL changes and methods to manipulate parameters
 * 
 * @returns Object with methods to get, set, and manipulate URL parameters
 * 
 * @example
 * ```tsx
 * const { getParam, setParam } = useURLParams()
 * const linkParam = getParam('link')
 * setParam('newParam', 'value')
 * ```
 */
export const useURLParams = (): UseURLParamsReturn => {
  // State to track current URL search parameters
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  )

  // Update search params when URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search))
    }

    window.addEventListener('popstate', handlePopState)
    
    // Also listen for pushstate/replacestate (if needed by other parts of app)
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args)
      setSearchParams(new URLSearchParams(window.location.search))
    }

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args)
      setSearchParams(new URLSearchParams(window.location.search))
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [])

  // Memoized function to get a parameter value
  const getParam = useCallback((key: string): string | null => {
    try {
      const value = searchParams.get(key)
      return value ? decodeURIComponent(value) : null
    } catch (error) {
      console.warn(`Error decoding URL parameter "${key}":`, error)
      return searchParams.get(key)
    }
  }, [searchParams])

  // Function to set a parameter and update the URL
  const setParam = useCallback((key: string, value: string) => {
    try {
      const newParams = new URLSearchParams(searchParams)
      newParams.set(key, encodeURIComponent(value))
      
      const newUrl = `${window.location.pathname}?${newParams.toString()}`
      window.history.pushState({}, '', newUrl)
      setSearchParams(newParams)
    } catch (error) {
      console.error(`Error setting URL parameter "${key}":`, error)
    }
  }, [searchParams])

  // Function to remove a parameter
  const removeParam = useCallback((key: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete(key)
    
    const newUrl = newParams.toString() 
      ? `${window.location.pathname}?${newParams.toString()}`
      : window.location.pathname
    
    window.history.pushState({}, '', newUrl)
    setSearchParams(newParams)
  }, [searchParams])

  // Function to get all parameters as an object
  const getAllParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {}
    
    searchParams.forEach((value, key) => {
      try {
        params[key] = decodeURIComponent(value)
      } catch (error) {
        console.warn(`Error decoding URL parameter "${key}":`, error)
        params[key] = value
      }
    })
    
    return params
  }, [searchParams])

  // Function to update multiple parameters at once
  const updateURL = useCallback((params: Record<string, string>) => {
    try {
      const newParams = new URLSearchParams()
      
      // Add new parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          newParams.set(key, encodeURIComponent(value))
        }
      })
      
      const newUrl = newParams.toString()
        ? `${window.location.pathname}?${newParams.toString()}`
        : window.location.pathname
      
      window.history.pushState({}, '', newUrl)
      setSearchParams(newParams)
    } catch (error) {
      console.error('Error updating URL parameters:', error)
    }
  }, [])

  // Function to check if a parameter exists
  const hasParam = useCallback((key: string): boolean => {
    return searchParams.has(key)
  }, [searchParams])

  // Return memoized object to prevent unnecessary re-renders
  return useMemo(() => ({
    getParam,
    setParam,
    removeParam,
    getAllParams,
    updateURL,
    hasParam
  }), [getParam, setParam, removeParam, getAllParams, updateURL, hasParam])
}