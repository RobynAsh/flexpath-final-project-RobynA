import { Container } from '../../atoms/Container'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'

export const BaseLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <Container className="grow">{children}</Container>
      <Footer />
    </div>
  )
}
