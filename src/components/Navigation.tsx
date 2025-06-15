
import React, { useState } from 'react';
import { Brain, Settings, User, Bell, LogOut, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavigationProps {
  onProfileClick?: () => void;
}

const Navigation = ({ onProfileClick }: NavigationProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
    setMobileMenuOpen(false);
  };

  const MobileActions = () => (
    <div className="flex flex-col space-y-3 p-1">
      <Button variant="ghost" size="sm" className="justify-start">
        <Bell className="h-4 w-4 mr-2" />
        Notifications
        <Badge className="ml-auto w-2 h-2 p-0 bg-destructive" />
      </Button>
      
      <Button variant="ghost" size="sm" className="justify-start">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      
      <Button variant="ghost" size="sm" className="justify-start" onClick={handleProfileClick}>
        <User className="h-4 w-4 mr-2" />
        Profile
      </Button>
      
      <div className="border-t pt-3">
        <div className="px-2 py-1 text-sm text-muted-foreground">
          {user?.email}
        </div>
        <Button variant="ghost" size="sm" className="justify-start text-destructive hover:text-destructive" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">ThinkFlow</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Nexus Mind</p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <>
                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        <User className="h-4 w-4 mr-2" />
                        <span className="hidden lg:inline">Profile</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem disabled className="text-xs">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleProfileClick}>
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72 sm:w-80">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                            <Brain className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <span className="font-semibold">Menu</span>
                        </div>
                      </div>
                      <MobileActions />
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} size="sm" className="text-sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
