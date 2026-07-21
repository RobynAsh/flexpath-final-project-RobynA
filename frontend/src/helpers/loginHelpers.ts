export const getStoredJWTToken = () =>
  (sessionStorage.getItem('token') ?? localStorage.getItem('token')) || ''

export const clearStoredJWTToken = () => {
  sessionStorage.removeItem('token')
  localStorage.removeItem('token')
}
