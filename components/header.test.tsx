import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './header'

describe('Header', () => {
  it('renders search input', () => {
    render(<Header />)
    expect(
      screen.getByPlaceholderText('Pesquisar projetos, fornecedores...'),
    ).toBeInTheDocument()
  })

  it('opens user menu when clicked', async () => {
    render(<Header />)
    const userButton = screen.getAllByRole('button')[1]
    await userEvent.click(userButton)
    expect(screen.getByText('Minha Conta')).toBeInTheDocument()
  })
})
