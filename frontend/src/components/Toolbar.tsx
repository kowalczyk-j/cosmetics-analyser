import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Heart, Search, Calendar } from "lucide-react";

const Toolbar = () => {
  return (
    <header className="sticky top-0 z-10 bg-background border-b w-full">
      <div className="w-full px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-foreground hover:text-primary"
          >
            <Search className="text-xl mr-1" />
            <h1 className="text-xl font-bold">Clean.</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/register" className="text-foreground hover:text-primary">
            Rejestracja
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                className="text-foreground"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>Ulubione</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Historia wyszukiwania</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Moje rutyny</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
