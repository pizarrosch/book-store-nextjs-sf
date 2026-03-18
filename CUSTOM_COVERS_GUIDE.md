# Custom Book Covers Guide

This guide explains how to manage book covers in your application.

## Cover Priority System

The application uses a simple priority system for book covers:

1. **Custom Cover** (Highest priority) - Manually uploaded covers you add
2. **Google Books API Cover** - Covers from Google Books (zoom=3)
3. **Fallback Image** - Default no-cover image when nothing else is available

## Adding Custom Covers Manually

### Option 1: Using the Script (Recommended)

1. **Get the Book ID**
   - Open your browser's developer console
   - Find the book you want to update
   - Note its ID from the URL or API response

2. **Prepare Your Cover Image**
   - Recommended size: 200x300px (or any 2:3 ratio)
   - Format: JPG, PNG, or WEBP
   - Place it in: `public/assets/book-covers/`

3. **Run the Script**
   ```bash
   npx tsx scripts/add-custom-cover.ts <bookId> <filename>
   ```

   Example:
   ```bash
   npx tsx scripts/add-custom-cover.ts "abc123xyz" "gatsby-cover.jpg"
   ```

### Option 2: Direct Database Update

You can also update the database directly using Prisma Studio:

```bash
npx prisma studio
```

1. Navigate to the `Book` model
2. Find your book
3. Set `customCoverUrl` to `/assets/book-covers/your-image.jpg`
4. Save

### Option 3: SQL Query

```sql
UPDATE Book
SET customCoverUrl = '/assets/book-covers/your-image.jpg'
WHERE id = 'book-id-here';
```

## Best Practices

1. **Image Dimensions**: Use 200x300px or maintain a 2:3 aspect ratio
2. **File Size**: Optimize images to keep them under 100KB for faster loading
3. **Naming**: Use descriptive names like `book-title-cover.jpg`
4. **Format**: Use JPG for photos, PNG for illustrations with transparency

## Troubleshooting

**Custom cover not showing?**
- Verify the image exists at `public/assets/book-covers/filename.jpg`
- Check the `customCoverUrl` in the database matches the file path
- Ensure the path starts with `/assets/book-covers/` (not `/public/assets/...`)
- Clear your browser cache and refresh
- Restart your dev server
