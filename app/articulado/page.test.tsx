import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ArticuladoPage from './page'

describe('ArticuladoPage', () => {
  it('filters lines based on search input', async () => {
    render(<ArticuladoPage />)
    const input = screen.getByPlaceholderText(
      'Pesquisar por descrição, código ou família...'
    )
    await userEvent.type(input, 'Tubos')
    expect(
      screen.getByText('Tubagem em PVC para instalações elétricas')
    ).toBeInTheDocument()
    expect(screen.queryByText('Quadro elétrico principal QGBT')).toBeNull()
  })
})
