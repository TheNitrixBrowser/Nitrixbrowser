# Nitrix Browser

Nitrix to lekka przeglądarka internetowa zbudowana na Electronie i Chromium. Projekt stawia na prosty interfejs, wygodne codzienne przeglądanie stron oraz większą kontrolę nad danymi witryn i uprawnieniami.

Nitrix nie ma własnej telemetrii i nie wysyła danych użytkownika na własne serwery.

## Wersja 2.1.0 BETA

Nitrix jest projektem w aktywnej fazie rozwoju. Oznacza to, że:

- mogą występować błędy,
- część funkcji może jeszcze wymagać dopracowania,
- mogą występować problemy związane z bezpieczeństwem lub zgodnością stron,
- używasz Nitrix na własną odpowiedzialność.

Szczegóły znajdują się w licencji MIT.

## Obsługiwane systemy

- Windows x64
- Linux x86_64 w formacie AppImage

Wersja AppImage działa bez instalacji zależności przez menedżer pakietów. Obsługa efektu Backdrop Blur na Linuksie zależy od używanego środowiska graficznego i kompozytora.

## Funkcje

- Przeglądanie wielokartowe z kartami prywatnymi
- Pasek zakładek, lista wszystkich zakładek oraz eksport zakładek do pliku HTML
- Historia przeglądania z wyszukiwaniem oraz historia pobierania plików
- Menedżer haseł zabezpieczony PIN-em i autouzupełnianie na stronach logowania
- Import zakładek, historii i haseł z obsługiwanych przeglądarek
- Ustawienie Nitrix jako domyślnej przeglądarki
- Obsługa lokalnych plików HTML
- Wbudowane strony `nitrix://`, między innymi ustawienia, historia i „Co nowego?”
- Nitrix Adblock z możliwością wyłączenia go dla pojedynczej witryny oraz własnymi filtrami
- Panel pobierania z postępem, prędkością, wstrzymywaniem, wznawianiem i anulowaniem
- Informacje o połączeniu HTTPS i podgląd certyfikatu SSL
- Ochrona lokalnego adresu IP przed odczytem przez WebRTC, domyślnie włączona
- Uprawnienia witryn dla kamery, mikrofonu, lokalizacji i powiadomień
- Usuwanie danych i zgód pojedynczej witryny lub całej przeglądarki
- Przybliżona lokalizacja po IP wyłącznie po udzieleniu zgody
- Wyszukiwanie tekstu na stronie z licznikiem wyników
- Usypianie nieaktywnych kart w celu ograniczenia zużycia pamięci
- Przywracanie poprzedniej sesji i ostatnio zamkniętych kart
- Motywy: ciemny, jasny, prywatny i Backdrop Blur
- Język polski i angielski
- Automatyczne aktualizacje dla Windows i AppImage

## Najważniejsze skróty klawiszowe

| Skrót | Działanie |
| --- | --- |
| `Ctrl + T` | Nowa karta |
| `Ctrl + W` | Zamknięcie bieżącej karty |
| `Ctrl + Shift + T` | Przywrócenie zamkniętej karty |
| `Ctrl + Tab` / `Ctrl + PgDn` | Następna karta |
| `Ctrl + N` | Nowe okno |
| `Ctrl + Shift + N` | Nowe okno prywatne |
| `Alt + ←` / `Alt + →` | Wstecz / dalej |
| `Ctrl + D` | Dodanie zakładki |
| `Ctrl + H` / `Ctrl + J` | Historia / pobrania |
| `Ctrl + K` | Przejście do paska adresu |
| `Ctrl + F` / `F3` | Wyszukiwanie na stronie |
| `F5` / `Ctrl + R` | Odświeżenie strony |
| `Ctrl + F5` / `Ctrl + Shift + R` | Twarde odświeżenie bez cache |
| `Esc` | Zatrzymanie ładowania lub zamknięcie otwartego panelu |

## Co nowego w 2.1.0

- Dodano motyw Backdrop Blur z regulacją siły efektu oraz wyborem obszarów interfejsu.
- Dodano wyszukiwanie tekstu na stronie wraz z przechodzeniem między wynikami.
- Dodano obsługę skrótów klawiszowych do kart, historii, pobrań, zakładek, powiększania i nawigacji.
- Dodano usypianie nieaktywnych kart oraz wyjątki dla witryn.
- Dodano przywracanie ostatnio zamkniętych kart i odzyskiwanie sesji po awarii.
- Dodano możliwość otwierania ustawień, historii, menedżera haseł i „Co nowego?” w osobnej karcie.
- Dodano własne pytania o uprawnienia stron oraz zarządzanie zgodami pod ikoną kłódki.
- Dodano usuwanie danych i zgód pojedynczej witryny.
- Dodano eksport zakładek do pliku HTML.
- Poprawiono autouzupełnianie haseł na stronach wieloetapowych oraz w osadzonych formularzach.
- Poprawiono stabilność przy zamykaniu kart, obsługę importu i odzyskiwanie po błędach interfejsu.
- Włączono sandbox dla wszystkich kart oraz wzmocniono izolację odwiedzanych stron od interfejsu przeglądarki.
- Poprawiono zgodność z WhatsApp Web.

## Prywatność

Nitrix nie zbiera danych użytkownika na własne serwery.

Aplikacja może korzystać z usług zewnętrznych, które przetwarzają dane potrzebne do działania danej funkcji:

- Google Favicon Service (`google.com/s2/favicons`) — pobieranie ikon odwiedzanych stron; usługa może otrzymać domenę strony, której ikona jest potrzebna.
- Google DNS prefetch — przyspieszenie ładowania wybranych zasobów.
- `ipwho.is` — używane tylko po wyrażeniu zgody na przybliżoną lokalizację po IP.
- GitHub Releases — sprawdzanie i pobieranie aktualizacji aplikacji.
- Strona startowa i wyszukiwarka — domyślnie mogą korzystać z Google, ale można je zmienić w ustawieniach.

## Stack technologiczny

| Warstwa | Technologia |
| --- | --- |
| Silnik przeglądarki | Chromium przez Electron |
| Silnik JavaScript | V8 |
| Framework | Electron 44 |
| Interfejs | HTML, CSS i Vanilla JavaScript |
| Dane lokalne | JSON i SQL.js |
| Aktualizacje | electron-updater / GitHub Releases |

## Instalacja

Aktualne instalatory są dostępne na stronie [wydań Nitrix](https://github.com/TheNitrixBrowser/autoaktualizacjenitrix/releases).

### Windows

Pobierz instalator `.exe` dla architektury x64 i uruchom go jak zwykły program instalacyjny.

### Linux

Pobierz plik `.AppImage`, nadaj mu uprawnienia do uruchamiania, a następnie uruchom go:

```bash
chmod +x Nitrix-2.1.0-x86_64.AppImage
./Nitrix-2.1.0-x86_64.AppImage
```

## Uruchomienie ze źródeł

Wymagany jest Node.js oraz npm. Na Linuksie, aby uruchamiać i budować funkcje specyficzne dla systemu, potrzebny jest także kompilator C++.

```bash
npm install
npm start
```

Testy:

```bash
npm test
```

Budowanie instalatorów dla Windows i Linux:

```bash
npm run dist
```

## Strona projektu

[TheNitrixBrowser.github.io/Nitrixbrowser](https://TheNitrixBrowser.github.io/Nitrixbrowser/)

## Licencja

MIT — szczegóły w pliku `LICENSE`.

## Autor

Projekt tworzony przez jedną osobę w ramach pasji do tworzenia oprogramowania.

Zgłoszenia błędów, uwagi i pomysły są mile widziane.
