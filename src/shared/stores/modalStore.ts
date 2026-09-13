import { create } from 'zustand'

interface ModalStore {
    stateModal: boolean
    toggleModal: (state: boolean) => void
}

export const modalStore = create<ModalStore>()((set) => ({
    stateModal: false,
    toggleModal: (state: boolean) => set(() => ({ stateModal: state })),
}))