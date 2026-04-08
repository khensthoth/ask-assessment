# Herbal Care ASK Assessment Tool v2.1

Employee assessment tool using the ASK framework (Attitude, Skills, Knowledge) with CARE values integration.

## Quick Deploy to GitHub Pages

### Step 1: Create a GitHub repo
1. Go to https://github.com/new
2. Name it `ask-assessment`
3. Make it **Private** (this has employee data)
4. Click "Create repository"

### Step 2: Push this code
```bash
cd ask-assessment
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ask-assessment.git
git push -u origin main
```

### Step 3: Install dependencies & deploy
```bash
npm install
```

**Edit `package.json`** — change the `homepage` line:
```json
"homepage": "https://YOUR_USERNAME.github.io/ask-assessment"
```

Then deploy:
```bash
npm run deploy
```

### Step 4: Enable GitHub Pages
1. Go to your repo → Settings → Pages
2. Source: select `gh-pages` branch
3. Save
4. Your tool will be live at: `https://YOUR_USERNAME.github.io/ask-assessment`

### Step 5: Share the link
Send the URL to Dean, TWL, or any Zone Owner via Lark. They open it on phone or computer, score their team members, and copy results back to you via Lark.

## How It Works
- **40 bilingual questions** (English + Chinese)
- **Attitude (50%)**: 18 questions mapped to CARE values (Care, Authenticity, Responsibility, Excellence)
- **Skills (25%)**: 12 universal, role-agnostic questions
- **Knowledge (25%)**: 10 universal, role-agnostic questions
- **Auto-verdict**: ⭐ Invest / ✅ Solid / ⚠️ Develop / 🔴 At Risk / ❌ Exit
- **Probation recommendation**: Confirm / Extend / Do Not Confirm
- **Data saved locally** in each user's browser (localStorage)
- **Copy to clipboard** for pasting into Lark

## Important Notes
- Data is stored in each person's browser — not shared between users
- Each assessor scores independently, then results are compared via Lark
- The tool works offline after first load
- Staff list can be updated in `src/App.js` → `STAFF_LIST` array
