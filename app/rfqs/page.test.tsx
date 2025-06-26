import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RFQsPage from './page'

describe('RFQsPage', () => {
  it('filters RFQs based on search input', async () => {
    render(<RFQsPage />)
    const input = screen.getByPlaceholderText('Pesquisar RFQs...')
    await userEvent.type(input, 'Nortécnica')
    expect(screen.getByText('RFQ-004')).toBeInTheDocument()
    expect(screen.queryByText('RFQ-001')).toBeNull()
  })
})
