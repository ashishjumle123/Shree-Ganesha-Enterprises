# Correct script to fix all localhost:8080 URLs properly
# This replaces 'http://localhost:8080/...' with `${BASE_URL}/...` (proper template literal)

$srcDir = "C:\Users\Asus\OneDrive\Desktop\ShreeGanesha\client\src"
$files = Get-ChildItem -Path $srcDir -Recurse -Include "*.jsx","*.js" |
         Where-Object { $_.FullName -notmatch "node_modules" -and $_.Name -ne "api.js" }

foreach ($file in $files) {
    $raw = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    if ($raw -notmatch "localhost:8080|BASE_URL") { continue }
    
    Write-Host "Processing: $($file.FullName)"
    
    # Fix broken replacements from previous script run:
    # Pattern: ${BASE_URL}/something' -> `${BASE_URL}/something`
    # The previous script left: (${BASE_URL}/api/...', { 
    # We need:                  (`${BASE_URL}/api/...`, {

    # Replace the broken pattern: 
    #  (${BASE_URL}/path' -> (`${BASE_URL}/path`
    #  `${BASE_URL}/path', -> `${BASE_URL}/path`,
    
    # Fix string patterns like: 'broken_start${BASE_URL}/...'
    # These appear as: ${BASE_URL}/api/... followed by a closing quote
    
    # Pattern 1: standalone template-like without opening backtick before (
    # e.g.   await fetch(${BASE_URL}/api/... '  -> await fetch(`${BASE_URL}/api/...`
    $raw = $raw -replace '\(\$\{BASE_URL\}([^''`\r\n]*?)''', '(`${BASE_URL}$1`'
    
    # Pattern 2: string concat patterns like: axios.post(${BASE_URL}/api/...',
    $raw = $raw -replace '(?<!\`)\$\{BASE_URL\}([^''`\r\n,\)]*?)''([,\s])', '`${BASE_URL}$1`$2'
    
    # Pattern 3: template literals that already have opening backtick but missing closing
    # e.g. `${BASE_URL}/api/products/${id}` - these should already be correct
    
    # Pattern 4: Fix patterns from the broken script - {BASE_URL}/...`
    # Some may already use backticks correctly

    # Clean up any remaining localhost:8080 that wasn't fixed (shouldn't be any but just in case)
    $raw = $raw -replace "'http://localhost:8080", '`${BASE_URL}'
    $raw = $raw -replace '"http://localhost:8080', '`${BASE_URL}'

    [System.IO.File]::WriteAllText($file.FullName, $raw, [System.Text.Encoding]::UTF8)
    Write-Host "  Done."
}

Write-Host "`nAll files processed."
