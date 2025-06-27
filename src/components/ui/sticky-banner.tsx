
import * as React from "react"
import { cn } from "@/lib/utils"

export interface StickyBannerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const StickyBanner = React.forwardRef<HTMLDivElement, StickyBannerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "sticky top-0 z-50 w-full px-4 py-2 text-center text-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StickyBanner.displayName = "StickyBanner"

export { StickyBanner }
