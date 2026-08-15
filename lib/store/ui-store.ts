import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  activeNotebookId: string | null;
  activeTopicId: string | null;
  activePageId: string | null;
  expandedTopicIds: Record<string, boolean>;
  isSearchOpen: boolean;
  isScratchpadOpen: boolean;
  
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
}

export const useUIStore = create<UIState>((set) => ({
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
}));
