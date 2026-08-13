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
    if (response.status === 409) {
      throw new Error('Username is already taken.')
    }

    throw new Error('There was an error creating your account.')
  }
}

export const useCreateAccount = () =>
  useMutation({
    mutationFn: createAccount,
  })
