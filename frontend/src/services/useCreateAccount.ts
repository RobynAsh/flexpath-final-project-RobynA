import { useMutation } from '@tanstack/react-query'

export type CreateAccountCredentials = {
  username: string
  password: string
}

const createAccount = async (credentials: CreateAccountCredentials) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error('There was an error creating your account.')
  }
}

export const useCreateAccount = () =>
  useMutation({
    mutationFn: createAccount,
  })
