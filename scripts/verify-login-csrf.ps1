$base = 'http://127.0.0.1:8000'
$r = Invoke-WebRequest -Uri "$base/login" -UseBasicParsing -SessionVariable ws
$xsrf = [System.Uri]::UnescapeDataString(($ws.Cookies.GetCookies($base) | Where-Object Name -eq 'XSRF-TOKEN').Value)
$body = '{"email":"admin@example.com","password":"password","remember":false}'
try {
    $p = Invoke-WebRequest -Uri "$base/login" -Method POST -WebSession $ws `
        -Headers @{ 'X-XSRF-TOKEN' = $xsrf } `
        -ContentType 'application/json' -Body $body -UseBasicParsing -ErrorAction Stop
    Write-Output "FINAL STATUS: $($p.StatusCode)"
    Write-Output "FINAL URL: $($p.BaseResponse.ResponseUri)"

    $u = Invoke-WebRequest -Uri "$base/api/user" -WebSession $ws -Headers @{ 'Accept' = 'application/json'; 'Referer' = "$base/dashboard" } -UseBasicParsing
    Write-Output "API /user STATUS: $($u.StatusCode)"
    Write-Output "API /user BODY: $($u.Content)"

    $roles = Invoke-WebRequest -Uri "$base/api/roles" -WebSession $ws -Headers @{ 'Accept' = 'application/json'; 'Referer' = "$base/dashboard" } -UseBasicParsing
    Write-Output "API /roles STATUS: $($roles.StatusCode)"

    $perms = Invoke-WebRequest -Uri "$base/api/permissions?per_page=100" -WebSession $ws -Headers @{ 'Accept' = 'application/json'; 'Referer' = "$base/dashboard" } -UseBasicParsing
    Write-Output "API /permissions STATUS: $($perms.StatusCode)"
} catch {
    $resp = $_.Exception.Response
    if ($resp -and $resp.StatusCode) {
        Write-Output "STATUS: $([int]$resp.StatusCode)"
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
        Write-Output "BODY: $($reader.ReadToEnd())"
    }
    else { Write-Output "ERROR: $($_.Exception.Message)" }
}
