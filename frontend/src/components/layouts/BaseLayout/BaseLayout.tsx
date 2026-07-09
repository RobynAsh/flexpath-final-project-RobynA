import { Container } from '../../atoms/Container'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'

export const BaseLayout = ({
  children,
  containerClassName,
}: {
  children?: React.ReactNode
  containerClassName?: string
}) => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <Container className={`grow ${containerClassName || ''}`}>
        {children}
      </Container>
      <Footer />
    </div>
  )
}
