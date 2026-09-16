import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Evita que las consultas se recarguen inmediatamente al hidratar
        staleTime: 60 * 1000, // 1 minuto
        // gcTime: 5 * 60 * 1000, // Opcional: 5 minutos para el garbage collection
      },
    },
  })
}