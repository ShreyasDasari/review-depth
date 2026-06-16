# ReviewDepth Code Workflow

## Branch Strategy
- `main` — production-ready code, deployed to Vercel
- Feature branches per task: `feat/scraper`, `feat/analyzer`, `feat/dashboard`, etc.

## Process
1. All code changes go through feature branches → pull requests → merge
2. The lead reviews PRs before merging to main
3. Merges use squash commits

## Repo Structure
```
/ReviewDepth/
├── dashboard/          # Next.js frontend
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # DB schema
├── scraper/            # Scraping library
├── analyzer/           # Analysis library
└── shared/             # Architecture docs
```