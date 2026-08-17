'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/notebook/page-header';
import { BlockEditor, BlockItem } from '@/components/notebook/block-editor';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useUIStore } from '@/lib/store/ui-store';

import { parseIpynbToCodeBook, exportCodeBookToIpynb } from '@/lib/converters/ipynb-converter';
import { Backlinks } from '@/components/notebook/backlinks';
import { KnowledgeGraphView } from '@/components/notebook/graph-view';

const defaultBlocks: BlockItem[] = [
  {
    id: 'block-1',
    type: 'text',
    content: 'A variable stores a value that can be referenced and manipulated later in your Python code.',
  },
  {
    id: 'block-2',
    type: 'heading',
    content: 'Basic Example',
  },
  {
    id: 'block-3',
    type: 'code',
    content: 'name = "Ghost"\nage = 22\n\nprint(f"User: {name}")\nprint(f"Age: {age}")',
    language: 'python',
    executionStatus: 'idle',
    outputs: [
      { type: 'text', content: 'User: Ghost\nAge: 22' },
    ],
  },
];

const visionBlocks: BlockItem[] = [
  {
    id: 'vision-1',
    type: 'text',
    content: 'Real-time hand landmark tracking and active finger counting using MediaPipe Tasks API and OpenCV.',
  },
  {
    id: 'vision-2',
    type: 'heading',
    content: 'MediaPipe Tasks Finger Detection',
  },
  {
    id: 'vision-3',
    type: 'code',
    content: `import os
import urllib.request
import cv2
import mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
import codebook as cb

MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
MODEL_DIR = os.path.join(os.path.expanduser("~"), ".codebook", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "hand_landmarker.task")

def get_hand_landmarker_model() -> str:
    if not os.path.exists(MODEL_PATH):
        os.makedirs(MODEL_DIR, exist_ok=True)
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    return MODEL_PATH

model_path = get_hand_landmarker_model()
TIP_IDS = [4, 8, 12, 16, 20]

options = vision.HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    num_hands=2,
    min_hand_detection_confidence=0.7,
    running_mode=vision.RunningMode.IMAGE
)

with vision.HandLandmarker.create_from_options(options) as landmarker:
    for frame in cb.camera.stream(fps=30, max_frames=300):
        h, w, c = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        results = landmarker.detect(mp_image)

        total_count = 0

        if results.hand_landmarks:
            for lms in results.hand_landmarks:
                fingers = [1 if lms[tip].y < lms[tip - 2].y else 0 for tip in TIP_IDS[1:]]
                count = sum(fingers)
                total_count += count

                xs = [int(l.x * w) for l in lms]
                ys = [int(l.y * h) for l in lms]
                min_x, max_x = min(xs), max(xs)
                min_y, max_y = min(ys), max(ys)

                cb.vision(frame).draw_box(
                    x=min_x - 10,
                    y=min_y - 10,
                    width=(max_x - min_x) + 20,
                    height=(max_y - min_y) + 20,
                    label=f"Fingers: {count}",
                    color="#00ff00"
                )

        print(f"Total Active Fingers Detected: {total_count}")`,
    language: 'python',
    executionStatus: 'idle',
    outputs: [],
  },
];

export default function NotebookPage() {
  const { activePageId, activePageTitle, activeTopicTitle } = useUIStore();
  const pageId = activePageId || 'page-variables';
  const [blocks, setBlocks] = useState<BlockItem[]>(defaultBlocks);
  const [pageTitle, setPageTitle] = useState('Variables & Data Types');

  const displayPageTitle = activePageTitle || pageTitle;

  // Load page blocks from backend API when active page changes
  useEffect(() => {
    async function fetchPageBlocks() {
      try {
        const res = await fetch(`/api/pages/${pageId}/blocks`);
        if (res.ok) {
          const data = await res.json();
          if (data.blocks && data.blocks.length > 0) {
            setBlocks(
              data.blocks.map((b: { id: string; type: BlockItem['type']; content: string; language?: string }) => ({
                id: b.id,
                type: b.type,
                content: b.content,
                language: b.language || 'python',
                executionStatus: 'idle',
                outputs: [],
              }))
            );
          } else if (pageId === 'page-vision') {
            setBlocks(visionBlocks);
          } else if (pageId !== 'page-variables') {
            // For new / empty pages, initialize clean notebook canvas
            setBlocks([
              {
                id: `block-${Date.now()}-1`,
                type: 'text',
                content: `Notes and code examples for ${activePageTitle || 'Untitled Page'}.`,
              },
              {
                id: `block-${Date.now()}-2`,
                type: 'heading',
                content: 'Python Example',
              },
              {
                id: `block-${Date.now()}-3`,
                type: 'code',
                content: `# Practice code for ${activePageTitle || 'Untitled Page'}\nprint("Hello from CodeBook!")`,
                language: 'python',
                executionStatus: 'idle',
                outputs: [],
              },
            ]);
          } else {
            setBlocks(defaultBlocks);
          }
        }
      } catch (err) {
        console.warn('Using default fallback blocks:', err);
      }
    }
    fetchPageBlocks();
  }, [pageId, activePageTitle]);

  // Sync edited blocks with backend API
  const saveBlocks = useCallback(async (currentBlocks: BlockItem[]) => {
    try {
      await fetch(`/api/pages/${pageId}/blocks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: currentBlocks.map((b, index) => ({
            type: b.type,
            content: b.content,
            language: b.language || 'python',
            position: index,
          })),
        }),
      });
    } catch (err) {
      console.warn('Save blocks warning:', err);
    }
  }, [pageId]);

  const { isSaving, isDirty, saveNow } = useAutoSave({
    data: blocks,
    onSave: saveBlocks,
    delay: 2000,
  });

  const handleImportIpynb = (content: string) => {
    try {
      const result = parseIpynbToCodeBook(content, pageTitle);
      setBlocks(result.blocks);
    } catch (err) {
      alert(`Failed to import .ipynb: ${(err as Error).message}`);
    }
  };

  const handleExportIpynb = () => {
    try {
      const jsonStr = exportCodeBookToIpynb(pageTitle, blocks);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pageTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ipynb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Failed to export .ipynb: ${(err as Error).message}`);
    }
  };

  // Global ⌘S / Ctrl+S keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveNow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveNow]);

  return (
    <AppShell>
      {/* Page Header Breadcrumbs, Title, Workspace Files, Save Status & Explicit Save Button */}
      <PageHeader
        notebookName="Python"
        topicTitle={activeTopicTitle || 'Fundamentals'}
        pageTitle={displayPageTitle}
        onTitleChange={(title) => setPageTitle(title)}
        lastEdited="Last edited just now"
        isSaving={isSaving}
        isDirty={isDirty}
        onSave={saveNow}
        onImportIpynb={handleImportIpynb}
        onExportIpynb={handleExportIpynb}
      />

      {/* Main Block Canvas */}
      <BlockEditor
        key={`editor-${blocks.length}-${blocks.map(b => b.id).join('-')}`}
        pageId={pageId}
        initialBlocks={blocks}
        onBlocksChange={(updated) => setBlocks(updated)}
      />

      {/* Bi-Directional Backlinks Section */}
      <Backlinks
        backlinks={[
          {
            id: 'page-control-flow',
            title: 'Control Flow & Functions',
            snippet: 'Uses variables defined in Variables & Data Types to compute total scores.',
          },
        ]}
      />

      {/* 2D Interactive Concept Knowledge Graph */}
      <KnowledgeGraphView />
    </AppShell>
  );
}
