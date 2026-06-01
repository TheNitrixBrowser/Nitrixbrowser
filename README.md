# Nitrix Browser

Nitrix to lekka przeglądarka internetowa zbudowana na Electron i Chromium, zaprojektowana z myślą o prostocie, wygodzie i większej kontroli użytkownika.  
Projekt nie posiada własnej telemetrii i nie wysyła danych użytkownika na własne serwery.

## Wersja 2.0.0 BETA

Nitrix jest projektem w aktywnej fazie rozwoju. Oznacza to, że:

- mogą występować błędy,
- część funkcji może jeszcze wymagać dopracowania,
- mogą występować błędy bezpieczeństwa,
- używasz Nitrix na własną odpowiedzialność.

Szczegóły znajdują się w licencji MIT.

## Funkcje

- Wielokartowe przeglądanie z intuicyjnym interfejsem
- Pasek zakładek z obsługą favicon oraz lista wszystkich zakładek
- Historia przeglądania z wyszukiwaniem
- Menedżer haseł z autocomplete
- Import danych z innych przeglądarek
- Możliwość ustawienia Nitrix jako domyślnej przeglądarki
- Obsługa lokalnych plików HTML
- Panel „Co Nowego?” z informacjami o zmianach w wersji
- Nitrix Adblock z wbudowanymi filtrami oraz obsługą EasyList, EasyPrivacy i EasyList Cookie
- Niewielkie poprawki blokowania reklam na YouTube
- Panel pobierania plików z podglądem postępu i prędkości
- Przyciski zatrzymania, wznowienia oraz anulowania pobierania
- Wskaźnik bezpieczeństwa HTTPS z podglądem certyfikatu SSL
- Automatyczne aktualizacje
- Tryb jasny i ciemny oraz prywatny
- Język polski i angielski
- Brak własnej telemetrii
- I wiele więcej

## Co nowego w 2.0.0

- Dodano możliwość ustawienia Nitrix jako domyślnej przeglądarki w systemie Windows
- Dodano obsługę otwierania lokalnych plików HTML
- Dodano panel „Co Nowego?”
- Poprawiono wygląd i tłumaczenia importu danych
- Poprawiono część błędów związanych z paskiem adresu / wyszukiwania
- Wprowadzono drobne poprawki działania adblocka na YouTube
- Zrezygnowano z `better-sqlite3` na rzecz zwykłego rozwiązania SQL, co zmniejsza problemy z budowaniem aplikacji i poprawia stabilność projektu

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

Pobierz najnowszy instalator `.exe` ze strony:

[TheNitrixBrowser.github.io/Nitrixbrowser](https://TheNitrixBrowser.github.io/Nitrixbrowser/)

## Licencja

MIT — szczegóły w pliku `LICENSE`.

## Autor

Projekt tworzony przez jedną osobę w ramach pasji do tworzenia oprogramowania.  
Feedback, zgłoszenia błędów i pomysły są mile widziane.
