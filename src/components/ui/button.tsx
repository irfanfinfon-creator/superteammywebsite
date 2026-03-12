'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'none'
  size?: 'default' | 'sm' | 'md' | 'lg' | '2xl' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    // Variant definitions - keep them clean so they can be overridden
    const variants = {
      default: 'bg-white text-black hover:scale-105 shadow-sm shadow-white/10',
      outline: 'border border-white/20 bg-transparent hover:bg-white/5',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700',
      ghost: 'bg-transparent hover:bg-white/10',
      none: '', // Completely blank variant
    }

    // Size definitions
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4',
      lg: 'h-11 px-8',
      '2xl': 'h-14 px-10 text-lg',
      icon: 'h-10 w-10',
    }

    // Note: The user previously mapped 'lg' to 'h-9' and '2xl' to 'h-11'
    // We will preserve that specific logic for their existing use cases
    const customSizeStyles = {
      lg: 'h-9 px-6 rounded-lg',
      '2xl': 'h-11 px-8 rounded-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          // Base alignment and interaction styles
          'inline-flex items-center gap-2 justify-center rounded-2xl font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',

          // Apply variant styles
          variants[variant as keyof typeof variants],

          // Apply size styles - respecting the user's custom h-9/h-11 preference for lg/2xl
          size === 'lg' ? customSizeStyles.lg :
            size === '2xl' ? customSizeStyles['2xl'] :
              sizes[size as keyof typeof sizes],

          // Merge with any custom classes passed from parent
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
