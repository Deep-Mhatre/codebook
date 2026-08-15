'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void> | void;
  delay?: number;
}

export function useAutoSave<T>({ data, onSave, delay = 1500 }: AutoSaveOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const isFirstRender = useRef(true);
  const latestDataRef = useRef(data);
  latestDataRef.current = data;

  const performSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(latestDataRef.current);
      setLastSavedAt(new Date());
      setIsDirty(false);
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  useEffect(() => {
    // Skip initial render auto-save trigger
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsDirty(true);
    setIsSaving(true);
    const handler = setTimeout(async () => {
      await performSave();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [data, delay, performSave]);

  return { isSaving, isDirty, lastSavedAt, saveNow: performSave };
}
