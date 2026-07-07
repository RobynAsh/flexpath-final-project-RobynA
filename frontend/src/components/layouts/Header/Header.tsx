import { Container } from '../../atoms/Container'
import { HeaderNavLink } from './HeaderNavLink'

export const Header = () => {
  return (
    <div className="shadow-card flex bg-rose-200 pb-1">
      <div className="flex grow border-b border-dashed border-rose-300">
        <Container className="justify-between px-2 py-0">
          <p className="self-start py-2">Hook Book</p>
          <div className="flex gap-4">
            <HeaderNavLink>Link One</HeaderNavLink>
            <HeaderNavLink>Link Two</HeaderNavLink>
            <HeaderNavLink>Link Three</HeaderNavLink>
          </div>
        </Container>
      </div>
    </div>
  )
}
