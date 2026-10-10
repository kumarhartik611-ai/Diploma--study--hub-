# Diploma Study Hub

A responsive React + Vite starter for a bilingual (English/Hindi) study-material library. Includes search, stream/branch filters, semester and material-type filters, demo listings, and an admin form for adding public resource links.

## Important limitation: static hosting and admin uploads

GitHub Pages serves static files; it does not provide a private server/database. In this starter, the Admin form saves custom links in **the current browser's localStorage only**. It does not upload a PDF or publish a resource for all visitors. The export button downloads your custom resource list as JSON.

For a real public admin upload workflow, add a backend such as Supabase or Firebase Storage with an authenticated admin role. Visitors can still browse and download public materials without logging in; only the administrator should need to sign in. Never put admin passwords or secret API keys in frontend code.

## Run locally

1. Install Node.js (LTS) from https://nodejs.org/
2. Extract this ZIP and open the `diploma-study-hub` folder in a terminal.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL shown by Vite (usually `http://localhost:5173`).

Check the production build before deploying:

```bash
npm run build
npm run preview
```

## Publish for free with GitHub Pages

1. Sign in to GitHub and create a **public** repository named `diploma-study-hub`.
2. Upload all files and folders from this project to the repository. Make sure `.github/workflows/deploy.yml` is included.
3. Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. Open the **Actions** tab. Wait for “Deploy Diploma Study Hub to GitHub Pages” to finish successfully.
5. Your website will be available at `https://YOUR-USERNAME.github.io/diploma-study-hub/` (replace `YOUR-USERNAME` with your GitHub username).

If you choose a different repository name, the site still uses relative asset paths, but verify the published URL under Settings → Pages. Updates pushed to `main` trigger another deployment.

## Add permanent public study materials

For permanent materials visible to all visitors on the live site:

1. Upload only files you created, have permission to distribute, or that are explicitly available for redistribution. For copyrighted textbooks, link to the publisher/library/official source instead of rehosting a copy.
2. For PDFs you are allowed to publish, place them in `public/materials/` and add a matching item to `src/data.js` with a URL such as `./materials/my-notes.pdf`.
3. Commit and push to `main`; GitHub Actions will rebuild and publish the site.

Example resource object:

```js
{
  id: 'ee-sem3-ohms-law',
  title: 'Ohm’s Law — Notes',
  titleHi: 'ओम का नियम — नोट्स',
  branch: 'Electrical Engineering',
  semester: 'Semester 3',
  category: 'Notes',
  language: 'English + Hindi',
  description: 'Original notes written for students.',
  url: './materials/ohms-law-notes.pdf',
  isDemo: false
}
```

Supported categories: `Notes`, `PYQ`, `Books`, `Syllabus`. The branch list is in `src/data.js`. The current example entries are **placeholders**, not verified course content. Replace them with the correct curriculum and authorized sources for your board/institute.

## Project structure

```text
diploma-study-hub/
├── .github/workflows/deploy.yml
├── public/
├── src/
│   ├── App.jsx
│   ├── data.js
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## Next steps

- Replace demo links with official board/institute links and your own notes.
- Add subjects and subject codes after verifying the relevant syllabus.
- For genuine admin uploads, configure Supabase/Firebase Storage and an admin-only authentication policy.
- Consider adding accessibility checks, privacy information, and a contact page before sharing widely.
