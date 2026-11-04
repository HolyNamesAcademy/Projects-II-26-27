import { isSupabaseConfigured } from './supabase';

export enum MenuItemType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}
export type MenuItem = {
  type: MenuItemType;
  name: string;
  value: string;
};

export type MenuTab = {
  name: string;
  items: MenuItem[];
};

export type Menu = {
  tabs: MenuTab[];
};

function requireConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env and add your project URL and publishable key.',
    );
  }
}

export async function getMenu(): Promise<Menu> {
  requireConfigured();

  return {
    tabs: [
      { name: 'Home', items: [] },
      { name: 'Settings', items: [] },
      { name: 'Profile', items: [] },
    ],
  };
}
