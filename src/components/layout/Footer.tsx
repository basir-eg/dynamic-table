import React from 'react'

export const Footer: React.FC = () => {
  return (
      <footer className="w-full bg-background border-t border-border py-4 mt-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center">
            <p className="text-sm text-foreground">
              © 2025 Basir. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  )
}