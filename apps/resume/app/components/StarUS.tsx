
'use client'

import { Button } from "@resume/ui/button"
import { Star } from "lucide-react"

export function StarUs() {
    return (
         <Button onClick={() => window.open(process.env.GITHUB_REPO)}><Star /> Star us</Button>
    )
}