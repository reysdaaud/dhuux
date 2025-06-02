'use client';
import type { FC } from 'react';
import { Home, Search, MusicIcon as LucideSounds, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  targetTab: string;
}

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tabLabel: string) => void;
}

const BottomNavBar: FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const navItems: NavItem[] = [
    { label: 'Home', icon: Home, targetTab: 'Home' },
    { label: 'Search', icon: Search, targetTab: 'Markets' },
    { label: 'Sounds', icon: LucideSounds, targetTab: 'Sounds' },
    { label: 'Articles', icon: FileText, targetTab: 'Articles' },
  ];

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 md:hidden h-16 z-50 shadow-lg"
      style={{
        background: 'linear-gradient(to right, hsl(240.92deg 90.16% 34.45%), hsl(330deg 90.16% 21.61%))',
      }}
    >
      <nav className="flex justify-around items-center h-full px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.targetTab;
          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                'flex flex-col items-center justify-center space-y-1 w-full h-full rounded-md p-2 transition-colors duration-200 ease-in-out flex-1',
                isActive ? 'text-primary-foreground font-bold' : 'text-primary-foreground/70 hover:text-primary-foreground'
              )}
              onClick={() => onTabChange(item.targetTab)}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn('h-7 w-7', isActive ? 'stroke-[2.5px]' : '')} />
              <span className={cn('text-xs', isActive ? 'font-semibold' : 'font-medium')}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNavBar;
