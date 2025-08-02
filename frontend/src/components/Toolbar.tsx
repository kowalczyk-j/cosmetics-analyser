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
import { User, Heart, Search, Calendar, LogOut, Plus } from "lucide-react";
import { ACCESS_TOKEN } from "@/lib/constants";
import ImportCosingButton from "@/components/ImportCosingButton";

const Toolbar = () => {
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
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
          <ImportCosingButton />
          {!isLoggedIn && (
            <>
              <Link
                to="/register"
                className="text-foreground hover:text-primary"
              >
                Rejestracja
              </Link>
              <Link to="/login" className="text-foreground hover:text-primary">
                Logowanie
              </Link>
            </>
          )}
          {isLoggedIn && (
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
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center text-foreground"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/add-cosmetic"
                    className="flex items-center text-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Dodaj kosmetyk</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Ulubione</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Moje rutyny</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/logout"
                    className="flex items-center text-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Wyloguj</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
