import { isSupabaseConfigured } from './supabase';

// Helpers for talking to Supabase.
// Keep database calls here (or in new files next to this one), not inside Phaser scenes.

export enum MenuItemType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

export type MenuItem = {
  type: MenuItemType;
  key: string;
  value: string;
};

export type MenuTab = {
  label: string;
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
      { label: 'Points', items: [{ type: MenuItemType.NUMBER, key: 'Total Points', value: '0' }] },
      {
        label: 'Avatar Settings',
        items: [
          { type: MenuItemType.STRING, key: 'Name', value: 'avatar name' },
          { type: MenuItemType.STRING, key: 'Avatar Color', value: 'color' },
        ],
      },
      {
        label: 'Password Settings',
        items: [
          { type: MenuItemType.STRING, key: 'Current Password', value: 'current password' },
          { type: MenuItemType.STRING, key: 'New Password', value: 'new password' },
        ],
      },
      {
        label: 'Leaderboard',
        items: [{ type: MenuItemType.STRING, key: 'Top Players', value: 'top players' }],
      },
    ],
  };
}
