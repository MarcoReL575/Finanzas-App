import clsx from 'clsx';
import React, { LabelHTMLAttributes } from 'react'

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function FormLabel(props: Props) {
  return (
    <label {...props} className={clsx('mb-1', props.className)}>

    </label>
  )
}
