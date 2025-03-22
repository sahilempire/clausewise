
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-600/90 text-white shadow",
        warning: 
          "border-transparent bg-orange-500/90 text-white shadow",
        dark:
          "border-transparent bg-gray-800/80 text-gray-300 shadow",
        highlight:
          "border-transparent bg-orange-500/90 text-white shadow",
        alert:
          "border-transparent bg-orange-500/90 text-white shadow",
        approved:
          "border-transparent bg-green-600/90 text-white shadow",
        overdue:
          "border-transparent bg-red-500/90 text-white shadow",
        scheduled:
          "border-transparent bg-blue-500/90 text-white shadow",
        paid:
          "border-transparent bg-gray-500/90 text-white shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
