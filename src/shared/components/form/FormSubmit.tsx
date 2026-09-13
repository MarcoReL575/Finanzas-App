import clsx from "clsx";
import { ButtonHTMLAttributes, InputHTMLAttributes } from "react"

type Props= ButtonHTMLAttributes<HTMLButtonElement>;

export function FormSubmit(props: Props) {
  return (
    <button {...props}
      type="submit"
      className={clsx('bg-green-500 flex items-center justify-center gap-x-2 py-2 text-white text-lg w-full font-bold capitalize rounded-lg cursor-pointer hover:bg-green-400', props.className)}
    >
      {props.children}
    </button>
  )
}