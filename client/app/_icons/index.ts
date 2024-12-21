export interface IconProps {
    size: "sm" | "md" | "lg",
    className?: string
    onClick?: React.MouseEventHandler<SVGSVGElement>
}

export const SizeStyles: Record<IconProps["size"], string> = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6"
}