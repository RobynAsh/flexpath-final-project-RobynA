import { Container } from '../../atoms/Container/Container'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'

export const BaseLayout = ({
  isAuthenticated,
  containerClassName,
  children,
}: {
  isAuthenticated: boolean
  containerClassName?: string
  children?: React.ReactNode
}) => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header isAuthenticated={isAuthenticated} />
      <Container className={`grow ${containerClassName || ''}`}>
        {children}
      </Container>
      <Footer />
    </div>
  )
}
