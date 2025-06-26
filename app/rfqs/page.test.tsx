import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RFQsPage from './page'

describe('RFQsPage', () => {
  it('opens the new RFQ dialog when clicking the button', async () => {
    render(<RFQsPage />)
    const button = screen.getByRole('button', { name: /novo rfq/i })
    await userEvent.click(button)
    expect(screen.getByText('Novo RFQ')).toBeInTheDocument()
  })
})
