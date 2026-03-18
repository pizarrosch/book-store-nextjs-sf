# Custom Book Covers

Place your custom book cover images in this directory.

## Guidelines

- **Dimensions**: 200x300px (or any 2:3 aspect ratio)
- **Format**: JPG, PNG, or WEBP
- **Size**: Keep under 100KB when possible
- **Naming**: Use descriptive names (e.g., `book-title-cover.jpg`)

## Usage

After adding an image here, update the book in your database:

```bash
npx ts-node scripts/add-custom-cover.ts <bookId> <filename>
```

Example:
```bash
npx ts-node scripts/add-custom-cover.ts "abc123" "my-cover.jpg"
```

See the main `CUSTOM_COVERS_GUIDE.md` in the project root for full documentation.
