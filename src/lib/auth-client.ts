import { createAuthClient } from "better-auth/react"

// Sin baseURL: el cliente usa el mismo origen del navegador.
// BETTER_AUTH_URL no está disponible aquí porque este módulo corre en el
// browser y esa variable no tiene el prefijo NEXT_PUBLIC_.
export const authClient = createAuthClient()