import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type UserMode = 'student' | 'parent'

const COOKIE_KEY = 'goodstudy_mode'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`
}

function getInitialMode(): UserMode {
  const saved = getCookie(COOKIE_KEY)
  if (saved === 'student' || saved === 'parent') return saved
  return 'student'
}

interface ModeContextValue {
  mode: UserMode
  setMode: (mode: UserMode) => void
  homePath: string
}

const ModeContext = createContext<ModeContextValue>({
  mode: 'student',
  setMode: () => {},
  homePath: '/home/student',
})

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>(getInitialMode)

  const setMode = useCallback((newMode: UserMode) => {
    setModeState(newMode)
    setCookie(COOKIE_KEY, newMode, COOKIE_MAX_AGE)
  }, [])

  const homePath = mode === 'parent' ? '/home/parent' : '/home/student'

  return (
    <ModeContext.Provider value={{ mode, setMode, homePath }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  return useContext(ModeContext)
}
