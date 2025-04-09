"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

export default function DropdownTable() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: string, event: React.MouseEvent) => {
    event.preventDefault();
    console.log(`Ação "${action}" foi clicada`);
    // Aqui você implementaria a lógica real para cada ação
    setIsOpen(false);
  };

  return (
    <div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-700 bg-gray-800 text-white shadow-md animate-in fade-in-80">
          <DropdownMenuItem 
            className="block px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer"
            onClick={(e) => handleAction("remover", e)}
          >
            Remover
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="block px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer"
            onClick={(e) => handleAction("banir", e)}
          >
            Banir
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="block px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer"
            onClick={(e) => handleAction("desabilitar", e)}
          >
            Desabilitar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
