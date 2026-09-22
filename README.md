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
