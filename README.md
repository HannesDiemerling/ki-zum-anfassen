# KI zum Anfassen – Begleitseite

Mobile Infoseite zum Abendprogramm „KI verstehen – gut entscheiden“ mit den drei Stationen „Sehen“, „Sprechen“ und „Fühlen“. Die Seite ersetzt gedruckte Plakate: An jeder Station hängt ein QR-Code, der auf die passende Unterseite führt.

- Rein statisch (HTML, CSS, etwas JavaScript), ohne externe Ressourcen, ohne Cookies, ohne Tracking
- Mobil optimiert, mit Dunkelmodus; Animationen werden bei „reduzierter Bewegung“ abgeschaltet
- Veröffentlichung automatisch über GitHub Actions auf GitHub Pages

## Aufbau

```
site/
  index.html        Überblick: Stationen, Vermenschlichungsfalle, vier Fragen, Exkurs
  station-1.html    „Sehen“ – mit Quiz (6 Fragen, Punktestand)
  station-2.html    „Sprechen“ – Stresstest für den Chatbot, mit Quiz (6 Fragen, Punktestand)
  station-3.html    „Fühlen“ – Mensch gegen Maschine
  assets/           style.css, app.js, favicon.svg
tools/check_site.py Prüft vor dem Veröffentlichen, ob alle internen Links existieren
.github/workflows/pages.yml
```

## Veröffentlichen

1. Diesen Ordner als eigenes GitHub-Repository anlegen, z.B. `ki-zum-anfassen`, und auf `main` pushen.
2. Auf GitHub unter **Settings → Pages → Build and deployment → Source** die Option **„GitHub Actions“** wählen.
3. Der Workflow „Website veröffentlichen“ läuft bei jedem Push auf `main` (oder manuell unter *Actions*).
4. Adresse: `https://<benutzername>.github.io/<repo-name>/`, z.B. `https://hannesdiemerling.github.io/ki-zum-anfassen/`

**Wichtig:** Die QR-Codes zum Ausdrucken werden außerhalb dieses Repos erzeugt (`karten/qr_erzeugen.py` im Projektordner). Stimmt die Adresse nicht mit der Vorgabe überein, die QR-Codes mit der richtigen Adresse neu erzeugen.

## Lokal ansehen

```
python3 -m http.server -d site 8080
```
Dann `http://localhost:8080` öffnen.
