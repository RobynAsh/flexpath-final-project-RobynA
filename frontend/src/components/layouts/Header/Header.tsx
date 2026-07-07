import { Container } from '../../atoms/Container'

export const Header = () => {
  return (
    <div className="shadow-card flex bg-rose-200 pb-1">
      <div className="flex grow border-b border-dashed border-rose-300">
        <Container>
          <p>Header</p>
        </Container>
      </div>
    </div>
  )
}
