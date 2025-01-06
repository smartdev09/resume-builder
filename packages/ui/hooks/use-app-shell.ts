'use client'

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

type Store = {
    user: string | null;
    score: number;
    setUser: (user: string | null) => void;
    addToScore: (amount: number) => void;
}

type PersistStore = (
    config: StateCreator<Store, [], []>,
    options: PersistOptions<Store>
) => StateCreator<Store, [], []>

const useAppShell = create<Store>(
    (persist as PersistStore)(
        (set) => ({
        user: null,
        score: 0,
        setUser: (user) => set(() => ({ user })),
        addToScore: (amount) => set((state) => ({ score: state.score + amount}))
    }), {
        name: 'app-shell'
    })
)

export default useAppShell;