import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { AddPatternRequest } from '../../../services/types/patternFormTypes'
import { PatternForm } from './PatternForm'

const validPattern: AddPatternRequest = {
  username: '',
  name: 'Cozy Cardigan',
  designer: 'Robin',
  category: 'Sweater',
  technique: 'Crochet',
  difficulty: 'Beginner',
  description: 'A cozy cardigan.',
  link: 'https://example.com/pattern',
  imageUrl: '',
  tags: [],
  yarn: [
    {
      description: 'Body',
      weight: 4,
      yardage: 251,
      grams: 142,
    },
  ],
  tools: [{ toolType: 'Crochet hook', sizeMm: 5.5 }],
  materials: [],
}

const renderPatternForm = (
  includeUsername: boolean,
  onSubmit = jest.fn().mockResolvedValue(undefined),
) =>
  render(
    <MemoryRouter
      initialEntries={['/form']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="/form"
          element={
            <PatternForm
              includeUsername={includeUsername}
              initialValues={validPattern}
              onSubmit={onSubmit}
              successRedirectPath="/patterns"
            />
          }
        />
        <Route path="/patterns" element={<p>My Patterns</p>} />
      </Routes>
    </MemoryRouter>,
  )

describe('PatternForm', () => {
  test('only displays the username field when requested', () => {
    const { unmount } = renderPatternForm(true)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()

    unmount()
    renderPatternForm(false)
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument()
  })

  test('redirects to the configured path after a successful submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    renderPatternForm(false, onSubmit)

    fireEvent.click(screen.getByRole('button', { name: 'Save Pattern' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(validPattern))
    expect(await screen.findByText('My Patterns')).toBeInTheDocument()
  })
})
