### Phase: Server Configuration & DNS Verification Jobs

- **Timestamp:** 2026-09-30 17:35
- **Mode:** Agent
- **Persona(s) Active:** ⚙️ Backend Engineer
- **Files Modified/Created:**
  - `resources/js/pages/site-domain/_sections/DomainTableSection.jsx` — Updated the setup modal text to explicitly instruct a TTL of 300.
  - `resources/stubs/nginx.stub` — Created a base template for Nginx web server blocks.
  - `app/Services/ServerConfigurationService.php` — Built the core service that generates Nginx configurations from the stub, safely runs `nginx -t`, and reloads the server (with a rollback if `nginx -t` fails).
  - `app/Console/Commands/VerifyPendingDomains.php` — Created a scheduled command to verify DNS propagation via `dns_get_record`.
  - `app/Jobs/IssueSslCertificateJob.php` — Created a background job that invokes Certbot for SSL issuance after Nginx configuration is successful.
  - `routes/console.php` — Scheduled the verification command to run `everyMinute()`.
- **Issues Encountered:** None. The scaffolding and service injection worked perfectly.
- **Resolution:** N/A.
- **QA Checklist Result:** ✅ All pass. Safety checks for `nginx -t` are correctly implemented, preventing the web server from breaking.
- **Next Steps:** None. The core server magic is now fully planned and scaffolded.
