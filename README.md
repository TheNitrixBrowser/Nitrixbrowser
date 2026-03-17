# Nitrix Browser

Nitrix to lekka przeglądarka internetowa zbudowana na Electron i Chromium, zaprojektowana z myślą o prostocie i pełnej kontroli użytkownika — bez zbędnych funkcji, bez własnej telemetrii.

---

## ⚠️ Wersja Alpha

Nitrix jest projektem w **aktywnej fazie rozwoju (Alpha)**. Oznacza to że:

- Mogą występować błędy, w tym błędy bezpieczeństwa
- **Nie zaleca się używania do operacji bankowych ani przechowywania wrażliwych danych**
- Do czasu wersji beta lub stabilnej używaj sprawdzonych przeglądarek do krytycznych czynności

Używasz Nitrix na własną odpowiedzialność — szczegóły w licencji MIT.

---

## Funkcje

- Wielokartowe przeglądanie z intuicyjnym interfejsem
- Pasek zakładek z obsługą favicon
- Historia przeglądania z wyszukiwaniem
- Panel pobierania plików z podglądem postępu i prędkości
- Wskaźnik bezpieczeństwa HTTPS z podglądem certyfikatu SSL
- Automatyczne aktualizacje
- Tryb jasny i ciemny
- Brak własnej telemetrii — Nitrix nie wysyła żadnych danych do własnych serwerów
- I wiele więcej!

---

## Prywatność

Nitrix nie zbiera żadnych danych użytkownika na własne serwery.

**Jednak korzystamy z usług zewnętrznych które mogą zbierać dane:**

- **Google Favicon Service** (`google.com/s2/favicons`) — używany do wyświetlania ikon stron. Google może widzieć jakie domeny odwiedzasz
- **Google DNS prefetch** — w celu przyspieszenia ładowania stron, nagłówki strony zawierają prefetch do domen Google
- **Strona startowa** — domyślnie google.pl (można modyfikować)

---

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Silnik przeglądarki | Chromium (przez Electron) |
| JavaScript engine | V8 |
| Framework | Electron |
| UI | HTML / CSS / Vanilla JS |
| Aktualizacje | electron-updater |

---

## Instalacja

Pobierz najnowszy instalator `.exe` ze strony [TheNitrixBrowser.github.io/Nitrixbrowser/](https://TheNitrixBrowser.github.io/Nitrixbrowser/)

---

## Licencja

MIT — szczegóły w pliku [LICENSE](./LICENSE)

---

## Autor

Projekt tworzony przez jedną osobę w ramach pasji do tworzenia oprogramowania.
Feedback, bugi i pomysły mile widziane.
