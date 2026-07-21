import { useMutation } from '@tanstack/react-query'

export type LoginCredentials = {
  username: string
  password: string
}

type LoginResponse = {
  accessToken: {
    token: string
  }
}

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Incorrect username or password.')
    }

    throw new Error('Unable to log in right now.')
  }

  return response.json() as Promise<LoginResponse>
}

export const useLogin = () =>
  useMutation({
    mutationFn: login,
  })
