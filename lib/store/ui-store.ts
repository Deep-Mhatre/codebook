import { create } from 'zustand';

export interface WorkspaceFile {
  name: string;
  size: number;
  type?: string;
  url?: string;
}

interface UIState {
  isSidebarOpen: boolean;
  activeNotebookId: string | null;
  activeTopicId: string | null;
  activePageId: string | null;
  expandedTopicIds: Record<string, boolean>;
  isSearchOpen: boolean;
  isScratchpadOpen: boolean;
  isWorkspaceExplorerOpen: boolean;
  workspaceFiles: WorkspaceFile[];
  
  // Media Streaming State
  isCameraStreaming: boolean;
  isAudioStreaming: boolean;
  stopStreamCallback: (() => void) | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActivePage: (pageId: string, topicId?: string) => void;
  toggleTopicExpand: (topicId: string) => void;
  setTopicExpanded: (topicId: string, expanded: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setScratchpadOpen: (open: boolean) => void;
  toggleScratchpad: () => void;
  setWorkspaceExplorerOpen: (open: boolean) => void;
  toggleWorkspaceExplorer: () => void;
  setWorkspaceFiles: (files: WorkspaceFile[]) => void;
  setCameraStreaming: (streaming: boolean) => void;
  setAudioStreaming: (streaming: boolean) => void;
  setStopStreamCallback: (cb: (() => void) | null) => void;
  stopAllStreams: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isSidebarOpen: true,
  activeNotebookId: 'default-notebook',
  activeTopicId: 'fundamentals',
  activePageId: 'page-variables',
  expandedTopicIds: {
    'fundamentals': true,
    'control-flow': false,
    'functions': false,
    'data-structures': false,
    'libraries': false,
  },
  isSearchOpen: false,
  isScratchpadOpen: false,
  isWorkspaceExplorerOpen: false,
  workspaceFiles: [],
  isCameraStreaming: false,
  isAudioStreaming: false,
  stopStreamCallback: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  
  setActivePage: (pageId, topicId) =>
    set((state) => ({
      activePageId: pageId,
      ...(topicId ? { activeTopicId: topicId } : {}),
    })),

  toggleTopicExpand: (topicId) =>
    set((state) => ({
      expandedTopicIds: {
        ...state.expandedTopicIds,
        [topicId]: !state.expandedTopicIds[topicId],
      },
    })),

  setTopicExpanded: (topicId, expanded) =>
    set((state) => ({
      expandedTopicIds: {
        ...state.expandedTopicIds,
        [topicId]: expanded,
      },
    })),

  setSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  
  setScratchpadOpen: (open) => set({ isScratchpadOpen: open }),
  toggleScratchpad: () => set((state) => ({ isScratchpadOpen: !state.isScratchpadOpen })),

  setWorkspaceExplorerOpen: (open) => set({ isWorkspaceExplorerOpen: open }),
  toggleWorkspaceExplorer: () => set((state) => ({ isWorkspaceExplorerOpen: !state.isWorkspaceExplorerOpen })),
  setWorkspaceFiles: (files) => set({ workspaceFiles: files }),

  setCameraStreaming: (streaming) => set({ isCameraStreaming: streaming }),
  setAudioStreaming: (streaming) => set({ isAudioStreaming: streaming }),
  setStopStreamCallback: (cb) => set({ stopStreamCallback: cb }),
  stopAllStreams: () => {
    const cb = get().stopStreamCallback;
    if (cb) cb();
    set({ isCameraStreaming: false, isAudioStreaming: false, stopStreamCallback: null });
  },
}));
