import { useModalStore } from '@/src/shared/stores/modalStore'
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'

export default function ModalExpenseLimits() {
    const isOpen = useModalStore((state)=> state.isOpen);
    const closeModal = useModalStore((state)=> state.closeModal);

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/40" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-lg">
                    <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                    <Description>This will permanently deactivate your account</Description>
                    <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                    <div className="flex gap-4">
                        <button onClick={closeModal}>Cancel</button>
                        <button onClick={closeModal}>Deactivate</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
