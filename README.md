# Nitrix Browser

Nitrix to lekka przeglądarka internetowa zbudowana na Electronie i Chromium, zaprojektowana z myślą o prostocie, wygodzie i większej kontroli użytkownika.

Projekt nie posiada własnej telemetrii i nie wysyła danych użytkownika na własne serwery.

## Wersja 2.0.1 BETA

Nitrix jest projektem w aktywnej fazie rozwoju. Oznacza to, że:

- mogą występować błędy,
- część funkcji może jeszcze wymagać dopracowania,
- mogą występować błędy bezpieczeństwa,
- używasz Nitrix na własną odpowiedzialność.

Szczegóły znajdują się w licencji MIT.

## Obsługiwane systemy

- Windows x64
- Linux x86_64 w formacie AppImage

## Funkcje

- Wielokartowe przeglądanie z intuicyjnym interfejsem
- Pasek zakładek z obsługą favicon oraz lista wszystkich zakładek
- Historia przeglądania z wyszukiwaniem
- Menedżer haseł z autouzupełnianiem
- Import danych z innych przeglądarek
- Możliwość ustawienia Nitrix jako domyślnej przeglądarki
- Obsługa lokalnych plików HTML
- Panel „Co Nowego?” z informacjami o zmianach w wersji
- Nitrix Adblock z wbudowanymi filtrami oraz obsługą EasyList, EasyPrivacy i EasyList Cookie
- Poprawione blokowanie reklam na YouTube
- Panel pobierania plików z podglądem postępu i prędkości
- Przyciski zatrzymania, wznowienia oraz anulowania pobierania
- Wskaźnik bezpieczeństwa HTTPS z podglądem certyfikatu SSL
- Domyślna ochrona lokalnego adresu IP przed odczytem przez strony za pomocą WebRTC
- Automatyczne aktualizacje
- Tryb jasny, ciemny i prywatny
- Język polski i angielski
- Brak własnej telemetrii
- I wiele więcej

## Co nowego w 2.0.1

- Dodano pełne wsparcie dla systemu Linux w formacie AppImage
- Zaktualizowano Electron do wersji 44.2.0 oraz Chromium do wersji 152.0.7977.76
- Dodano domyślną ochronę lokalnego adresu IP przed odczytem przez strony za pomocą WebRTC
- Dodano możliwość wyłączenia ochrony lokalnego adresu IP w ustawieniach bezpieczeństwa
- Naprawiono chwilowe znikanie tekstu z paska adresu podczas otwierania strony
- Poprawiono ikony stron w podpowiedziach paska adresu, aby nie znikały podczas wpisywania

## Prywatność

Nitrix nie zbiera danych użytkownika na własne serwery.

Aplikacja może jednak korzystać z usług zewnętrznych, które mogą przetwarzać część danych:

- Google Favicon Service (`google.com/s2/favicons`) — używany do wyświetlania ikon stron. Google może widzieć domeny, dla których pobierane są ikony.
- Google DNS prefetch — używany w celu przyspieszenia ładowania wybranych zasobów.
- Domyślna strona startowa — domyślnie `google.pl`, ale można ją zmienić w ustawieniach.

## Stack technologiczny

| Warstwa | Technologia |
| --- | --- |
| Silnik przeglądarki | Chromium przez Electron |
| JavaScript engine | V8 |
| Framework | Electron |
| UI | HTML / CSS / Vanilla JS |
| Aktualizacje | electron-updater |

## Instalacja

### Windows

Pobierz i uruchom instalator:

[Nitrix 2.0.1 dla Windows](https://github.com/TheNitrixBrowser/autoaktualizacjenitrix/releases/download/v2.0.1-beta/Nitrix-Setup-2.0.1-x64.exe)

### Linux

Pobierz plik AppImage:

[Nitrix 2.0.1 dla Linux](https://github.com/TheNitrixBrowser/autoaktualizacjenitrix/releases/download/v2.0.1-beta/Nitrix-2.0.1-x86_64.AppImage)

Nadaj plikowi uprawnienia do uruchamiania i uruchom aplikację:

```bash
chmod +x Nitrix-2.0.1-x86_64.AppImage
./Nitrix-2.0.1-x86_64.AppImage
```

Strona projektu:

[TheNitrixBrowser.github.io/Nitrixbrowser](https://TheNitrixBrowser.github.io/Nitrixbrowser/)

## Licencja

MIT — szczegóły w pliku `LICENSE`.

## Autor

Projekt tworzony przez jedną osobę w ramach pasji do tworzenia oprogramowania.

Feedback, zgłoszenia błędów i pomysły są mile widziane.
