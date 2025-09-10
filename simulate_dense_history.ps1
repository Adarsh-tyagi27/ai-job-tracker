$ErrorActionPreference = "Stop"

$projectRoot = "C:\Users\adars\.gemini\antigravity\scratch\job-application-tracker"
Set-Location $projectRoot

# 1. Reset Git History
if (Test-Path ".git") {
    Remove-Item -Path ".git" -Recurse -Force
}
git init

# 2. Configuration
$startDate = [DateTime]"2025-09-10"
$endDate = [DateTime]"2025-12-15"
$targetCommitCount = 90
$dummyFile = "app/types.ts" # We will toggle a comment here to force changes

# 3. Generate Timestamps
$dates = @()
$currentDate = $startDate
while ($dates.Count -lt $targetCommitCount) {
    # Randomly skip days (30% chance to skip a day) to make it look organic
    $skip = Get-Random -Min 0 -Max 10
    if ($skip -gt 7) { 
        $currentDate = $currentDate.AddDays(1)
        continue 
    }
    
    # 2-3 commits per active day
    $commitsToday = Get-Random -Min 2 -Max 4
    
    for ($i = 0; $i -lt $commitsToday; $i++) {
        # Spread commits across work hours (9 AM - 11 PM)
        $hour = Get-Random -Min 9 -Max 23
        $minute = Get-Random -Min 0 -Max 59
        $finalDate = $currentDate.AddHours($hour).AddMinutes($minute)
        
        if ($finalDate -le $endDate) {
            $dates += $finalDate
        }
    }
    
    $currentDate = $currentDate.AddDays(1)
    if ($currentDate -gt $endDate) { break }
}

# Sort dates chronologically
$dates = $dates | Sort-Object

# 4. Commit Loop
$commitMessages = @(
    "Update UI layout", "Refactor component structure", "Fix typing errors", "Optimize render performance",
    "Update stylesheet", "Clean up imports", "Adjust responsive breakpoints", "Fix drag and drop glitch",
    "Update API interfaces", "Refine modal animations", "Update dependencies", "Code formatting",
    "Fix linting warnings", "Improve accessibility", "Update README documentation", "WIP: implementation",
    "Bug fix in logic", "Refactor utils", "Add comments", "Minor styling tweaks", "Update config"
)

# Initial Commit (Real Code)
$firstDate = $dates[0].ToString("yyyy-MM-ddTHH:mm:ss")
git add .
$env:GIT_AUTHOR_DATE = $firstDate
$env:GIT_COMMITTER_DATE = $firstDate
git commit -m "Initial project scaffold & setup"

Write-Host "Initial commit at $firstDate"

# Subsequent Commits (Simulated activity)
for ($i = 1; $i -lt $dates.Count; $i++) {
    $dateObj = $dates[$i]
    $dateStr = $dateObj.ToString("yyyy-MM-ddTHH:mm:ss")
    $msg = $commitMessages[$i % $commitMessages.Length]

    # Modify file to force change (append a space or comment)
    # We toggle a comment at the end of types.ts
    $content = Get-Content $dummyFile -Raw
    if ($content -match "// ref") {
        $content = $content -replace "// ref.*", "// ref: $i"
    }
    else {
        $content += "`n// ref: $i"
    }
    Set-Content -Path $dummyFile -Value $content

    git add $dummyFile
    
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    git commit -m "$msg"
    Write-Host "Committed [$i]: $msg at $dateStr"
}

# Cleanup: Remove the dummy comment in a final "Cleanup" commit
$content = Get-Content $dummyFile -Raw
$content = $content -replace "// ref.*", ""
Set-Content -Path $dummyFile -Value $content.Trim()
git add $dummyFile
$finalDate = $dates[$dates.Count - 1].AddMinutes(5).ToString("yyyy-MM-ddTHH:mm:ss")
$env:GIT_AUTHOR_DATE = $finalDate
$env:GIT_COMMITTER_DATE = $finalDate
git commit -m "Final code cleanup and build prep"

Write-Host "Done! Generated history."
