import React, { ParamHTMLAttributes } from "react"

export function FormError({children}: {children: React.ReactNode}) {
  return (
    <p className="border-l-4 border-red-800 p-2 bg-red-100 text-red-600 text-sm font-semibold">
        {children}
    </p>
  )
}
