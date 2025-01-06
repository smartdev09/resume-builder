'use client'

import React from 'react';
import useAppShell from '../../hooks/use-app-shell';

export default function Shell({title, children} : {title: string, children: React.ReactNode}){
    const { user, score, setUser } = useAppShell();

    return (
        <div>{children}</div>
    )
}