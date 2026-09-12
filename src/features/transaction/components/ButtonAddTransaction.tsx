'use client'

import { IconCirclePlus } from '@tabler/icons-react'
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import FormTransaction from './FormTransaction';

export default function ButtonAddTransaction() {

    const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
        <button 
            className='bg-green-500 flex items-center gap-x-2 text-white px-4 py-2 rounded-lg hover:bg-green-400 cursor-pointer'
            onClick={() =>setIsOpen(true)}
        >
            <IconCirclePlus />
            Agregar Transacción
        </button>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-2xl space-y-4 border bg-white p-12 rounded-lg">
                    <DialogTitle className="font-bold">Agregando una nueva transacción</DialogTitle>
                    <FormTransaction />
                    <section className='w-full flex justify-end'>
                        <button 
                            className='justify-end bg-red-500 text-white rounded-lg cursor-pointer px-4 py-1 hover:bg-red-400'
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                    </section>
                </DialogPanel>
            </div>
        </Dialog>
    </>

  )
}
