# Clean install note

Your screenshot shows old extracted build folders sitting inside the project root.

Delete these local folders before copying in the new build:

- `firevault-build-0.40.1-modular-root`
- `firevault-build-0.40.2-modular-root`
- `firevault-build-0.40.3-modular-root`
- any other `firevault-build-*` folders

Then copy/extract this ZIP into the project root so the root contains `index.html`, `manifest.json`, `src/`, `assets/`, and optional project files like `package.json`.

Do not drag the entire unzipped build folder into the project. Open the ZIP or folder and copy the contents into the project root.
