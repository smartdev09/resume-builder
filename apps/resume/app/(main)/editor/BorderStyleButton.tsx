import { Button } from "@resume/ui/button"
import { Circle, Square, Squircle } from "lucide-react"

export const BorderStyles = { 
    SQUARE: "square",
    CIRCLE: "circle",
    SQUIRCLE: "squircle",
} as const

type BorderStyle = typeof BorderStyles[keyof typeof BorderStyles]

const borderStyles = Object.values(BorderStyles)

interface BorderStyleButtonProps { 
    borderStyle: BorderStyle
    onChange: (borderStyle: BorderStyle) => void
}

export default function BorderStyleButton({
    borderStyle,
    onChange
}: BorderStyleButtonProps) {

    function handleClick() {
        const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
        const nextIndex = (currentIndex + 1) % borderStyles.length;
        onChange(borderStyles[nextIndex]!)
    }

    const Icon = borderStyle === 'square' ? Square : borderStyle === 'circle' ? Circle : Squircle;

    return (
        <Button variant="outline" size="icon" title="Change border style" onClick={handleClick}>
            <Icon className="size-5" />
        </Button>
    )
}