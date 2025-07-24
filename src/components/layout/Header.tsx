import React from 'react'

export const Header: React.FC = () => {
  return (
      <header className="w-full bg-background border-b border-border py-3">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center">
            <img
                src="/dynamic-table/logo.svg"
                className="h-10 w-auto"
                alt="Logo"
            />
          </div>
        </div>
      </header>
  )
}