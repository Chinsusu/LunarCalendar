/**
 * Keyboard Shortcuts Hook for Web
 * Handles keyboard navigation and shortcuts
 */

import { useEffect } from 'react';
import { Platform } from 'react-native';

export interface KeyboardShortcutsConfig {
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onToday?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  useEffect(() => {
    // Only enable keyboard shortcuts on web
    if (Platform.OS !== 'web') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          config.onPrevMonth?.();
          break;

        case 'ArrowRight':
          event.preventDefault();
          config.onNextMonth?.();
          break;

        case 't':
        case 'T':
          event.preventDefault();
          config.onToday?.();
          break;

        case 'Escape':
          event.preventDefault();
          config.onEscape?.();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config]);
}
