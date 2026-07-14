import { useEffect, useState } from 'react'
import { Container } from '../../atoms/Container/Container'
import { HeaderNavLink } from './HeaderNavLink'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

export const Header = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const navigate = useNavigate()

  const [isMounted, setIsMounted] = useState(false)

  const [mobileMenuClicked, setMobileMenuClicked] = useState(false)
  const [isMobileTransitionSet, setIsMobileTransitionSet] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  /**
   * With the mobile menu, we only want the CSS transition if the user is actually interacting with the menu.
   * However, with the CSS transition classes, as the user scales the UI down to a mobile size once the mobile menu is put into the place the animation shows the menu hiding at the very start.
   * To fix this we are going to set the class when the menu button is clicked, which will trigger this useEffect to open/close the menu and after the 300ms duration we'll remove the transition class
   */
  useEffect(() => {
    if (isMounted) {
      setIsMobileTransitionSet(true)
      setIsMobileMenuOpen(!isMobileMenuOpen)

      const cleanup = setTimeout(() => {
        setIsMobileTransitionSet(false)
      }, 300)

      return () => clearTimeout(cleanup)
    } else {
      setIsMounted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileMenuClicked])

  return (
    <div className="shadow-card relative z-10 flex bg-rose-200 pb-1">
      <div className="flex grow border-b border-dashed border-rose-300">
        <Container className="flex-col md:flex-row md:justify-between md:px-2 md:py-0">
          <div className="flex items-center justify-between">
            <div className="group inline-flex cursor-pointer items-center gap-2 self-start md:py-2">
              <img
                src="/assets/icon.png"
                alt="Frog Log Logo"
                className="h-15 w-15"
              />
              <h1 className="text-4xl font-bold text-rose-50 transition-colors duration-300 group-hover:text-rose-500">
                Frog Log
              </h1>
            </div>
            <div
              className="group cursor-pointer md:hidden"
              onClick={() => {
                setMobileMenuClicked(!mobileMenuClicked)
              }}
            >
              <FontAwesomeIcon
                icon={faBars}
                className="text-2xl text-rose-50 transition-colors duration-300 group-hover:text-rose-500"
              />
            </div>
          </div>
          {isAuthenticated && (
            <div
              className={`flex flex-col gap-4 md:flex-row ${isMobileMenuOpen ? 'max-h-48 pt-2 md:pt-0' : 'max-h-0 pt-0'} ${isMobileTransitionSet ? 'transition-all' : ''} overflow-hidden md:max-h-full md:overflow-visible`}
            >
              <HeaderNavLink
                onClick={() => {
                  navigate('/logout')
                }}
              >
                Logout
              </HeaderNavLink>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}
