import { z } from 'zod';

// Notebook Schemas
export const createNotebookSchema = z.object({
  name: z.string().min(1, 'Notebook name is required').max(255),
});

export const updateNotebookSchema = z.object({
  name: z.string().min(1).max(255),
});

// Topic Schemas
export const createTopicSchema = z.object({
  notebookId: z.string().uuid('Invalid notebook ID'),
  parentId: z.string().uuid().nullable().optional(),
  title: z.string().min(1, 'Topic title is required').max(255),
  position: z.number().int().optional(),
});

export const updateTopicSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  parentId: z.string().uuid().nullable().optional(),
  position: z.number().int().optional(),
});

// Page Schemas
export const createPageSchema = z.object({
  topicId: z.string().uuid('Invalid topic ID'),
  title: z.string().min(1, 'Page title is required').max(255),
  position: z.number().int().optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  position: z.number().int().optional(),
});

// Block Schemas
export const blockTypeEnum = z.enum(['heading', 'text', 'code', 'output', 'image']);

export const blockSchema = z.object({
  id: z.string().uuid().optional(),
  type: blockTypeEnum,
  content: z.string(),
  language: z.string().optional().default('python'),
  position: z.number().int().optional().default(0),
});

export const syncBlocksSchema = z.object({
  blocks: z.array(blockSchema),
});

// Execution Request Schema
export const executeCodeSchema = z.object({
  code: z.string().min(1, 'Code snippet cannot be empty'),
  language: z.string().optional().default('python'),
  timeout: z.number().int().min(1).max(30).optional().default(10),
  session_id: z.string().optional(),
});
