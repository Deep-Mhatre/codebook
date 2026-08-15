import { db } from './index';
import { notebooks, topics, pages, blocks } from './schema';

export async function seedDatabase(userId: string = '00000000-0000-0000-0000-000000000000') {
  console.log('Seeding initial CodeBook starter notebooks...');

  try {
    // 1. Create Default Notebook
    const [notebook] = await db
      .insert(notebooks)
      .values({
        userId,
        name: 'Python & Data Science Masterbook',
      })
      .returning();

    // 2. Create Topic: 1. Python Fundamentals
    const [topicFundamentals] = await db
      .insert(topics)
      .values({
        notebookId: notebook.id,
        title: '1. Python Fundamentals',
        position: 0,
      })
      .returning();

    // Page: Variables & Types
    const [pageVariables] = await db
      .insert(pages)
      .values({
        topicId: topicFundamentals.id,
        title: 'Variables & Data Types',
        position: 0,
      })
      .returning();

    await db.insert(blocks).values([
      {
        pageId: pageVariables.id,
        type: 'text',
        content: 'Python variables are dynamically typed and store data objects in memory.',
        position: 0,
      },
      {
        pageId: pageVariables.id,
        type: 'code',
        content: 'name = "CodeBook User"\nversion = 1.0\nnumbers = [10, 20, 30, 40, 50]\n\nprint(f"Product: {name}")\nprint(f"Version: {version}")\nprint("Average:", sum(numbers) / len(numbers))',
        language: 'python',
        position: 1,
      },
    ]);

    // 3. Create Topic: 2. Data Science (Pandas & Polars)
    const [topicDataScience] = await db
      .insert(topics)
      .values({
        notebookId: notebook.id,
        title: '2. Data Science & High Performance',
        position: 1,
      })
      .returning();

    // Page: Polars & Pandas
    const [pagePolars] = await db
      .insert(pages)
      .values({
        topicId: topicDataScience.id,
        title: 'Polars & Pandas High-Speed DataFrames',
        position: 0,
      })
      .returning();

    await db.insert(blocks).values([
      {
        pageId: pagePolars.id,
        type: 'heading',
        content: 'Blazing Fast Data Processing',
        position: 0,
      },
      {
        pageId: pagePolars.id,
        type: 'code',
        content: 'import polars as pl\n\ndf = pl.DataFrame({\n    "Framework": ["Polars", "Pandas", "PySpark"],\n    "Speed": ["Blazing", "Fast", "Distributed"],\n    "Stars": [31000, 42000, 39000]\n})\n\nprint(df)',
        language: 'python',
        position: 1,
      },
    ]);

    // 4. Create Topic: 3. Computer Vision & OpenCV
    const [topicVision] = await db
      .insert(topics)
      .values({
        notebookId: notebook.id,
        title: '3. Computer Vision & OpenCV',
        position: 2,
      })
      .returning();

    // Page: Image Filtering
    const [pageVision] = await db
      .insert(pages)
      .values({
        topicId: topicVision.id,
        title: 'OpenCV Synthetic Image Operations',
        position: 0,
      })
      .returning();

    await db.insert(blocks).values([
      {
        pageId: pageVision.id,
        type: 'code',
        content: 'import cv2\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Create synthetic test image\nimg = np.zeros((300, 300, 3), dtype=np.uint8)\ncv2.circle(img, (150, 150), 80, (0, 255, 128), -1)\n\nplt.figure(figsize=(4, 4))\nplt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))\nplt.title("OpenCV Generated Graphic")\nplt.axis("off")\nplt.show()',
        language: 'python',
        position: 0,
      },
    ]);

    console.log('Successfully seeded database with starter notebooks!');
  } catch (err) {
    console.error('Database seeding error:', err);
  }
}
