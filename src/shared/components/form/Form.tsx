import React, { FormHTMLAttributes } from 'react'
import clsx from "clsx"

type Props = FormHTMLAttributes<HTMLFormElement>

export default function FormComponent(props: Props) {
  return (
    <form {...props} className={clsx('mt-10 space-y-6 container mx-auto max-w-4xl', props.className)}>
        {props.children}
    </form>
  )
}
