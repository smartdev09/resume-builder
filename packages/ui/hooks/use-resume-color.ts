import { useState, useEffect } from "react"

export const useResumeColors = (initialPrimary = "#2D3748", initialSecondary = "#4FD1C5") => {
  const [primaryColorProp, setPrimaryColor] = useState(initialPrimary)
  const [secondaryColorProp, setSecondaryColor] = useState(initialSecondary)

  useEffect(() => {
    setPrimaryColor(initialPrimary)
    setSecondaryColor(initialSecondary)
  }, [initialPrimary, initialSecondary])

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primaryColorProp)
    document.documentElement.style.setProperty("--secondary-color", secondaryColorProp)
  }, [primaryColorProp, secondaryColorProp])

  return { primaryColorProp, secondaryColorProp }
}