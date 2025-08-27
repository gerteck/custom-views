<frontmatter>
  title: Making a Release
</frontmatter>


<!-- Markdown Guide to releasing next version of this package -->

# Making a Release

Follow these steps to bundle and release the next version of this package:

## 1. Update the Version

Edit `package.json` and increment the `"version"` field as needed.

## 2. Update Dependencies

Run:

```sh
npm install
```

This updates `package-lock.json` to match your new version and dependencies.

## 3. Build the Bundle

Run:

```sh
npm run build
```

This generates the bundled files in the `dist/` folder.

## 4. Login to npm (if needed)

```sh
npm login
```

## 5. Publish to npm

Run:

```sh
npm publish
```

Your package will now be available on npm.

## 6. (Optional) Tag a Release on GitHub

Push your changes and create a release/tag for versioning.

---

**Tip:**  
- Use `npm version patch|minor|major` to bump the version automatically.
- Make sure your `dist/` files are up to date before