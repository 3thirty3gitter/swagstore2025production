
import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We can't use the native EventEmitter because it's not available in the browser
// This is a simple polyfill. A more robust solution might be a library like 'mitt'.
class SimpleEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): void {
    if (!this.listeners[event]) return;

    const idx = this.listeners[event].indexOf(listener);
    if (idx > -1) {
      this.listeners[event].splice(idx, 1);
    }
  }

  emit<E extends keyof AppEvents>(event: E, ...args: Parameters<AppEvents[E]>): void {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach(listener => {
      try {
        listener(...args);
      } catch (e) {
        console.error(`Error in event listener for ${event}:`, e);
      }
    });
  }
}


export const errorEmitter = new SimpleEventEmitter();
