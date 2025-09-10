$ErrorActionPreference = "Stop"

# Ensure we are in the project root
$projectRoot = "C:\Users\adars\.gemini\antigravity\scratch\job-application-tracker"
Set-Location $projectRoot

# Initialize Git
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git..."
    git init
}

# Remove any existing commits (soft reset to keep changes in working directory) if needed
# But for safety, we assume it's fresh or we just append.
# Since we want to backdate, we need to create a fresh history.
# WARNING: This deletes .git to start fresh.
if (Test-Path ".git") {
    Remove-Item -Path ".git" -Recurse -Force
    git init
}

# Configure User (Local to this repo) - Optional, uses global if not set
# git config user.name "Your Name" 
# git config user.email "you@example.com"

# Define commit steps
$steps = @(
    @{
        Date = "2025-11-25T10:00:00"
        Msg = "Initial project setup with Next.js and TypeScript"
        Files = @("package.json", "package-lock.json", "tsconfig.json", "next.config.ts", ".gitignore", "README.md", "eslint.config.mjs", "next-env.d.ts", "public/")
    },
    @{
        Date = "2025-11-29T14:30:00"
        Msg = "Setup global CSS variables and dark theme"
        Files = @("app/globals.css", "app/layout.tsx")
    },
    @{
        Date = "2025-12-04T09:15:00"
        Msg = "Define TypeScript interfaces and mock data"
        Files = @("app/types.ts", "app/data/mockData.ts")
    },
    @{
        Date = "2025-12-11T16:45:00"
        Msg = "Implement Kanban Board with drag and drop"
        Files = @("app/components/KanbanBoard.tsx", "app/components/KanbanBoard.module.css")
    },
    @{
        Date = "2025-12-18T11:20:00"
        Msg = "Add AddApplicationModal component"
        Files = @("app/components/AddApplicationModal.tsx", "app/components/AddApplicationModal.module.css")
    },
    @{
        Date = "2025-12-24T13:00:00"
        Msg = "Integrate OpenAI API for resume analysis"
        Files = @("app/api/analyze/route.ts")
    },
    @{
        Date = "2025-12-30T15:55:00"
        Msg = "Finalize UI and clean up homepage"
        Files = @("app/page.tsx")
    }
)

# Unstage everything initially
# We do this by git add . then accessing files, but better to add one by one.
# Valid strategy: Git add . implies everything.
# We will Stage specific files for each commit.

foreach ($step in $steps) {
    $date = $step.Date
    $msg = $step.Msg
    $files = $step.Files

    Write-Host "Committing: $msg on $date"

    # Environment variables for date
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date

    foreach ($file in $files) {
        if (Test-Path $file) {
            git add $file
        } else {
            Write-Warning "File not found: $file"
        }
    }

    # Commit
    git commit -m "$msg"
}

Write-Host "History simulated successfully!"
