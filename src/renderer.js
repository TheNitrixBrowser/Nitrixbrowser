  // ══════════════════════════════════════════════════════════════════
  //  SYSTEM TŁUMACZEŃ (i18n) — NITRIX
  // ══════════════════════════════════════════════════════════════════
  const TRANSLATIONS = {
    pl: {
      backdrop_contrast: 'Automatyczny kolor tekstu paneli i popupów',
      backdrop_contrast_desc: 'Dobiera jasne lub ciemne napisy do tła strony pod panelem.',
      cert_title: 'Certyfikat', cert_general: 'Ogólne', cert_advanced: 'Zaawansowane',
      cert_no_data: 'Nie można pobrać danych certyfikatu.',
      cert_missing: 'brak w certyfikacie',
      cert_subject: 'Podmiot (Subject)', cert_issuer: 'Wystawca (Issuer)',
      cert_subject_details: 'Podmiot — szczegóły', cert_issuer_details: 'Wystawca — szczegóły',
      cert_validity: 'Ważność', cert_valid_from: 'Ważny od', cert_valid_to: 'Ważny do',
      cert_expired: 'wygasł',
      cert_cn: 'Nazwa (CN)', cert_org: 'Organizacja', cert_country: 'Kraj',
      cert_ou: 'Jednostka (OU)', cert_state: 'Stan/Prowincja', cert_locality: 'Miejscowość',
      cert_serial: 'Numer seryjny', cert_sig_algo: 'Algorytm podpisu',
      cert_version: 'Wersja', cert_sha256: 'Odciski cyfrowe SHA-256',
      cert_pubkey: 'Klucz publiczny', cert_algo: 'Algorytm',
      cert_size_curve: 'Rozmiar / Krzywa',
      conn_secure: 'Połączenie bezpieczne', conn_insecure: 'Połączenie niezabezpieczone',
      secure_conn: 'Połączenie jest bezpieczne',
      secure_desc: 'Ta strona jest zabezpieczona protokołem HTTPS. Wysyłanie kart kredytowych i innych poufnych danych pozostaje prywatne.',
      insecure_conn: 'Niezabezpieczona',
      insecure_desc: 'Twoje połączenie z tą witryną jest niezabezpieczone. Nie wprowadzaj poufnych danych, takich jak hasła lub karty kredytowe.',
      cert_valid: 'Certyfikat jest ważny', cert_invalid: 'Certyfikat jest nieważny',
      ram_usage: 'Zużycie RAM',
      show_in_folder: 'Pokaż w folderze',
      delete_from_history: 'Usuń z historii',
      search_for: 'Szukaj',
      find_panel_label: 'Znajdź na stronie', find_placeholder: 'Znajdź na stronie',
      find_previous: 'Poprzedni wynik', find_next: 'Następny wynik', find_close: 'Zamknij wyszukiwanie',
      find_no_results: 'Brak wyników', find_result_count: '{current} z {total}',
      close_tab: 'Zamknij kartę',
      tab_mute: 'Wycisz kartę', tab_unmute: 'Włącz dźwięk',
      dl_done: 'Ukończono', dl_cancelled: 'Anulowano',
      dl_error: 'Błąd pobierania', dl_file_moved: 'Plik usunięty lub przeniesiony',
      dl_private_notice: 'Nie zapisano do historii pobierania. Pamiętaj, że plik jest widoczny dla każdego na tym urządzeniu.',
      dl_starting: 'Rozpoczynanie…',
      dl_paused: 'Wstrzymano', dl_resumed: 'Wznowiono…',
      dl_net_error: 'Utracono połączenie z internetem',
      dl_no_space: 'Nie można zapisać pliku — brak miejsca na dysku',
      dl_net_retry: 'Wznów',
      dl_cancel_confirm: 'Czy na pewno anulować pobieranie?',
      dl_cancel_yes: 'Anuluj', dl_cancel_no: 'Nie',
      dl_pause_title: 'Wstrzymaj', dl_resume_title: 'Wznów', dl_cancel_title: 'Anuluj pobieranie',
      dl_click_open: 'Kliknij aby otworzyć plik', dl_file_missing_title: 'Plik usunięty lub przeniesiony',
      zoom_out: 'Pomniejsz', zoom_in: 'Powiększ', zoom_reset: 'Resetuj powiększenie',
      confirm_clear_history: 'Wyczyścić całą historię?',
      confirm_clear_dl: 'Wyczyścić historię pobierania?',
      clear: 'Wyczyść',
      translated_to: 'Przetłumaczono na Polski',
      ph_google: 'Wpisz adres lub wyszukaj w Google...',
      ph_duckduckgo: 'Wpisz adres lub wyszukaj w DuckDuckGo...',
      ph_bing: 'Wpisz adres lub wyszukaj w Bing...',
      ph_brave: 'Wpisz adres lub wyszukaj w Brave Search...',
      clear_all: 'Wyczyść wszystko',
      dl_history: 'Historia pobierania',
      dl_active_section: 'Aktualnie pobierane',
      no_history: 'Brak historii',
      no_downloads: 'Brak pobranych plików',
      no_results_for: 'Brak wyników dla',
      day_today: 'Dzisiaj',
      day_yesterday: 'Wczoraj',
      file_missing: 'Brak pliku',
      priv_detail_cookies: 'Pliki cookie i dane stron są usuwane po zamknięciu okna',
      priv_detail_bookmarks: 'Zakładki i pobrane pliki nie są zapisywane',
      history_private_notice: 'Jesteś w <strong>trybie prywatnym</strong> — aktualnie przeglądasz historię trybu normalnego',
      save_as: 'Zapisz jako…', save_image_as: 'Zapisz obraz jako…',
      ctx_open_link_current: 'Otwórz link w bieżącej karcie',
      ctx_open_link_new: 'Otwórz link w nowej karcie',
      ctx_open_image_current: 'Otwórz grafikę w bieżącej karcie',
      ctx_open_image_new: 'Otwórz grafikę w nowej karcie',
      delete_bookmark: 'Usuń zakładkę',
      bk_delete_title: 'Usuń',
      forward: 'Dalej',
      // Ogólne
      new_tab: 'Nowa karta', minimize: 'Minimalizuj', maximize: 'Maksymalizuj',
      close: 'Zamknij', save: 'Zapisz', cancel: 'Anuluj', later: 'Może później',
      back: 'Wstecz', forward: 'Do przodu', reload: 'Odśwież', home: 'Strona główna',
      menu: 'Menu', downloads: 'Pobieranie', settings: 'Ustawienia',
      whats_new: 'Co Nowego?', whats_new_subtitle: 'Wybierz wersję, żeby zobaczyć zmiany',
      history: 'Historia', name: 'Nazwa', url: 'Adres URL', reset: 'Resetuj',
      always: 'Zawsze', never: 'Nigdy', none: 'Nic', all: 'Wszystko',
      select_all: 'Zaznacz wszystko', deselect_all: 'Odznacz wszystko',
      delete: 'USUŃ', hide: 'Ukryj', add_bookmark: 'Dodaj zakładkę', edit_bookmark: 'Edytuj zakładkę', custom: 'Niestandardowa',
      all_bookmarks: 'Wszystkie Zakładki', bk_all_search_ph: 'Szukaj zakładek...', bk_all_empty: 'Brak zakładek', bk_bar_badge: 'pasek', bk_drag_hint: 'Przeciąganie niedostępne podczas wyszukiwania',
      // Navbar
      connection_info: 'Informacje o połączeniu',
      url_placeholder: 'Wpisz adres lub wyszukaj w Google...',
      zoom: 'Powiększenie strony', translate_page: 'Tłumacz stronę',
      // Dropdown
      private_mode: 'Tryb prywatny', devtools: 'Narzędzia deweloperskie',
      password_manager: 'Menedżer haseł',
      pw_add_page: 'Dodaj stronę', pw_add_title: 'Dodaj hasło', pw_edit_title: 'Edytuj hasło',
      pw_label_site: 'Strona', pw_label_user: 'Nazwa użytkownika / e-mail', pw_label_pass: 'Hasło',
      pw_save: 'Zapisz', pw_search: 'Szukaj…',
      pw_copied: 'Hasło skopiowane!', pw_empty: 'Brak zapisanych haseł', pw_empty_search: 'Brak wyników',
      pw_copy_title: 'Kopiuj hasło', pw_edit_btn: 'Edytuj', pw_del_btn: 'Usuń',
      pw_sidebar_passwords: 'Hasła', pw_sidebar_pin: 'PIN',
      pw_pin_title: 'Ustaw PIN dostępu',
      pw_pin_warning: 'PIN nie może być później zmieniony. Zapamiętaj go — jest wymagany do kopiowania i edytowania haseł.',
      pw_pin_warning_bold: 'Uwaga:',
      pw_pin_label: 'PIN (min. 4 cyfry)', pw_pin_confirm_label: 'Potwierdź PIN',
      pw_pin_set_btn: 'Ustaw PIN',
      pw_pin_done: 'PIN został ustawiony. Będzie wymagany przy kopiowaniu i edytowaniu haseł.',
      pw_pin_verify_title: 'Podaj PIN', pw_pin_verify_btn: 'Potwierdź',
      pw_pin_err_short: 'PIN musi mieć co najmniej 4 cyfry.',
      pw_pin_err_digits: 'PIN może zawierać tylko cyfry.',
      pw_pin_err_match: 'Podane PINy nie są zgodne.',
      pw_pin_err_wrong: 'Nieprawidłowy PIN.',
      pw_pin_already: 'PIN jest już ustawiony.',
      pw_add_need_pin: 'Najpierw ustaw PIN w sekcji PIN.',
      pw_autofill_fill: 'Wypełnij',
      pw_autofill_filled: 'Wypełniono',
      pw_autofill_text: 'Zapisane hasło dla tej strony',
      pw_dot_btn_title: 'Zapisane hasło',
      pw_autofill_title_main: 'Na tej stronie znajduje się',
      pw_autofill_title_sub: 'zapisane hasło',
      pw_delete_all: 'Usuń wszystkie',
      pw_delete_all_confirm: 'Usuń wszystkie zapisane hasła? Operacja jest nieodwracalna.',
      pw_pin_skip_label: 'Nie pytaj o PIN przy uzupełnianiu hasła',
      pw_pin_skip_desc: 'Hasła będą uzupełniane bez weryfikacji kodem PIN',
      pw_pin_reset_label: 'Zresetuj PIN',
      pw_pin_reset_desc: 'Usuwa PIN oraz wszystkie zapisane hasła — operacja nieodwracalna',
      pw_pin_reset_btn: 'Resetuj PIN',
      dst_passwords: 'Zapisane hasła',
      dst_passwords_desc: 'Wszystkie dane logowania z menedżera haseł',
      dst_pin: 'PIN menedżera haseł',
      dst_pin_desc: 'Kod PIN chroniący dostęp do menedżera haseł',
      destroyer: 'Niszczyciel Nitrix',
      browsing_private: 'Przeglądasz w trybie prywatnym',
      // Pasek pobierania
      dl_clear_done: 'Wyczyść ukończone',
      dl_open_history: 'Otwórz historię pobierania',
      // Tłumacz
      translate_notice: 'Ta strona jest w innym języku',
      translate_to: 'Przetłumacz na Polski',
      show_original: 'Pokaż oryginalny język',
      send_to_device: 'Wyślij na urządzenie',
      send_to_device_settings: 'Prześlij na urządzenie',
      qr_show_in_bar: 'Pokazuj na pasku wyszukiwania',
      qr_show_in_bar_desc: 'Wyświetla przycisk kod QR w pasku adresu umożliwiający przesłanie strony na inne urządzenie',
      qr_disable_yt_time: 'Wyłącz dodawanie czasu z YouTube do QR code',
      qr_disable_yt_time_desc: 'Nie dodaje aktualnego czasu odtwarzania wideo z YouTube do kodu QR',
      // Ustawienia sidebar
      general: 'Ogólne', security_settings: 'Bezpieczeństwo', appearance: 'Wygląd', search_engine: 'Wyszukiwarka',
      homepage: 'Strona startowa', settings_language: 'Język',
      block_local_ip: 'Zablokuj stronom wykrywanie lokalnego adresu IP',
      block_local_ip_desc: 'Ukrywa lokalny adres IP przed stronami korzystającymi z WebRTC.',
      // Wygląd
      theme: 'Motyw', theme_desc: 'Zmienia wygląd paska nawigacji i interfejsu przeglądarki',
      theme_dark: 'Ciemny', theme_light: 'Jasny', theme_private: 'Prywatny',
      theme_transparent: 'Backdrop Blur', aero_scope: 'W których miejscach przeglądarki Nitrix ma działać motyw Backdrop Blur?', aero_bookmarks_ui: 'Pasek zakładek oraz UI', aero_tabs_ui: 'Pasek kart oraz UI', aero_choose_areas: 'Wybierz obszary Backdrop Blur', aero_area_cards: 'Karty', aero_area_tabs: 'Pasek kart', aero_area_bookmarks: 'Pasek zakładek', aero_area_navigation: 'Pasek adresu i przyciski', aero_area_ui: 'Ustawienia, panele i popupy', aero_navigation: 'Tylko pasek adresu i przyciski', aero_navigation_ui: 'UI oraz pasek adresu i przyciski', aero_scope_help: 'Zaznacz dowolne obszary interfejsu. Motyw Backdrop Blur nie zmienia wyglądu stron internetowych.', aero_ui: 'Tylko UI', aero_bookmarks: 'Tylko pasek zakładek', aero_tabs: 'Tylko pasek kart', aero_all: 'Wszystko',
      theme_transparent_note: 'Półprzezroczyste paski i panele z efektem Backdrop Blur dopasowanym do tła.',
      theme_transparent_restart: ' Aby zobaczyć pulpit przez okno, uruchom Nitrix ponownie.',
      aero_top_opacity: 'Siła Backdrop Blur górnych pasków', aero_top_opacity_desc: 'Większa wartość oznacza mocniejsze rozmycie tła za paskiem kart, adresu i zakładek. Kolor dopasowuje się do tła.', theme_blur: 'Siła Backdrop Blur w panelach i popupach', theme_blur_desc: 'Większa wartość oznacza mocniejsze rozmycie tła. Panele zachowują neutralną, lekko przezroczystą warstwę bez stałego niebieskiego koloru.',
      expand_bar: 'Rozszerzaj pasek wyszukiwania',
      expand_bar_desc: 'Pasek URL zajmuje całą dostępną szerokość paska nawigacji',
      bkbar: 'Pokaż pasek zakładek', bkbar_desc: 'Kiedy pasek zakładek ma być widoczny',
      // Wyszukiwarka
      default_engine: 'Domyślna wyszukiwarka',
      default_engine_desc: 'Używana gdy wpiszesz zapytanie w pasku adresu',
      default_browser_settings: 'Domyślna przeglądarka',
      default_browser_desc: 'Ustaw Nitrix jako domyślną przeglądarkę — linki z innych aplikacji będą otwierać się w Nitrix.',
      default_browser_checking: 'Sprawdzanie stanu…',
      default_browser_is_default: 'Nitrix jest domyślną przeglądarką',
      default_browser_already_default: 'Nitrix jest już domyślną przeglądarką',
      default_browser_not_default: 'Nitrix nie jest ustawiony jako domyślna przeglądarka',
      set_default_browser: 'Ustaw jako domyślną przeglądarkę',
      default_browser_setting: 'Ustawianie…',
      default_browser_choose_windows: 'Wybierz Nitrix w ustawieniach domyślnych aplikacji Windows',
      default_browser_linux_failed: 'Nie udało się ustawić Nitrix jako domyślnej przeglądarki w tym środowisku Linux',
      default_browser_check_again: 'Sprawdź ponownie',
      default_browser_status_unavailable: 'Nie można sprawdzić stanu',
      default_browser_open_failed: 'Nie udało się otworzyć ustawień domyślnych aplikacji',
      import_data: 'Import danych',
      import_detecting: 'Wykrywanie zainstalowanych przeglądarek…',
      import_no_browsers: 'Nie znaleziono żadnych przeglądarek z danymi do importu.',
      import_supported: 'Obsługiwane: Chrome, Edge, Brave, Brave Origin, Opera, Vivaldi, Firefox',
      import_what: 'Co importować',
      import_bookmarks: 'Zakładki',
      import_history: 'Historia przeglądania',
      import_run: 'Importuj',
      import_running: 'Importowanie…',
      import_note: 'Jeśli przeglądarka jest aktualnie otwarta, zamknij ją przed importem historii, aby uniknąć błędów blokady pliku.',
      import_meta_bookmarks: 'Zakładki',
      import_meta_history: 'Historia',
      import_meta_no_data: 'brak danych',
      import_unavailable: '(brak danych do importu)',
      import_error: 'Błąd importu. Spróbuj zamknąć przeglądarkę i ponów.',
      import_added_bookmarks: 'Dodano <b>{count}</b> zakładek',
      import_no_new_bookmarks: 'Brak nowych zakładek do dodania',
      import_history_unavailable: 'Historia niedostępna — nie udało się odczytać bazy Firefoxa',
      import_added_history: 'Dodano <b>{count}</b> wpisów historii',
      import_no_new_history: 'Brak nowych wpisów historii',
      import_nothing: 'Nie zaimportowano niczego — zaznacz co chcesz importować.',
      import_unexpected_error: 'Nieoczekiwany błąd: {error}',
      hist_suggestions: 'Pokazuj sugestie na podstawie historii przeglądania',
      hist_suggestions_desc: 'Podczas wpisywania w pasku adresu wyświetlaj podpowiedzi z odwiedzonych stron',
      bk_suggestions: 'Pokazuj sugestie na podstawie zakładek',
      bk_suggestions_desc: 'Podczas wpisywania w pasku adresu wyświetlaj pasujące zakładki',
      priv_suggestions: 'Sugestie w trybie prywatnym',
      priv_suggestions_desc: 'Co wyświetlać w pasku adresu podczas przeglądania prywatnego',
      history_only: 'Tylko historia', bookmarks_only: 'Tylko zakładki',
      // Strona startowa
      default_homepage: 'Domyślna strona startowa',
      default_homepage_desc: 'Otwierana po kliknięciu przycisku domku i przy nowej karcie',
      enter_custom_url: 'Wpisz własny adres URL',
      custom_url_placeholder: 'https://przykład.pl',
      // Zachowanie przy uruchomieniu
      startup_on_launch: 'Po uruchomieniu przeglądarki',
      startup_opt_homepage: 'Otwórz stronę startową przeglądarki',
      startup_opt_last: 'Otwórz ostatnio otwartą stronę',
      startup_opt_custom: 'Otwórz wybraną stronę',
      startup_opt_bookmarks: 'Otwórz wybrane zakładki',
      startup_bk_empty: 'Brak zakładek do wybrania',
      startup_bk_selected: 'zakładek wybranych',
      startup_bk_choose: 'Wybierz zakładki',
      startup_bk_modal_title: 'Zakładki na starcie',
      startup_bk_search_ph: 'Szukaj zakładek…',
      startup_bk_confirm: 'Gotowe',
      startup_bk_empty_modal: 'Brak zakładek. Dodaj je najpierw w przeglądarce.',
      // Język
      lang_name_pl: 'Polski', lang_name_en: 'Angielski',
      lang_label: 'Język interfejsu',
      lang_desc: 'Zmienia język całej przeglądarki Nitrix',
      lang_applied: 'Język został zmieniony.',
      // Historia
      browsing_history: 'Historia przeglądania', search_history: 'Szukaj w historii...',
      clear_all_history: 'Wyczyść całą historię', search_downloads: 'Szukaj w pobranych...',
      clear_dl_history: 'Wyczyść historię pobierania',
      private_no_history: 'Historia przeglądania nie jest zapisywana',
      // Zakładki
      bk_name_placeholder: 'np. Google', bk_url_placeholder: 'https://...',
      // Bezpieczeństwo
      secure_conn: 'Połączenie jest bezpieczne', cert_valid: 'Certyfikat jest ważny',
      // Prywatny baner
      private_banner: 'Tryb prywatny — przeglądasz bez śladu',
      // Niszczyciel
      destroyer_subtitle: 'Wybierz co chcesz trwale usunąć',
      dst_history_desc: 'Wszystkie odwiedzone adresy i tytuły stron',
      dst_dlhistory: 'Historia pobierania', dst_dlhistory_desc: 'Lista wszystkich pobranych plików',
      dst_bookmarks: 'Zakładki', dst_bookmarks_desc: 'Wszystkie zapisane zakładki',
      dst_cookies: 'Pliki cookie i dane sesji',
      dst_cookies_desc: 'Dane logowania, preferencje stron, sesje',
      dst_cache: 'Pamięć podręczna (cache)',
      dst_cache_desc: 'Obrazy, skrypty i inne zasoby stron',
      dst_storage: 'Dane witryn i zgody',
      dst_storage_desc: 'Dane witryn oraz wszystkie zapamiętane zgody i blokady',
      confirm_title: 'Czy na pewno chcesz usunąć?',
      irreversible: 'Tej operacji nie można cofnąć.',
      confirm_delete: 'Tak, usuń na zawsze',
      destroy_selected_desc: 'Wybrane dane zostaną trwale usunięte z przeglądarki Nitrix.',
      // Auto-update
      update_available_title: 'Dostępna jest nowsza wersja przeglądarki!',
      update_sub_default: 'Pobierz najnowszą wersję aby korzystać z najnowszych funkcji i poprawek.',
      update_version: 'Wersja',
      update_sub_available: 'jest już dostępna. Pobierz teraz aby korzystać z najnowszych funkcji.',
      update_sub_downloading: 'Pobieranie wersji…',
      update_sub_downloaded: 'jest gotowa do instalacji.',
      update_download: 'Pobierz teraz',
      update_downloading: 'Pobieranie…',
      update_install: 'Zainstaluj i uruchom ponownie',
      adblock_btn_title: 'Adblock', adblock_title: 'Nitrix Adblock',
      adblock_toggle_label: 'Blokowanie reklam',
      adblock_toggle_on: 'Aktywne na tej stronie',
      adblock_toggle_off: 'Wyłączone na tej stronie',
      adblock_blocked_total: 'Zablokowano na tej stronie',
      adblock_advanced: 'Zaawansowane',
      adblock_blocked_list: 'Zablokowane zasoby',
      adblock_clear: 'Wyczyść', adblock_empty: 'Brak zablokowanych zasobów',
      adblock_custom_list: 'Twoje własne zablokowane elementy',
      adblock_custom_empty: 'Brak własnych zablokowanych elementów',
      remove_element: 'Usuń element',
      picker_hint: 'Kliknij element który chcesz usunąć',
      picker_cancel: 'Anuluj (Esc)',
      // Ustawienia adblock
      adb_settings_title: 'Adblock',
      adb_enabled_label: 'Włącz Adblock',
      adb_enabled_desc: 'Globalne blokowanie reklam i trackerów we wszystkich kartach',
      adb_filter_lists: 'Listy filtrów',
      adb_nitrix_label: 'Wbudowane listy Nitrix',
      adb_nitrix_desc: 'Własne listy Nitrix — blokowanie reklam, trackerów i reklam YouTube (~200 reguł domen)',
      adb_easylist_label: 'EasyList',
      adb_easylist_desc: 'Główna lista blokowania reklam (~60 000 reguł). Odświeżana co 7 dni automatycznie.',
      adb_easyprivacy_label: 'EasyPrivacy',
      adb_easyprivacy_desc: 'Blokuje trackery i skrypty śledzące (~30 000 reguł). Może spowolnić pierwsze uruchomienie.',
      adb_refresh_btn: 'Aktualizuj listy teraz',
      adb_refreshing: 'Pobieranie…',
      adb_refreshed: 'Zaktualizowano ✓',
      adb_refresh_error: 'Błąd – spróbuj ponownie',
      adb_last_updated: 'Ostatnia aktualizacja:',
      adb_extra_options: 'Dodatkowe opcje',
      adb_my_filters_example_domain: '||domena.com^',
      adb_my_filters_example_css: '##.klasa',
      adb_my_filters_hint: 'Jedna reguła na linię. Obsługiwane formaty:',
      adb_my_filters_block: '— blokuj domenę',
      adb_my_filters_hide: '— ukryj element CSS',
      adb_my_filters_placeholder: '! Przykłady:\n||ads.example.com^\n##.banner-ad\n##div[id^="ad-"]',
      adb_my_filters_save: 'Zapisz filtry',
      adb_cookies_label: 'EasyList Cookie',
      adb_cookies_desc: 'Automatycznie ukrywa banery cookie / GDPR na podstawie listy EasyList Cookie',
      adb_aggressive_label: 'Tryb agresywny',
      adb_aggressive_desc: 'Blokuje również elementy mediów społecznościowych (Facebook, Instagram, TikTok, X…). Może powodować problemy z wyświetlaniem niektórych stron.',
      adb_experimental: 'Eksperymentalne',
      adb_rules_suffix: 'tys. reguł',
      adb_disabled_info: 'Włącz Adblock powyżej, aby zmienić te ustawienia',
    },
    en: {
      backdrop_contrast: 'Automatic text color in panels and popups',
      backdrop_contrast_desc: 'Chooses light or dark text based on the page behind each panel.',
      cert_title: 'Certificate', cert_general: 'General', cert_advanced: 'Advanced',
      cert_no_data: 'Unable to retrieve certificate data.',
      cert_missing: 'not in certificate',
      cert_subject: 'Subject', cert_issuer: 'Issuer',
      cert_subject_details: 'Subject — details', cert_issuer_details: 'Issuer — details',
      cert_validity: 'Validity', cert_valid_from: 'Valid from', cert_valid_to: 'Valid to',
      cert_expired: 'expired',
      cert_cn: 'Common name (CN)', cert_org: 'Organization', cert_country: 'Country',
      cert_ou: 'Unit (OU)', cert_state: 'State/Province', cert_locality: 'Locality',
      cert_serial: 'Serial number', cert_sig_algo: 'Signature algorithm',
      cert_version: 'Version', cert_sha256: 'SHA-256 fingerprints',
      cert_pubkey: 'Public key', cert_algo: 'Algorithm',
      cert_size_curve: 'Size / Curve',
      conn_secure: 'Secure connection', conn_insecure: 'Insecure connection',
      secure_conn: 'Connection is secure',
      secure_desc: 'This page is secured with HTTPS. Sending credit cards and other sensitive data remains private.',
      insecure_conn: 'Not secure',
      insecure_desc: 'Your connection to this site is not secure. Do not enter sensitive data such as passwords or credit cards.',
      cert_valid: 'Certificate is valid', cert_invalid: 'Certificate is invalid',
      ram_usage: 'RAM usage',
      show_in_folder: 'Show in folder',
      delete_from_history: 'Remove from history',
      search_for: 'Search',
      find_panel_label: 'Find in page', find_placeholder: 'Find in page',
      find_previous: 'Previous result', find_next: 'Next result', find_close: 'Close search',
      find_no_results: 'No results', find_result_count: '{current} of {total}',
      close_tab: 'Close tab',
      tab_mute: 'Mute tab', tab_unmute: 'Unmute tab',
      dl_done: 'Completed', dl_cancelled: 'Cancelled',
      dl_error: 'Download error', dl_file_moved: 'File deleted or moved',
      dl_private_notice: 'Not saved to download history. Note that the file is visible to everyone on this device.',
      dl_starting: 'Starting…',
      dl_paused: 'Paused', dl_resumed: 'Resuming…',
      dl_net_error: 'Internet connection lost',
      dl_no_space: 'Cannot save file — not enough disk space',
      dl_net_retry: 'Resume',
      dl_cancel_confirm: 'Cancel this download?',
      dl_cancel_yes: 'Cancel', dl_cancel_no: 'No',
      dl_pause_title: 'Pause', dl_resume_title: 'Resume', dl_cancel_title: 'Cancel download',
      dl_click_open: 'Click to open file', dl_file_missing_title: 'File deleted or moved',
      zoom_out: 'Zoom out', zoom_in: 'Zoom in', zoom_reset: 'Reset zoom',
      confirm_clear_history: 'Clear all browsing history?',
      confirm_clear_dl: 'Clear download history?',
      clear: 'Clear',
      translated_to: 'Translated to English',
      ph_google: 'Enter address or search in Google...',
      ph_duckduckgo: 'Enter address or search in DuckDuckGo...',
      ph_bing: 'Enter address or search in Bing...',
      ph_brave: 'Enter address or search in Brave Search...',
      clear_all: 'Clear all',
      dl_history: 'Download history',
      dl_active_section: 'Currently downloading',
      no_history: 'No history',
      no_downloads: 'No downloads',
      no_results_for: 'No results for',
      day_today: 'Today',
      day_yesterday: 'Yesterday',
      file_missing: 'File missing',
      priv_detail_cookies: 'Cookies and site data are deleted when the window is closed',
      priv_detail_bookmarks: 'Bookmarks and downloaded files are not saved',
      history_private_notice: 'You are in <strong>private mode</strong> — currently viewing normal mode history',
      save_as: 'Save as…', save_image_as: 'Save image as…',
      ctx_open_link_current: 'Open link in current tab',
      ctx_open_link_new: 'Open link in new tab',
      ctx_open_image_current: 'Open image in current tab',
      ctx_open_image_new: 'Open image in new tab',
      bk_delete_title: 'Delete',
      forward: 'Forward',
      // General
      new_tab: 'New tab', minimize: 'Minimize', maximize: 'Maximize',
      close: 'Close', save: 'Save', cancel: 'Cancel', later: 'Maybe later',
      back: 'Back', forward: 'Forward', reload: 'Reload', home: 'Homepage',
      menu: 'Menu', downloads: 'Downloads', settings: 'Settings',
      whats_new: 'What\'s New?', whats_new_subtitle: 'Choose a version to see changes',
      history: 'History', name: 'Name', url: 'URL address', reset: 'Reset',
      always: 'Always', never: 'Never', none: 'None', all: 'All',
      select_all: 'Select all', deselect_all: 'Deselect all',
      delete: 'DELETE', hide: 'Hide', add_bookmark: 'Add bookmark', edit_bookmark: 'Edit bookmark', custom: 'Custom',
      all_bookmarks: 'All Bookmarks', bk_all_search_ph: 'Search bookmarks...', bk_all_empty: 'No bookmarks saved', bk_bar_badge: 'bar', bk_drag_hint: 'Drag reordering unavailable while searching',
      // Navbar
      connection_info: 'Connection information',
      url_placeholder: 'Enter address or search in Google...',
      zoom: 'Page zoom', translate_page: 'Translate page',
      // Dropdown
      private_mode: 'Private mode', devtools: 'Developer tools',
      password_manager: 'Password manager',
      pw_add_page: 'Add page', pw_add_title: 'Add password', pw_edit_title: 'Edit password',
      pw_label_site: 'Site', pw_label_user: 'Username / e-mail', pw_label_pass: 'Password',
      pw_save: 'Save', pw_search: 'Search…',
      pw_copied: 'Password copied!', pw_empty: 'No saved passwords', pw_empty_search: 'No results',
      pw_copy_title: 'Copy password', pw_edit_btn: 'Edit', pw_del_btn: 'Delete',
      pw_sidebar_passwords: 'Passwords', pw_sidebar_pin: 'PIN',
      pw_pin_title: 'Set access PIN',
      pw_pin_warning: 'The PIN cannot be changed later. Remember it — it is required to copy and edit passwords.',
      pw_pin_warning_bold: 'Warning:',
      pw_pin_label: 'PIN (min. 4 digits)', pw_pin_confirm_label: 'Confirm PIN',
      pw_pin_set_btn: 'Set PIN',
      pw_pin_done: 'PIN has been set. It will be required when copying and editing passwords.',
      pw_pin_verify_title: 'Enter PIN', pw_pin_verify_btn: 'Confirm',
      pw_pin_err_short: 'PIN must be at least 4 digits.',
      pw_pin_err_digits: 'PIN can only contain digits.',
      pw_pin_err_match: 'PINs do not match.',
      pw_pin_err_wrong: 'Incorrect PIN.',
      pw_pin_already: 'PIN is already set.',
      pw_add_need_pin: 'Set a PIN first in the PIN section.',
      pw_autofill_fill: 'Fill',
      pw_autofill_filled: 'Filled',
      pw_autofill_text: 'Saved password for this site',
      pw_dot_btn_title: 'Saved password',
      pw_autofill_title_main: 'This page has a',
      pw_autofill_title_sub: 'saved password',
      pw_delete_all: 'Delete all',
      pw_delete_all_confirm: 'Delete all saved passwords? This action cannot be undone.',
      pw_pin_skip_label: 'Skip PIN when filling passwords',
      pw_pin_skip_desc: 'Passwords will be filled without PIN verification',
      pw_pin_reset_label: 'Reset PIN',
      pw_pin_reset_desc: 'Removes the PIN and all saved passwords — this cannot be undone',
      pw_pin_reset_btn: 'Reset PIN',
      dst_passwords: 'Saved passwords',
      dst_passwords_desc: 'All login credentials from the password manager',
      dst_pin: 'Password manager PIN',
      dst_pin_desc: 'PIN code protecting access to the password manager',
      destroyer: 'Nitrix Destroyer',
      browsing_private: 'Browsing in private mode',
      // Download panel
      dl_clear_done: 'Clear completed',
      dl_open_history: 'Open download history',
      // Translator
      translate_notice: 'This page is in another language',
      translate_to: 'Translate to English',
      show_original: 'Show original language',
      send_to_device: 'Send to device',
      send_to_device_settings: 'Send to device',
      qr_show_in_bar: 'Show in search bar',
      qr_show_in_bar_desc: 'Shows a QR code button in the address bar to send the page to another device',
      qr_disable_yt_time: 'Disable YouTube timestamp in QR code',
      qr_disable_yt_time_desc: 'Does not include the current YouTube video playback time in the QR code',
      // Settings sidebar
      general: 'General', security_settings: 'Security', appearance: 'Appearance', search_engine: 'Search engine',
      homepage: 'Homepage', settings_language: 'Language',
      block_local_ip: 'Block websites from detecting the local IP address',
      block_local_ip_desc: 'Hides the local IP address from websites using WebRTC.',
      // Appearance
      theme: 'Theme', theme_desc: 'Changes the look of the navigation bar and browser interface',
      theme_dark: 'Dark', theme_light: 'Light', theme_private: 'Private',
      theme_transparent: 'Backdrop Blur', aero_scope: 'Where should the Backdrop Blur theme be used in Nitrix?', aero_bookmarks_ui: 'Bookmarks bar and UI', aero_tabs_ui: 'Tab bar and UI', aero_choose_areas: 'Choose Backdrop Blur areas', aero_area_cards: 'Tabs', aero_area_tabs: 'Tab bar', aero_area_bookmarks: 'Bookmarks bar', aero_area_navigation: 'Address bar and buttons', aero_area_ui: 'Settings, panels and popups', aero_navigation: 'Address bar and buttons only', aero_navigation_ui: 'UI, address bar and buttons', aero_scope_help: 'Select any interface areas. Backdrop Blur does not change the appearance of websites.', aero_ui: 'UI only', aero_bookmarks: 'Bookmarks bar only', aero_tabs: 'Tab bar only', aero_all: 'Everything',
      theme_transparent_note: 'Translucent bars and panels with a Backdrop Blur effect that follows the background.',
      theme_transparent_restart: ' Restart Nitrix to see the desktop through the window.',
      aero_top_opacity: 'Backdrop Blur strength for top bars', aero_top_opacity_desc: 'Higher values mean stronger blur behind the tab, address and bookmarks bars. The colour follows the background.', theme_blur: 'Backdrop Blur strength in panels and popups', theme_blur_desc: 'Higher values mean stronger background blur. Panels keep a neutral, lightly translucent surface instead of a fixed blue tint.',
      expand_bar: 'Expand search bar',
      expand_bar_desc: 'The URL bar takes up the full available width of the navigation bar',
      bkbar: 'Show bookmarks bar', bkbar_desc: 'When the bookmarks bar should be visible',
      // Search engine
      default_engine: 'Default search engine',
      default_engine_desc: 'Used when you type a query in the address bar',
      default_browser_settings: 'Default browser',
      default_browser_desc: 'Set Nitrix as your default browser — links from other apps will open in Nitrix.',
      default_browser_checking: 'Checking status…',
      default_browser_is_default: 'Nitrix is your default browser',
      default_browser_already_default: 'Nitrix is already your default browser',
      default_browser_not_default: 'Nitrix is not set as your default browser',
      set_default_browser: 'Set as default browser',
      default_browser_setting: 'Opening settings…',
      default_browser_choose_windows: 'Choose Nitrix in Windows default apps settings',
      default_browser_linux_failed: 'Nitrix could not be set as the default browser in this Linux environment',
      default_browser_check_again: 'Check again',
      default_browser_status_unavailable: 'Cannot check status',
      default_browser_open_failed: 'Could not open default apps settings',
      import_data: 'Data import',
      import_detecting: 'Detecting installed browsers…',
      import_no_browsers: 'No browsers with importable data were found.',
      import_supported: 'Supported: Chrome, Edge, Brave, Brave Origin, Opera, Vivaldi, Firefox',
      import_what: 'What to import',
      import_bookmarks: 'Bookmarks',
      import_history: 'Browsing history',
      import_run: 'Import',
      import_running: 'Importing…',
      import_note: 'If the browser is currently open, close it before importing history to avoid file lock errors.',
      import_meta_bookmarks: 'Bookmarks',
      import_meta_history: 'History',
      import_meta_no_data: 'no data',
      import_unavailable: '(no data to import)',
      import_error: 'Import failed. Try closing the browser and run it again.',
      import_added_bookmarks: 'Added <b>{count}</b> bookmarks',
      import_no_new_bookmarks: 'No new bookmarks to add',
      import_history_unavailable: 'History unavailable — Firefox database could not be read',
      import_added_history: 'Added <b>{count}</b> history entries',
      import_no_new_history: 'No new history entries',
      import_nothing: 'Nothing was imported — select what you want to import.',
      import_unexpected_error: 'Unexpected error: {error}',
      hist_suggestions: 'Show suggestions based on browsing history',
      hist_suggestions_desc: 'While typing in the address bar, show hints from visited pages',
      bk_suggestions: 'Show suggestions based on bookmarks',
      bk_suggestions_desc: 'While typing in the address bar, show matching bookmarks',
      priv_suggestions: 'Suggestions in private mode',
      priv_suggestions_desc: 'What to show in the address bar while browsing privately',
      history_only: 'History only', bookmarks_only: 'Bookmarks only',
      // Homepage
      default_homepage: 'Default homepage',
      default_homepage_desc: 'Opened when clicking the home button and on new tab',
      enter_custom_url: 'Enter custom URL',
      custom_url_placeholder: 'https://example.com',
      // Startup behavior
      startup_on_launch: 'On browser launch',
      startup_opt_homepage: 'Browser homepage',
      startup_opt_last: 'Last opened page',
      startup_opt_custom: 'Open a specific page',
      startup_opt_bookmarks: 'Open selected bookmarks',
      startup_bk_empty: 'No bookmarks to select',
      startup_bk_selected: 'bookmarks selected',
      startup_bk_choose: 'Choose bookmarks',
      startup_bk_modal_title: 'Startup bookmarks',
      startup_bk_search_ph: 'Search bookmarks…',
      startup_bk_confirm: 'Done',
      startup_bk_empty_modal: 'No bookmarks. Add some in the browser first.',
      // Language
      lang_name_pl: 'Polish', lang_name_en: 'English',
      lang_label: 'Interface language',
      lang_desc: 'Changes the language of the entire Nitrix browser',
      lang_applied: 'Language has been changed.',
      // History
      browsing_history: 'Browsing history', search_history: 'Search history...',
      clear_all_history: 'Clear all history', search_downloads: 'Search downloads...',
      clear_dl_history: 'Clear download history',
      private_no_history: 'Browsing history is not saved',
      // Bookmarks
      bk_name_placeholder: 'e.g. Google', bk_url_placeholder: 'https://...',
      // Security
      secure_conn: 'Connection is secure', cert_valid: 'Certificate is valid',
      // Private banner
      private_banner: 'Private mode — browsing without a trace',
      // Destroyer
      destroyer_subtitle: 'Choose what you want to permanently delete',
      dst_history_desc: 'All visited addresses and page titles',
      dst_dlhistory: 'Download history', dst_dlhistory_desc: 'List of all downloaded files',
      dst_bookmarks: 'Bookmarks', dst_bookmarks_desc: 'All saved bookmarks',
      dst_cookies: 'Cookies and session data',
      dst_cookies_desc: 'Login data, site preferences, sessions',
      dst_cache: 'Cache (temporary files)',
      dst_cache_desc: 'Images, scripts and other page resources',
      dst_storage: 'Site data and permissions',
      dst_storage_desc: 'Website data and all remembered permissions and blocks',
      confirm_title: 'Are you sure you want to delete?',
      irreversible: 'This action cannot be undone.',
      confirm_delete: 'Yes, delete forever',
      destroy_selected_desc: 'Selected data will be permanently deleted from the Nitrix browser.',
      // Auto-update
      update_available_title: 'A newer version of the browser is available!',
      update_sub_default: 'Download the latest version to enjoy the newest features and fixes.',
      update_version: 'Version',
      update_sub_available: 'is now available. Download now to enjoy the latest features.',
      update_sub_downloading: 'Downloading version…',
      update_sub_downloaded: 'is ready to install.',
      update_download: 'Download now',
      update_downloading: 'Downloading…',
      update_install: 'Install and restart',
      adblock_btn_title: 'Adblock', adblock_title: 'Nitrix Adblock',
      adblock_toggle_label: 'Ad blocking',
      adblock_toggle_on: 'Active on this page',
      adblock_toggle_off: 'Disabled on this page',
      adblock_blocked_total: 'Blocked on this page',
      adblock_advanced: 'Advanced',
      adblock_blocked_list: 'Blocked resources',
      adblock_clear: 'Clear', adblock_empty: 'No blocked resources',
      adblock_custom_list: 'Your custom blocked elements',
      adblock_custom_empty: 'No custom blocked elements',
      remove_element: 'Remove element',
      picker_hint: 'Click an element to remove it',
      picker_cancel: 'Cancel (Esc)',
      // Adblock settings
      adb_settings_title: 'Adblock',
      adb_enabled_label: 'Enable Adblock',
      adb_enabled_desc: 'Globally block ads and trackers across all tabs',
      adb_filter_lists: 'Filter lists',
      adb_nitrix_label: 'Nitrix built-in lists',
      adb_nitrix_desc: 'Nitrix own lists — blocks ads, trackers and YouTube ads (~200 domain rules)',
      adb_easylist_label: 'EasyList',
      adb_easylist_desc: 'Main ad blocking list (~60,000 rules). Refreshed automatically every 7 days.',
      adb_easyprivacy_label: 'EasyPrivacy',
      adb_easyprivacy_desc: 'Blocks trackers and tracking scripts (~30,000 rules). May slow down first launch.',
      adb_refresh_btn: 'Update lists now',
      adb_refreshing: 'Downloading…',
      adb_refreshed: 'Updated ✓',
      adb_refresh_error: 'Error – please try again',
      adb_last_updated: 'Last updated:',
      adb_extra_options: 'Additional options',
      adb_my_filters_example_domain: '||example.com^',
      adb_my_filters_example_css: '##.class',
      adb_my_filters_hint: 'One rule per line. Supported formats:',
      adb_my_filters_block: '— block domain',
      adb_my_filters_hide: '— hide CSS element',
      adb_my_filters_placeholder: '! Examples:\n||ads.example.com^\n##.banner-ad\n##div[id^="ad-"]',
      adb_my_filters_save: 'Save filters',
      adb_my_filters_title: 'My Filters',
      adb_cookies_label: 'EasyList Cookie',
      adb_cookies_desc: 'Automatically hides cookie / GDPR banners using the EasyList Cookie filter list',
      adb_aggressive_label: 'Aggressive mode',
      adb_aggressive_desc: 'Also blocks social media embeds (Facebook, Instagram, TikTok, X…). May break some sites.',
      adb_experimental: 'Experimental',
      adb_rules_suffix: 'k rules',
      adb_disabled_info: 'Enable Adblock above to change these settings',
    }
  }

  // ── Silnik i18n ──────────────────────────────────────────────────
  let _currentLang = localStorage.getItem('nitrix_lang') || 'pl'

  function t(key) {
    return (TRANSLATIONS[_currentLang] || TRANSLATIONS.pl)[key] || (TRANSLATIONS.pl[key] || key)
  }

  function applyTranslations(lang) {
    _currentLang = lang
    const T = TRANSLATIONS[lang] || TRANSLATIONS.pl
    // data-i18n → textContent (or innerHTML if value contains HTML tags)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      if (T[key] !== undefined) {
        if (T[key].includes('<')) el.innerHTML = T[key]
        else el.textContent = T[key]
      }
    })
    // data-i18n-title → title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title')
      if (T[key] !== undefined) el.title = T[key]
    })
    // data-i18n-placeholder → placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder')
      if (T[key] !== undefined) el.placeholder = T[key]
    })
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label')
      if (T[key] !== undefined) el.setAttribute('aria-label', T[key])
    })
    // Specjalny przypadek: url-input placeholder
    const urlIn = document.getElementById('url-input')
    if (urlIn && T.url_placeholder) urlIn.placeholder = T.url_placeholder
    // Sync language radio buttons
    const radio = document.querySelector(`input[name="nitrix-lang"][value="${lang}"]`)
    if (radio) radio.checked = true
    // Refresh all close tab button titles (created dynamically per tab)
    document.querySelectorAll('.tab-close').forEach(btn => { btn.title = T.close_tab || '' })
    // Refresh sound button titles (mute/unmute state-aware)
    document.querySelectorAll('.tab-sound').forEach(btn => {
      btn.title = btn.classList.contains('muted') ? (T.tab_unmute || '') : (T.tab_mute || '')
    })
    // Refresh search engine placeholder — safe guard for early init call
    try {
      if (typeof currentSearchEngine !== 'undefined' && typeof SEARCH_ENGINES !== 'undefined') {
        const cfg = SEARCH_ENGINES[currentSearchEngine] || SEARCH_ENGINES.google
        const urlIn2 = document.getElementById('url-input')
        if (urlIn2 && cfg.placeholderKey) urlIn2.placeholder = T[cfg.placeholderKey] || urlIn2.placeholder
      }
    } catch(e) {}
    // Refresh security state title — safe guard for early init call
    try {
      if (typeof urlIcon !== 'undefined' && urlIcon && typeof currentIsHttps !== 'undefined') {
        urlIcon.title = currentIsHttps ? T.conn_secure : T.conn_insecure
      }
    } catch(e) {}
    // Odśwież tłumaczenia aktywnych pobierań (przyciski, tooltips, statusy)
    try {
      if (typeof dlItems !== 'undefined') {
        for (const [id, entry] of dlItems.entries()) {
          if (entry.pauseBtnEl)  entry.pauseBtnEl.title  = T.dl_pause_title  || ''
          if (entry.resumeBtnEl) entry.resumeBtnEl.title = T.dl_resume_title || ''
          if (entry.cancelBtnEl) entry.cancelBtnEl.title = T.dl_cancel_title || ''
          if (entry.retryBtnEl)  entry.retryBtnEl.textContent = T.dl_net_retry || ''
          if (entry.folderBtnEl) entry.folderBtnEl.title = T.show_in_folder  || ''
          // Tekst w banerze utraty sieci
          const netSpan = entry.netErrEl?.querySelector('span')
          if (netSpan) netSpan.textContent = T.dl_net_error || ''
          // Tekst statusu meta zależny od stanu
          if (entry.metaEl) {
            if (entry.state === 'completed' && !entry._fileMissing) {
              entry.metaEl.textContent = `${T.dl_done || ''}  ·  ${formatBytes(entry.totalBytes || 0)}`
            } else if (entry._fileMissing) {
              entry.metaEl.textContent = T.dl_file_moved || ''
            } else if (entry.state === 'cancelled') {
              entry.metaEl.textContent = T.dl_cancelled || ''
            } else if (entry.state === 'error' || entry.state === 'interrupted') {
              entry.metaEl.textContent = T.dl_error || ''
            } else if (entry.dlState === 'paused') {
              entry.metaEl.textContent = T.dl_paused || ''
            }
            // progressing i network-error — nie ruszaj (dynamiczny tekst / baner)
          }
          // Tooltip kliknij aby otworzyć (stan completed)
          if (entry.state === 'completed' && !entry._fileMissing && T.dl_click_open) {
            entry.el.title = T.dl_click_open
          }
          if (entry._fileMissing && T.dl_file_missing_title) {
            entry.el.title = T.dl_file_missing_title
          }
        }
      }
    } catch(e) {}
    // Odśwież odznaki reguł i daty aktualizacji list adblock (tłumaczalne sufiks i format daty)
    try {
      if (typeof refreshListsInfo === 'function') refreshListsInfo()
    } catch(e) {}
    try {
      if (typeof window.refreshDefaultBrowserText === 'function') window.refreshDefaultBrowserText()
    } catch(e) {}
    try {
      if (typeof window.refreshImportText === 'function') window.refreshImportText()
    } catch(e) {}
  }

  // Zastosuj przy starcie
  applyTranslations(_currentLang)
  // Zsynchronizuj aktualny język z localStorage do settings.json przy każdym starcie
  setTimeout(() => {
    if (window.electronAPI?.saveSettings) window.electronAPI.saveSettings({ lang: _currentLang })
  }, 200)

  // ── Globalny handler błędów obrazów ─────────────────────────────
  document.addEventListener('error', e => {
    const t = e.target
    if (t.tagName !== 'IMG') return
    // Obrazy z data-fallback-icon: ukryj img, pokaż następny element (SVG fallback)
    if (t.hasAttribute('data-fallback-icon')) {
      t.style.display = 'none'
      const next = t.nextElementSibling
      if (next) next.style.display = 'flex'
      return
    }
    // Pozostałe obrazy: po prostu ukryj
    t.style.display = 'none'
  }, true)  // capture — łapie zdarzenia zanim dotrą do elementu

  // ── Sanitizacja HTML — musi być pierwsza, używana wszędzie ───────────
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
  // ══════════════════════════════════════════════════════════════════
  //  ZMIENNE GLOBALNE
  // ══════════════════════════════════════════════════════════════════
  window.expandBarEnabled = true
  window.blockLocalIpEnabled = true
  // Fixed popup coordinates refer to the viewport, not the blurred navigation bar.
  // Keep them outside its stacking context so webviews cannot cover them.
  document.querySelectorAll('#navbar :is(#adblock-popup, #zoom-popup, #qr-popup, #translate-popup, #pw-dot-popup)')
    .forEach(popup => document.body.appendChild(popup))
  window.adblockGloballyEnabled = true
  const tabsBar    = document.getElementById('tabs-bar')
  const tabNewBtn  = document.getElementById('tab-new-btn')
  const wvCont     = document.getElementById('webview-container')
  const loader     = document.getElementById('loader')
  const urlInput   = document.getElementById('url-input')
  const urlWrap    = document.getElementById('url-wrap')
  const btnBack    = document.getElementById('btn-back')
  const btnFwd     = document.getElementById('btn-forward')
  const btnReload  = document.getElementById('btn-reload')
  const btnHome    = document.getElementById('btn-home')
  const menuBtn    = document.getElementById('menu-btn')
  const dropdown   = document.getElementById('dropdown')
  const urlIcon    = document.getElementById('url-icon')
  const settingsOverlay = document.getElementById('settings-overlay')
  const whatsNewOverlay = document.getElementById('whatsnew-overlay')
  const whatsNewFrame = document.getElementById('whatsnew-frame')
  const iconReload = document.getElementById('icon-reload')

  function closeSettingsOverlay() {
    settingsOverlay.classList.remove('open')
    settingsOverlay.style.animation = ''
    document.getElementById('settings-panel').style.animation = ''
  }

  let tabs = []
  let activeTabId = null
  let tabCounter = 0
  let browserFeatures = null

  const findPanel = document.getElementById('page-find-panel')
  const findInput = document.getElementById('page-find-input')
  const findCount = document.getElementById('page-find-count')
  let findTab = null, findQuery = '', findRequest = null, findGeneration = 0, findTimer = null
  let earlyFindResult = null
  findPanel.inert = true
  function closeTopDialog() {
    const cancel = document.getElementById('_pwda_cancel')
    if (cancel?.getClientRects().length) { cancel.click(); return true }
    const pairs = [
      ['pw-pin-verify-overlay', null], ['pw-form-overlay', 'pw-form-cancel'],
      ['destroyer-confirm-overlay', 'dconf-cancel'], ['bk-modal-overlay', 'bk-cancel'],
      ['cert-modal-overlay', 'cert-modal-close'], ['sbk-overlay', 'sbk-close'],
      ['passwords-overlay', 'passwords-close'], ['destroyer-overlay', 'destroyer-close'],
      ['bk-all-overlay', 'bk-all-close'], ['history-overlay', 'history-close-btn'],
      ['whatsnew-overlay', 'whatsnew-close'], ['settings-overlay', 'settings-close']
    ]
    for (const [id, button] of pairs) {
      const panel = document.getElementById(id)
      if(panel?.closest('.nitrix-panel-page'))continue
      if (!panel?.classList.contains('open')) continue
      if (button) document.getElementById(button)?.click()
      else panel.click()
      return true
    }
    return false
  }
  function closePageFind(focusPage = true) {
    clearTimeout(findTimer)
    findGeneration++
    const tab = findTab
    findTab = null
    findRequest = null
    findQuery = ''
    findPanel.classList.remove('open')
    findPanel.setAttribute('aria-hidden', 'true')
    findPanel.inert = true
    if (tab) {
      try {
        window.electronAPI.stopFindInPage(tab.wv.getWebContentsId()).catch(console.error)
        if (focusPage && !tab.closing) tab.wv.focus()
      } catch (_) {}
    }
  }
  function openPageFind() {
    const tab = getActiveTab()
    if (!tab || tab.closing) return
    if (findTab !== tab) {
      closePageFind(false)
      findInput.value = ''
      findCount.textContent = ''
      findCount.classList.remove('no-results')
    }
    findTab = tab
    findPanel.inert = false
    findPanel.classList.add('open')
    findPanel.setAttribute('aria-hidden', 'false')
    findInput.focus()
    findInput.select()
  }
  async function searchPage(forward = true, next = false) {
    clearTimeout(findTimer)
    const tab = findTab
    if (!tab || tab.closing) return
    const query = findInput.value.slice(0, 4096)
    const generation = ++findGeneration
const continueSearch = next && query === findQuery
    findQuery = query
    earlyFindResult = null
    findRequest = null
    findCount.textContent = ''
    findCount.classList.remove('no-results')
    try {
      const id = tab.wv.getWebContentsId()
      if (!query) { await window.electronAPI.stopFindInPage(id); return }
      const request = await window.electronAPI.findInPage(id, query, forward, continueSearch)
      if (generation === findGeneration) {
        findRequest = request
        if (earlyFindResult) showFindResult(earlyFindResult)
      }
    } catch (error) { console.error('Find in page:', error) }
  }
  findInput.maxLength = 4096
  findInput.addEventListener('input', () => {
    clearTimeout(findTimer)
    findRequest = null
    findGeneration++
    findTimer = setTimeout(() => searchPage(), 100)
  })
  for (const id of ['page-find-prev', 'page-find-next']) {
    document.getElementById(id).addEventListener('mousedown', e => e.preventDefault())
  }
  document.getElementById('page-find-prev').onclick = () => searchPage(false, true)
  document.getElementById('page-find-next').onclick = () => searchPage(true, true)
  document.getElementById('page-find-close').onclick = () => closePageFind()
  function showFindResult(result) {
    if (!findTab || !findQuery || result.requestId !== findRequest) return
    try { if (findTab.wv.getWebContentsId() !== result.webContentsId) return } catch (_) { return }
    findCount.textContent = result.matches
      ? t('find_result_count').replace('{current}', result.activeMatchOrdinal).replace('{total}', result.matches)
      : t('find_no_results')
    findCount.classList.toggle('no-results', result.matches === 0)
  }
  window.electronAPI.onPageFindResult(result => {
    earlyFindResult = result
    showFindResult(result)
  })
  window.electronAPI.onBrowserShortcut(data => {
    try {
      const tab=getActiveTab()
      if(data.action==='quit-shortcut'){void askQuitShortcut();return}
      if (data.webContentsId && tab?.wv.getWebContentsId() !== data.webContentsId) return
      if(data.action==='new-tab')tabNewBtn.click()
      if(data.action==='close-tab' && tab)closeTab(tab.id)
      if(['next-tab','previous-tab'].includes(data.action) && tabs.length) {
        const index=tabs.findIndex(t=>t.id===activeTabId)
        activateTab(tabs[(index+(data.action==='next-tab'?1:-1)+tabs.length)%tabs.length].id)
      }
      if(data.action==='new-window')window.electronAPI.openNormalWindow()
      if(data.action==='private-window')window.electronAPI.openPrivateWindow()
      if(data.action==='back' && tab?.wv.canGoBack())tab.wv.goBack()
      if(data.action==='forward' && tab?.wv.canGoForward())tab.wv.goForward()
      if(data.action==='bookmark')document.getElementById('bk-add-btn').click()
      if(data.action==='history')openHistory()
      if(data.action==='downloads')document.getElementById('dl-open-history-btn').click()
      if(data.action==='address'){urlInput.focus();urlInput.select()}
      if(['console','source'].includes(data.action) && tab)window.electronAPI.openWebviewDevTools(tab.wv.getWebContentsId(),data.action)
      if(['reload','hard-reload'].includes(data.action) && tab && !tab.internalPage)window.electronAPI.reloadPage(tab.wv.getWebContentsId(),data.action==='hard-reload').catch(console.error)
      if(['zoom-in','zoom-out','zoom-reset'].includes(data.action) && tab){
        document.getElementById(data.action==='zoom-in'?'zoom-in-btn':data.action==='zoom-out'?'zoom-out-btn':'zoom-reset-btn').click()
        if(!zoomPopup.classList.contains('open'))zoomBtn.click()
      }
      if (data.action === 'find') openPageFind()
      if (data.action === 'reopen-tab') browserFeatures?.reopen()
      if (data.action === 'escape') {
        void stopCurrentPage(tab)
        if(!closeTopDialog() && findTab)closePageFind()
      }
    } catch (_) {}
  })
  document.addEventListener('keydown', event => {
    if (document.querySelector('dialog[open]')) {
      if (event.key === 'Escape') event.stopImmediatePropagation()
      return
    }
    if (event.isComposing || event.altKey) return
    const key = event.key.toLowerCase(), control = event.ctrlKey || event.metaKey
    if(key==='escape')void stopCurrentPage(getActiveTab())
    if (key === 'escape' && closeTopDialog()) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    const reload = key === 'f5' || (control && key === 'r')
    const openFind = key === 'f3' || (control && key === 'f')
    const closeFind = key === 'escape' && findTab
    const next = ['enter', 'arrowdown', 'arrowup'].includes(key) && findTab && event.target === findInput
    if (!reload && !openFind && !closeFind && !next) return
    event.preventDefault()
    event.stopImmediatePropagation()
    if (reload) {
      try {
        const tab = getActiveTab()
        if (tab && !tab.internalPage) window.electronAPI.reloadPage(tab.wv.getWebContentsId(), !!(control && (key === 'f5' || event.shiftKey))).catch(console.error)
      } catch (error) { console.error('Reload:', error) }
    } else if (openFind) openPageFind()
    else if (closeFind) closePageFind()
    else searchPage(key !== 'arrowup' && !event.shiftKey, true)
  }, true)


  function getActiveTab() { return tabs.find(t => t.id === activeTabId) }
  function getDomain(url) { try { return new URL(url).hostname } catch { return '' } }

  // Sprawdza czy URL wskazuje bezpośrednio na plik graficzny
  function _isImageUrl(url) {
    if (!url) return false
    try {
      const pathname = new URL(url).pathname.toLowerCase().split('?')[0]
      return /\.(jpe?g|png|gif|webp|svg|bmp|avif|tiff?|ico)$/.test(pathname)
    } catch { return false }
  }

  // ══════════════════════════════════════════════════════════════════
  //  POBIERANIE — logika UI
  // ══════════════════════════════════════════════════════════════════
  const dlToggleBtn = document.getElementById('dl-toggle-btn')
  const dlPanel     = document.getElementById('dl-panel')
  const dlClearBtn  = document.getElementById('dl-clear-btn')

  // Mapa: id -> { el, barEl, metaEl, iconEl, state }
  const dlItems = new Map()
  const dlSpeeds = new Map()
  let activeDownloadsCount = 0

  // ══════════════════════════════════════════════════════════════════
  //  HISTORIA POBIERANIA — persystencja
  // ══════════════════════════════════════════════════════════════════
  const DL_HISTORY_KEY = 'nitrix_dl_history'
  let dlHistoryData = []

  function loadDlHistory() {
    try {
      const raw = localStorage.getItem(DL_HISTORY_KEY)
      dlHistoryData = raw ? JSON.parse(raw) : []
    } catch(e) { dlHistoryData = [] }
  }

  function saveDlHistory() {
    try { localStorage.setItem(DL_HISTORY_KEY, JSON.stringify(dlHistoryData)) } catch(e) {}
  }

  function addDlHistoryEntry(entry) {
    dlHistoryData.unshift(entry)
    if (dlHistoryData.length > 2000) dlHistoryData.splice(2000)
    saveDlHistory()
  }

  loadDlHistory()

  // Sprawdza czy plik na dysku to ten sam oryginał (nie nowo pobrany)
  // Zwraca: 'original' | 'replaced' | 'missing'
  async function checkFileIdentity(savePath, downloadTimestamp) {
    try {
      const { exists, mtimeMs } = await window.electronAPI.fileExists(savePath)
      if (!exists) return 'missing'
      // Margines 30s — plik mógł być zapisany chwilę po zakończeniu pobierania
      // Jeśli mtime jest znacznie nowszy niż timestamp pobierania — to inny plik
      if (mtimeMs > downloadTimestamp + 30000) return 'replaced'
      return 'original'
    } catch { return 'missing' }
  }

  function formatBytes(bytes) {
    if (bytes === 0 || bytes == null) return '0 B'
    const units = ['B','KB','MB','GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + ' ' + units[Math.min(i, 3)]
  }

  function formatSpeed(bytesPerSec) {
    return formatBytes(bytesPerSec) + '/s'
  }

  function formatEta(remainingBytes, speed) {
    if (!speed || speed < 1 || remainingBytes <= 0) return ''
    const secs = remainingBytes / speed
    if (secs < 60)  return `~${Math.ceil(secs)}s`
    if (secs < 3600) return `~${Math.ceil(secs/60)}min`
    return `~${(secs/3600).toFixed(1)}h`
  }

  // Pokaż/ukryj ikonkę pobierania obok 3 kropek z animacją zwężania URL
  function updateDlButtonVisibility() {
    const hasAny = dlItems.size > 0
    if (hasAny) {
      dlToggleBtn.classList.add('visible')
      if (window.expandBarEnabled) urlWrap.classList.add('downloading')
    } else {
      dlToggleBtn.classList.remove('visible')
      urlWrap.classList.remove('downloading')
      dlPanel.classList.remove('open')
    }
    // Niebieski badge gdy coś w toku
    dlToggleBtn.classList.toggle('active', activeDownloadsCount > 0)
    // Odśwież sekcję aktywnych w historii pobierania jeśli jest otwarta
    try {
      const section = document.getElementById('history-section-downloads')
      if (section && section.classList.contains('active') && historyOverlay && historyOverlay.classList.contains('open')) {
        renderDlHistory(document.getElementById('dl-history-search')?.value || '')
      }
    } catch(e) {}
  }

  // Ikona SVG zależna od stanu
  function getDlIcon(state) {
    if (state === 'completed') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>`
    }
    if (state === 'error') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>`
    }
    // w toku
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>`
  }

  window.electronAPI.onDownloadStarted(data => {
    const { id, filename, totalBytes, url: dlUrl } = data

    // ── Przechwytywanie obrazów otwartych w nowej karcie ─────────────
    // Gdy serwer zwraca Content-Disposition:attachment dla pliku graficznego,
    // Chromium traktuje go jako pobieranie i karta zostaje pusta.
    // Szukamy karty, która właśnie próbowała załadować ten URL jako obraz —
    // jeśli znajdziemy, anulujemy pobieranie i wyświetlamy obraz bezpośrednio.
    const _isImgFilename = f => /\.(jpe?g|png|gif|webp|svg|bmp|avif|tiff?|ico)$/i.test(f || '')
    if (dlUrl && (_isImageUrl(dlUrl) || _isImgFilename(filename))) {
      const imgTab = tabs.find(t => t._openedWithUrl === dlUrl && (t.url === dlUrl || t.url === 'about:blank' || !t.url || t.url === ''))
      if (imgTab) {
        // Anuluj pobieranie natychmiast
        window.electronAPI.downloadCancel(id)
        // Załaduj prosty widz HTML z obrazkiem
        const viewerHtml = `data:text/html;charset=utf-8,<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${encodeURIComponent(filename)}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a1a;display:flex;align-items:center;justify-content:center;min-height:100vh;overflow:auto}
img{max-width:100vw;max-height:100vh;object-fit:contain;display:block;cursor:zoom-in}
img.zoomed{max-width:none;max-height:none;cursor:zoom-out}
</style></head><body>
<img src="${dlUrl.replace(/"/g, '&quot;')}" alt="${encodeURIComponent(filename)}"
  onclick="this.classList.toggle('zoomed')">
</body></html>`
        try { imgTab.wv.loadURL(viewerHtml) } catch(e) {}
        // Odejmij activeDownloadsCount który już inkrementowaliśmy
        activeDownloadsCount = Math.max(0, activeDownloadsCount - 1)
        dlSpeeds.delete(id)
        return
      }
    }
    // ─────────────────────────────────────────────────────────────────

    dlSpeeds.set(id, { bytes: 0, time: Date.now(), speed: 0 })
    activeDownloadsCount++

    // Utwórz element wpisu
    const item = document.createElement('div')
    item.className = 'dl-item'
    item.innerHTML = `
      <div class="dl-item-top">
        <div class="dl-item-icon" id="dl-icon-${id}">${getDlIcon('progressing')}</div>
        <div class="dl-item-info">
          <div class="dl-item-name" title="${escHtml(filename)}">${escHtml(filename)}</div>
          <div class="dl-item-meta" id="dl-meta-${id}">${t('dl_starting')}</div>
        </div>
        <div class="dl-ctrl-btns" id="dl-ctrl-${id}">
          <button class="dl-ctrl-btn pause-btn" id="dl-pause-${id}" title="${t('dl_pause_title')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>
          <button class="dl-ctrl-btn resume-btn" id="dl-resume-${id}" title="${t('dl_resume_title')}" style="display:none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </button>
          <button class="dl-ctrl-btn cancel-btn" id="dl-cancel-${id}" title="${t('dl_cancel_title')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
        <button class="dl-item-folder-btn" id="dl-folder-${id}" title="${t('show_in_folder')}" style="display:none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <div class="dl-progress-bar-wrap">
        <div class="dl-progress-bar ${totalBytes <= 0 ? 'indeterminate' : ''}" id="dl-bar-${id}"></div>
      </div>
      <div class="dl-network-error" id="dl-neterr-${id}" style="display:none">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
        </svg>
        <span>${t('dl_net_error')}</span>
        <button class="dl-net-retry-btn" id="dl-retry-${id}" title="${t('dl_resume_title')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          ${t('dl_net_retry')}
        </button>
      </div>
    `

    // Wstaw za nagłówkiem panelu
    const header = dlPanel.querySelector('.dl-panel-header')
    dlPanel.insertBefore(item, header.nextSibling)

    dlItems.set(id, {
      el:          item,
      barEl:       item.querySelector(`#dl-bar-${id}`),
      metaEl:      item.querySelector(`#dl-meta-${id}`),
      iconEl:      item.querySelector(`#dl-icon-${id}`),
      folderBtnEl: item.querySelector(`#dl-folder-${id}`),
      ctrlEl:      item.querySelector(`#dl-ctrl-${id}`),
      pauseBtnEl:  item.querySelector(`#dl-pause-${id}`),
      resumeBtnEl: item.querySelector(`#dl-resume-${id}`),
      cancelBtnEl: item.querySelector(`#dl-cancel-${id}`),
      netErrEl:    item.querySelector(`#dl-neterr-${id}`),
      retryBtnEl:  item.querySelector(`#dl-retry-${id}`),
      state:       'progressing',
      filename:    filename,
      totalBytes:  totalBytes,
      timestamp:   Date.now(),
    })

    // Helper — natychmiastowe przywrócenie UI do stanu "pobieranie" (bez czekania na IPC)
    function _resumeUI() {
      const entry = dlItems.get(id)
      if (!entry) return
      if (!window.electronAPI.isOnline()) return
      entry.state   = 'progressing'
      entry.dlState = 'progressing'
      entry.barEl.classList.remove('paused')
      if (entry.ctrlEl)      entry.ctrlEl.style.display    = ''
      if (entry.pauseBtnEl)  entry.pauseBtnEl.style.display  = ''
      if (entry.resumeBtnEl) entry.resumeBtnEl.style.display = 'none'
      if (entry.netErrEl)    entry.netErrEl.style.display    = 'none'
      entry.metaEl.textContent = t('dl_resumed')
    }

    // ── Pauza ──
    item.querySelector(`#dl-pause-${id}`).addEventListener('click', e => {
      e.stopPropagation()
      window.electronAPI.downloadPause(id)
    })

    // ── Wznów (przycisk play — po pauzie lub błędzie sieci) ──
    item.querySelector(`#dl-resume-${id}`).addEventListener('click', e => {
      e.stopPropagation()
      _resumeUI()
      window.electronAPI.downloadResume(id)
    })

    // ── Retry (przycisk przy utracie połączenia) ──
    item.querySelector(`#dl-retry-${id}`).addEventListener('click', e => {
      e.stopPropagation()
      _resumeUI()
      window.electronAPI.downloadResume(id)
    })

    // ── Anuluj — z potwierdzeniem inline ──
    item.querySelector(`#dl-cancel-${id}`).addEventListener('click', e => {
      e.stopPropagation()
      const entry = dlItems.get(id)
      if (!entry) return

      // Wstaw potwierdzenie pod paskiem postępu
      const existing = entry.el.querySelector('.dl-cancel-confirm')
      if (existing) { existing.remove(); return }

      const confirm = document.createElement('div')
      confirm.className = 'dl-cancel-confirm'
      confirm.innerHTML = `
        <span>${t('dl_cancel_confirm')}</span>
        <button class="dl-cancel-confirm-yes">${t('dl_cancel_yes')}</button>
        <button class="dl-cancel-confirm-no">${t('dl_cancel_no')}</button>
      `
      entry.el.appendChild(confirm)

      confirm.querySelector('.dl-cancel-confirm-yes').addEventListener('click', ev => {
        ev.stopPropagation()
        window.electronAPI.downloadCancel(id)
      })
      confirm.querySelector('.dl-cancel-confirm-no').addEventListener('click', ev => {
        ev.stopPropagation()
        confirm.remove()
      })
    })

    updateDlButtonVisibility()
    // Otwórz panel automatycznie przy pierwszym pobraniu
    dlPanel.classList.add('open')
  })

  window.electronAPI.onDownloadProgress(data => {
    const { id, receivedBytes, totalBytes } = data
    const now = Date.now()
    const prev = dlSpeeds.get(id)
    let speed = 0
    if (prev && (now - prev.time) > 50) {
  speed = Math.max(0, (receivedBytes - prev.bytes) / ((now - prev.time) / 1000))
  dlSpeeds.set(id, { bytes: receivedBytes, time: now, speed })
} else if (prev) {
  speed = prev.speed
} else {
  dlSpeeds.set(id, { bytes: receivedBytes, time: now, speed: 0 })
}
    const entry = dlItems.get(id)
    if (!entry) return

    const bar  = entry.barEl
    const meta = entry.metaEl

    if (totalBytes > 0) {
      const pct = Math.min(100, (receivedBytes / totalBytes) * 100)
      bar.classList.remove('indeterminate')
      bar.style.width = pct + '%'
      const remaining = totalBytes - receivedBytes
      const eta = formatEta(remaining, speed)
      meta.textContent = `${formatBytes(receivedBytes)} / ${formatBytes(totalBytes)}  ·  ${formatSpeed(speed)}${eta ? '  ·  ' + eta : ''}`
    } else {
      // Nieznany rozmiar
      if (!bar.classList.contains('indeterminate')) bar.classList.add('indeterminate')
      meta.textContent = `${formatBytes(receivedBytes)}  ·  ${formatSpeed(speed)}`
    }
  })

  window.electronAPI.onDownloadDone(data => {
    const { id, filename, state, totalBytes } = data
    dlSpeeds.delete(id)
    const entry = dlItems.get(id)
    activeDownloadsCount = Math.max(0, activeDownloadsCount - 1)
    updateDlButtonVisibility()
    if (!entry) return

    entry.state    = state
    entry.savePath = data.savePath   // ← zapamiętaj ścieżkę
    const bar       = entry.barEl
    const meta      = entry.metaEl
    const icon      = entry.iconEl
    const folderBtn = entry.folderBtnEl

    // Ukryj przyciski kontroli (pauza/anuluj) — pobieranie skończone
    if (entry.ctrlEl) entry.ctrlEl.style.display = 'none'
    if (entry.netErrEl) entry.netErrEl.style.display = 'none'
    // Usuń potwierdzenie anulowania jeśli otwarte
    const confirmEl = entry.el.querySelector('.dl-cancel-confirm')
    if (confirmEl) confirmEl.remove()

    bar.classList.remove('indeterminate')

    if (state === 'completed') {
      bar.style.width = '100%'
      bar.classList.add('done')
      icon.classList.add('done')
      icon.innerHTML = getDlIcon('completed')
      meta.textContent = `${t('dl_done')}  ·  ${formatBytes(totalBytes)}`

      const downloadedAt = entry.timestamp || Date.now()

      // Sprawdza czy plik istnieje na dysku
      async function checkFile() {
        try { return (await window.electronAPI.fileExists(entry.savePath)).exists } catch { return false }
      }

      function markFileMissing() {
        if (entry._fileMissing) return
        entry._fileMissing = true
        entry.el.style.cursor = 'default'
        entry.el.title = t('dl_file_missing_title')
        bar.parentElement.style.display = 'none'
        icon.className = 'dl-item-icon error'
        icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`
        const nameEl = entry.el.querySelector('.dl-item-name')
        if (nameEl) nameEl.style.textDecoration = 'line-through'
        meta.textContent = t('dl_file_moved')
        meta.style.color = '#e57373'
        if (folderBtn) folderBtn.style.display = 'none'
      }

      function markFileRestored() {
        if (!entry._fileMissing) return
        entry._fileMissing = false
        entry.el.style.cursor = 'pointer'
        entry.el.title = t('dl_click_open')
        bar.parentElement.style.display = ''
        icon.className = 'dl-item-icon done'
        icon.innerHTML = getDlIcon('completed')
        const nameEl = entry.el.querySelector('.dl-item-name')
        if (nameEl) nameEl.style.textDecoration = ''
        meta.textContent = `${t('dl_done')}  ·  ${formatBytes(totalBytes)}`
        meta.style.color = ''
        if (folderBtn) folderBtn.style.display = ''
      }

      entry._markMissing  = markFileMissing
      entry._markRestored = markFileRestored

      // Sprawdź po 1.5s — plik musi mieć czas żeby wylądować na dysku
      setTimeout(() => {
        checkFile().then(exists => {
          if (!exists) { markFileMissing(); return }

          entry.el.style.cursor = 'pointer'
          entry.el.title = t('dl_click_open')
          entry.el.addEventListener('click', async e => {
            if (e.target.closest('.dl-item-folder-btn')) return
            const ok = await checkFile()
            if (!ok) { markFileMissing(); return }
            window.electronAPI.openFile(entry.savePath)
          })

          if (folderBtn) {
            folderBtn.style.display = ''
            folderBtn.addEventListener('click', async e => {
              e.stopPropagation()
              const ok = await checkFile()
              if (!ok) { markFileMissing(); return }
              window.electronAPI.showInFolder(entry.savePath)
            })
          }
        }).catch(() => {})
      }, 1500)


      // Zapisz do historii pobierania (nie w trybie prywatnym)
      if (!isPrivate) {
        addDlHistoryEntry({
          filename:   filename,
          savePath:   data.savePath,
          totalBytes: totalBytes,
          state:      state,
          timestamp:  entry.timestamp || Date.now(),
        })
        if (historyOverlay && historyOverlay.classList.contains('open')) {
          renderDlHistory(document.getElementById('dl-history-search').value)
        }
      } else {
        // Tryb prywatny — pokaż notice w elemencie pobierania
        const notice = document.createElement('div')
        notice.className = 'dl-private-notice'
        notice.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>${t('dl_private_notice')}</span>
        `
        entry.el.appendChild(notice)
      }
    } else if (state === 'interrupted') {
      if (data.interruptReason === 'no-space') {
        // Brak miejsca na dysku — błąd nieodwracalny, nie pokazuj przycisku Wznów
        bar.classList.add('error')
        icon.classList.add('error')
        icon.innerHTML = getDlIcon('error')
        meta.textContent = t('dl_no_space')
        meta.style.color = '#e57373'
        if (entry.ctrlEl) entry.ctrlEl.style.display = 'none'
        if (!isPrivate) {
          addDlHistoryEntry({
            filename: filename, savePath: data.savePath || '',
            totalBytes, state: 'error', timestamp: entry.timestamp || Date.now(),
          })
          if (historyOverlay && historyOverlay.classList.contains('open'))
            renderDlHistory(document.getElementById('dl-history-search').value)
        }
      } else {
        // Utrata połączenia — pokaż baner sieciowy z przyciskiem wznowienia
        entry.state = 'network-error'
        bar.classList.add('paused')
        if (entry.ctrlEl)      entry.ctrlEl.style.display    = ''
        if (entry.pauseBtnEl)  entry.pauseBtnEl.style.display  = 'none'
        if (entry.resumeBtnEl) entry.resumeBtnEl.style.display = ''
        if (entry.netErrEl)    entry.netErrEl.style.display    = ''
        meta.textContent = ''
      }

    } else {
      bar.classList.add('error')
      icon.classList.add('error')
      icon.innerHTML = getDlIcon('error')
      meta.textContent = state === 'cancelled' ? t('dl_cancelled') : t('dl_error')

      // Zapisz błędy też do historii (nie w trybie prywatnym)
      if (!isPrivate) {
        addDlHistoryEntry({
          filename:   filename,
          savePath:   data.savePath || '',
          totalBytes: totalBytes,
          state:      state,
          timestamp:  entry.timestamp || Date.now(),
        })
        if (historyOverlay && historyOverlay.classList.contains('open')) {
          renderDlHistory(document.getElementById('dl-history-search').value)
        }
      }
    }
  })

  // ── Zmiany stanu: paused / progressing / network-error ──────────────
  window.electronAPI.onDownloadState(data => {
    const { id, state } = data
    const entry = dlItems.get(id)
    if (!entry) return

    const bar       = entry.barEl
    const meta      = entry.metaEl
    const pauseBtn  = entry.pauseBtnEl
    const resumeBtn = entry.resumeBtnEl
    const netErrEl  = entry.netErrEl

    if (state === 'paused') {
      entry.dlState = 'paused'
      bar.classList.add('paused')
      bar.classList.remove('indeterminate')
      if (pauseBtn)  pauseBtn.style.display  = 'none'
      if (resumeBtn) resumeBtn.style.display = ''
      meta.textContent = t('dl_paused')
      if (netErrEl) netErrEl.style.display = 'none'

    } else if (state === 'network-error') {
      entry.dlState = 'network-error'
      bar.classList.add('paused')
      bar.classList.remove('indeterminate')
      if (pauseBtn)  pauseBtn.style.display  = 'none'
      if (resumeBtn) resumeBtn.style.display = ''
      meta.textContent = ''
      if (netErrEl) netErrEl.style.display = ''
      // Zamknij potwierdzenie anulowania jeśli otwarte
      const confirmEl = entry.el.querySelector('.dl-cancel-confirm')
      if (confirmEl) confirmEl.remove()

    } else if (state === 'progressing') {
      entry.state    = 'progressing'
      entry.dlState  = 'progressing'
      bar.classList.remove('paused')
      if (entry.ctrlEl)  entry.ctrlEl.style.display  = ''
      if (pauseBtn)  pauseBtn.style.display  = ''
      if (resumeBtn) resumeBtn.style.display = 'none'
      if (netErrEl) netErrEl.style.display = 'none'
      meta.textContent = t('dl_resumed')
    }
  })

  // ── Proaktywne wykrywanie utraty/powrotu sieci ──────────────────────
  window.electronAPI.onNetworkStatus(({ online }) => {
    for (const [id, entry] of dlItems.entries()) {
      if (entry.state !== 'progressing' && entry.state !== 'network-error') continue
      const bar       = entry.barEl
      const meta      = entry.metaEl
      const pauseBtn  = entry.pauseBtnEl
      const resumeBtn = entry.resumeBtnEl
      const netErrEl  = entry.netErrEl

      if (!online && entry.state === 'progressing') {
        entry.state = 'network-error'
        bar.classList.add('paused')
        bar.classList.remove('indeterminate')
        if (entry.ctrlEl)    entry.ctrlEl.style.display    = ''
        if (pauseBtn)        pauseBtn.style.display        = 'none'
        if (resumeBtn)       resumeBtn.style.display       = ''
        if (netErrEl)        netErrEl.style.display        = ''
        meta.textContent = ''
        const confirmEl = entry.el.querySelector('.dl-cancel-confirm')
        if (confirmEl) confirmEl.remove()
      } else if (online && entry.state === 'network-error') {
        if (!window.electronAPI.isOnline()) return
        // Sieć wróciła — wyczyść UI i wznów automatycznie
        entry.state   = 'progressing'
        entry.dlState = 'progressing'
        bar.classList.remove('paused')
        if (entry.ctrlEl)    entry.ctrlEl.style.display    = ''
        if (pauseBtn)        pauseBtn.style.display        = ''
        if (resumeBtn)       resumeBtn.style.display       = 'none'
        if (netErrEl)        netErrEl.style.display        = 'none'
        meta.textContent = t('dl_resumed')
        window.electronAPI.downloadResume(id)
      }
    }
  })

  // Przycisk — otwórz/zamknij panel pobierania
  dlToggleBtn.addEventListener('click', e => {
    e.stopPropagation()
    hideSecPopup()
    dropdown.classList.remove('open')
    adblockPopup.classList.remove('open')
    translatePopup.classList.remove('open')
    zoomPopup.classList.remove('open')
    qrPopup.classList.remove('open')
    dlPanel.classList.toggle('open')
    // Przy każdym otwarciu sprawdź czy pliki istnieją (w obie strony)
    if (dlPanel.classList.contains('open')) {
      for (const [id, entry] of dlItems.entries()) {
        if (entry.state === 'completed' && entry.savePath) {
          window.electronAPI.fileExists(entry.savePath).then(({ exists }) => {
            if (!exists && !entry._fileMissing) entry._markMissing  && entry._markMissing()
            if (exists  &&  entry._fileMissing) entry._markRestored && entry._markRestored()
          }).catch(() => {})
        }
      }
    }
  })

  // Wyczyść ukończone
  dlClearBtn.addEventListener('click', () => {
    for (const [id, entry] of [...dlItems.entries()]) {
      if (entry.state !== 'progressing') {
        entry.el.remove()
        dlItems.delete(id)
      }
    }
    updateDlButtonVisibility()
  })

  document.getElementById('dl-open-history-btn').addEventListener('click', () => {
    dlPanel.classList.remove('open')
    openHistory()
    // Przełącz od razu na zakładkę pobierania
    setTimeout(() => {
      document.querySelectorAll('.history-sidebar-item').forEach(i => i.classList.remove('active'))
      document.querySelectorAll('.history-section').forEach(s => s.classList.remove('active'))
      const sideItem = document.querySelector('.history-sidebar-item[data-hsection="downloads"]')
      const section  = document.getElementById('history-section-downloads')
      if (sideItem) sideItem.classList.add('active')
      if (section)  section.classList.add('active')
      renderDlHistory(document.getElementById('dl-history-search')?.value || '')
    }, 100)
  })

  // Zamknij panel po kliknięciu poza nim
  // Forward-safe — pełna implementacja poniżej przy inicjalizacji sec-popup
  function hideSecPopup() {
    const p = document.getElementById('sec-popup')
    if (p) p.classList.remove('open')
  }

  function closeAllMenus() {
    dropdown.classList.remove('open')
    dlPanel.classList.remove('open')
    hideCtxMenu()
    hideSecPopup()
    const zp = document.getElementById('zoom-popup')
    if (zp) zp.classList.remove('open')
    const tp = document.getElementById('translate-popup')
    if (tp) tp.classList.remove('open')
    const dp = document.getElementById('pw-dot-popup')
    if (dp) dp.classList.remove('open')
    const ap = document.getElementById('adblock-popup')
    if (ap) ap.classList.remove('open')
    const qp = document.getElementById('qr-popup')
    if (qp) qp.classList.remove('open')
  }

  function closeTransientMenus() {
    dropdown.classList.remove('open')
    dlPanel.classList.remove('open')
    hideCtxMenu()
    hideSecPopup()
    const zp = document.getElementById('zoom-popup')
    if (zp) zp.classList.remove('open')
    const tp = document.getElementById('translate-popup')
    if (tp) tp.classList.remove('open')
    const dp = document.getElementById('pw-dot-popup')
    if (dp) dp.classList.remove('open')
    const ap = document.getElementById('adblock-popup')
    if (ap) ap.classList.remove('open')
    const qp = document.getElementById('qr-popup')
    if (qp) qp.classList.remove('open')
    if (ap) ap.classList.remove('open')
  }

  document.addEventListener('click', () => closeAllMenus())
  dlPanel.addEventListener('click', e => e.stopPropagation())
  dropdown.addEventListener('click', e => e.stopPropagation())
  document.getElementById('pw-dot-wrap').addEventListener('click', e => e.stopPropagation())
  document.getElementById('pw-dot-popup').addEventListener('click', e => e.stopPropagation())

  // ══════════════════════════════════════════════════════════════════
  //  TWORZENIE KARTY
  // ══════════════════════════════════════════════════════════════════
  const panelTabs=new Map()
  async function askQuitShortcut() {
    if(document.querySelector('.nitrix-quit-dialog[open]'))return
    const settings=await window.electronAPI.loadSettings()
    if(settings.skipQuitShortcutPrompt){window.electronAPI.quitNitrixShortcut();return}
    const en=_currentLang==='en',dialog=document.createElement('dialog')
    dialog.className='nf-dialog nitrix-quit-dialog'
    const headingWrap=document.createElement('div');headingWrap.className='nf-dialog-heading'
    const heading=document.createElement('h2')
    const badge=document.createElement('span');badge.className='nf-quit-badge'
    badge.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v9"/><path d="M18.36 6.64a8 8 0 1 1-12.72 0"/><path d="M12 21v-1"/></svg>'
    heading.textContent=en?'Close Nitrix with Ctrl+Q?':'Czy na pewno zamknąć Nitrixa skrótem Ctrl+Q?'
    heading.prepend(badge);headingWrap.append(heading)
    const description=document.createElement('p');description.className='nf-quit-description';description.textContent=en?'Choose what should happen after using the keyboard shortcut.':'Wybierz, co ma się stać po użyciu tego skrótu klawiszowego.'
    const row=document.createElement('label');row.className='setting-row-inline nf-quit-option'
    const label=document.createElement('span');label.textContent=en?'Never ask again when using this shortcut':'Nigdy nie pytaj przy następnym użyciu tego skrótu'
    const toggle=document.createElement('span');toggle.className='toggle-switch'
    toggle.innerHTML='<input type="checkbox"><span class="toggle-track"></span><span class="toggle-thumb"></span>'
    const check=toggle.querySelector('input');row.append(label,toggle)
    const actions=document.createElement('div');actions.className='nf-actions'
    let decided=false
    for(const [text,action] of [[en?'Cancel':'Anuluj','cancel'],[en?'Close current tab':'Zamknij bieżącą kartę','tab'],[en?'Close Nitrix':'Zamknij Nitrixa','quit']]) {
      const button=document.createElement('button')
      button.className='nf-button'
      const icon=document.createElement('span');icon.className='nf-quit-action-icon'
      icon.innerHTML=action==='cancel'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>'
        : action==='tab'
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/><path d="M7 7h.01"/><path d="M10 7h.01"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v9"/><path d="M18.36 6.64a8 8 0 1 1-12.72 0"/></svg>'
      button.append(icon,document.createTextNode(text))
      button.onclick=async()=>{
        if(decided)return;decided=true
        if(action==='quit' && check.checked)await window.electronAPI.saveSettings({skipQuitShortcutPrompt:true})
        dialog.close();dialog.remove()
        if(action==='tab' && getActiveTab())closeTab(getActiveTab().id)
        if(action==='quit')window.electronAPI.quitNitrixShortcut()
      };actions.append(button)
    }
    dialog.append(headingWrap,description,row,actions);document.body.append(dialog)
    dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();actions.firstChild.focus()
  }
  async function stopCurrentPage(tab) {
    if(!tab || tab.internalPage)return
    try {
      const result=await window.electronAPI.stopPage(tab.wv.getWebContentsId())
      if(!tabs.includes(tab) || tab.closing)return
      if(result?.restored)return
      tab.isLoading=false
      if(activeTabId===tab.id) {
        wvCont.classList.remove('wv-loading')
        loader.className=''
        iconReload.innerHTML='<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>'
        btnReload.onclick=()=>window.electronAPI.reloadPage(tab.wv.getWebContentsId())
      }
    }catch{}
  }
  function openPanelTab(key,overlayId,title,targetTab=null) {
    const existing=panelTabs.get(key)
    if(existing && !existing.closing){activateTab(existing.id);return existing}
    const sourceTab = targetTab && tabs.includes(targetTab) ? targetTab : getActiveTab()
    const overlay=document.getElementById(overlayId),parent=overlay.parentNode,next=overlay.nextSibling
    const page=document.createElement('section');page.className='nitrix-panel-page';page.dataset.internalUrl='nitrix://'+key
    if(sourceTab && !sourceTab.internalPage && sourceTab!==targetTab) page.dataset.sourceTabId=String(sourceTab.id)
    wvCont.append(page);page.append(overlay);overlay.classList.add('open')
    const tab=targetTab && tabs.includes(targetTab) && !targetTab.closing && !targetTab.internalPage
      ? targetTab : createTab('about:blank',page)
    if(tab===targetTab) {
      tab.internalPage=page
      tab.url='nitrix://'+key
      tab._openedWithUrl='about:blank'
      tab.wv.style.display='none'
      tab.isLoading=false
    }
    panelTabs.set(key,tab)
    tab.titleEl.textContent=title;tab.faviconEl.src='icon.ico';tab.faviconEl.onerror=null;tab.faviconEl.style.display=''
    tab.onInternalClose=()=>{
      overlay.classList.remove('open')
      if (overlay===settingsOverlay) {
        overlay.style.animation=''
        document.getElementById('settings-panel').style.animation=''
      }
      parent.insertBefore(overlay,next?.parentNode===parent?next:null);panelTabs.delete(key)
    }
    activateTab(tab.id)
    return tab
  }
  function createTab(url = 'https://www.google.pl', internalPage = null) {
    const id = ++tabCounter

    const tabEl = document.createElement('div')
    tabEl.className = 'tab'
    tabEl.dataset.id = id

    const faviconEl = document.createElement('img')
    faviconEl.className = 'tab-favicon'
    faviconEl.decoding = 'async'   // dekoduj asynchronicznie — nie blokuj main thread
    faviconEl.loading  = 'eager'   // ładuj od razu (nie lazy)
    faviconEl.src = `https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`
    faviconEl.onerror = () => { faviconEl.style.display = 'none' } // zastępowane przez faviconGen przy nawigacji

    const titleEl = document.createElement('span')
    titleEl.className = 'tab-title'
    titleEl.textContent = t('new_tab')

    const closeBtn = document.createElement('button')
    closeBtn.className = 'tab-close'
    closeBtn.innerHTML = `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="1.5" y1="1.5" x2="8.5" y2="8.5"/><line x1="8.5" y1="1.5" x2="1.5" y2="8.5"/></svg>`
    closeBtn.title = t('close_tab')
    closeBtn.addEventListener('click', e => { e.stopPropagation(); closeTab(id) })

    // ── Przycisk dźwięku / wyciszenia ────────────────────────────────
    const SVG_SOUND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`
    const SVG_MUTED = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`

    const soundBtn = document.createElement('button')
    soundBtn.className = 'tab-sound'
    soundBtn.innerHTML = SVG_SOUND
    soundBtn.title = t('tab_mute')
    let _tabMuted = false

    soundBtn.addEventListener('click', e => {
      e.stopPropagation()
      _tabMuted = !_tabMuted
      try { wv.setAudioMuted(_tabMuted) } catch {}
      if (_tabMuted) {
        soundBtn.classList.add('muted')
        soundBtn.innerHTML = SVG_MUTED
        soundBtn.title = t('tab_unmute')
      } else {
        soundBtn.classList.remove('muted')
        soundBtn.innerHTML = SVG_SOUND
        soundBtn.title = t('tab_mute')
      }
    })

    tabEl.append(faviconEl, titleEl, soundBtn, closeBtn)
    tabEl.addEventListener('click', () => activateTab(id))

    // ── Tooltip po 5s hover ───────────────────────────────────────
    let tooltipTimer = null
    let tooltipEl = null
    let tabHovered = false   // czy mysz aktualnie jest nad kartą

    function showTabTooltip() {
      if (tooltipEl) return
      const tab = tabs.find(t => t.id === id)
      const rect = tabEl.getBoundingClientRect()

      tooltipEl = document.createElement('div')
      tooltipEl.className = 'tab-tooltip'

      const title = titleEl.textContent || 'Karta'
      let domain = ''
      try { domain = new URL(tab?.url || '').hostname } catch {}

      const faviconSrc = faviconEl.style.display !== 'none' ? faviconEl.src : ''
      const faviconHtml = faviconSrc
        ? `<img src="${faviconSrc}" style="width:15px;height:15px;border-radius:3px;object-fit:contain;flex-shrink:0">`
        : ''
      const domainLine = domain
        ? `<div class="tab-tooltip-domain" style="display:flex;align-items:center;gap:7px">${faviconHtml}<span>${escHtml(domain)}</span></div>`
        : ''

      tooltipEl.innerHTML = `
        <div class="tab-tooltip-title">${escHtml(title)}</div>
        ${domainLine}
        <div class="tab-tooltip-divider"></div>
        <div class="tab-tooltip-ram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M6 6V4M10 6V4M14 6V4M18 6V4M6 18v2M10 18v2M14 18v2M18 18v2"/>
          </svg>
          <span class="tab-tooltip-ram-label">${t('ram_usage')}:</span>
          <span class="tab-tooltip-ram-value" id="tt-ram-${id}">…</span>
        </div>
      `
      document.body.appendChild(tooltipEl)

      const left = Math.min(rect.left, window.innerWidth - 370)
      tooltipEl.style.left = left + 'px'
      tooltipEl.style.top  = (rect.bottom + 4) + 'px'

      // Podwójny rAF — pierwszy frame rejestruje stan początkowy (opacity:0, scale:.97),
      // drugi dodaje .visible żeby transition faktycznie zagrał
      requestAnimationFrame(() => requestAnimationFrame(() => tooltipEl?.classList.add('visible')))

      const wcId = wv.getWebContentsId ? wv.getWebContentsId() : null
      window.electronAPI.getRamUsage(wcId).then(r => {
        const el = document.getElementById(`tt-ram-${id}`)
        if (el) el.textContent = r?.mb != null ? `${r.mb} MB` : 'brak danych'
      }).catch(() => {
        const el = document.getElementById(`tt-ram-${id}`)
        if (el) el.textContent = 'brak danych'
      })
    }

    function hideTabTooltip() {
      clearTimeout(tooltipTimer)
      tooltipTimer = null
      tabHovered = false
      if (tooltipEl) {
        tooltipEl.remove()
        tooltipEl = null
      }
    }

    // Ukryj tooltip przy przeładowaniu — wznów timer TYLKO jeśli mysz nadal nad kartą
    function resetTooltipOnNavigation() {
      clearTimeout(tooltipTimer)
      tooltipTimer = null
      if (tooltipEl) {
        tooltipEl.remove()
        tooltipEl = null
      }
      if (tabHovered) {
        tooltipTimer = setTimeout(showTabTooltip, 2000)
      }
    }

    tabEl.addEventListener('mouseenter', () => {
      tabHovered = true
      tooltipTimer = setTimeout(showTabTooltip, 2000)
    })
    tabEl.addEventListener('mouseleave', hideTabTooltip)
    tabEl.addEventListener('mousedown',  hideTabTooltip)

    let _suppressClick = false
    tabEl.addEventListener('click', e => {
      if (_suppressClick) { _suppressClick = false; e.stopImmediatePropagation() }
    }, true)

    tabEl.addEventListener('mousedown', e => {
      if (e.button !== 0) return
      if (e.target.closest('.tab-close')) return
      e.preventDefault()

      const startX  = e.clientX
      let dragging  = false
      let fromIdx   = tabs.findIndex(t => t.id === id)
      let insertIdx = fromIdx

      // Zapamiętaj pozycje wszystkich kart PRZED przesuwaniem
      let snapshots = []
      const takeSnapshots = () => {
        snapshots = tabs.map(t => {
          const r = t.tabEl.getBoundingClientRect()
          return { left: r.left, width: r.width, mid: r.left + r.width / 2 }
        })
      }
      takeSnapshots()
      const mySnap = snapshots[fromIdx]

      const onMove = mv => {
        const dx = mv.clientX - startX
        if (!dragging && Math.abs(dx) > 4) {
          dragging = true
          hideTabTooltip()
          tabEl.classList.add('tab-dragging')
        }
        if (!dragging) return

        const barRect = tabsBar.getBoundingClientRect()
        const minDx = barRect.left - mySnap.left
        const maxDx = barRect.right - mySnap.left - mySnap.width
        const clampedDx = Math.min(maxDx, Math.max(minDx, dx))
        tabEl.style.transform = `translateX(${clampedDx}px)`
        const dragCx = mySnap.mid + clampedDx

        // Popychaj przycisk + gdy karta go dotyka
        const tabRight = mySnap.left + mySnap.width + clampedDx
        const newTabOrigLeft = tabsBar.getBoundingClientRect().left + tabNewBtn.offsetLeft
        const overlap = tabRight - newTabOrigLeft + 8
        tabNewBtn.style.transition = 'none'
        tabNewBtn.style.transform = overlap > 0 ? `translateX(${overlap}px)` : ''

        // Oblicz nowy indeks docelowy
        let newIdx = fromIdx
        if (dx < 0) {
          for (let i = fromIdx - 1; i >= 0; i--) {
            if (dragCx < snapshots[i].mid) newIdx = i
          }
        } else {
          for (let i = fromIdx + 1; i < snapshots.length; i++) {
            if (dragCx > snapshots[i].mid) newIdx = i
          }
        }
        insertIdx = newIdx

        // Przesuń inne karty płynnie
        tabs.forEach((t, i) => {
          if (t.id === id) return
          t.tabEl.style.transition = 'transform .18s cubic-bezier(.4,0,.2,1)'
          if (fromIdx < newIdx && i > fromIdx && i <= newIdx) {
            t.tabEl.style.transform = `translateX(-${mySnap.width}px)`
          } else if (fromIdx > newIdx && i >= newIdx && i < fromIdx) {
            t.tabEl.style.transform = `translateX(${mySnap.width}px)`
          } else {
            t.tabEl.style.transform = ''
          }
        })
      }

      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        if (!dragging) return
        _suppressClick = true
        tabEl.classList.remove('tab-dragging')
        hideTabTooltip()

        const commit = () => {
          tabs.forEach(t => { t.tabEl.style.transition = ''; t.tabEl.style.transform = '' })
          tabNewBtn.style.transition = 'transform .1s cubic-bezier(.4,0,.2,1)'
          setTimeout(() => {
            tabNewBtn.style.transform = ''
            void tabNewBtn.offsetWidth
            // Odśwież pointer-events DOPIERO po zakończeniu animacji powrotu (100ms)
            setTimeout(() => {
              const tb = document.getElementById('titlebar')
              tb.style.webkitAppRegion = 'no-drag'
              requestAnimationFrame(() => requestAnimationFrame(() => { tb.style.webkitAppRegion = '' }))
            }, 115)
          }, 210)
          if (insertIdx !== fromIdx) {
            const [moved] = tabs.splice(fromIdx, 1)
            tabs.splice(insertIdx, 0, moved)
            tabs.forEach(t => tabsBar.insertBefore(t.tabEl, tabNewBtn))
          }
        }

        // Animacja snap do finalnej pozycji
        let snapDx = 0
        if (insertIdx !== fromIdx) {
          snapDx = insertIdx > fromIdx
            ? snapshots[insertIdx].left + snapshots[insertIdx].width - mySnap.left - mySnap.width
            : snapshots[insertIdx].left - mySnap.left
        }
        tabEl.style.transition = 'transform .15s cubic-bezier(.4,0,.2,1)'
        tabEl.style.transform  = `translateX(${snapDx}px)`
        setTimeout(commit, 155)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    })

    tabsBar.insertBefore(tabEl, tabNewBtn)
    tabEl.classList.add('tab-opening')
    requestAnimationFrame(() => requestAnimationFrame(() => {
      tabEl.classList.remove('tab-opening')
      tabEl.style.transition = 'max-width .22s cubic-bezier(.4,0,.2,1), min-width .22s cubic-bezier(.4,0,.2,1), flex-basis .22s cubic-bezier(.4,0,.2,1), opacity .18s ease, padding .22s cubic-bezier(.4,0,.2,1), background .15s, color .15s'
      tabEl.style.opacity  = '1'
    }))
    setTimeout(() => {
      tabEl.style.transition = ''
      tabEl.style.opacity    = ''
    }, 230)

    const wv = document.createElement('webview')
    const safeUrl = (isAllowedBrowserUrl(url) || /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml|bmp|avif);base64,/i.test(url)) ? url : 'https://www.google.pl'
    wv.src = internalPage ? 'about:blank' : safeUrl
    wv.setAttribute('disableblinkfeatures', 'Auxclick')
    wv.setAttribute('allowpopups', '')
    // Tryb prywatny — sesja tylko w RAM (bez 'persist:' prefix = nie zapisuje nic)
    wv.setAttribute('partition', isPrivate ? 'persist:nitrix_private' : 'persist:main')
    wv.setAttribute('webpreferences', 'allowRunningInsecureContent=false, webSecurity=yes, javascript=yes, images=yes, pageCache=yes, nodeIntegration=no, nodeIntegrationInSubFrames=no, nodeIntegrationInWorker=no, contextIsolation=yes, sandbox=yes')
    wv.style.cssText = 'width:100%;'
    wvCont.appendChild(wv)

    // ── Overlay strony błędu ─────────────────────────────────────────
    const errOverlay = document.createElement('div')
    errOverlay.className = 'wv-error-page'
    wvCont.appendChild(errOverlay)

    function _errTips(lang) {
      const tips = lang === 'en'
        ? ['Check if the network cable is connected or if Wi-Fi is enabled',
           'Make sure the website address is typed correctly',
           'Try restarting your router or modem',
           'Disable VPN or proxy if you are using one']
        : ['Sprawdź czy kabel sieciowy jest podłączony lub czy Wi-Fi jest włączone',
           'Upewnij się, że adres strony jest poprawnie wpisany',
           'Spróbuj zrestartować router lub modem',
           'Wyłącz VPN lub serwer proxy, jeśli z takiego korzystasz']
      return tips.map(tip => `
        <div class="wv-error-tip">
          <span class="wv-error-tip-dot"></span>
          <span>${escHtml(tip)}</span>
        </div>`).join('')
    }

    function showErrorPage(errorCode, errorDescription, validatedURL) {
      const tabObj = tabs.find(t => t.id === id)
      if (tabObj) tabObj.hasError = true

      const DNS_CODES     = [-105, -137]
      const TIMEOUT_CODES = [-7, -118]
      const OFFLINE_CODES = [-106, -109]
      const lang          = typeof _currentLang !== 'undefined' ? _currentLang : 'pl'
      const isEn          = lang === 'en'

      let title, desc
      if (DNS_CODES.includes(errorCode)) {
        title = isEn ? 'Server not found'               : 'Nie można znaleźć serwera'
        desc  = isEn
          ? `Nitrix could not find the server for <em>${escHtml(validatedURL)}</em>. Check if the address is correct and that you are connected to the internet.`
          : `Nitrix nie mógł odnaleźć serwera dla <em>${escHtml(validatedURL)}</em>. Sprawdź, czy adres jest poprawny i czy masz połączenie z internetem.`
      } else if (OFFLINE_CODES.includes(errorCode) || !navigator.onLine) {
        title = isEn ? 'No internet connection'         : 'Brak połączenia z internetem'
        desc  = isEn
          ? 'Nitrix cannot connect to the internet. Check your network connection and try again.'
          : 'Nitrix nie może połączyć się z internetem. Sprawdź połączenie sieciowe i spróbuj ponownie.'
      } else if (TIMEOUT_CODES.includes(errorCode)) {
        title = isEn ? 'Connection timed out'           : 'Przekroczono czas połączenia'
        desc  = isEn
          ? `The server at <em>${escHtml(validatedURL)}</em> took too long to respond. It may be overloaded or unavailable.`
          : `Serwer dla <em>${escHtml(validatedURL)}</em> zbyt długo nie odpowiadał. Może być przeciążony lub tymczasowo niedostępny.`
      } else {
        title = isEn ? 'Could not connect to the server' : 'Nie udało się połączyć z serwerem'
        desc  = isEn
          ? 'Nitrix could not load the page. The server may be unavailable or your connection was interrupted.'
          : 'Nitrix nie mógł wczytać strony. Możliwe, że serwer jest niedostępny lub Twoje połączenie zostało zerwane.'
      }

      const tipsTitle = isEn ? 'What can you do?' : 'Co możesz zrobić?'
      const btnLabel  = isEn ? 'Try again'         : 'Spróbuj ponownie'
      const errCodeTxt = errorDescription
        ? errorDescription.replace(/^net::/, '')
        : `ERR_${Math.abs(errorCode)}`

      errOverlay.innerHTML = `
        <svg class="wv-error-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="32" cy="32" r="28" stroke-width="2.5"/>
          <ellipse cx="32" cy="32" rx="12" ry="28" stroke-width="2"/>
          <line x1="4" y1="32" x2="60" y2="32" stroke-width="2"/>
          <line x1="10" y1="16.5" x2="54" y2="47.5" stroke-width="2.8" stroke="#e57373"/>
          <line x1="10" y1="47.5" x2="54" y2="16.5" stroke-width="2.8" stroke="#e57373"/>
        </svg>
        <div class="wv-error-title">${escHtml(title)}</div>
        ${validatedURL ? `<div class="wv-error-url">${escHtml(validatedURL)}</div>` : ''}
        <div class="wv-error-code">${escHtml(errCodeTxt)}</div>
        <div class="wv-error-desc">${desc}</div>
        <div class="wv-error-tips">
          <div class="wv-error-tips-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            ${escHtml(tipsTitle)}
          </div>
          ${_errTips(lang)}
        </div>
        <button class="wv-error-reload-btn" id="wv-err-reload-${id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          ${escHtml(btnLabel)}
        </button>
      `
      errOverlay.classList.add('visible')
      if (activeTabId === id) { setSecurityState(tabObj?.url || ''); hideSecPopup() }
      const reloadBtn = document.getElementById(`wv-err-reload-${id}`)
      if (reloadBtn) reloadBtn.addEventListener('click', () => { hideErrorPage(); wv.reload() })
    }

    function hideErrorPage() {
      const tabObj = tabs.find(t => t.id === id)
      if (tabObj) tabObj.hasError = false
      errOverlay.classList.remove('visible')
      if (activeTabId === id) { setSecurityState(tabObj?.url || ''); hideSecPopup() }
    }

    // Przechwytuj otwieranie nowych okien — otwórz jako nową kartę
    wv.addEventListener('new-window', e => {
      e.preventDefault()
      const targetUrl = e.url
      if (!targetUrl || targetUrl === 'about:blank') return
      if (!isAllowedBrowserUrl(targetUrl)) return
      createTab(targetUrl)
    })

    // Blokuj nawigację do niebezpiecznych schematów
    wv.addEventListener('will-navigate', e => {
      if (!e.url) return
      if (!isAllowedBrowserUrl(e.url)) {
        e.preventDefault()
      }
      // Schowaj ikonkę klucza natychmiast przy każdej nawigacji
      if (typeof window._nitrixHideAutofill === 'function') window._nitrixHideAutofill()
    })

    wv.addEventListener('context-menu', (e) => {
      showCtxMenu(e.params.x, e.params.y, 'webview', -1, { ...e.params, webview: wv })
    })

    wv.addEventListener('focus', () => closeTransientMenus())
    // Zamknij ctx-menu gdy użytkownik kliknie w obszar webview
    wv.addEventListener('mousedown', () => { hideCtxMenu(); const dp = document.getElementById('pw-dot-popup'); if (dp) dp.classList.remove('open'); const ap = document.getElementById('adblock-popup'); if (ap) ap.classList.remove('open') })

    // ── Błąd ładowania strony (brak sieci, nieznana domena itp.) ────────
    let _startupRetried = false
    const _startupTime  = Date.now()
    wv.addEventListener('did-fail-load', e => {
      if (!e.isMainFrame) return          // ignoruj błędy subframe (reklamy, iframy)
      if (e.errorCode === -3) return      // ERR_ABORTED — użytkownik zatrzymał lub szybko nawigował
      if (e.errorCode === 0) return       // brak błędu
      // ERR_CONNECTION_RESET (-101) lub ERR_NETWORK_CHANGED (-21) w ciągu 8s od startu
      // = stos sieciowy Electrona jeszcze nie gotowy — jeden auto-retry
      const isStartupNetErr = (e.errorCode === -101 || e.errorCode === -21) &&
                              !_startupRetried && (Date.now() - _startupTime < 8000)
      if (isStartupNetErr) {
        _startupRetried = true
        const retryUrl = e.validatedURL || ''
        if (retryUrl) setTimeout(() => { try { wv.loadURL(retryUrl) } catch(err) {} }, 1200)
        return
      }
      if (activeTabId === id) wvCont.classList.remove('wv-loading')
      showErrorPage(e.errorCode, e.errorDescription, e.validatedURL || '')
    })

    wv.addEventListener('did-start-loading', () => {
      hideErrorPage()
      resetTooltipOnNavigation()
      const tabObj = tabs.find(t => t.id === id)
      if (tabObj) tabObj.isLoading = true
      if (activeTabId !== id) return
      wvCont.classList.add('wv-loading')
      loader.className = 'active'
      iconReload.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
      btnReload.onclick = () => stopCurrentPage(tabs.find(t=>t.id===id))
    })

    const _finishLoading = () => {
      const tabObj = tabs.find(t => t.id === id)
      if (tabObj) tabObj.isLoading = false

      // ── Zabezpieczenie: jeśli page-title-updated nie wystrzelił (race condition) ──
      // Sprawdź po załadowaniu czy tytuł nie jest jeszcze domyślny i pobierz go bezpośrednio
      if (!titleEl.textContent || titleEl.textContent === t('new_tab')) {
        try {
          const t = wv.getTitle ? wv.getTitle() : ''
          if (t && t !== 'about:blank') {
            titleEl.textContent = t
            if (activeTabId === id) document.title = t + ' — Nitrix'
            const tabRef = tabs.find(tt => tt.id === id)
            if (tabRef && tabRef.url) scheduleAddToHistory(tabRef.url, t)
          }
        } catch(e) {}
      }

      if (activeTabId !== id) return
      wvCont.classList.remove('wv-loading')
      loader.className = 'done'
      setTimeout(() => { if (loader.className === 'done') loader.className = '' }, 600)
      iconReload.innerHTML = '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>'
      btnReload.onclick = () => window.electronAPI.reloadPage(wv.getWebContentsId())
      btnBack.disabled = !wv.canGoBack()
      btnFwd.disabled  = !wv.canGoForward()
    }

    wv.addEventListener('did-stop-loading', _finishLoading)
    wv.addEventListener('did-finish-load',  _finishLoading)

    // ── Wykrywanie odtwarzania dźwięku ───────────────────────────────
    // Używamy licznika aktywnych mediów + debounce z anulowaniem.
    // media-started-playing może się odpalić wielokrotnie (wiele elementów),
    // media-paused odpala się też przy buforowaniu/reklamach — stąd licznik.
    let _mediaCount = 0
    let _mediaPauseTimer = null

    const _showSoundIcon = () => {
      if (_mediaPauseTimer) { clearTimeout(_mediaPauseTimer); _mediaPauseTimer = null }
      soundBtn.classList.add('playing')
    }

    const _hideSoundIcon = () => {
      // Nie chowamy gdy wyciszone — ikona musi zostać jako info że karta jest muted
      if (_tabMuted) return
      soundBtn.classList.remove('playing')
    }

    wv.addEventListener('media-started-playing', () => {
      _mediaCount++
      _showSoundIcon()
    })

    wv.addEventListener('media-paused', () => {
      _mediaCount = Math.max(0, _mediaCount - 1)
      if (_mediaCount > 0) return  // inne media wciąż grają
      // Debounce 1.5s — dajemy czas na re-start (buforowanie, reklamy, autoplay)
      if (_mediaPauseTimer) clearTimeout(_mediaPauseTimer)
      _mediaPauseTimer = setTimeout(() => {
        _mediaPauseTimer = null
        if (_mediaCount === 0) _hideSoundIcon()
      }, 1500)
    })

    // Reset licznika przy nawigacji
    wv.addEventListener('did-start-loading', () => {
      _mediaCount = 0
      if (_mediaPauseTimer) { clearTimeout(_mediaPauseTimer); _mediaPauseTimer = null }
      if (!_tabMuted) soundBtn.classList.remove('playing')
    })

    // ── Własne zablokowane elementy + motyw — wstrzykuj CSS przy każdym załadowaniu ──
    // Osobny listener bez żadnych early returns — zawsze odpala
    wv.addEventListener('did-finish-load', () => {
      const tab = tabs.find(t => t.id === id)
      if (tab) {
        applyCustomBlockedCSS(tab)
        applyBlockedPageTheme(tab)
      }
    })

    // ── Wykrywanie języka strony → przycisk Tłumacza ─────────────────
    wv.addEventListener('did-finish-load', async () => {
      const tab = tabs.find(t => t.id === id)
      if (!tab) return

      const currentUrl = tab.url || ''

      // Jeśli strona jest już tłumaczona przez Google Translate — zaktualizuj stan
      if (isGoogleTranslateUrl(currentUrl)) {
        tab.isTranslated  = true
        tab.showTranslate = true
        if (activeTabId === id) updateTranslateBtn()
        return
      }

      // Resetuj flagę translated przy nowym załadowaniu
      tab.isTranslated = false

      // Nie wykrywaj na stronie startowej / pustej
      if (!currentUrl || isHomePage(currentUrl)) {
        tab.showTranslate = false
        if (activeTabId === id) updateTranslateBtn()
        return
      }

      try {
        const lang = await wv.executeJavaScript(`
          (function() {
            var l = document.documentElement.lang || ''
            if (!l) {
              var m = document.querySelector('meta[http-equiv="content-language"],meta[name="language"]')
              if (m) l = m.getAttribute('content') || ''
            }
            return l.toLowerCase().trim()
          })()
        `)
        // Pokaż przycisk tylko gdy strona jest w innym języku niż aktualny język UI
        const uiLang = _currentLang || 'pl'
        const isCurrentLang = !lang || lang.startsWith(uiLang)
        tab.showTranslate = !isCurrentLang
      } catch {
        tab.showTranslate = false
      }

      if (activeTabId === id) updateTranslateBtn()

      // Sprawdź autofill po pełnym załadowaniu strony
      if (activeTabId === id && typeof window._nitrixCheckAutofill === 'function') {
        const tab = tabs.find(t => t.id === id)
        if (tab?.url) window._nitrixCheckAutofill(wv, tab.url)
      }

      // Wstrzyknij aktualny stan adblockera do webview (agresywny + globalnie wyłączony)
      ;(async () => {
        try {
          if (!window.electronAPI?.adblockSettingsLoad) return
          const cfg = await window.electronAPI.adblockSettingsLoad()
          const tabNow = tabs.find(t => t.id === id)
          if (!tabNow) return
          const perTabOff = _adbEnabledMap[tabNow.id] === false
          const off = !cfg.enabled || perTabOff
          wv.executeJavaScript(
            `document.documentElement.dataset.nitrixAdblockOff = '${off ? '1' : '0'}';` +
            `document.documentElement.dataset.nitrixAggressive = '${cfg.enabled && cfg.aggressiveMode ? '1' : '0'}';`
          ).catch(() => {})
        } catch(e) {}
      })()
    })

    // Licznik generacji — każda nawigacja inkrementuje, stare callbacki ignorowane
    let faviconGen = 0

    wv.addEventListener('did-navigate', e => {
      if (internalPage) return
      const tab = tabs.find(t => t.id === id)
      if (tab) {
        tab._adbCount = 0; tab._adbItems = []
        // Przywróć persystentny stan adblock dla tej domeny
        const globalEnabled = document.getElementById('adb-toggle-enabled')?.checked !== false
        if (globalEnabled) {
          const disabled = _adbIsDisabledForUrl(e.url)
          _adbEnabledMap[tab.id] = !disabled
          try {
            const wcId = tab.wv.getWebContentsId ? tab.wv.getWebContentsId() : null
            if (wcId) electronAPI.adblockSetTab(wcId, !disabled)
          } catch {}
        }
        if (activeTabId === id) updateAdblockUI()
        tab.url = e.url
        // Zapamiętaj ostatni URL dla opcji "Ostatnio otwartą stronę"
        if (!isPrivate && activeTabId === id && e.url && /^https?:\/\//i.test(e.url)) {
          _lastOpenedUrl = e.url
          saveAllSettings()
        }
        // Resetuj stan tłumaczenia przy każdej nawigacji
        if (!isGoogleTranslateUrl(e.url)) {
          tab.showTranslate = false
          tab.isTranslated  = false
          tab.origUrl       = null
        }
        const gen = ++faviconGen
        const googleUrl = `https://www.google.com/s2/favicons?domain=${getDomain(e.url)}&sz=32`
        // Pokaż favicon z Google service jako bazowy fallback
        faviconEl.style.display = ''
        faviconEl.src = googleUrl
        faviconEl.onerror = () => {
          if (faviconGen !== gen) return // stara nawigacja — ignoruj
          faviconEl.style.display = 'none'
        }
      }
      if (activeTabId === id) {
        setUrlDisplay(e.url)
        setSecurityState(e.url)
        btnBack.disabled = !wv.canGoBack()
        btnFwd.disabled  = !wv.canGoForward()
        updateBkBarVisibility()
        if (typeof updateTranslateBtn === 'function') updateTranslateBtn()
      }
      scheduleAddToHistory(e.url, '')
      if (activeTabId === id && typeof window._nitrixCheckAutofill === 'function')
        window._nitrixCheckAutofill(wv, e.url)
    })

    wv.addEventListener('did-navigate-in-page', e => {
      if (internalPage) return
      if (!e.isMainFrame) return
      if (activeTabId === id) {
        setUrlDisplay(e.url)
        setSecurityState(e.url)
        btnBack.disabled = !wv.canGoBack()
        btnFwd.disabled  = !wv.canGoForward()
        if (typeof window._nitrixCheckAutofill === 'function')
          window._nitrixCheckAutofill(wv, e.url)
      }
      scheduleAddToHistory(e.url, '')
    })

    wv.addEventListener('page-title-updated', e => {
      if (internalPage) return
      titleEl.textContent = e.title || 'Karta'
      if (activeTabId === id) document.title = e.title + ' — Nitrix'
      const tab = tabs.find(t => t.id === id)
      if (tab && tab.url && e.title) scheduleAddToHistory(tab.url, e.title)
    })

    wv.addEventListener('page-favicon-updated', e => {
      if (internalPage) return
      if (!e.favicons || e.favicons.length === 0) return
      const gen = ++faviconGen   // nowa generacja — to jest "prawdziwe" favicon
      const actualUrl = e.favicons[0]
      const tab = tabs.find(t => t.id === id)
      const fallbackUrl = tab?.url
        ? `https://www.google.com/s2/favicons?domain=${getDomain(tab.url)}&sz=32`
        : null

      faviconEl.onerror = () => {
        if (faviconGen !== gen) return
        // Właściwe favicon nie załadowało się — cofnij do Google service
        if (fallbackUrl) {
          const gen2 = ++faviconGen
          faviconEl.src = fallbackUrl
          faviconEl.onerror = () => {
            if (faviconGen !== gen2) return
            faviconEl.style.display = 'none'
          }
          faviconEl.onload = () => { faviconEl.style.display = '' }
        } else {
          faviconEl.style.display = 'none'
        }
      }
      faviconEl.onload = () => {
        if (faviconGen !== gen) return
        faviconEl.style.display = ''
      }
      faviconEl.src = actualUrl
    })

    const tabObj = { id, wv, tabEl, titleEl, faviconEl, internalPage, url: internalPage ? (internalPage.dataset.internalUrl || "nitrix://restore-session") : url, errOverlay, hasError: false, _openedWithUrl: url,
      dispose() {
        tabObj.onInternalClose?.()
        internalPage?.remove()
        hideTabTooltip()
        clearTimeout(_mediaPauseTimer)
        _mediaPauseTimer = null
        faviconGen++
        faviconEl.onload = faviconEl.onerror = null
      }
    }
    tabEl.addEventListener('contextmenu', event => { event.preventDefault(); event.stopPropagation(); showCtxMenu(event.clientX, event.clientY, 'tab', -1, { tab: tabObj }) })
    tabs.push(tabObj)
    browserFeatures?.tabCreated(tabObj)
    updateTabSizes()
    activateTab(id)
    setTimeout(() => { if (typeof fixWebviewSizes === 'function') fixWebviewSizes() }, 80)
    return tabObj
  }

  // ══════════════════════════════════════════════════════════════════
  //  AKTYWACJA KARTY
  // ══════════════════════════════════════════════════════════════════
  function activateTab(id) {
    if (findTab && findTab.id !== id) closePageFind(false)
    const tab = tabs.find(t => t.id === id)
    if (!tab || tab.closing) return
    browserFeatures?.activate(tab)
    tabs.forEach(t => {
      t.wv.classList.remove('wv-active', 'wv-panel-source')
      t.tabEl.classList.remove('active')
      if (t.errOverlay) t.errOverlay.classList.remove('visible')
      if (t.internalPage) t.internalPage.style.display = 'none'
    })
    if (!tab.internalPage) tab.wv.classList.add('wv-active')
    const source = tab.internalPage && tabs.find(t => String(t.id) === tab.internalPage.dataset.sourceTabId && !t.closing && !t.internalPage)
    if (source) {
      browserFeatures?.activate(source)
      source.wv.classList.add('wv-panel-source')
    }
    tab.tabEl.classList.add('active')
    if (tab.hasError && tab.errOverlay) tab.errOverlay.classList.add('visible')
    activeTabId = id
    if (tab.internalPage) tab.internalPage.style.display = 'flex'
    setUrlDisplay(tab.url || '', !!tab.internalPage)
    try { btnBack.disabled = !tab.wv.canGoBack() } catch { btnBack.disabled = true }
    try { btnFwd.disabled  = !tab.wv.canGoForward() } catch { btnFwd.disabled = true }
    setSecurityState(tab.url || '')
    document.title = (tab.titleEl.textContent || t('new_tab')) + ' — Nitrix'
    // Synchronizuj pasek ładowania ze stanem karty
    btnReload.disabled = !!tab.internalPage
    if (tab.internalPage) {
      wvCont.classList.remove('wv-loading')
      loader.className = ''
      iconReload.innerHTML = '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>'
      btnReload.onclick = () => {}
    } else if (tab.isLoading) {
      wvCont.classList.add('wv-loading')
      loader.className = 'active'
      iconReload.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
      btnReload.onclick = () => stopCurrentPage(tab)
    } else {
      wvCont.classList.remove('wv-loading')
      loader.className = ''
      iconReload.innerHTML = '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>'
      btnReload.onclick = () => window.electronAPI.reloadPage(tab.wv.getWebContentsId())
    }
    // Auto-focus gdy strona startowa
    if (isHomePage(tab.url)) {
      setTimeout(() => { urlInput.focus() }, 80)
    }
    updateBkBarVisibility()
    // Przywróć zoom dla aktywowanej karty
    const tabZoom = tab.zoom || 100
    try { tab.wv.setZoomFactor(tabZoom / 100) } catch(e) {}
    if (typeof updateZoomUI === 'function') updateZoomUI(tabZoom)
    if (typeof updateTranslateBtn === 'function') updateTranslateBtn()
    if (typeof updateAdblockUI    === 'function') { updateAdblockUI(); _startAdblockPoll() }
    if (typeof applyCustomBlockedCSS === 'function') applyCustomBlockedCSS(tab)
    if (typeof window._nitrixCheckAutofill === 'function')
      window._nitrixCheckAutofill(tab.wv, tab.url || '')
  }

  // ══════════════════════════════════════════════════════════════════
  //  ZOOM — logika powiększenia strony
  // ══════════════════════════════════════════════════════════════════
  const zoomBtn          = document.getElementById('zoom-btn')
  const zoomPopup        = document.getElementById('zoom-popup')
  const zoomOutBtn       = document.getElementById('zoom-out-btn')
  const zoomInBtn        = document.getElementById('zoom-in-btn')
  const zoomResetBtn     = document.getElementById('zoom-reset-btn')
  const zoomValueDisplay = document.getElementById('zoom-value-display')

  const ZOOM_MIN  = 25
  const ZOOM_MAX  = 500
  const ZOOM_STEP = 10

  function updateZoomUI(zoom) {
    zoomValueDisplay.textContent = zoom + '%'
    zoomOutBtn.disabled = zoom <= ZOOM_MIN
    zoomInBtn.disabled  = zoom >= ZOOM_MAX
    zoomBtn.classList.toggle('zoomed', zoom !== 100)

    // Zmień symbol w lupce: + (>100), - (<100), = (100)
    const iconH = document.getElementById('zoom-icon-h')
    const iconV = document.getElementById('zoom-icon-v')
    if (!iconH || !iconV) return
    if (zoom > 100) {
      // plus — pozioma i pionowa kreska
      iconH.setAttribute('x1', '8');  iconH.setAttribute('y1', '11')
      iconH.setAttribute('x2', '14'); iconH.setAttribute('y2', '11')
      iconV.setAttribute('x1', '11'); iconV.setAttribute('y1', '8')
      iconV.setAttribute('x2', '11'); iconV.setAttribute('y2', '14')
      iconV.style.display = ''
    } else if (zoom < 100) {
      // minus — tylko pozioma kreska
      iconH.setAttribute('x1', '8');  iconH.setAttribute('y1', '11')
      iconH.setAttribute('x2', '14'); iconH.setAttribute('y2', '11')
      iconV.style.display = 'none'
    } else {
      // równa się — dwie poziome kreski (góra i dół)
      iconH.setAttribute('x1', '8');  iconH.setAttribute('y1', '9.5')
      iconH.setAttribute('x2', '14'); iconH.setAttribute('y2', '9.5')
      iconV.setAttribute('x1', '8');  iconV.setAttribute('y1', '12.5')
      iconV.setAttribute('x2', '14'); iconV.setAttribute('y2', '12.5')
      iconV.style.display = ''
    }
  }

  function applyZoom(tabObj, zoom) {
    tabObj.zoom = zoom
    try { tabObj.wv.setZoomFactor(zoom / 100) } catch(e) {}
    updateZoomUI(zoom)
  }

  function getCurrentZoom() {
    const t = getActiveTab()
    return t ? (t.zoom || 100) : 100
  }

  zoomBtn.addEventListener('click', e => {
    e.stopPropagation()
    // Zamknij inne menu
    dropdown.classList.remove('open')
    dlPanel.classList.remove('open')
    hideSecPopup()
    translatePopup.classList.remove('open')
    qrPopup.classList.remove('open')

    if (zoomPopup.classList.contains('open')) {
      zoomPopup.classList.remove('open')
      return
    }

    updateZoomUI(getCurrentZoom())

    // Pozycja popupu — pod przyciskiem, wyrównany do prawego brzegu
    const rect = zoomBtn.getBoundingClientRect()
    zoomPopup.style.top = (rect.bottom + 6) + 'px'
    // tymczasowo pokaż żeby zmierzyć szerokość
    zoomPopup.style.visibility = 'hidden'
    zoomPopup.style.display = 'flex'
    const pw = zoomPopup.offsetWidth
    zoomPopup.style.display = ''
    zoomPopup.style.visibility = ''
    const left = Math.max(8, rect.right - pw)
    zoomPopup.style.left = left + 'px'
    zoomPopup.classList.add('open')
  })

  zoomOutBtn.addEventListener('click', e => {
    e.stopPropagation()
    const t = getActiveTab()
    if (!t) return
    const newZoom = Math.max(ZOOM_MIN, (t.zoom || 100) - ZOOM_STEP)
    applyZoom(t, newZoom)
  })

  zoomInBtn.addEventListener('click', e => {
    e.stopPropagation()
    const t = getActiveTab()
    if (!t) return
    const newZoom = Math.min(ZOOM_MAX, (t.zoom || 100) + ZOOM_STEP)
    applyZoom(t, newZoom)
  })

  zoomResetBtn.addEventListener('click', e => {
    e.stopPropagation()
    const t = getActiveTab()
    if (!t) return
    applyZoom(t, 100)
  })

  zoomPopup.addEventListener('click', e => e.stopPropagation())

  // ══════════════════════════════════════════════════════════════════
  // ══════════════════════════════════════════════════════════════════
  //  ADBLOCK — przycisk, popup, toggle, lista zablokowanych
  // ══════════════════════════════════════════════════════════════════
  const adblockBtn     = document.getElementById('adblock-btn')
  const adblockPopup   = document.getElementById('adblock-popup')
  const adblockToggle  = document.getElementById('adblock-toggle')
  const adblockCount   = document.getElementById('adblock-count')
  const adbStatTotal   = document.getElementById('adb-stat-total')
  const adbToggleSub   = document.getElementById('adb-toggle-sub')
  const adbAdvBtn      = document.getElementById('adb-advanced-toggle-btn')
  const adbAdvPanel    = document.getElementById('adblock-advanced')
  const adbAdvChevron  = document.getElementById('adb-advanced-chevron')
  const adbList        = document.getElementById('adb-list')
  const adbClearBtn    = document.getElementById('adb-adv-clear-btn')

  // Stan per-karta — czy adblock jest włączony
  const _adbEnabledMap = {}     // tabId → Boolean

  // ── Persystentna lista domen z wyłączonym adblock ────────────────
  const ADB_DISABLED_KEY = 'nitrix_adb_disabled_domains'
  function _adbLoadDisabled() {
    try { return new Set(JSON.parse(localStorage.getItem(ADB_DISABLED_KEY)) || []) } catch { return new Set() }
  }
  function _adbSaveDisabled(set) {
    try { localStorage.setItem(ADB_DISABLED_KEY, JSON.stringify([...set])) } catch {}
  }
  let _adbDisabledDomains = _adbLoadDisabled()

  function _adbGetDomain(url) {
    try { return new URL(url).hostname.toLowerCase() } catch { return null }
  }
  function _adbIsDisabledForUrl(url) {
    const h = _adbGetDomain(url)
    return h ? _adbDisabledDomains.has(h) : false
  }
  let   _adbPollTimer  = null   // globalny timer aktywnego pollingu

  function isAdblockEnabled() {
    const tab = getActiveTab()
    return tab ? (_adbEnabledMap[tab.id] !== false) : true
  }

  function updateAdblockUI() {
    const tab     = getActiveTab()
    const enabled = isAdblockEnabled()
    const count   = tab?._adbCount || 0

    adblockBtn.classList.toggle('active',    enabled)
    adblockBtn.classList.toggle('disabled',  !enabled)
    adblockBtn.classList.toggle('has-count', enabled && count > 0)
    adblockCount.textContent = count > 99 ? '99+' : String(count)
    adblockToggle.checked    = enabled
    adbToggleSub.textContent = t(enabled ? 'adblock_toggle_on' : 'adblock_toggle_off')
    adbStatTotal.textContent = String(count)
  }

  // Pokaż/ukryj ikonkę adblock globalnie (wg ustawień)
  function applyAdblockGlobalVisibility(globalEnabled, instant = false) {
    window.adblockGloballyEnabled = globalEnabled
    adblockBtn.classList.toggle('globally-hidden', !globalEnabled)
    if (!globalEnabled) adblockPopup.classList.remove('open')

    if (instant) {
      urlWrap.style.transition = 'none'
      adblockBtn.style.transition = 'none'
      urlWrap.classList.toggle('bar-expanded', window.expandBarEnabled !== false)
      urlWrap.getBoundingClientRect()
      urlWrap.style.transition = ''
      adblockBtn.style.transition = ''
    } else {
      urlWrap.classList.toggle('bar-expanded', window.expandBarEnabled !== false)
    }
  }

  function renderAdblockList() {
    const tab   = getActiveTab()
    const items = tab?._adbItems || []
    if (!items.length) {
      adbList.innerHTML = `<div class="adb-empty">${t('adblock_empty')}</div>`
      return
    }
    const slice = [...items].reverse().slice(0, 100)
    adbList.innerHTML = slice.map(item => {
      let shortUrl = item.url || ''
      try {
        const u = new URL(item.url)
        shortUrl = u.hostname + (u.pathname.length > 1 ? u.pathname.slice(0, 35) + (u.pathname.length > 35 ? '…' : '') : '')
      } catch(e) {}
      const tc = item.type === 'fetch' ? 'fetch' : 'xhr'
      return `<div class="adb-item">
        <span class="adb-item-type ${tc}">${(item.type||'').toUpperCase()}</span>
        <span class="adb-item-url" title="${item.url}">${shortUrl}</span>
      </div>`
    }).join('')
  }

  // ── Odbiór zdarzeń o zablokowanych zasobach z main procesu ──
  // (main.js wysyła 'adblock-blocked' dla każdego zablokowanego requestu sieciowego)
  electronAPI.onAdblockBlocked(data => {
    const tab = tabs.find(t => {
      try { return t.wv.getWebContentsId && t.wv.getWebContentsId() === data.wcId } catch { return false }
    })
    if (!tab) return
    if (!tab._adbItems) tab._adbItems = []
    tab._adbItems.push({ url: data.url, type: data.type })
    if (tab._adbItems.length > 50) tab._adbItems.splice(0, 25)
    tab._adbCount = tab._adbItems.length
    if (tab === getActiveTab()) {
      updateAdblockUI()
      if (adblockPopup.classList.contains('open') && adbAdvPanel.classList.contains('open'))
        renderAdblockList()
    }
  })

  electronAPI.onNavigateTabBlock(({ wcId, domain }) => {
    const tab = tabs.find(t => {
      try { return t.wv.getWebContentsId && t.wv.getWebContentsId() === wcId } catch { return false }
    })
    if (tab && tab.wv) {
      try { tab.wv.loadURL('nitrix-block://blocked?d=' + encodeURIComponent(domain)) } catch(e) {}
    }
  })

  // ── Polling jako backup — synchronizuje licznik po zmianie karty / nawigacji ──
  // (dataset jest kasowany przy beforeunload, więc nie jest już głównym źródłem danych)
  function _startAdblockPoll() {
    clearTimeout(_adbPollTimer)
    ;(function poll() {
      // Odśwież UI co 2 sekundy — tylko gdy karta jest aktywna i popup otwarty
      if (document.visibilityState !== 'hidden') updateAdblockUI()
      _adbPollTimer = setTimeout(poll, 8000)
    })()
  }

  // Start pollingu przy otwarciu przeglądarki
  setTimeout(_startAdblockPoll, 1000)

  // Ustaw widoczność ikonki adblock przy starcie wg zapisanych ustawień
  ;(async () => {
    try {
      if (window.electronAPI?.adblockSettingsLoad) {
        const cfg = await window.electronAPI.adblockSettingsLoad()
        applyAdblockGlobalVisibility(cfg.enabled, true)
      }
    } catch(e) {}
  })()

  // ── Otwieranie/zamykanie popupu ──
  adblockBtn.addEventListener('click', e => {
    e.stopPropagation()
    dropdown.classList.remove('open')
    dlPanel.classList.remove('open')
    hideSecPopup()
    if (typeof zoomPopup   !== 'undefined') zoomPopup.classList.remove('open')
    if (typeof translatePopup !== 'undefined') translatePopup.classList.remove('open')
    if (typeof qrPopup !== 'undefined') qrPopup.classList.remove('open')

    if (adblockPopup.classList.contains('open')) {
      adblockPopup.classList.remove('open'); return
    }
    updateAdblockUI()
    renderAdblockList()

    const rect = adblockBtn.getBoundingClientRect()
    adblockPopup.style.visibility = 'hidden'
    adblockPopup.style.display    = 'block'
    const pw = adblockPopup.offsetWidth
    adblockPopup.style.display    = ''
    adblockPopup.style.visibility = ''
    adblockPopup.style.left = Math.max(8, rect.right - pw) + 'px'
    adblockPopup.style.top  = (rect.bottom + 6) + 'px'
    adblockPopup.classList.add('open')
  })

  adblockPopup.addEventListener('click', e => e.stopPropagation())
  document.addEventListener('click', () => adblockPopup.classList.remove('open'))

  // ── Toggle włącz/wyłącz ──
  adblockToggle.addEventListener('change', () => {
    const tab     = getActiveTab()
    const enabled = adblockToggle.checked
    if (tab) {
      _adbEnabledMap[tab.id] = enabled
      // Zapisz stan domeny persystentnie
      const domain = _adbGetDomain(tab.url || '')
      if (domain) {
        if (!enabled) _adbDisabledDomains.add(domain)
        else          _adbDisabledDomains.delete(domain)
        _adbSaveDisabled(_adbDisabledDomains)
      }
      // 1. Ustaw stan w main procesie → wyłącza/włącza blokowanie sieciowe
      try {
        const wcId = tab.wv.getWebContentsId ? tab.wv.getWebContentsId() : null
        if (wcId) electronAPI.adblockSetTab(wcId, enabled)
      } catch(e) {}
      // 2. Zapisz do dataset webviewu → adblock-content.js (fetch/XHR patch)
      tab.wv.executeJavaScript(
        `document.documentElement.dataset.nitrixAdblockOff = '${enabled ? '0' : '1'}'`
      ).catch(() => {})
      // 3. Przeładuj stronę żeby zmiany weszły w życie natychmiast
      setTimeout(() => { try { tab.wv.reload() } catch(e) {} }, 80)
    }
    updateAdblockUI()
  })

  // ── Panel zaawansowany ──
  adbAdvBtn.addEventListener('click', () => {
    const open = adbAdvPanel.classList.toggle('open')
    adbAdvChevron.style.transform = open ? 'rotate(180deg)' : ''
    if (open) renderAdblockList()
  })

  adbClearBtn.addEventListener('click', () => {
    const tab = getActiveTab()
    if (tab) {
      tab._adbItems = []; tab._adbCount = 0
      tab.wv.executeJavaScript(
        "document.documentElement.dataset.nitrixBlocked = '[]'"
      ).catch(() => {})
    }
    updateAdblockUI()
    renderAdblockList()
  })

  // ══════════════════════════════════════════════════════════════════
  //  WŁASNE ZABLOKOWANE ELEMENTY (element picker)
  // ══════════════════════════════════════════════════════════════════
  const adbCustomSection = document.getElementById('adb-custom-section')
  const adbCustomList    = document.getElementById('adb-custom-list')
  const pickerToast      = document.getElementById('picker-toast')
  const pickerToastMsg   = document.getElementById('picker-toast-msg')
  const pickerToastCancel= document.getElementById('picker-toast-cancel')

  // Storage: { "hostname": ["selector1", ...] } — persystowane w pliku przez main process
  async function loadCustomBlocked() {
    try { return await window.electronAPI.customBlockedLoad() } catch { return {} }
  }
  async function saveCustomBlocked(obj) {
    try { await window.electronAPI.customBlockedSave(obj) } catch {}
  }
  async function getCustomBlockedForHost(hostname) {
    return (await loadCustomBlocked())[hostname] || []
  }
  async function addCustomBlocked(hostname, selector) {
    const obj = await loadCustomBlocked()
    if (!obj[hostname]) obj[hostname] = []
    if (!obj[hostname].includes(selector)) obj[hostname].push(selector)
    await saveCustomBlocked(obj)
  }
  async function removeCustomBlocked(hostname, selector) {
    const obj = await loadCustomBlocked()
    if (!obj[hostname]) return
    obj[hostname] = obj[hostname].filter(s => s !== selector)
    if (!obj[hostname].length) delete obj[hostname]
    await saveCustomBlocked(obj)
  }

  // Wstrzyknij CSS ukrywający własne zablokowane elementy po załadowaniu strony
  async function applyCustomBlockedCSS(tab) {
    if (!tab || !tab.wv || !tab.url) return
    let hostname = ''
    try { hostname = new URL(tab.url).hostname } catch { return }
    if (!hostname) return
    const selectors = await getCustomBlockedForHost(hostname)
    if (!selectors.length) return
    const css = selectors.map(s => `${s}{display:none!important;visibility:hidden!important}`).join('\n')
    const code = `(function(){var id='__nitrix_custom_block';var el=document.getElementById(id);if(!el){el=document.createElement('style');el.id=id;(document.head||document.documentElement).appendChild(el);}el.textContent=${JSON.stringify(css)};})();`
    try { tab.wv.executeJavaScript(code).catch(() => {}) } catch {}
  }

  // applyWebviewThemeCSS — usunięte (modyfikacja kolorów tekstu na stronach wyłączona)

  // ── Strona blocked — wygląd identyczny jak Nitrix ERR_NAME_NOT_RESOLVED ──
  function applyBlockedPageTheme(tab) {
    if (!tab || !tab.wv) return
    const url = (tab.url || tab.wv.getURL?.() || '')
    if (!url.startsWith('nitrix-block://')) return
    const isDark = currentTheme !== 'light'
    const isEn   = (_currentLang || 'pl') === 'en'

    const bg      = isDark ? '#1e1e1e' : '#ffffff'
    const cardBg  = isDark ? '#2a2a2a' : '#f5f5f5'
    const cardBor = isDark ? '#3a3a3a' : '#e0e0e0'
    const text    = isDark ? '#e8e8e8' : '#202124'
    const sub     = isDark ? '#9e9e9e' : '#5f6368'
    const iconCol = isDark ? '#c0504d' : '#d93025'
    const linkCol = isDark ? '#8ab4f8' : '#1a73e8'
    const dotCol  = isDark ? '#8ab4f8' : '#1a73e8'
    const sepCol  = isDark ? '#3a3a3a' : '#e0e0e0'
    const btnBg   = isDark ? '#8ab4f8' : '#1a73e8'
    const btnTxt  = '#ffffff'

    // Teksty PL/EN
    const T = isEn ? {
      title:   'Site blocked',
      errCode: 'NITRIX_ADBLOCK_BLOCKED',
      desc:    (d) => `Nitrix Adblock blocked access to <em>${d}</em> based on your filter settings.`,
      card:    'What can you do?',
      b1:      'This site was blocked by one of your custom filter rules',
      b2:      'You can manage your rules in Adblock settings',
      b3:      'Disable the rule to allow access to this site',
      rule:    'Blocked by rule:',
      back:    '← Go back',
    } : {
      title:   'Ta strona jest zablokowana',
      errCode: 'NITRIX_ADBLOCK_BLOCKED',
      desc:    (d) => `Nitrix Adblock zablokował dostęp do <em>${d}</em> na podstawie Twoich ustawień filtrów.`,
      card:    'Co możesz zrobić?',
      b1:      'Ta strona została zablokowana przez jedną z Twoich reguł filtrów',
      b2:      'Możesz zarządzać regułami w ustawieniach Adblock',
      b3:      'Usuń regułę, aby zezwolić na dostęp do tej strony',
      rule:    'Zablokowano regułą:',
      back:    '← Wróć',
    }

    const code = `(function(){
      if(document.getElementById('__nitrix_rebuilt')) return;

      // Pobierz domenę
      var domain = '';
      try {
        var params = new URLSearchParams(location.search);
        domain = params.get('d') || location.hostname || '';
      } catch(e){}

      // Pobierz regułę z oryginalnej treści
      var rule = '';
      try {
        var allText = document.body ? document.body.innerText : '';
        var m = allText.match(/[|]{1,2}[^\\s\\n]{3,}/);
        if(m) rule = m[0];
        if(!rule){
          var codeEl = document.querySelector('code');
          if(codeEl) rule = codeEl.textContent.trim();
        }
      } catch(e){}

      var domainStr = domain || 'tej strony';
      var descHtml = \`${T.desc('__DOM__')}\`.replace('__DOM__', domainStr);

      document.title = '${T.title}';
      document.head.innerHTML = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
        '*{margin:0;padding:0;box-sizing:border-box;}' +
        'html,body{height:100%;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-size:14px;background:${bg};color:${text};}' +
        '.page{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:60px 24px 80px;}' +
        '.icon{margin-bottom:24px;}' +
        '.icon svg{width:80px;height:80px;}' +
        'h1{font-size:22px;font-weight:700;color:${text};margin-bottom:6px;text-align:center;letter-spacing:.1px;}' +
        '.domain{font-size:13px;color:${sub};margin-bottom:4px;text-align:center;}' +
        '.errcode{font-size:12px;color:${sub};margin-bottom:18px;text-align:center;letter-spacing:.4px;}' +
        '.desc{font-size:14px;color:${sub};text-align:center;max-width:440px;line-height:1.7;margin-bottom:28px;}' +
        '.desc em{font-style:italic;color:${text};}' +
        '.card{background:${cardBg};border:1px solid ${cardBor};border-radius:12px;padding:20px 24px;max-width:440px;width:100%;margin-bottom:32px;}' +
        '.card-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:${text};margin-bottom:14px;}' +
        '.card-title svg{flex-shrink:0;}' +
        '.bullet{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid ${sepCol};font-size:13px;color:${sub};line-height:1.5;}' +
        '.bullet:last-child{border-bottom:none;padding-bottom:0;}' +
        '.dot{width:7px;height:7px;border-radius:50%;background:${dotCol};flex-shrink:0;margin-top:5px;}' +
        '.rule-row{margin-top:12px;font-size:12px;color:${sub};}' +
        '.rule-badge{display:inline-block;background:${isDark ? '#3a3a3a' : '#e8eaed'};color:${text};font-family:"SF Mono","Fira Mono","Consolas",monospace;font-size:11px;padding:3px 10px;border-radius:4px;word-break:break-all;margin-top:4px;}' +
        '.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 24px;background:${btnBg};color:${btnTxt};font-size:14px;font-weight:500;border:none;border-radius:24px;cursor:pointer;transition:opacity .15s;text-decoration:none;}' +
        '.btn:hover{opacity:.88;}' +
        '</style>';

      var ruleHtml = rule
        ? '<div class="rule-row">${T.rule} <br><span class="rule-badge">' + rule + '</span></div>'
        : '';

      document.body.innerHTML =
        '<div class="page">' +
          '<div class="icon">' +
            '<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">' +
              '<circle cx="40" cy="40" r="36" stroke="${iconCol}" stroke-width="2.5" opacity=".35"/>' +
              '<ellipse cx="40" cy="40" rx="14" ry="36" stroke="${iconCol}" stroke-width="2.5" opacity=".35"/>' +
              '<line x1="4" y1="40" x2="76" y2="40" stroke="${iconCol}" stroke-width="2.5" opacity=".35"/>' +
              '<line x1="10" y1="22" x2="70" y2="22" stroke="${iconCol}" stroke-width="2" opacity=".25"/>' +
              '<line x1="10" y1="58" x2="70" y2="58" stroke="${iconCol}" stroke-width="2" opacity=".25"/>' +
              '<line x1="16.3" y1="7.7" x2="63.7" y2="72.3" stroke="${iconCol}" stroke-width="3" stroke-linecap="round"/>' +
            '</svg>' +
          '</div>' +
          '<h1>${T.title}</h1>' +
          (domain ? '<p class="domain">' + domainStr + '</p>' : '') +
          '<p class="errcode">${T.errCode}</p>' +
          '<p class="desc">' + descHtml + '</p>' +
          '<div class="card">' +
            '<div class="card-title">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${linkCol}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
              '${T.card}' +
            '</div>' +
            '<div class="bullet"><div class="dot"></div><span>${T.b1}</span></div>' +
            '<div class="bullet"><div class="dot"></div><span>${T.b2}</span></div>' +
            '<div class="bullet"><div class="dot"></div><span>${T.b3}</span></div>' +
            ruleHtml +
          '</div>' +
          '<button class="btn" onclick="history.back()">${T.back}</button>' +
        '</div>';

      var marker = document.createElement('div');
      marker.id = '__nitrix_rebuilt';
      marker.style.display = 'none';
      document.body.appendChild(marker);
    })();`

    try { tab.wv.executeJavaScript(code).catch(() => {}) } catch {}
  }

  // Renderuj sekcję własnych zablokowanych elementów w popup
  async function renderCustomBlockedList() {
    const tab = getActiveTab()
    let hostname = ''
    try {
      const url = tab?.wv?.getURL() || tab?.url || ''
      hostname = url ? new URL(url).hostname : ''
    } catch {}
    const items = hostname ? await getCustomBlockedForHost(hostname) : []
    adbCustomSection.style.display = items.length ? '' : 'none'
    if (!items.length) { adbCustomList.innerHTML = ''; return }
    adbCustomList.innerHTML = items.map((sel, idx) => `
      <div class="adb-item" data-idx="${idx}">
        <span class="adb-item-type elem">ELEM</span>
        <span class="adb-item-url" title="${sel}">${sel.length > 40 ? sel.slice(0, 40) + '…' : sel}</span>
        <button class="adb-item-del" data-sel="${encodeURIComponent(sel)}" title="${t('adblock_clear')}">✕</button>
      </div>
    `).join('')
    adbCustomList.querySelectorAll('.adb-item-del').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation()
        const sel = decodeURIComponent(btn.dataset.sel)
        await removeCustomBlocked(hostname, sel)
        // Usuń blokadę z aktualnej strony live
        try { tab.wv.executeJavaScript(`(function(){var el=document.getElementById('__nitrix_custom_block');if(el){var lines=el.textContent.split('\\n').filter(l=>!l.startsWith(${JSON.stringify(sel)}));el.textContent=lines.join('\\n');}})()`) } catch {}
        renderCustomBlockedList()
        updateAdblockUI()
      })
    })
  }

  // Odśwież sekcję custom gdy otwierany jest popup
  const _origAdblockBtnClick = adblockBtn.onclick
  adblockBtn.addEventListener('click', () => {
    renderCustomBlockedList()
  })
  adbAdvBtn.addEventListener('click', () => {
    renderCustomBlockedList()
  }, true)

  // ── Element Picker ──
  let _pickerActive = false
  let _pickerAbort  = null

  const PICKER_SCRIPT = `
  new Promise(function(resolve) {
    if (window.__nitrixPickerActive) { resolve(null); return; }
    window.__nitrixPickerActive = true;

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483646;cursor:crosshair;';
    document.documentElement.appendChild(overlay);

    var highlight = document.createElement('div');
    highlight.style.cssText = 'position:fixed;z-index:2147483645;pointer-events:none;outline:2px solid #8ab4f8;background:rgba(138,180,248,0.10);border-radius:3px;transition:all 0.05s;box-sizing:border-box;';
    document.documentElement.appendChild(highlight);

    var lastTarget = null;

    function buildSelector(el) {
      if (!el || el === document.body || el === document.documentElement) return null;
      if (el.id) return '#' + CSS.escape(el.id);
      var parts = [];
      var cur = el;
      for (var i = 0; i < 4 && cur && cur !== document.documentElement; i++) {
        var tag = cur.tagName.toLowerCase();
        var cls = Array.from(cur.classList).slice(0,2).map(function(c){ return '.'+CSS.escape(c); }).join('');
        var part = tag + cls;
        if (cur.parentElement) {
          var siblings = Array.from(cur.parentElement.children).filter(function(c){ return c.tagName === cur.tagName; });
          if (siblings.length > 1) part += ':nth-of-type(' + (siblings.indexOf(cur)+1) + ')';
        }
        parts.unshift(part);
        cur = cur.parentElement;
      }
      return parts.join(' > ');
    }

    overlay.addEventListener('mousemove', function(e) {
      overlay.style.pointerEvents = 'none';
      var real = document.elementFromPoint(e.clientX, e.clientY);
      overlay.style.pointerEvents = '';
      if (!real || real === overlay || real === highlight) return;
      lastTarget = real;
      var r = real.getBoundingClientRect();
      highlight.style.left   = r.left   + 'px';
      highlight.style.top    = r.top    + 'px';
      highlight.style.width  = r.width  + 'px';
      highlight.style.height = r.height + 'px';
    });

    overlay.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      cleanup();
      var sel = lastTarget ? buildSelector(lastTarget) : null;
      resolve(sel ? { selector: sel } : null);
    });

    function onKey(e) {
      if (e.key === 'Escape') { cleanup(); resolve(null); }
    }
    document.addEventListener('keydown', onKey, true);

    function cleanup() {
      window.__nitrixPickerActive = false;
      try { overlay.remove(); } catch {}
      try { highlight.remove(); } catch {}
      document.removeEventListener('keydown', onKey, true);
    }
    window.__nitrixPickerCleanup = cleanup;
  })
  `

  function enterElementPickerMode(tab) {
    if (_pickerActive) exitElementPickerMode()
    _pickerActive = true
    pickerToastMsg.textContent = t('picker_hint')
    pickerToastCancel.textContent = t('picker_cancel')
    pickerToast.classList.add('visible')

    tab.wv.executeJavaScript(PICKER_SCRIPT).then(async result => {
      exitElementPickerMode()
      if (!result || !result.selector) return
      const sel = result.selector
      let hostname = ''
      try { hostname = new URL(tab.url).hostname } catch {}
      if (!hostname) return
      // Dodaj do listy własnych
      await addCustomBlocked(hostname, sel)
      // Usuń element na żywo
      try {
        tab.wv.executeJavaScript(`(function(){var el=document.querySelector(${JSON.stringify(sel)});if(el)el.style.setProperty('display','none','important');})()`)
      } catch {}
      // Wstrzyknij CSS (trwałe na tej sesji)
      applyCustomBlockedCSS(tab)
      // Odśwież popup jeśli otwarty
      renderCustomBlockedList()
      updateAdblockUI()
    }).catch(() => exitElementPickerMode())
  }

  function exitElementPickerMode() {
    _pickerActive = false
    pickerToast.classList.remove('visible')
    const tab = getActiveTab()
    if (tab) {
      try { tab.wv.executeJavaScript('if(window.__nitrixPickerCleanup)window.__nitrixPickerCleanup()').catch(()=>{}) } catch {}
    }
  }

  pickerToastCancel.addEventListener('click', () => exitElementPickerMode())

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && _pickerActive) exitElementPickerMode()
  }, true)

  // Wstrzyknij CSS własnych bloków przy każdej nawigacji — hook w did-finish-load (powyżej w createTab)

  //  TŁUMACZ — wykrywanie języka i tłumaczenie przez Google Translate
  // ══════════════════════════════════════════════════════════════════
  const translateBtn     = document.getElementById('translate-btn')
  const translateDiv     = document.getElementById('translate-divider')
  const translatePopup   = document.getElementById('translate-popup')
  const translateDoBtn   = document.getElementById('translate-do-btn')
  const translateOrigBtn = document.getElementById('translate-orig-btn')
  const translateLabel   = document.getElementById('translate-popup-label')

  function isGoogleTranslateUrl(url) {
    try {
      const u = new URL(url)
      return u.hostname === 'translate.google.com' && u.pathname === '/translate'
    } catch { return false }
  }

  function updateTranslateBtn() {
    const tab = getActiveTab()
    if (!tab) {
      translateBtn.style.display = 'none'
      translateDiv.style.display = 'none'
      return
    }
    const show = !!tab.showTranslate || !!tab.isTranslated
    translateBtn.style.display = show ? 'flex' : 'none'
    translateDiv.style.display = show ? '' : 'none'
    translateBtn.classList.toggle('translated', !!tab.isTranslated)

    // Aktualizuj zawartość popupu
    if (tab.isTranslated) {
      translateLabel.textContent   = `✓ ${t('translated_to')}`
      translateDoBtn.style.display  = 'none'
      translateOrigBtn.style.display = ''
    } else {
      translateLabel.textContent   = t('translate_notice')
      translateDoBtn.style.display  = ''
      translateOrigBtn.style.display = 'none'
    }
  }

  translateBtn.addEventListener('click', e => {
    e.stopPropagation()
    // Zamknij inne menu
    dropdown.classList.remove('open')
    dlPanel.classList.remove('open')
    hideSecPopup()
    zoomPopup.classList.remove('open')
    qrPopup.classList.remove('open')

    if (translatePopup.classList.contains('open')) {
      translatePopup.classList.remove('open')
      return
    }

    updateTranslateBtn()  // odśwież zawartość popupu

    // Pozycjonuj popup pod przyciskiem
    const rect = translateBtn.getBoundingClientRect()
    translatePopup.style.visibility = 'hidden'
    translatePopup.style.display    = 'block'
    const pw = translatePopup.offsetWidth
    translatePopup.style.display    = ''
    translatePopup.style.visibility = ''
    const left = Math.max(8, rect.right - pw)
    translatePopup.style.left = left + 'px'
    translatePopup.style.top  = (rect.bottom + 6) + 'px'
    translatePopup.classList.add('open')
  })

  translateDoBtn.addEventListener('click', e => {
    e.stopPropagation()
    translatePopup.classList.remove('open')
    const tab = getActiveTab()
    if (!tab) return
    const origUrl = tab.url || ''
    tab.origUrl = origUrl   // zapamiętaj oryginalny URL
    const gtUrl = `https://translate.google.com/translate?sl=auto&tl=${_currentLang === 'en' ? 'en' : 'pl'}&u=${encodeURIComponent(origUrl)}`
    tab.wv.loadURL(gtUrl)
  })

  translateOrigBtn.addEventListener('click', e => {
    e.stopPropagation()
    translatePopup.classList.remove('open')
    const tab = getActiveTab()
    if (!tab) return
    const url = tab.origUrl || tab.url || ''
    if (/^https?:\/\//i.test(url)) tab.wv.loadURL(url)
  })

  translatePopup.addEventListener('click', e => e.stopPropagation())

  //  SEND TO DEVICES — QR Code
  // ══════════════════════════════════════════════════════════════════
  const qrBtn        = document.getElementById('qr-btn')
  const qrPopup      = document.getElementById('qr-popup')
  const qrImg        = document.getElementById('qr-code-img')
  const qrUrlText    = document.getElementById('qr-url-text')
  const qrPopupClose = document.getElementById('qr-popup-close')

  qrBtn.addEventListener('click', async e => {
    e.stopPropagation()
    dropdown.classList.remove('open')
    dlPanel.classList.remove('open')
    hideSecPopup()
    zoomPopup.classList.remove('open')
    translatePopup.classList.remove('open')

    const tab = getActiveTab()
    let url = tab ? tab.url : ''
    if (!url || !/^https?:\/\//i.test(url)) {
      qrPopup.classList.remove('open')
      return
    }

    // Toggle: zamknij jeśli już otwarty
    if (qrPopup.classList.contains('open')) {
      qrPopup.classList.remove('open')
      return
    }

    // Wyciągnij timestamp z YouTube / innych odtwarzaczy z elementu wideo
    const disableYtTime = qrToggleDisableYtTime && qrToggleDisableYtTime.checked
    try {
      const u = new URL(url)
      const host = u.hostname
      const isYouTube = host.includes('youtube.com') || host.includes('youtu.be')
      // YouTube
      if (!disableYtTime && isYouTube) {
        const tab = getActiveTab()
        if (tab && tab.wv) {
          try {
            const videoTime = await tab.wv.executeJavaScript(`
              (function(){
                var currentEl = document.querySelector('.ytp-time-current');
                if (currentEl) {
                  var parts = currentEl.textContent.split(':');
                  var seconds = 0;
                  if (parts.length === 2) {
                    seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                  } else if (parts.length === 3) {
                    seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
                  }
                  if (seconds > 0) return seconds;
                }
                var v = document.querySelector('video');
                if (v && v.currentTime > 0) return Math.floor(v.currentTime);
                return 0;
              })()
            `)
            if (videoTime > 0) {
              const sep = url.includes('?') ? '&' : '?'
              url += sep + 't=' + videoTime + 's'
            }
          } catch(e) {}
        }
      }
      // Vimeo, Dailymotion, Twitch i inne (nie YouTube)
      else if (!isYouTube) {
        const tab = getActiveTab()
        if (tab && tab.wv) {
          try {
            const videoTime = await tab.wv.executeJavaScript(`
              (function(){
                var v = document.querySelector('video');
                if (v && v.currentTime > 0) return Math.floor(v.currentTime);
                return 0;
              })()
            `)
            if (videoTime > 0) {
              const sep = url.includes('?') ? '&' : '?'
              if (host.includes('vimeo.com')) {
                url += '#t=' + videoTime + 's'
              } else if (host.includes('dailymotion.com')) {
                url += '#' + videoTime
              } else if (host.includes('twitch.tv')) {
                url += sep + 't=' + videoTime + 's'
              } else {
                url += sep + 't=' + videoTime + 's'
              }
            }
          } catch(e) {}
        }
      }
    } catch {}

    // Generuj QR używając darmowego API
    const qrLoading = document.getElementById('qr-loading')
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
    qrImg.style.display = 'none'
    qrLoading.classList.remove('hidden')
    qrImg.onerror = () => { 
      qrLoading.classList.add('hidden')
      qrImg.style.display = 'none' 
    }
    qrImg.onload = () => { 
      qrLoading.classList.add('hidden')
      qrImg.style.display = '' 
    }
    qrImg.src = qrApiUrl
    qrUrlText.textContent = url

    // Pozycjonuj popup
    const rect = qrBtn.getBoundingClientRect()
    qrPopup.style.visibility = 'hidden'
    qrPopup.style.display = 'block'
    const pw = qrPopup.offsetWidth
    qrPopup.style.display = ''
    qrPopup.style.visibility = ''
    const left = Math.max(8, rect.right - pw)
    qrPopup.style.left = left + 'px'
    qrPopup.style.top = (rect.bottom + 6) + 'px'
    qrPopup.classList.add('open')
  })

  qrPopupClose.addEventListener('click', e => {
    e.stopPropagation()
    qrPopup.classList.remove('open')
  })

  qrPopup.addEventListener('click', e => e.stopPropagation())

  // ══════════════════════════════════════════════════════════════════
  //  WYŚWIETLANIE URL — skrócony / pełny bez protokołu / pełny
  // ══════════════════════════════════════════════════════════════════
  let urlClickCount = 0
  let urlClickTimer = null

  function isHomePage(url) {
    if (!url) return true
    try {
      const u = new URL(url)
      // Sprawdź czy URL to aktualna strona startowa
      try {
        const homeU = new URL(currentHomepageUrl)
        if (u.hostname === homeU.hostname && u.pathname === homeU.pathname && !u.searchParams.has('q')) return true
      } catch {}
      // Fallback: Google (zachowane dla kompatybilności)
      const googleHost = /^(www\.)?google\.(pl|com)$/.test(u.hostname)
      if (!googleHost) return false
      return !u.searchParams.has('q')
    } catch { return false }
  }

  function getShortUrl(url) {
    if (!url) return ''
    try {
      const u = new URL(url)
      if (u.protocol === 'file:') return decodeURIComponent(url)
      const host = u.hostname.replace(/^www\./, '')
      const path = u.pathname + u.search
      if (path && path !== '/') {
        const short = path.length > 40 ? path.slice(0, 40) + '…' : path
        return host + short
      }
      return host
    } catch { return url }
  }

  function getUrlWithoutProtocol(url) {
    if (!url) return ''
    return url.replace(/^https?:\/\//, '')
  }

  function setUrlDisplay(url, force = false) {
    // Zawsze zaktualizuj tab.url
    const tab = getActiveTab()
    if (tab) tab.url = url
    // Nie nadpisuj inputa jeśli użytkownik aktualnie pisze
    if (!force && document.activeElement === urlInput) return
    _pendingTyped = null
    if (isHomePage(url)) {
      urlInput.value = ''
    } else {
      urlInput.value = /^nitrix:\/\//i.test(url) ? url : getShortUrl(url)
    }
  }

  // Blur — wróć do skróconego, reset kliknięć
  // Zapamiętaj co wpisał użytkownik żeby przywrócić przy powrocie focusa
  let _pendingTyped = null  // null = brak zapamiętanego tekstu
  let _urlInputDirty = false // true tylko gdy użytkownik realnie pisał po focusie

  urlInput.addEventListener('blur', () => {
    urlClickCount = 0
    if (urlClickTimer) clearTimeout(urlClickTimer)
    const tab = getActiveTab()
    const currentUrl = tab ? tab.url : ''
    if (!_urlInputDirty) {
      _pendingTyped = null
      setUrlDisplay(currentUrl)
      return
    }
    const typed = urlInput.value.trim()
    const displayedUrl = getUrlWithoutProtocol(currentUrl)
    // Usuń autocomplete-zaznaczenie jeśli zostało
    if (urlInput.selectionStart < urlInput.value.length) {
      urlInput.value = _typedVal || typed
    }
    const cleanTyped = urlInput.value.trim()
    // Jeśli użytkownik wpisał coś innego niż aktualny URL — zapamiętaj
    if (cleanTyped && cleanTyped !== displayedUrl && cleanTyped !== currentUrl) {
      _pendingTyped = cleanTyped
    } else {
      _pendingTyped = null
      setUrlDisplay(currentUrl)
    }
    _urlInputDirty = false
  })
  function closeTab(id) {
    if (findTab && findTab.id === id) closePageFind(false)
    const idx = tabs.findIndex(t => t.id === id)
    if (idx === -1) return
    const tab = tabs[idx]
    if (tab.closing) return
    browserFeatures?.rememberClosed(tab, idx)
    tab.closing = true
    hideSecPopup()
    if (activeTabId === id) {
      const next = tabs.slice(idx + 1).find(t => !t.closing)
        || tabs.slice(0, idx).reverse().find(t => !t.closing)
      if (next) activateTab(next.id)
    }
    // Zablokuj width żeby animacja miała od czego kurczyć
    const w = tab.tabEl.getBoundingClientRect().width
    tab.tabEl.style.maxWidth  = w + 'px'
    tab.tabEl.style.minWidth  = w + 'px'
    tab.tabEl.style.flexBasis = w + 'px'
    tab.tabEl.style.overflow  = 'hidden'
    tab.tabEl.style.pointerEvents = 'none'
    // + button płynnie wraca
    tabNewBtn.style.transition = 'transform .22s cubic-bezier(.4,0,.2,1)'
    tabNewBtn.style.transform = ''
    requestAnimationFrame(() => requestAnimationFrame(() => {
      tab.tabEl.classList.add('tab-closing')
    }))
    setTimeout(() => {
      tab.dispose()
      tab.tabEl.remove()
      tab.wv.remove()
      if (tab.errOverlay) tab.errOverlay.remove()
      const removeIdx = tabs.findIndex(t => t.id === id)
      if (removeIdx !== -1) tabs.splice(removeIdx, 1)
      delete _adbEnabledMap[id]
      browserFeatures?.snapshot()
      if (tabs.length === 0) window.electronAPI.close()
      updateTabSizes()
    }, 230)
  }

  // ══════════════════════════════════════════════════════════════════
  //  ROZMIAR KART — dynamiczne dostosowanie szerokości
  //  Gwarantuje że przycisk + zawsze jest widoczny; karty kurczą się
  //  proporcjonalnie gdy ich liczba rośnie (jak w Chrome).
  // ══════════════════════════════════════════════════════════════════
  function updateTabSizes() {
    const count = tabs.length
    if (count === 0) return

    const available = tabsBar.clientWidth - tabNewBtn.offsetWidth - 16
    const perTab    = available / count          // float — brak zaokrągleń = + stoi w miejscu
    const shrinking = perTab < 204              // czy karty muszą się kurczyć

    const newWidth  = Math.min(204, perTab)

    // Progi szerokości karty odpowiadające ok. 20 i 30 kart na standardowym ekranie
    // perTab < 68px ≈ 20 kart, perTab < 46px ≈ 30 kart
    const narrow      = shrinking && newWidth < 68 && newWidth >= 46
    const veryNarrow  = shrinking && newWidth < 46

    tabs.forEach(t => {
      if (shrinking) {
        // max = min = dokładna szerokość (sub-pixel) → + nie drga
        t.tabEl.style.maxWidth = newWidth + 'px'
        t.tabEl.style.minWidth = newWidth + 'px'
      } else {
        // Mało kart — flex sam obsługuje układ, czyścimy inline style
        t.tabEl.style.maxWidth = '204px'
        t.tabEl.style.minWidth = ''
      }
      t.tabEl.classList.toggle('tab-narrow',      narrow)
      t.tabEl.classList.toggle('tab-very-narrow',  veryNarrow)
      // Usuń klasę jeśli jest w złej grupie
      if (veryNarrow) t.tabEl.classList.remove('tab-narrow')
      if (narrow)     t.tabEl.classList.remove('tab-very-narrow')
      if (!narrow && !veryNarrow) {
        t.tabEl.classList.remove('tab-narrow', 'tab-very-narrow')
      }
    })
  }

  // ══════════════════════════════════════════════════════════════════
  //  WYSZUKIWARKA — wybór domyślnej
  // ══════════════════════════════════════════════════════════════════
  const SEARCH_ENGINES = {
    google:     { url: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,       home: 'https://www.google.pl',        placeholderKey: 'ph_google' },
    duckduckgo: { url: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,             home: 'https://duckduckgo.com',        placeholderKey: 'ph_duckduckgo' },
    bing:       { url: q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,         home: 'https://www.bing.com',          placeholderKey: 'ph_bing' },
    brave:      { url: q => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,    home: 'https://search.brave.com',      placeholderKey: 'ph_brave' },
  }
  let currentSearchEngine = 'google'

  function applySearchEngine(engine, save = true) {
    currentSearchEngine = engine
    const cfg = SEARCH_ENGINES[engine] || SEARCH_ENGINES.google
    urlInput.placeholder = t(cfg.placeholderKey)
    document.querySelectorAll('.se-option[data-engine]').forEach(el => {
      el.classList.toggle('selected', el.dataset.engine === engine)
    })
    if (save) saveAllSettings()
  }

  document.querySelectorAll('.se-option[data-engine]').forEach(el => {
    el.addEventListener('click', () => applySearchEngine(el.dataset.engine))
  })

  document.getElementById('settings-close-se').onclick = closeSettingsOverlay
  document.getElementById('settings-close-home').onclick = closeSettingsOverlay
  document.getElementById('settings-close-lang').onclick = closeSettingsOverlay

  // ── Adblock Settings ──────────────────────────────────────────────
  function initAdblockSettings() {
    const elEnabled         = document.getElementById('adb-toggle-enabled')
    const elNitrix          = document.getElementById('adb-toggle-nitrix')
    const elEasyList        = document.getElementById('adb-toggle-easylist')
    const elEasyPrivacy     = document.getElementById('adb-toggle-easyprivacy')
    const elCookies         = document.getElementById('adb-toggle-cookie-banners')
    const elAggressive      = document.getElementById('adb-toggle-aggressive')
    const elRefreshBtn      = document.getElementById('adb-btn-refresh')
    const elRefreshLabel    = document.getElementById('adb-refresh-label')
    const elElBadge         = document.getElementById('adb-el-badge')
    const elEpBadge         = document.getElementById('adb-ep-badge')
    const elEcBadge         = document.getElementById('adb-ec-badge')
    const elElUpdated       = document.getElementById('adb-el-updated')
    const elEpUpdated       = document.getElementById('adb-ep-updated')
    const elEcUpdated       = document.getElementById('adb-ec-updated')
    const elSettingsBody    = document.getElementById('adb-settings-body')
    const elMyFilters       = document.getElementById('adb-my-filters-textarea')
    const elMyFiltersSave   = document.getElementById('adb-my-filters-save')

    elMyFiltersSave?.addEventListener('click', async () => {
      const text = elMyFilters?.value || ''
      await window.electronAPI?.customFiltersSave?.(text)
      elMyFiltersSave.classList.add('saved')
      elMyFiltersSave.textContent = '✓ Zapisano'
      setTimeout(() => {
        elMyFiltersSave.classList.remove('saved')
        elMyFiltersSave.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Zapisz filtry'
      }, 2000)
    })
    const elDisabledBanner  = document.getElementById('adb-disabled-banner')

    // Zapamiętany stan suwaków przed wyłączeniem
    let _savedSubState = null

    // Przyciemnij / odblokuj pozostałe opcje + wizualnie włącz/wyłącz suwaki
    function _applyEnabledState(enabled) {
      elSettingsBody.classList.toggle('adb-off', !enabled)
      elDisabledBanner.classList.toggle('visible', !enabled)

      if (!enabled) {
        // Zapisz aktualny stan suwaków przed wyłączeniem
        _savedSubState = {
          nitrixBuiltIn:      elNitrix.checked,
          easyList:           elEasyList.checked,
          easyPrivacy:        elEasyPrivacy.checked,
          easyListCookie: elCookies.checked,
          aggressiveMode:     elAggressive.checked,
        }
        // Wizualnie odznacz wszystkie suwaki
        elNitrix.checked    = false
        elEasyList.checked  = false
        elEasyPrivacy.checked = false
        elCookies.checked   = false
        elAggressive.checked = false
      } else {
        // Przywróć ostatni zapisany stan suwaków
        if (_savedSubState) {
          elNitrix.checked      = _savedSubState.nitrixBuiltIn
          elEasyList.checked    = _savedSubState.easyList
          elEasyPrivacy.checked = _savedSubState.easyPrivacy
          elCookies.checked = _savedSubState.easyListCookie
          elAggressive.checked  = _savedSubState.aggressiveMode
          _savedSubState = null
        }
      }
    }

    function _fmt(ms) {
      if (!ms) return ''
      const d = new Date(ms)
      return d.toLocaleDateString(_currentLang === 'en' ? 'en-GB' : 'pl-PL') + ' ' +
             d.toLocaleTimeString(_currentLang === 'en' ? 'en-GB' : 'pl-PL', { hour: '2-digit', minute: '2-digit' })
    }
    function _fmtDomains(n) {
      if (!n) return ''
      const suffix = t('adb_rules_suffix')
      if (n >= 1000) return (n / 1000).toFixed(1) + ' ' + suffix
      return n + ' ' + suffix
    }

    async function refreshListsInfo() {
      if (!window.electronAPI?.adblockListsInfo) return
      try {
        const info = await window.electronAPI.adblockListsInfo()
        const lastUpdated = t('adb_last_updated')
        if (info.easyList) {
          elElBadge.textContent = _fmtDomains(info.easyList.domains)
          elElBadge.style.display = 'inline'
          elElUpdated.textContent = lastUpdated + ' ' + _fmt(info.easyList.mtimeMs)
          elElUpdated.style.display = 'block'
        } else {
          elElBadge.style.display = 'none'
          elElUpdated.style.display = 'none'
        }
        if (info.easyPrivacy) {
          elEpBadge.textContent = _fmtDomains(info.easyPrivacy.domains)
          elEpBadge.style.display = 'inline'
          elEpUpdated.textContent = lastUpdated + ' ' + _fmt(info.easyPrivacy.mtimeMs)
          elEpUpdated.style.display = 'block'
        } else {
          elEpBadge.style.display = 'none'
          elEpUpdated.style.display = 'none'
        }
        if (info.easyListCookie) {
          if (elEcBadge) { elEcBadge.textContent = _fmtDomains(info.easyListCookie.domains); elEcBadge.style.display = 'inline' }
          if (elEcUpdated) { elEcUpdated.textContent = lastUpdated + ' ' + _fmt(info.easyListCookie.mtimeMs); elEcUpdated.style.display = 'block' }
        } else {
          if (elEcBadge)   elEcBadge.style.display   = 'none'
          if (elEcUpdated) elEcUpdated.style.display  = 'none'
        }
      } catch(e) {}
    }

    async function loadAndApply() {
      if (!window.electronAPI?.adblockSettingsLoad) return
      try {
        const cfg = await window.electronAPI.adblockSettingsLoad()
        elEnabled.checked     = !!cfg.enabled
        elNitrix.checked      = !!cfg.nitrixBuiltIn
        elEasyList.checked    = !!cfg.easyList
        elEasyPrivacy.checked = !!cfg.easyPrivacy
        elCookies.checked = !!cfg.easyListCookie
        elAggressive.checked  = !!cfg.aggressiveMode
        // Zawsze zapamiętaj stan suwaków z dysku jako punkt przywracania
        _savedSubState = {
          nitrixBuiltIn:      !!cfg.nitrixBuiltIn,
          easyList:           !!cfg.easyList,
          easyPrivacy:        !!cfg.easyPrivacy,
          easyListCookie: !!cfg.easyListCookie,
          aggressiveMode:     !!cfg.aggressiveMode,
        }
        _applyEnabledState(cfg.enabled)
        applyAdblockGlobalVisibility(cfg.enabled)
        await refreshListsInfo()
        // Wczytaj Moje Filtry
        try {
          const ft = await window.electronAPI.customFiltersLoad?.()
          if (typeof ft === 'string') elMyFilters.value = ft
        } catch(e) {}
      } catch(e) {}
    }

    async function save() {
      // Gdy adblock wyłączony — nie zapisuj zmian sub-togglesów (są tylko wizualne)
      if (!elEnabled.checked) return
      if (!window.electronAPI?.adblockSettingsSave) return
      await window.electronAPI.adblockSettingsSave({
        enabled:            true,
        nitrixBuiltIn:      elNitrix.checked,
        easyList:           elEasyList.checked,
        easyPrivacy:        elEasyPrivacy.checked,
        easyListCookie: elCookies.checked,
        aggressiveMode:     elAggressive.checked,
      })
      await refreshListsInfo()
    }

    // Gdy globalny włącznik zmienia się → wymuś stan na WSZYSTKICH kartach
    elEnabled.addEventListener('change', async () => {
      const globalEnabled = elEnabled.checked

      if (!globalEnabled) {
        // Capture prawdziwego stanu PRZED _applyEnabledState (która zeruje checkboxy)
        const stateToSave = {
          nitrixBuiltIn:      elNitrix.checked,
          easyList:           elEasyList.checked,
          easyPrivacy:        elEasyPrivacy.checked,
          easyListCookie: elCookies.checked,
          aggressiveMode:     elAggressive.checked,
        }
        // Wizualnie zeruj suwaki + zapamiętaj w _savedSubState
        _applyEnabledState(false)
        applyAdblockGlobalVisibility(false)
        // Zapisz na dysk: enabled=false + oryginalne wartości sub-togglesów
        await window.electronAPI?.adblockSettingsSave?.({ enabled: false, ...stateToSave })
      } else {
        // _applyEnabledState(true) przywraca suwaki z _savedSubState
        _applyEnabledState(true)
        applyAdblockGlobalVisibility(true)
        // Zapisz na dysk: enabled=true + przywrócone wartości suwaków
        await window.electronAPI?.adblockSettingsSave?.({
          enabled:            true,
          nitrixBuiltIn:      elNitrix.checked,
          easyList:           elEasyList.checked,
          easyPrivacy:        elEasyPrivacy.checked,
          easyListCookie: elCookies.checked,
          aggressiveMode:     elAggressive.checked,
        })
      }

      const aggressiveOn = elAggressive.checked
      tabs.forEach(tab => {
        try {
          const wcId = tab.wv.getWebContentsId ? tab.wv.getWebContentsId() : null
          if (!globalEnabled) {
            _adbEnabledMap[tab.id] = false
            if (wcId) electronAPI.adblockSetTab(wcId, false)
            tab.wv.executeJavaScript(
              `document.documentElement.dataset.nitrixAdblockOff = '1';` +
              `document.documentElement.dataset.nitrixAggressive = '0';`
            ).catch(() => {})
          } else {
            _adbEnabledMap[tab.id] = true
            if (wcId) electronAPI.adblockSetTab(wcId, true)
            tab.wv.executeJavaScript(
              `document.documentElement.dataset.nitrixAdblockOff = '0';` +
              `document.documentElement.dataset.nitrixAggressive = '${aggressiveOn ? '1' : '0'}';`
            ).catch(() => {})
          }
        } catch(e) {}
      })
      updateAdblockUI()
      // Przeładuj wszystkie karty — nowe ustawienia wchodzą w życie natychmiast
      tabs.forEach(tab => { try { tab.wv.reload() } catch(e) {} })
    })

    elNitrix.addEventListener('change',      save)
    elEasyList.addEventListener('change',    save)
    elEasyPrivacy.addEventListener('change', save)
    elCookies.addEventListener('change',     save)
    elAggressive.addEventListener('change',  async () => {
      await save()
      const aggressiveOn  = elAggressive.checked
      const globalEnabled = elEnabled.checked
      tabs.forEach(tab => {
        try {
          tab.wv.executeJavaScript(
            `document.documentElement.dataset.nitrixAggressive = '${globalEnabled && aggressiveOn ? '1' : '0'}';`
          ).catch(() => {})
        } catch(e) {}
      })
    })

    elRefreshBtn.addEventListener('click', async () => {
      elRefreshLabel.textContent = t('adb_refreshing')
      elRefreshBtn.disabled = true
      try {
        await window.electronAPI?.adblockRefreshLists?.()
        await refreshListsInfo()
        elRefreshLabel.textContent = t('adb_refreshed')
        setTimeout(() => { elRefreshLabel.textContent = t('adb_refresh_btn') }, 2500)
      } catch(e) {
        elRefreshLabel.textContent = t('adb_refresh_error')
        setTimeout(() => { elRefreshLabel.textContent = t('adb_refresh_btn') }, 2500)
      } finally {
        elRefreshBtn.disabled = false
      }
    })

    // Odbiór globalnego stanu z main.js (po zmianie przez inne okno)
    window.electronAPI?.onAdblockGlobalState?.(({ enabled, aggressiveMode }) => {
      elEnabled.checked    = enabled
      elAggressive.checked = !!aggressiveMode
      _applyEnabledState(enabled)
      applyAdblockGlobalVisibility(enabled)
      tabs.forEach(tab => {
        try {
          const wcId = tab.wv.getWebContentsId ? tab.wv.getWebContentsId() : null
          _adbEnabledMap[tab.id] = enabled
          if (wcId) electronAPI.adblockSetTab(wcId, enabled)
          tab.wv.executeJavaScript(
            `document.documentElement.dataset.nitrixAdblockOff = '${enabled ? '0' : '1'}';` +
            `document.documentElement.dataset.nitrixAggressive = '${enabled && aggressiveMode ? '1' : '0'}';`
          ).catch(() => {})
        } catch(e) {}
      })
      updateAdblockUI()
    })

    // Załaduj przy pierwszym kliknięciu w sidebar i od razu przy init
    const sidebarAdblock = document.querySelector('.sidebar-item[data-section="adblock"]')
    if (sidebarAdblock) sidebarAdblock.addEventListener('click', loadAndApply, { once: true })

    // Opóźnij wywołanie loadAndApply aby główne ustawienia zostały załadowane
    setTimeout(loadAndApply, 500)
  }

  // ══════════════════════════════════════════════════════════════════
  //  USTAWIENIA JĘZYKA
  // ══════════════════════════════════════════════════════════════════
  document.querySelectorAll('input[name="nitrix-lang"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (!radio.checked) return
      const lang = radio.value
      localStorage.setItem('nitrix_lang', lang)
      applyTranslations(lang)
      if (window.electronAPI?.saveSettings) window.electronAPI.saveSettings({ lang })
      // Odśwież wszystkie panele z dynamicznie generowanym tekstem — zmiany działają od razu
      if (typeof renderBookmarks   === 'function') renderBookmarks()
      if (typeof renderHistory     === 'function') renderHistory(document.getElementById('history-search')?.value || '')
      if (typeof renderDlHistory   === 'function') renderDlHistory(document.getElementById('dl-history-search')?.value || '')
      if (typeof renderPasswords   === 'function') renderPasswords()
      if (typeof refreshPinSection === 'function') refreshPinSection()
      if (typeof updateAdblockUI    === 'function') updateAdblockUI()
      // Ukryj ewentualną notatkę — zmiany działają od razu, restart nie jest potrzebny
      const note = document.getElementById('lang-restart-note')
      if (note) note.style.display = 'none'
    })
  })

  // ══════════════════════════════════════════════════════════════════
  //  STRONA STARTOWA
  // ══════════════════════════════════════════════════════════════════
  const HOMEPAGE_PRESETS = {
    google:     'https://www.google.pl',
    duckduckgo: 'https://duckduckgo.com',
    bing:       'https://www.bing.com',
  }
  let currentHomepage     = 'google'
  let currentHomepageUrl  = 'https://www.google.pl'
  let customHomepageUrl   = ''

  function getHomepageUrl() { return currentHomepageUrl }

  // ── Startup behavior ─────────────────────────────────────────────────────
  let startupBehavior    = 'homepage'  // 'homepage' | 'last' | 'custom' | 'bookmarks'
  let startupCustomUrl   = ''
  let startupBookmarks   = []          // tablica URL-i do otwarcia przy starcie
  let _lastOpenedUrl     = ''          // aktualizowany przy każdej nawigacji

  function applyStartupBehavior(behavior, customUrl, save = true) {
    startupBehavior  = behavior || 'homepage'
    startupCustomUrl = customUrl || ''
    document.querySelectorAll('[data-startup]').forEach(el => {
      el.classList.toggle('selected', el.dataset.startup === startupBehavior)
    })
    const wrap  = document.getElementById('startup-custom-wrap')
    const input = document.getElementById('startup-custom-input')
    if (wrap)  wrap.classList.toggle('visible', startupBehavior === 'custom')
    if (input && startupCustomUrl) input.value = startupCustomUrl
    const trigger = document.getElementById('startup-bookmarks-trigger')
    if (trigger) trigger.classList.toggle('visible', startupBehavior === 'bookmarks')
    if (startupBehavior === 'bookmarks') updateSbkCountBadge()
    if (save) saveAllSettings()
  }

  // ── Licznik zaznaczonych zakładek w trigger-ze ──────────────────────
  function sbkPlural(n) {
    if (_currentLang === 'en') return 'bookmarks selected'
    if (n === 1) return 'zakładka wybrana'
    const m10 = n % 10, m100 = n % 100
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'zakładki wybrane'
    return 'zakładek wybranych'
  }

  function updateSbkCountBadge() {
    const badge = document.getElementById('sbk-count-badge')
    if (!badge) return
    const strong = badge.querySelector('strong')
    if (strong) strong.textContent = startupBookmarks.length
    const label = document.getElementById('sbk-badge-label')
    if (label) label.textContent = sbkPlural(startupBookmarks.length)
  }

  // ── Modal wyboru zakładek startowych ────────────────────────────────
  ;(function initSbkModal() {
    const overlay    = document.getElementById('sbk-overlay')
    const closeBtn   = document.getElementById('sbk-close')
    const openBtn    = document.getElementById('sbk-open-btn')
    const searchIn   = document.getElementById('sbk-search')
    const list       = document.getElementById('sbk-list')
    const emptyEl    = document.getElementById('sbk-empty')
    const footerNum  = document.getElementById('sbk-footer-num')
    const confirmBtn = document.getElementById('sbk-confirm-btn')
    if (!overlay) return

    function openModal() {
      overlay.classList.add('open')
      if (searchIn) { searchIn.value = ''; searchIn.focus() }
      renderSbkList('')
    }
    function closeModal() {
      overlay.classList.remove('open')
      updateSbkCountBadge()
      saveAllSettings()
    }

    if (openBtn)    openBtn.addEventListener('click', openModal)
    if (closeBtn)   closeBtn.addEventListener('click', closeModal)
    overlay.addEventListener('mousedown', e => { if (e.target === overlay) closeModal() })
    if (confirmBtn) confirmBtn.addEventListener('click', closeModal)
    if (searchIn)   searchIn.addEventListener('input', () => renderSbkList(searchIn.value))

    function renderSbkList(query) {
      if (!list) return
      const q = (query || '').trim().toLowerCase()
      const src = Array.isArray(bookmarks) ? bookmarks : []
      const filtered = q
        ? src.filter(b => b.name.toLowerCase().includes(q) || b.url.toLowerCase().includes(q))
        : src

      if (emptyEl) emptyEl.classList.toggle('visible', filtered.length === 0)
      if (footerNum) footerNum.textContent = startupBookmarks.length
      const _fbl = document.getElementById('sbk-footer-label')
      if (_fbl) _fbl.textContent = sbkPlural(startupBookmarks.length)

      list.innerHTML = filtered.map(bk => {
        const sel      = startupBookmarks.includes(bk.url)
        const safeName = bk.name.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const safeUrl  = bk.url.replace(/"/g, '&quot;')
        let domain = ''
        try { domain = new URL(bk.url).hostname } catch {}
        const favSrc = domain
          ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`
          : ''
        return `<div class="sbk-item${sel ? ' sbk-selected' : ''}" data-url="${safeUrl}">
          <img class="sbk-item-favicon" src="${favSrc}" alt="" onerror="this.style.display='none'">
          <div class="sbk-item-info">
            <div class="sbk-item-name">${safeName}</div>
            <div class="sbk-item-url">${safeUrl}</div>
          </div>
          <label class="sbk-toggle">
            <input type="checkbox" class="sbk-checkbox" ${sel ? 'checked' : ''}>
            <span class="sbk-toggle-track"></span>
            <span class="sbk-toggle-thumb"></span>
          </label>
        </div>`
      }).join('')

      if (emptyEl && filtered.length === 0) {
        emptyEl.textContent = t('startup_bk_empty_modal')
      }

      list.querySelectorAll('.sbk-item').forEach(item => {
        item.addEventListener('click', e => {
          if (e.target.closest('.sbk-toggle')) return
          const cb = item.querySelector('.sbk-checkbox')
          if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')) }
        })
        const cb = item.querySelector('.sbk-checkbox')
        if (cb) cb.addEventListener('change', () => {
          const url = item.dataset.url
          if (cb.checked) {
            if (!startupBookmarks.includes(url)) startupBookmarks.push(url)
          } else {
            startupBookmarks = startupBookmarks.filter(u => u !== url)
          }
          item.classList.toggle('sbk-selected', cb.checked)
          if (footerNum) footerNum.textContent = startupBookmarks.length
          const _fbl2 = document.getElementById('sbk-footer-label')
          if (_fbl2) _fbl2.textContent = sbkPlural(startupBookmarks.length)
        })
      })
    }

    // Reeksponuj renderSbkList do ponownego wywołania po doładowaniu zakładek
    window._renderSbkList = renderSbkList
  })()

  function getStartupUrl() {
    if (startupBehavior === 'last')      return _lastOpenedUrl || getHomepageUrl()
    if (startupBehavior === 'custom')    return startupCustomUrl || getHomepageUrl()
    if (startupBehavior === 'bookmarks') return startupBookmarks[0] || getHomepageUrl()
    return getHomepageUrl()
  }

  document.querySelectorAll('[data-startup]').forEach(el => {
    el.addEventListener('click', () => applyStartupBehavior(el.dataset.startup, startupCustomUrl))
  })

  document.getElementById('startup-custom-save')?.addEventListener('click', () => {
    let val = (document.getElementById('startup-custom-input')?.value || '').trim()
    if (!val) return
    if (!/^https?:\/\//i.test(val)) val = 'https://' + val
    applyStartupBehavior('custom', val)
  })

  document.getElementById('startup-custom-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('startup-custom-save')?.click()
  })

  function saveAllSettings() {
    window.electronAPI.saveSettings({
      theme:              persistedTheme,
      aeroBlur,
      aeroTopOpacity,
      backdropContrast,
      ...(!isPrivate ? { aeroAreas } : {}),
      expandBar:          window.expandBarEnabled,
      bkBarMode,
      searchEngine:       currentSearchEngine,
      homepage:           currentHomepage,
      homepageUrl:        currentHomepageUrl,
      customHomepageUrl,
      historySuggestions:   historySuggestionsEnabled,
      bookmarkSuggestions:     bookmarkSuggestionsEnabled,
      privateSuggestionsMode:  privateSuggestionsMode,
      qrShowInBar:       qrToggleShow.checked,
      qrDisableYtTime:   (document.getElementById('qr-toggle-disable-yt-time') || {}).checked || false,
      startupBehavior,
      startupCustomUrl,
      startupBookmarks,
      ...(!isPrivate ? { lastOpenedUrl: _lastOpenedUrl } : {}),
      blockLocalIp:      window.blockLocalIpEnabled !== false,
    })
  }

  // Helper — SVG globusa dla niestandardowej strony startowej
  function globeSvg() {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  }

  function applyHomepage(hp, url, save = true) {
    currentHomepage    = hp
    currentHomepageUrl = url || HOMEPAGE_PRESETS[hp] || 'https://www.google.pl'

    document.querySelectorAll('[data-homepage]').forEach(el => {
      el.classList.toggle('selected', el.dataset.homepage === hp)
    })

    const customWrap = document.getElementById('homepage-custom-wrap')
    customWrap.classList.toggle('visible', hp === 'custom')

    const preview = document.getElementById('homepage-custom-preview')
    const logo    = document.getElementById('homepage-custom-logo')

    if (hp === 'custom') {
      const inp = document.getElementById('homepage-custom-input')
      const savedUrl = url && url !== 'https://www.google.pl' ? url : customHomepageUrl
      if (savedUrl) {
        inp.value = savedUrl
        customHomepageUrl = savedUrl
        currentHomepageUrl = savedUrl
        preview.textContent = savedUrl
        // Pokaż favicon zamiast globusa
        try {
          const domain = new URL(savedUrl).hostname
          const img = document.createElement('img')
          img.width = 28; img.height = 28
          img.style.borderRadius = '6px'
          img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
          img.onerror = () => { logo.innerHTML = globeSvg() }
          logo.innerHTML = ''
          logo.appendChild(img)
        } catch { logo.innerHTML = globeSvg() }
      } else {
        preview.textContent = 'Wpisz własny adres URL'
        logo.innerHTML = globeSvg()
      }
    } else {
      // Wróć do globusa gdy przełączamy się z custom na inną opcję
      if (logo) logo.innerHTML = globeSvg()
    }

    if (save) saveAllSettings()
  }

  document.querySelectorAll('[data-homepage]').forEach(el => {
    el.addEventListener('click', () => {
      const hp = el.dataset.homepage
      if (hp === 'custom') {
        applyHomepage('custom', customHomepageUrl || '')
      } else {
        applyHomepage(hp, HOMEPAGE_PRESETS[hp])
      }
    })
  })

  document.getElementById('homepage-custom-save').addEventListener('click', () => {
    const inp = document.getElementById('homepage-custom-input')
    let val = inp.value.trim()
    if (!val) return
    if (!/^https?:\/\//i.test(val)) val = 'https://' + val
    customHomepageUrl = val
    currentHomepageUrl = val
    document.getElementById('homepage-custom-preview').textContent = val

    // Zmień ikonę globusa na favicon strony
    const logo = document.getElementById('homepage-custom-logo')
    try {
      const domain = new URL(val).hostname
      const img = document.createElement('img')
      img.width = 28; img.height = 28
      img.style.borderRadius = '6px'
      img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      img.onerror = () => {
        // Fallback — wróć do globusa
        logo.innerHTML = globeSvg()
      }
      logo.innerHTML = ''
      logo.appendChild(img)
    } catch {}

    saveAllSettings()
  })

  document.getElementById('homepage-custom-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('homepage-custom-save').click()
  })

  // Nawigacja — uwzględnij wybraną wyszukiwarkę
  // ══════════════════════════════════════════════════════════════════
  //  NAWIGACJA
  // ══════════════════════════════════════════════════════════════════
  // ── Walidacja URL przed nawigacją ────────────────────────────────────
  // Zwraca gotowy do załadowania URL lub null jeśli niebezpieczny.
  // Dozwolone schematy: https:// (preferowany) i http:// (tylko HTTP, nie inne).
  // Wpisany tekst bez schematu traktowany jest jako domena (→ https://) lub zapytanie.
  function isAllowedLocalHtmlUrl(rawUrl) {
    try {
      const parsed = new URL(rawUrl)
      if (parsed.protocol !== 'file:') return false
      return /\.(html?|shtml|xhtml|xht|mhtml|mht)$/i.test(decodeURIComponent(parsed.pathname || ''))
    } catch {
      return false
    }
  }

  const INTERNAL_ROUTES = {
    settings:       { key:'settings', overlay:'settings-overlay', pl:'Ustawienia', en:'Settings' },
    appearance:     { key:'settings', section:'wyglad', pl:'Ustawienia', en:'Settings' },
    security:       { key:'settings', section:'bezpieczenstwo', pl:'Ustawienia', en:'Settings' },
    search:         { key:'settings', section:'wyszukiwarka', pl:'Ustawienia', en:'Settings' },
    homepage:       { key:'settings', section:'startowa', pl:'Ustawienia', en:'Settings' },
    language:       { key:'settings', section:'jezyk', pl:'Ustawienia', en:'Settings' },
    adblock:        { key:'settings', section:'adblock', pl:'Ustawienia', en:'Settings' },
    import:         { key:'settings', section:'import', pl:'Ustawienia', en:'Settings' },
    'send-to-device': { key:'settings', section:'sendtodevice', pl:'Ustawienia', en:'Settings' },
    'default-browser': { key:'settings', section:'domyslna', pl:'Ustawienia', en:'Settings' },
    history:        { key:'history', overlay:'history-overlay', pl:'Historia', en:'History' },
    downloads:      { key:'history', overlay:'history-overlay', pl:'Historia', en:'History' },
    passwords:      { key:'passwords', overlay:'passwords-overlay', pl:'Menedżer haseł', en:'Passwords' },
    'whats-new':    { key:'whats-new', overlay:'whatsnew-overlay', pl:'Co nowego?', en:'What’s new?' },
    whatsnew:       { key:'whats-new', overlay:'whatsnew-overlay', pl:'Co nowego?', en:'What’s new?' }
  }

  function getInternalRoute(rawUrl) {
    const match = String(rawUrl || '').trim().match(/^nitrix:\/\/([^/?#]+)(?:[/?#].*)?$/i)
    if (!match) return null
    const name = match[1].toLowerCase()
    return INTERNAL_ROUTES[name] ? { ...INTERNAL_ROUTES[name], url:name } : null
  }

  function openInternalRoute(rawUrl, targetTab) {
    const route = getInternalRoute(rawUrl)
    if (!route) return false
    const tab = openPanelTab(route.key, route.overlay || `${route.key}-overlay`, _currentLang === 'en' ? route.en : route.pl, targetTab)
    if (route.section) {
      setTimeout(() => document.querySelector(`#settings-overlay .sidebar-item[data-section="${route.section}"]`)?.click(), 0)
    }
    if (tab) setUrlDisplay(`nitrix://${route.url}`, true)
    return true
  }

  function isAllowedBrowserUrl(rawUrl) {
    return /^https?:\/\//i.test(rawUrl || '') || isAllowedLocalHtmlUrl(rawUrl)
  }

  function safeLoadURL(raw) {
    const url = (raw || '').trim()
    if (!url) return null

    // Jawny schemat — akceptuj tylko http/https, resztę odrzuć
    if (/^[a-z][a-z0-9+\-.]*:\/\//i.test(url)) {
      if (isAllowedBrowserUrl(url)) return url
      return null
    }

    // Wygląda jak domena (np. "example.com", "sub.domain.pl")
    if (/^[a-z0-9]([a-z0-9\-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]*[a-z0-9])?)+/i.test(url) && !url.includes(' ')) {
      return 'https://' + url
    }

    // Traktuj jako zapytanie do wyszukiwarki
    const cfg = SEARCH_ENGINES[currentSearchEngine] || SEARCH_ENGINES.google
    return cfg.url(url)
  }

  function navigate(raw) {
    _pendingTyped = null   // reset zapamiętanego tekstu po nawigacji
    _typedVal = ''
    const url = raw.trim()
    if (!url) return
    const tab = getActiveTab()
    if (!tab) return
    if (openInternalRoute(url, tab)) return
    const safe = safeLoadURL(url)
    if (safe) { if (tab.internalPage) createTab(safe); else tab.wv.loadURL(safe) }
  }

  let _suppressAutocomplete = false  // true gdy użytkownik usunął autocomplete Backspace/Delete
  let _deletingMode = false           // true gdy użytkownik usuwa znaki — sugestie nie wyskakują

  urlInput.addEventListener('keydown', e => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      _deletingMode = true
      // Jeśli jest autocomplete zaznaczenie — zablokuj re-aplikację
      if (sugOpen && urlInput.selectionStart < urlInput.value.length) {
        _suppressAutocomplete = true
      }
    } else if (e.key.length === 1) {
      // Wpisano nowy znak — wyjdź z trybu usuwania
      _deletingMode = false
    }
    // Obsługa nawigacji klawiaturą w sugestiach
    if (sugOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        sugActiveIdx = Math.min(sugActiveIdx + 1, sugItems.length - 1)
        renderSugActive()
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        sugActiveIdx = Math.max(sugActiveIdx - 1, -1)
        renderSugActive()
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'End') {
        // Zaakceptuj inline autocomplete — przesuń kursor na koniec
        if (urlInput.selectionStart < urlInput.value.length) {
          e.preventDefault()
          _typedVal = urlInput.value
          urlInput.setSelectionRange(urlInput.value.length, urlInput.value.length)
          return
        }
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (sugActiveIdx >= 0 && sugItems[sugActiveIdx]) {
          const item = sugItems[sugActiveIdx]
          closeSuggestions()
          if (item.type === 'search') navigate(item.query)
          else {
            if (item.type === 'bookmark') trackBookmarkClick(item.url)
            navigate(item.url)
          }
          urlInput.blur()
        } else {
          const val = urlInput.value
          closeSuggestions()
          navigate(val)
          urlInput.blur()
        }
        return
      }
      if (e.key === 'Escape') { closeSuggestions(); urlInput.blur(); return }
    }
    if (e.key === 'Enter') {
      closeSuggestions()
      navigate(urlInput.value)
      urlInput.blur()
    }
    if (e.key === 'Escape') { closeSuggestions(); urlInput.blur() }
  })

  // Kliknięcie na pasek URL — 1 klik = bez protokołu, 2 kliki = pełny, potem już nie zmienia
  urlInput.addEventListener('click', () => {
    const tab = getActiveTab()
    const fullUrl = tab ? tab.url : ''
    if (isHomePage(fullUrl)) return
    if (urlClickCount >= 2) return  // po 2 kliknięciach nie zmienia już nic
    urlClickCount++
    if (urlClickTimer) clearTimeout(urlClickTimer)
    if (urlClickCount === 1) {
      urlInput.value = getUrlWithoutProtocol(fullUrl)
      urlInput.select()
    } else {
      urlInput.value = fullUrl
      urlInput.select()
    }
    urlClickTimer = setTimeout(() => { urlClickCount = 0 }, 2000)
  })

  // Focus — przywróć to co wpisał użytkownik, albo URL bez protokołu
  urlInput.addEventListener('focus', () => {
    const tab = getActiveTab()
    const fullUrl = tab ? tab.url : ''
    _urlInputDirty = false
    if (_pendingTyped) {
      // Użytkownik wcześniej coś wpisał — przywróć i zaznacz
      urlInput.value = _pendingTyped
      _typedVal = _pendingTyped
      urlInput.select()
      _deletingMode = false
      return
    }
    _typedVal = ''
    if (isHomePage(fullUrl)) {
      urlInput.value = ''
      return
    }
    if (urlClickCount === 0) {
      urlInput.value = getUrlWithoutProtocol(fullUrl)
    }
    urlInput.select()
  })

  // ══════════════════════════════════════════════════════════════════
  //  SUGESTIE PASKA URL — na podstawie historii + inline autocomplete
  // ══════════════════════════════════════════════════════════════════
  const sugEl       = document.getElementById('url-suggestions')
  let sugOpen       = false
  let sugItems      = []
  let sugActiveIdx  = -1
  let _historyData     = null
  let _historyLoading  = null   // Promise w locie — blokuje duplikaty fetchy
  let _sugInputTimer   = null
  let _typedVal        = ''   // dokładnie to co wpisał użytkownik (bez autocomplete)

  async function getSugHistory() {
    if (_historyData) return _historyData
    // Jeśli już trwa ładowanie — poczekaj na ten sam Promise zamiast startować nowy
    if (_historyLoading) return _historyLoading
    _historyLoading = (async () => {
      try {
        const all = await window.electronAPI.loadHistory()
        _historyData = Array.isArray(all) ? all.slice(0, 500) : []
        preloadFavicons(_historyData.map(h => h.url), 0)
      } catch { _historyData = [] }
      _historyLoading = null
      return _historyData
    })()
    return _historyLoading
  }

  function highlightMatch(text, query) {
    if (!text || !query) return escHtml(text || '')
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return escHtml(text)
    return escHtml(text.slice(0, idx))
      + '<span class="url-sug-match">' + escHtml(text.slice(idx, idx + query.length)) + '</span>'
      + escHtml(text.slice(idx + query.length))
  }


  function getDisplayUrl(url) {
    try {
      const u = new URL(url)
      const host = u.hostname.replace(/^www\./, '')
      const path = u.pathname.replace(/\/$/, '')
      return path ? host + path : host
    } catch { return url }
  }

  // ── Favicon cache (in-memory, per session) ──────────────────────────────
  // Kolejka z max 3 równoległymi requestami — nie zapycha connection poola Electrona
  const _faviconCache = new Map() // hostname → dataURL | 'loading'
  const _faviconQueue  = []        // hostnamy czekające na fetch
  let   _faviconActive = 0         // aktualnie w locie
  const _FAVICON_CONCURRENCY = 3

  function _faviconFlush() {
    while (_faviconActive < _FAVICON_CONCURRENCY && _faviconQueue.length > 0) {
      const hostname = _faviconQueue.shift()
      if (_faviconCache.get(hostname) !== 'loading') continue // już zrobione
      _faviconActive++
      const img = new Image()
      let settled = false
      const done = () => {
        if (settled) return
        settled = true
        clearTimeout(timeout)
        img.onload = img.onerror = null
        _faviconActive--
        _faviconFlush()
      }
      const timeout = setTimeout(() => {
        _faviconCache.delete(hostname)
        done()
        img.src = ''
      }, 10000)
      img.onload = () => {
        try {
          const c = document.createElement('canvas')
          c.width = 32; c.height = 32
          c.getContext('2d').drawImage(img, 0, 0, 32, 32)
          _faviconCache.set(hostname, c.toDataURL())
        } catch { _faviconCache.set(hostname, img.src) }
        done()
      }
      img.onerror = () => { _faviconCache.delete(hostname); done() }
      img.src = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
    }
  }

  function _cacheFavicon(hostname) {
    if (!hostname || _faviconCache.has(hostname)) return
    if (_faviconQueue.length >= 64) return
    if (_faviconCache.size >= 256) {
      const oldest = [..._faviconCache.keys()].find(key => _faviconCache.get(key) !== 'loading')
      if (oldest === undefined) return
      _faviconCache.delete(oldest)
    }
    _faviconCache.set(hostname, 'loading')
    _faviconQueue.push(hostname)
    _faviconFlush()
  }

  function _getCachedFavicon(url) {
    try {
      const hostname = new URL(url).hostname
      const cached = _faviconCache.get(hostname)
      if (cached && cached !== 'loading') return cached
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
    } catch { return null }
  }

  // Preload z opóźnieniem — nie startuje od razu przy starcie, żeby nie blokować
  // pierwszych ładowań stron (connection pool Electrona jest ograniczony)
  function preloadFavicons(urls, delayMs = 0) {
    const hostnames = [...new Set(urls.flatMap(url => {
      try { return [new URL(url).hostname] } catch { return [] }
    }))]
    if (delayMs > 0) {
      setTimeout(() => hostnames.forEach(_cacheFavicon), delayMs)
    } else {
      hostnames.forEach(_cacheFavicon)
    }
  }

  function faviconUrl(url) {
    return _getCachedFavicon(url)
  }

  // Zwraca dataURL z cache LUB null jeśli jeszcze nie gotowe.
  // Gdy gotowe, woła cb(dataURL) — używane do aktualizacji <img> w DOM bez re-renderu.
  function getFaviconAsync(url, cb) {
    try {
      const hostname = new URL(url).hostname
      const cached = _faviconCache.get(hostname)
      const fallbackUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
      if (cached && cached !== 'loading') return cached
      // Zamiast osobnego Image() — wstaw do kolejki i podepnij cb przez polling
      if (!_faviconCache.has(hostname)) _cacheFavicon(hostname)
      let attempts = 0
      const poll = () => {
        attempts++
        const v = _faviconCache.get(hostname)
        if (v && v !== 'loading') { cb(v); return }
        if (v === 'loading' && attempts < 30) setTimeout(poll, 120)
      }
      setTimeout(poll, 120)
      return fallbackUrl
    } catch { return null }
  }

  // ── Inline autocomplete (jak Chrome) ─────────────────────────────
  // Dopisuje resztę najlepszego trafienia jako zaznaczony tekst.
  // Backspace usuwa zaznaczenie (nie typed part) — zachowanie natywne.
  function applyInlineAutocomplete(typed, bestUrl) {
    const dUrl = getDisplayUrl(bestUrl)
    if (!dUrl.toLowerCase().startsWith(typed.toLowerCase())) return
    const completion = dUrl.slice(typed.length)
    if (!completion) return
    // Ustaw wartość i zaznacz tylko część autocomplete
    urlInput.value = typed + completion
    urlInput.setSelectionRange(typed.length, typed.length + completion.length)
  }

  function clearInlineAutocomplete() {
    // Zostaw tylko typed part (od 0 do selectionStart)
    const keep = urlInput.value.slice(0, urlInput.selectionStart)
    if (urlInput.selectionStart < urlInput.value.length) {
      urlInput.value = keep
    }
  }

  function renderSugActive() {
    sugEl.querySelectorAll('.url-sug-item').forEach((el, i) => {
      el.classList.toggle('active', i === sugActiveIdx)
      if (i === sugActiveIdx) el.scrollIntoView({ block: 'nearest' })
    })
    if (sugActiveIdx >= 0 && sugItems[sugActiveIdx]) {
      const item = sugItems[sugActiveIdx]
      if (item.type === 'search') {
        urlInput.value = item.query
        urlInput.setSelectionRange(item.query.length, item.query.length)
      } else {
        const dUrl = getDisplayUrl(item.url)
        urlInput.value = dUrl
        urlInput.setSelectionRange(dUrl.length, dUrl.length)
      }    } else {
      urlInput.value = _typedVal
      const firstHist = sugItems.find(m => m.type === 'history')
      if (!_suppressAutocomplete && firstHist) applyInlineAutocomplete(_typedVal, firstHist.url)
    }
  }

  function closeSuggestions() {
    sugOpen = false
    sugActiveIdx = -1
    sugItems = []
    sugEl.classList.remove('open')
    sugEl.innerHTML = ''
  }

  function positionSuggestions() {
    const rect = urlWrap.getBoundingClientRect()
    sugEl.style.left  = rect.left + 'px'
    sugEl.style.top   = (rect.bottom + 4) + 'px'
    sugEl.style.width = rect.width + 'px'
  }

  async function showSuggestions(query) {
    if (!historySuggestionsEnabled && !bookmarkSuggestionsEnabled) { closeSuggestions(); return }
    if (!query || query.length < 1) { closeSuggestions(); return }

    const q = query.toLowerCase()
    // W trybie prywatnym — sprawdź ustawienie
    let histEnabled = historySuggestionsEnabled
    let bkEnabled   = bookmarkSuggestionsEnabled
    if (isPrivate) {
      histEnabled = privateSuggestionsMode === 'all' || privateSuggestionsMode === 'history'
      bkEnabled   = privateSuggestionsMode === 'all' || privateSuggestionsMode === 'bookmarks'
      if (privateSuggestionsMode === 'none') { closeSuggestions(); return }
    }

    // ── Zakładki ──────────────────────────────────────────────────
    const bkResults = []
    if (bkEnabled) {
      for (const bk of bookmarks) {
        const url   = bk.url   || ''
        const name  = bk.name  || ''
        if (!url) continue
        const inName = name.toLowerCase().includes(q)
        const inUrl  = url.toLowerCase().includes(q)
        if (!inName && !inUrl) continue
        const prefixScore = getDisplayUrl(url).toLowerCase().startsWith(q) ? 1000 : 0
        bkResults.push({ type: 'bookmark', url, title: name, score: prefixScore + getBookmarkScore(url) * 10 + 5 })
      }
      bkResults.sort((a, b) => b.score - a.score)
    }

    // ── Historia ──────────────────────────────────────────────────
    const histResults = []
    if (histEnabled) {
      const history = await getSugHistory()
      const visitCount = new Map()
      for (const entry of history) {
        const key = entry.url || ''
        visitCount.set(key, (visitCount.get(key) || 0) + 1)
      }
      const seen = new Set()
      // Dodaj URL-e zakładek do seen żeby unikać duplikatów
      bkResults.forEach(b => seen.add(b.url))
      for (const entry of history) {
        const url   = entry.url   || ''
        const title = entry.title || ''
        if (seen.has(url)) continue
        const inTitle = title.toLowerCase().includes(q)
        const inUrl   = url.toLowerCase().includes(q)
        if (!inTitle && !inUrl) continue
        seen.add(url)
        const prefixScore = getDisplayUrl(url).toLowerCase().startsWith(q) ? 1000 : 0
        histResults.push({ type: 'history', url, title, score: prefixScore + (visitCount.get(url) || 1) })
      }
      histResults.sort((a, b) => b.score - a.score)
    }

    // ── Połącz: zakładki i historia razem, max 6, posortowane ────
    const combined = [...bkResults.slice(0, 3), ...histResults.slice(0, 3)]
    combined.sort((a, b) => b.score - a.score)
    const topResults = combined.slice(0, 5)

    if (topResults.length === 0) { closeSuggestions(); return }

    // ── Wstaw "Szukaj" w odpowiednim miejscu ─────────────────────
    const looksLikeUrl = /^https?:\/\//i.test(query) || (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(query) && !query.includes(' '))
    const searchScore  = looksLikeUrl ? 0 : 500
    const mixed = []
    let searchInserted = false
    for (const item of topResults) {
      if (!searchInserted && item.score <= searchScore) {
        mixed.push({ type: 'search', query })
        searchInserted = true
      }
      mixed.push(item)
    }
    if (!searchInserted) mixed.push({ type: 'search', query })

    sugItems = mixed
    sugActiveIdx = -1

    // ── SVG ikony ─────────────────────────────────────────────────
    const searchSvg    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
    const bookmarkSvg  = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z"/></svg>`
    const globeSvgSm   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`

    let html = ''
    mixed.forEach((item, i) => {
      if (item.type === 'search') {
        if (i > 0) html += `<div class="url-sug-divider"></div>`
        html += `<div class="url-sug-item sug-search" data-idx="${i}">
          <span class="url-sug-icon">${searchSvg}</span>
          <div class="url-sug-text">
            <div class="url-sug-title">${t('search_for')} „<strong>${escHtml(query)}</strong>"</div>
          </div>
        </div>`
        if (i < mixed.length - 1) html += `<div class="url-sug-divider"></div>`
      } else if (item.type === 'bookmark') {
        const dUrl = getDisplayUrl(item.url)
        const titleHl = highlightMatch(item.title || dUrl, query)
        const urlHl   = highlightMatch(dUrl, query)
        const iconHtml = `<span class="url-sug-icon sug-bk-icon"><img data-fav="${escHtml(item.url)}" decoding="async" loading="eager"><span class="sug-icon-fallback">${bookmarkSvg}</span></span>`
        html += `<div class="url-sug-item sug-bookmark" data-idx="${i}">
          ${iconHtml}
          <div class="url-sug-text">
            <div class="url-sug-title">${titleHl}</div>
            <div class="url-sug-url">${urlHl}</div>
          </div>
        </div>`
      } else {
        const dUrl = getDisplayUrl(item.url)
        const titleHl = highlightMatch(item.title || dUrl, query)
        const urlHl   = highlightMatch(dUrl, query)
        const iconHtml = `<span class="url-sug-icon"><img data-fav="${escHtml(item.url)}" decoding="async" loading="eager"><span class="sug-icon-fallback">${globeSvgSm}</span></span>`
        html += `<div class="url-sug-item" data-idx="${i}">
          ${iconHtml}
          <div class="url-sug-text">
            <div class="url-sug-title">${titleHl}</div>
            <div class="url-sug-url">${urlHl}</div>
          </div>
        </div>`
      }
    })

    // Zachowaj już załadowane favicony sugestii, które nadal są na liście.
    // Ponowne tworzenie <img> po każdym znaku powodowało krótkie pokazanie fallbacku.
    const previousFavicons = new Map()
    sugEl.querySelectorAll('img[data-fav]').forEach(img => {
      const url = img.dataset.fav
      if (url && !previousFavicons.has(url)) previousFavicons.set(url, img)
    })

    sugEl.innerHTML = html
    positionSuggestions()
    sugEl.classList.add('open')
    sugOpen = true

    // Uzupełnij favicon po wyrenderowaniu — instant jeśli w cache, async jeśli nie
    sugEl.querySelectorAll('img[data-fav]').forEach(placeholder => {
      const url = placeholder.dataset.fav
      const previous = previousFavicons.get(url)
      const img = previous || placeholder
      if (previous) placeholder.replaceWith(previous)
      const fallback = img.nextElementSibling
      img.onload = () => {
        if (!img.isConnected) return
        if (fallback) fallback.style.opacity = '0'
        img.style.opacity = '1'
      }
      img.onerror = () => {
        if (!img.isConnected) return
        img.style.opacity = '0'
        if (fallback) fallback.style.opacity = '1'
      }
      if (previous) {
        const loaded = img.complete && img.naturalWidth > 0
        img.style.opacity = loaded ? '1' : '0'
        if (fallback) fallback.style.opacity = loaded ? '0' : '1'
        return
      }
      img.style.opacity = '0'
      if (fallback) fallback.style.opacity = '1'
      const cached = getFaviconAsync(url, (dataUrl) => {
        if (!img.isConnected) return
        img.src = dataUrl
      })
      if (cached) {
        img.src = cached
      }
    })

    // Inline autocomplete — pierwszy history lub bookmark wynik
    const firstNav = topResults[0]
    if (!_suppressAutocomplete && firstNav) {
      applyInlineAutocomplete(query, firstNav.url)
    }
    _suppressAutocomplete = false

    // Kliknięcia
    sugEl.querySelectorAll('.url-sug-item').forEach(el => {
      el.addEventListener('mousedown', e => {
        e.preventDefault()
        const idx  = parseInt(el.dataset.idx)
        const item = sugItems[idx]
        if (!item) return
        closeSuggestions()
        if (item.type === 'search') {
          navigate(item.query)
        } else {
          if (item.type === 'bookmark') trackBookmarkClick(item.url)
          navigate(item.url)
        }
        urlInput.blur()
      })
    })
  }

  urlInput.addEventListener('input', () => {
    if (_sugInputTimer) clearTimeout(_sugInputTimer)
    _typedVal = urlInput.value
    _urlInputDirty = true
    const val = _typedVal.trim()
    if (!val) { closeSuggestions(); _suppressAutocomplete = false; _deletingMode = false; return }
    if (_deletingMode) {
      // Użytkownik usuwa — zamknij sugestie, nie otwieraj nowych
      closeSuggestions()
      return
    }
    const suppress = _suppressAutocomplete
    _sugInputTimer = setTimeout(() => {
      _suppressAutocomplete = suppress
      showSuggestions(val)
    }, 60)
  })

  // Reposition przy resize
  window.addEventListener('resize', () => { if (sugOpen) positionSuggestions() })

  // Zamknij przy blur
  urlInput.addEventListener('blur', () => {
    setTimeout(() => {
      // Przywróć typed part (usuń autocomplete jeśli nadal widoczny)
      if (_urlInputDirty && urlInput.selectionStart < urlInput.value.length) {
        urlInput.value = _typedVal
      }
      closeSuggestions()
    }, 150)
  })

  // Preload historii przy starcie — żeby sugestie były dostępne od razu
  // bez oczekiwania na pierwsze wpisanie znaku
  getSugHistory()

  btnBack.onclick   = () => { const t = getActiveTab(); if(t) t.wv.goBack() }
  btnFwd.onclick    = () => { const t = getActiveTab(); if(t) t.wv.goForward() }
  btnReload.onclick = () => { const t = getActiveTab(); if(t && !t.internalPage) window.electronAPI.reloadPage(t.wv.getWebContentsId()) }
  btnHome.onclick   = () => { const t = getActiveTab(); if(t) t.wv.loadURL(getHomepageUrl()) }
  tabNewBtn.addEventListener('click', () => createTab(getHomepageUrl()))

  document.getElementById('btn-min').onclick   = () => window.electronAPI.minimize()
  document.getElementById('btn-max').onclick   = () => window.electronAPI.maximize()
  document.getElementById('btn-close').onclick = () => window.electronAPI.close()

  // Dropdown — nadpisz poprzedni listener (teraz mamy jeden globalny)
  menuBtn.onclick = e => { e.stopPropagation(); hideSecPopup(); dlPanel.classList.remove('open'); adblockPopup.classList.remove('open'); qrPopup.classList.remove('open'); dropdown.classList.toggle('open') }

  // ── Tryb prywatny — inicjalizacja ────────────────────────────────
  const isPrivate = !!(window.electronAPI && window.electronAPI.isPrivate === true)
  if (isPrivate) {
    document.documentElement.classList.add('private-mode')
    document.getElementById('private-banner').classList.add('visible')
    document.getElementById('dd-private-indicator').style.display = 'flex'
    // W trybie prywatnym przycisk pozostaje widoczny — można otworzyć kolejne okno prywatne

    // Banner — rozwiń/zwiń po kliknięciu paska
    const privBanner     = document.getElementById('private-banner')
    const privBannerBar  = document.getElementById('private-banner-bar')
    const privBannerHide = document.getElementById('private-banner-hide')

    privBannerBar.addEventListener('click', e => {
      if (e.target === privBannerHide || privBannerHide.contains(e.target)) return
      privBanner.classList.toggle('expanded')
    })

    privBannerHide.addEventListener('click', e => {
      e.stopPropagation()
      // Zwiń szczegóły jeśli otwarte
      privBanner.classList.remove('expanded')
      // Dodaj klasę animacji ukrywania
      privBanner.classList.add('hiding')
      privBanner.addEventListener('animationend', () => {
        privBanner.classList.remove('visible', 'hiding')
      }, { once: true })
    })
  }

  // ══════════════════════════════════════════════════════════════════
  //  NISZCZYCIEL NITRIX
  // ══════════════════════════════════════════════════════════════════
  ;(function() {
    const destroyerOverlay        = document.getElementById('destroyer-overlay')
    const destroyerModal          = document.getElementById('destroyer-modal')
    const destroyerClose          = document.getElementById('destroyer-close')
    const dstDeleteBtn            = document.getElementById('dst-delete-btn')
    const dstSelectAll            = document.getElementById('dst-select-all')
    const dstDeselectAll          = document.getElementById('dst-deselect-all')
    const destroyerConfirmOverlay = document.getElementById('destroyer-confirm-overlay')
    const dconfCancel             = document.getElementById('dconf-cancel')
    const dconfConfirm            = document.getElementById('dconf-confirm')
    const dconfSummary            = document.getElementById('dconf-summary')

    const dstCheckboxes = {
      history:   document.getElementById('dst-history'),
      dlhistory: document.getElementById('dst-dlhistory'),
      bookmarks: document.getElementById('dst-bookmarks'),
      cookies:   document.getElementById('dst-cookies'),
      cache:     document.getElementById('dst-cache'),
      storage:   document.getElementById('dst-storage'),
      passwords: document.getElementById('dst-passwords'),
      pin:       document.getElementById('dst-pin'),
    }
    const dstNames = {
      get history()   { return t('browsing_history') },
      get dlhistory() { return t('dst_dlhistory') },
      get bookmarks() { return t('dst_bookmarks') },
      get cookies()   { return t('dst_cookies') },
      get cache()     { return t('dst_cache') },
      get storage()   { return t('dst_storage') },
      get passwords() { return t('dst_passwords') },
      get pin()       { return t('dst_pin') },
    }

    function updateDeleteBtn() {
      dstDeleteBtn.disabled = !Object.values(dstCheckboxes).some(cb => cb.checked)
    }

    function openDestroyer() {
      destroyerOverlay.classList.add('open')
      updateDeleteBtn()
    }
    function closeDestroyer() {
      destroyerOverlay.classList.remove('open')
    }

    // Otwórz z przycisku w dropdownie
    document.getElementById('dd-destroyer').onclick = e => {
      e.stopPropagation()
      dropdown.classList.remove('open')
      openDestroyer()
    }

    // Zamknij przez X lub klik tła
    destroyerClose.addEventListener('click', closeDestroyer)
    destroyerOverlay.addEventListener('click', e => {
      if (e.target === destroyerOverlay) closeDestroyer()
    })

    // Zmiany checkboxów
    Object.values(dstCheckboxes).forEach(cb => {
      cb.addEventListener('change', updateDeleteBtn)
    })

    dstSelectAll.addEventListener('click', () => {
      Object.values(dstCheckboxes).forEach(cb => { cb.checked = true })
      updateDeleteBtn()
    })
    dstDeselectAll.addEventListener('click', () => {
      Object.values(dstCheckboxes).forEach(cb => { cb.checked = false })
      updateDeleteBtn()
    })

    // Przycisk USUŃ → otwórz potwierdzenie
    dstDeleteBtn.addEventListener('click', () => {
      dconfSummary.innerHTML = Object.entries(dstCheckboxes)
        .filter(([, cb]) => cb.checked)
        .map(([k]) => `<div class="dconf-summary-item">${dstNames[k]}</div>`)
        .join('')
      destroyerConfirmOverlay.classList.add('open')
    })

    // Anuluj potwierdzenie
    dconfCancel.addEventListener('click', () => {
      destroyerConfirmOverlay.classList.remove('open')
    })
    destroyerConfirmOverlay.addEventListener('click', e => {
      if (e.target === destroyerConfirmOverlay)
        destroyerConfirmOverlay.classList.remove('open')
    })

    // POTWIERDŹ — wykonaj usuwanie
    dconfConfirm.addEventListener('click', async () => {
      const options = {
        clearHistory:   dstCheckboxes.history.checked,
        clearDlHistory: dstCheckboxes.dlhistory.checked,
        clearBookmarks: dstCheckboxes.bookmarks.checked,
        clearCookies:   dstCheckboxes.cookies.checked,
        clearCache:     dstCheckboxes.cache.checked,
        clearStorage:   dstCheckboxes.storage.checked,
        clearPasswords: dstCheckboxes.passwords.checked,
        clearPin:       dstCheckboxes.pin.checked,
      }

      // Jeśli usuwamy PIN — wymagaj potwierdzenia kodem PIN
      if ((options.clearPin || options.clearPasswords) && await window.electronAPI.pinHas()) {
        destroyerConfirmOverlay.classList.remove('open')
        const pinOk = await (window._nitrixAskPin ? window._nitrixAskPin() : Promise.resolve(true))
        if (!pinOk) return
        destroyerConfirmOverlay.classList.add('open')
      }

      // Zablokuj przyciski na czas operacji
      dconfConfirm.disabled = true
      dconfCancel.disabled  = true
      dconfConfirm.textContent = 'Usuwanie…'

      try {
        await window.electronAPI.nitrixDestroy(options)
      } catch(err) {
        console.error('[Niszczyciel] błąd:', err)
      }

      // Wyczyść dane w pamięci renderera
      if (options.clearHistory) {
        historyData.splice(0, historyData.length)
        _historyData = []
        if (typeof renderHistory === 'function') renderHistory()
      }
      if (options.clearDlHistory) {
        dlHistoryData = []
        if (typeof saveDlHistory   === 'function') saveDlHistory()
        if (typeof renderDlHistory === 'function') renderDlHistory()
      }
      if (options.clearBookmarks) {
        bookmarks.splice(0, bookmarks.length)
        if (typeof renderBookmarks   === 'function') renderBookmarks()
        if (typeof renderBkAllList   === 'function') renderBkAllList()
      }
      if (options.clearPasswords) {
        await window.electronAPI.passwordsClear()
        if (typeof renderPasswords === 'function') renderPasswords()
      }
      if (options.clearPin) {
        await window.electronAPI.pinClear()
        localStorage.removeItem('nitrix_pin_skip_autofill')
        await window.electronAPI.passwordsClear()
        if (typeof renderPasswords === 'function') renderPasswords()
        if (typeof refreshPinSection === 'function') refreshPinSection()
        if (typeof updateAddBtn === 'function') updateAddBtn()
      }

      // Animacja sukcesu i zamknięcie
      destroyerConfirmOverlay.classList.remove('open')
      destroyerModal.classList.add('dst-done-anim')
      setTimeout(() => {
        destroyerModal.classList.remove('dst-done-anim')
        closeDestroyer()
        // Przywróć przyciski
        dconfConfirm.disabled = false
        dconfCancel.disabled  = false
        dconfConfirm.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg> Tak, usuń na zawsze`
      }, 480)
    })
  })()
  // ══════════════════════════════════════════════════════════════════
  //  MENEDŻER HASEŁ — safeStorage (klucz systemowy)
  // ══════════════════════════════════════════════════════════════════
  ;(function () {
    const PIN_SKIP_KEY = 'nitrix_pin_skip_autofill'

    // ── API do main procesu ───────────────────────────────────────────
    const api = window.electronAPI

    // ── Magazyn ───────────────────────────────────────────────────────
    let _pwCache  = null       // cache haseł (tablica obiektów)
    let _pinCache = undefined  // undefined = jeszcze nie wczytano; null = brak PINu; '__pin_set__' = PIN ustawiony

    async function loadRaw() {
      let raw = await api.passwordsLoad()
      if (raw === null && await askPin()) raw = await api.passwordsLoad()
      if (raw === null) throw new Error('Menedżer haseł jest zablokowany')
      return raw
    }
    async function saveRaw(arr) {
      if (!await api.passwordsSave(arr)) {
        if (!await askPin() || !await api.passwordsSave(arr)) throw new Error('Nie zapisano haseł')
      }
      _pwCache = null
    }
    async function loadPinVal() {
      if (_pinCache !== undefined) return _pinCache
      _pinCache = await api.pinLoad()   // null lub string
      return _pinCache
    }
    async function hasPin() { return !!(await loadPinVal()) }
    async function verifyPin(entered) {
      const stored = await loadPinVal()
      if (!stored) return true               // brak PINu — nie blokuj
      // Weryfikacja po stronie main (porównanie hasha PBKDF2) — renderer nie zna surowego PINu
      return !!(await api.pinVerify(entered))
    }
    async function savePinVal(pin) {
      if (!await api.pinSave(pin)) throw new Error('Nie zapisano PIN-u')
      _pinCache = '__pin_set__'   // nie trzymaj surowego PINu w pamięci renderera
    }
    async function clearPinVal() {
      if (!await api.pinClear()) throw new Error('Nie usunięto PIN-u')
      _pinCache = null
    }
    async function clearAllPasswords() {
      if (!await api.passwordsClear()) throw new Error('Nie usunięto haseł')
      _pwCache = null
    }

    // ── DOM ───────────────────────────────────────────────────────────
    const overlay       = document.getElementById('passwords-overlay')
    const listEl        = document.getElementById('passwords-list')
    const searchEl      = document.getElementById('passwords-search')
    const addBtn        = document.getElementById('passwords-add-btn')
    const deleteAllBtn  = document.getElementById('passwords-delete-all-btn')
    const closeBtn      = document.getElementById('passwords-close')
    const formOverlay   = document.getElementById('pw-form-overlay')
    const formTitle     = document.getElementById('pw-form-title')
    const fieldSite     = document.getElementById('pw-field-site')
    const fieldUser     = document.getElementById('pw-field-user')
    const fieldPass     = document.getElementById('pw-field-pass')
    const toggleVis     = document.getElementById('pw-toggle-vis')
    const formCancel    = document.getElementById('pw-form-cancel')
    const formSave      = document.getElementById('pw-form-save')
    const copyToast     = document.getElementById('pw-copy-toast')
    const pinInput1     = document.getElementById('pw-pin-input1')
    const pinInput2     = document.getElementById('pw-pin-input2')
    const pinError      = document.getElementById('pw-pin-error')
    const pinSaveBtn    = document.getElementById('pw-pin-save-btn')
    const pinSetWrap    = document.getElementById('pw-pin-set-wrap')
    const pinSetDone    = document.getElementById('pw-pin-set-done')
    const verifyOverlay = document.getElementById('pw-pin-verify-overlay')
    const verifyInput   = document.getElementById('pw-pin-verify-input')
    const verifyError   = document.getElementById('pw-pin-verify-error')
    const verifyBtn     = document.getElementById('pw-pin-verify-btn')
    const sidebarItems  = document.querySelectorAll('.pw-sidebar-item')
    const sectionPassEl = document.getElementById('pw-section-passwords')
    const sectionPinEl  = document.getElementById('pw-section-pin')
    const headerTitle   = document.getElementById('pw-content-header-title')

    let _editIndex = -1, _toastTimer = null, _verifyResolve = null

    // ── Sidebar ───────────────────────────────────────────────────────
    sidebarItems.forEach(item => {
      item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'))
        item.classList.add('active')
        const sec = item.dataset.pwSection
        sectionPassEl.style.display = sec === 'passwords' ? 'flex' : 'none'
        sectionPinEl.style.display  = sec === 'pin'       ? 'flex' : 'none'
        headerTitle.textContent = t(sec === 'passwords' ? 'pw_sidebar_passwords' : 'pw_sidebar_pin')
        if (sec === 'pin') refreshPinSection()
      })
    })

    async function refreshPinSection() {
      const pinned = await hasPin()
      if (pinned) {
        pinSetWrap.style.display = 'none'
        pinSetDone.classList.add('visible')
        document.getElementById('pw-pin-skip-row').classList.add('visible')
        document.getElementById('pw-pin-reset-row').style.display = ''
        const skipChk = document.getElementById('pw-pin-skip-chk')
        if (skipChk) skipChk.checked = await api.autofillSkipGet()
      } else {
        pinSetWrap.style.display = ''
        pinSetDone.classList.remove('visible')
        document.getElementById('pw-pin-skip-row').classList.remove('visible')
        document.getElementById('pw-pin-reset-row').style.display = 'none'
        pinInput1.value = ''; pinInput2.value = ''
        pinError.textContent = ''
        pinInput1.classList.remove('error'); pinInput2.classList.remove('error')
      }
    }

    // Toggle "pomiń PIN przy autofill" — wymaga weryfikacji PIN przed włączeniem
    document.getElementById('pw-pin-skip-chk').addEventListener('change', async function() {
      const enabled = this.checked
      this.disabled = true
      try {
        if (enabled && !await askPin()) { this.checked = false; return }
        await api.autofillSkipSet(enabled)
        this.checked = await api.autofillSkipGet()
      } finally { this.disabled = false }
      localStorage.removeItem(PIN_SKIP_KEY)
    })

    // ── PIN setup ─────────────────────────────────────────────────────
    pinSaveBtn.onclick = async () => {
      const p1 = pinInput1.value, p2 = pinInput2.value
      pinInput1.classList.remove('error'); pinInput2.classList.remove('error')
      pinError.textContent = ''
      if (!/^\d+$/.test(p1)) { pinError.textContent = t('pw_pin_err_digits'); pinInput1.classList.add('error'); return }
      if (p1.length < 4)      { pinError.textContent = t('pw_pin_err_short');  pinInput1.classList.add('error'); return }
      if (p1 !== p2)          { pinError.textContent = t('pw_pin_err_match');  pinInput2.classList.add('error'); return }
      await savePinVal(p1)
      await refreshPinSection()
      await updateAddBtn()
    }
    ;[pinInput1, pinInput2].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') pinSaveBtn.click() }))

    // Usuń wszystkie hasła
    deleteAllBtn.addEventListener('click', async () => {
      if (await hasPin()) {
        const ok = await askPin()
        if (!ok) return
      }
      const pwDelConfirmed = await new Promise(resolve => {
        const overlay = document.createElement('div')
        overlay.style.cssText = `position:absolute;inset:0;z-index:100;background:rgba(0,0,0,.55);border-radius:16px;display:flex;align-items:center;justify-content:center;`
        const box = document.createElement('div')
        box.style.cssText = `background:var(--settings-bg);border:1px solid var(--border);border-radius:12px;padding:24px 28px;width:320px;box-shadow:0 8px 32px rgba(0,0,0,.4);text-align:center;`
        box.innerHTML = `
          <div style="font-size:15px;font-weight:600;margin-bottom:8px;color:var(--text)">${t('pw_delete_all_confirm').split('?')[0] + '?'}</div>
          <div style="font-size:13px;color:var(--text-dim);margin-bottom:20px">${t('irreversible')}</div>
          <div style="display:flex;gap:8px;justify-content:center">
            <button id="_pwda_cancel" style="padding:8px 20px;border-radius:8px;border:none;background:var(--hover);color:var(--text);font-size:14px;font-family:inherit;cursor:pointer">${t('cancel')}</button>
            <button id="_pwda_ok"     style="padding:8px 20px;border-radius:8px;border:none;background:#c42b1c;color:#fff;font-size:14px;font-family:inherit;cursor:pointer">${t('clear')}</button>
          </div>`
        overlay.appendChild(box)
        const sectionEl = document.getElementById('pw-content')
        sectionEl.appendChild(overlay)
        box.querySelector('#_pwda_cancel').onclick = () => { overlay.remove(); resolve(false) }
        box.querySelector('#_pwda_ok').onclick     = () => { overlay.remove(); resolve(true)  }
        overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); resolve(false) } })
      })
      if (!pwDelConfirmed) return
      await clearAllPasswords()
      renderPasswords()
    })

    // ── PIN verify ────────────────────────────────────────────────────
    function askPin() {
      return new Promise(resolve => {
        _verifyResolve = resolve
        verifyInput.value = ''; verifyError.textContent = ''
        verifyInput.classList.remove('error')
        verifyOverlay.classList.add('open')
        setTimeout(() => verifyInput.focus(), 80)
      })
    }
    verifyBtn.onclick = async () => {
      const pending = _verifyResolve
      const ok = await verifyPin(verifyInput.value)
      if (!pending || _verifyResolve !== pending) { await api.passwordsLock(); return }
      if (!ok) {
        verifyError.textContent = t('pw_pin_err_wrong')
        verifyInput.classList.add('error')
        setTimeout(() => verifyInput.classList.remove('error'), 400)
        verifyInput.value = ''; verifyInput.focus(); return
      }
      verifyOverlay.classList.remove('open')
      if (_verifyResolve) { _verifyResolve(true); _verifyResolve = null }
    }
    verifyInput.addEventListener('keydown', e => { if (e.key === 'Enter') verifyBtn.click() })
    verifyOverlay.addEventListener('click', e => {
      if (e.target === verifyOverlay) {
        verifyOverlay.classList.remove('open')
        if (_verifyResolve) { _verifyResolve(false); _verifyResolve = null }
      }
    })

    // ── Toast ─────────────────────────────────────────────────────────
    function showToast(msg) {
      copyToast.textContent = msg
      copyToast.classList.add('show')
      if (_toastTimer) clearTimeout(_toastTimer)
      _toastTimer = setTimeout(() => copyToast.classList.remove('show'), 2000)
    }

    // ── Lista haseł ───────────────────────────────────────────────────
    async function renderPasswords() {
      const raw    = await api.passwordsList()
      const q      = searchEl.value.trim().toLowerCase()
      const filtered = q ? raw.filter(e =>
        (e.site||'').toLowerCase().includes(q) ||
        (e.user||'').toLowerCase().includes(q)
      ) : raw

      if (!filtered.length) {
        listEl.innerHTML = `<div class="pw-empty">${t(q ? 'pw_empty_search' : 'pw_empty')}</div>`
        return
      }

      listEl.innerHTML = ''
      filtered.forEach((entry, i) => {
        const realIdx = raw.indexOf(entry)
        // Wyciągnij czystą domenę do wyświetlenia
        let displaySite = entry.site || ''
        try {
          let s = displaySite
          if (!/^https?:\/\//i.test(s)) s = 'https://' + s
          displaySite = new URL(s).hostname.replace(/^www\./, '')
        } catch(e) {}
        const faviconDomain = (() => { try { let s = entry.site; if (!/^https?:\/\//i.test(s)) s='https://'+s; return new URL(s).hostname } catch { return entry.site } })()
        const item = document.createElement('div')
        item.className = 'pw-item'
        item.innerHTML = `
          <img class="pw-item-favicon" src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(faviconDomain)}&sz=32" onerror="this.style.display='none'" alt="">
          <div class="pw-item-info">
            <div class="pw-item-site">${escHtml(displaySite)}</div>
            <div class="pw-item-user">${escHtml(entry.user || '')}</div>
          </div>
          <button class="pw-item-btn" data-copy="${realIdx}" title="${t('pw_copy_title')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button class="pw-item-btn" data-edit="${realIdx}" title="${t('pw_edit_btn')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="pw-item-btn pw-item-del" data-del="${realIdx}" title="${t('pw_del_btn')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>`

        item.querySelector('[data-copy]').onclick = async btn => {
          if (await hasPin()) { const ok = await askPin(); if (!ok) return }
          const r = await loadRaw()
          navigator.clipboard.writeText(r[realIdx]?.plainPass || '').catch(() => {})
          showToast(t('pw_copied'))
        }
        item.querySelector('[data-edit]').onclick = async () => {
          if (await hasPin()) { const ok = await askPin(); if (!ok) return }
          openForm(realIdx)
        }
        item.querySelector('[data-del]').onclick = async () => {
          const r = await loadRaw()
          r.splice(realIdx, 1)
          await saveRaw(r)
          renderPasswords()
        }
        listEl.appendChild(item)
      })
    }
    // alias dla kompatybilności z kodem Niszczyciela
    const renderList = renderPasswords

    // ── Formularz dodaj/edytuj ────────────────────────────────────────
    function openForm(idx) {
      _editIndex = idx
      formOverlay.classList.add('open')
      if (idx === -1) {
        formTitle.textContent = t('pw_add_title')
        // Wstaw domenę aktywnej karty — użytkownik nie musi jej wpisywać ręcznie
        const _activeTab = typeof getActiveTab === 'function' ? getActiveTab() : null
        const _tabUrl    = _activeTab && _activeTab.url && /^https?:\/\//i.test(_activeTab.url)
                             ? _activeTab.url : ''
        let   _siteVal   = ''
        try { if (_tabUrl) _siteVal = new URL(_tabUrl).hostname.replace(/^www\./, '') } catch {}
        fieldSite.value = _siteVal
        fieldUser.value = ''; fieldPass.value = ''
      } else {
        formTitle.textContent = t('pw_edit_title')
        loadRaw().then(raw => {
          const entry = raw[idx]
          fieldSite.value = entry?.site || ''
          fieldUser.value = entry?.user || ''
          fieldPass.value = entry?.plainPass || ''
        })
      }
      setTimeout(() => fieldSite.focus(), 80)
    }
    function closeForm() { formOverlay.classList.remove('open') }
    formCancel.onclick = closeForm
    formOverlay.addEventListener('click', e => { if (e.target === formOverlay) closeForm() })

    toggleVis.onclick = () => {
      fieldPass.type = fieldPass.type === 'password' ? 'text' : 'password'
    }

    formSave.onclick = async () => {
      const site = fieldSite.value.trim()
      const user = fieldUser.value.trim()
      const pass = fieldPass.value
      if (!site || !pass) return
      const raw = await loadRaw()
      if (_editIndex === -1) {
        raw.push({ site, user, plainPass: pass })
      } else {
        raw[_editIndex] = { site, user, plainPass: pass }
      }
      await saveRaw(raw)
      closeForm()
      renderPasswords()
    }

    // ── Reset PIN ──────────────────────────────────────────────────────
    document.getElementById('pw-pin-reset-btn').addEventListener('mouseenter', function() {
      this.style.background = '#f87171'; this.style.color = '#fff'
    })
    document.getElementById('pw-pin-reset-btn').addEventListener('mouseleave', function() {
      this.style.background = 'transparent'; this.style.color = '#f87171'
    })
    document.getElementById('pw-pin-reset-btn').addEventListener('click', async () => {
      const ok = await askPin()
      if (!ok) return
      await clearPinVal()
      await clearAllPasswords()
      localStorage.removeItem(PIN_SKIP_KEY)
      renderPasswords()
      refreshPinSection()
      updateAddBtn()
    })

    // ── Otwieranie ────────────────────────────────────────────────────
    window._nitrixAskPin = askPin
    window._nitrixOpenPasswords = () => {
      sidebarItems.forEach(i => i.classList.remove('active'))
      sidebarItems[0].classList.add('active')
      sectionPassEl.style.display = 'flex'
      sectionPinEl.style.display  = 'none'
      headerTitle.textContent = t('pw_sidebar_passwords')
      overlay.classList.add('open')
      searchEl.value = ''; renderPasswords(); updateAddBtn()
      setTimeout(() => searchEl.focus(), 80)
    }
    function lockPasswords() {
      overlay.classList.remove('open')
      closeForm()
      fieldPass.value = ''; fieldUser.value = ''; fieldSite.value = ''
      _pwCache = null
      api.passwordsLock()
    }
    closeBtn.onclick = lockPasswords
    overlay.addEventListener('click', e => { if (e.target === overlay) lockPasswords() })
    addBtn.onclick = async () => {
      if (addBtn.classList.contains('locked')) {
        showToast(t('pw_add_need_pin'))
        return
      }
      openForm(-1)
    }
    searchEl.addEventListener('input', renderPasswords)

    async function updateAddBtn() {
      const locked = !(await hasPin())
      addBtn.classList.toggle('locked', locked)
      addBtn.title = locked ? t('pw_add_need_pin') : ''
    }
  })()

  document.getElementById('dd-passwords').onclick = e => {
    e.stopPropagation()
    dropdown.classList.remove('open')
    window._nitrixOpenPasswords()
  }

  // ══════════════════════════════════════════════════════════════════
  //  AUTOUZUPEŁNIANIE HASEŁ
  // ══════════════════════════════════════════════════════════════════
  ;(function () {
    const PIN_SKIP_KEY = 'nitrix_pin_skip_autofill'

    const dotWrap   = document.getElementById('pw-dot-wrap')
    const dotBtn    = document.getElementById('pw-dot-btn')
    const dotPopup  = document.getElementById('pw-dot-popup')
    const dotFavico = document.getElementById('pw-dot-popup-favicon')
    const dotSite   = document.getElementById('pw-dot-popup-site')
    const dotUser   = document.getElementById('pw-dot-popup-user')
    const dotFill   = document.getElementById('pw-dot-popup-fill')

    const dismissed = new Set()

    function positionPopup() {
      const rect = dotBtn.getBoundingClientRect()
      dotPopup.style.visibility = 'hidden'
      dotPopup.style.display    = 'block'
      const pw = dotPopup.offsetWidth
      dotPopup.style.display    = ''
      dotPopup.style.visibility = ''
      dotPopup.style.top  = (rect.bottom + 6) + 'px'
      dotPopup.style.left = Math.max(8, rect.right - pw) + 'px'
    }

    async function matchEntry(url) {
      try {
        const host = new URL(url).hostname.replace(/^www\./, '')
        const raw  = await window.electronAPI.passwordsList() || []
        return raw.find(e => {
          try {
            let s = e.site.trim()
            if (!/^https?:\/\//.test(s)) s = 'https://' + s
            return new URL(s).hostname.replace(/^www\./, '') === host
          } catch { return false }
        })
      } catch { return null }
    }

    function hidePopup() { dotPopup.classList.remove('open') }
    function hideBtn()   { dotWrap.classList.remove('visible'); hidePopup() }
    window._nitrixHideAutofill = hideBtn

    window._nitrixCheckAutofill = async function (wv, url) {
      if (!url || /^nitrix:|^about:|^chrome:/.test(url)) { hideBtn(); return }
      const host = (() => { try { return new URL(url).hostname } catch { return url } })()
      if (dismissed.has(host)) { hideBtn(); return }
      const entry = await matchEntry(url)
      if (!entry) { hideBtn(); return }

      window._autofillEntry = entry
      window._autofillWv    = wv

      dotFavico.src = `https://www.google.com/s2/favicons?domain=${host}&sz=32`
      dotFavico.onerror = () => { dotFavico.style.display = 'none' }
      dotFavico.style.display = ''
      dotSite.textContent = host.replace(/^www\./, '')
      dotUser.textContent = entry.user || ''
      dotWrap.classList.add('visible')
      // Pozycjonuj popup dopiero po tym jak przycisk jest widoczny i ma wymiary
      requestAnimationFrame(() => {
        positionPopup()
        dotPopup.classList.add('open')
      })
    }

    dotBtn.addEventListener('click', e => {
      e.stopPropagation()
      if (dotPopup.classList.contains('open')) {
        dotPopup.classList.remove('open')
      } else {
        positionPopup()
        dotPopup.classList.add('open')
      }
    })

    dotPopup.addEventListener('click', e => e.stopPropagation())

    dotFill.addEventListener('click', async () => {
      let entry = window._autofillEntry
      const wv    = window._autofillWv
      if (!entry || !wv) return

      const skipPin = await window.electronAPI.autofillSkipGet()
      if (await window.electronAPI.pinHas() && !skipPin) {
        const ok = await (window._nitrixAskPin ? window._nitrixAskPin() : Promise.resolve(false))
        if (!ok) return
      }
      let filled = false
      try {
        filled = await window.electronAPI.autofillPassword(wv.getWebContentsId(), entry.site, entry.user || '')
      } finally { await window.electronAPI.passwordsLock() }
      if (!filled) return

      // Animacja sukcesu na przycisku przed zamknięciem popupu
      const origHTML = dotFill.innerHTML
      dotFill.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ${t('pw_autofill_filled')}`
      dotFill.style.background = '#34a853'
      // Dodaj domenę do dismissed — żeby po przekierowaniu po logowaniu klucz nie wracał
      try {
        const filledHost = new URL(window._autofillWv?.getURL?.() || '').hostname
        // Keep filling available for the password step of multi-page sign-in.
      } catch {}
      await new Promise(r => setTimeout(r, 550))
      dotFill.innerHTML = origHTML
      dotFill.style.background = ''
      hidePopup()
    })
  })()

  document.getElementById('dd-devtools').onclick = e => {
    e.stopPropagation()
    dropdown.classList.remove('open')
    const t = getActiveTab()
    if (!t) return
    const id = t.wv.getWebContentsId()
    window.electronAPI.openWebviewDevTools(id)
  }

  document.getElementById('dd-private').onclick = e => {
    e.stopPropagation()
    dropdown.classList.remove('open')
    window.electronAPI.openPrivateWindow()
  }

  // Ustawienia
  document.getElementById('dd-settings').onclick = e => {
    e.stopPropagation()
    dropdown.classList.remove('open')
    settingsOverlay.classList.add('open')
    document.querySelector('#settings-sidebar [data-section="wyglad"]').click()
    document.getElementById('settings-content').scrollTop = 0
  }
  document.getElementById('dd-whatsnew').onclick = e => {
    e.stopPropagation()
    dropdown.classList.remove('open')
    if (whatsNewFrame && !whatsNewFrame.getAttribute('src')) {
      const baseSrc = whatsNewFrame.dataset.src || 'strona.html'
      whatsNewFrame.setAttribute('src', `${baseSrc}?lang=${encodeURIComponent(_currentLang || 'pl')}`)
    }
    whatsNewOverlay.classList.add('open')
  }
  function closeWhatsNewPanel() {
    whatsNewOverlay.classList.remove('open')
    if (whatsNewFrame) whatsNewFrame.removeAttribute('src')
  }
  document.getElementById('whatsnew-close').onclick = closeWhatsNewPanel
  whatsNewOverlay.addEventListener('click', e => {
    if (e.target === whatsNewOverlay) closeWhatsNewPanel()
  })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && whatsNewOverlay.classList.contains('open')) closeWhatsNewPanel()
  })
  document.getElementById('settings-close').onclick = closeSettingsOverlay
  document.getElementById('settings-close-security').onclick = closeSettingsOverlay
  document.getElementById('settings-close-adblock').onclick = closeSettingsOverlay
  document.getElementById('settings-close-sendtodevice').onclick = closeSettingsOverlay
  document.getElementById('settings-close-import').onclick = closeSettingsOverlay
  document.getElementById('settings-close-domyslna').onclick = closeSettingsOverlay
  settingsOverlay.addEventListener('click', e => {
    if (e.target === settingsOverlay) closeSettingsOverlay()
  })
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.onclick = () => {
      document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'))
      document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'))
      item.classList.add('active')
      document.getElementById('section-' + item.dataset.section).classList.add('active')
    }
  })

  // Motywy
  let currentTheme   = 'dark'
  let persistedTheme = 'dark'   // motyw normalnego okna — nigdy nie nadpisywany z trybu prywatnego
  let aeroBlur = 75
  let aeroTopOpacity = 75
  let backdropContrast = false
  let backdropTimer = 0
  let backdropBusy = false
  const backdropSelector = '#settings-panel,#history-panel,#bk-modal,#sbk-modal,#destroyer-modal,#destroyer-confirm-modal,#cert-modal,#whatsnew-panel,#passwords-panel,#pw-form-panel,#pw-pin-verify-panel,#bk-all-modal,.nf-dialog,#dropdown,#dl-panel,#ctx-menu,#url-suggestions,#sec-popup,#adblock-popup,#translate-popup,#zoom-popup,#qr-popup,#pw-dot-popup,#page-find-panel,.nf-permission-dialog,#update-card'
  const backdropContrastInput = document.getElementById('backdrop-contrast')
  let backdropCache = null
  let backdropMaskKey = ''
  let backdropRasterState = null, backdropRasterRevision = 0, backdropRasterTimer = 0, backdropRasterBusy = false
  const backdropRepairImage = document.createElement('img')
  backdropRepairImage.id='backdrop-raster-repair'
  backdropRepairImage.alt=''
  backdropRepairImage.setAttribute('aria-hidden','true')
  backdropRepairImage.hidden=true
  wvCont.appendChild(backdropRepairImage)
  function resetBackdropRaster(id,regions) {
    backdropRasterRevision++
    clearTimeout(backdropRasterTimer)
    backdropRepairImage.hidden=true
    backdropRepairImage.removeAttribute('src')
    backdropRasterState=id && regions.length ? {id,regions} : null
    if(backdropRasterState) backdropRasterTimer=setTimeout(refreshBackdropRaster,250)
  }
  async function refreshBackdropRaster() {
    if(!backdropRasterState||backdropRasterBusy)return
    const state=backdropRasterState,revision=backdropRasterRevision
    backdropRasterBusy=true
    try {
      if(document.hidden)return
      const result=await window.electronAPI.backdropRasterMask(state.id,state.regions)
      if(revision!==backdropRasterRevision||!result)return
      if(result.image) {
        const decoded=new Image();decoded.src=result.image;await decoded.decode()
        if(revision!==backdropRasterRevision)return
        if(backdropRepairImage.src!==result.image)backdropRepairImage.src=result.image
        backdropRepairImage.hidden=false
      } else {
        backdropRepairImage.hidden=true
        backdropRepairImage.removeAttribute('src')
      }
    } catch { /* A closed or navigating tab invalidates its repair image. */ }
    finally {
      backdropRasterBusy=false
      if(backdropRasterState) {
        clearTimeout(backdropRasterTimer)
        backdropRasterTimer=setTimeout(refreshBackdropRaster,revision===backdropRasterRevision?1800:250)
      }
    }
  }
  const removeBackdropInvalidation=window.electronAPI.onBackdropInvalidated(id=>{
    if(backdropRasterState?.id===id)resetBackdropRaster(id,backdropRasterState.regions)
  })
  const backdropObservedGuests = new WeakSet()
  const backdropOn = () => currentTheme === 'transparent' && aeroAreas.includes('ui')
  function getBackdropGuest() {
    const active = getActiveTab()
    if (!active || active.closing) return null
    if (!active.internalPage) return active.wv
    const source = tabs.find(tab => String(tab.id) === active.internalPage.dataset.sourceTabId)
    return source && !source.closing && !source.internalPage && source.wv.isConnected
      ? source.wv : null
  }
  function visibleBackdropPanels() {
    return [...document.querySelectorAll(backdropSelector)].filter(panel => {
      const page = panel.closest('.nitrix-panel-page')
      if (page && getActiveTab()?.internalPage !== page) return false
      const style = getComputedStyle(panel)
      return panel.getClientRects().length && style.visibility !== 'hidden' && style.pointerEvents !== 'none' && Number(style.opacity) > 0
    })
  }
  function paintBackdropInk() {
    if (!backdropOn() || !backdropContrast || !backdropCache) return
    const guest = getBackdropGuest()
    if (!guest || backdropCache.guest !== guest) return
    const bounds = guest.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    for (const panel of visibleBackdropPanels()) {
      const rect = panel.getBoundingClientRect()
      const x0=Math.max(0,Math.floor((rect.left-bounds.left)/bounds.width*32))
      const y0=Math.max(0,Math.floor((rect.top-bounds.top)/bounds.height*32))
      const x1=Math.min(32,Math.ceil((rect.right-bounds.left)/bounds.width*32))
      const y1=Math.min(32,Math.ceil((rect.bottom-bounds.top)/bounds.height*32))
      let sum=0,count=0
      for(let y=y0;y<y1;y++) for(let x=x0;x<x1;x++) {
        const rgb=backdropCache.colors[y*32+x]
        if(!rgb) continue
        const c=rgb.map(v=>{const s=v/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4})
        sum+=.2126*c[0]+.7152*c[1]+.0722*c[2]; count++
      }
      if(count) {
        const ink=sum/count>.3?'dark':'light'
        if(panel.dataset.backdropInk!==ink) panel.dataset.backdropInk=ink
      }
    }
  }
  function syncBackdropReadability() {
    document.getElementById('backdrop-readability').hidden = currentTheme !== 'transparent'
    backdropContrastInput.checked = backdropContrast
    clearTimeout(backdropTimer)
    if(!backdropOn() || !backdropContrast) {
      document.querySelectorAll('[data-backdrop-ink]').forEach(panel=>panel.removeAttribute('data-backdrop-ink'))
    } else {
      paintBackdropInk()
      backdropTimer=setTimeout(updateBackdropContrast,0)
    }
  }
  async function updateBackdropContrast() {
    if(backdropBusy || !backdropOn() || !backdropContrast) return
    backdropBusy=true
    try {
      const guest=getBackdropGuest()
      if(!document.hidden && guest) {
        // Sample even when every popup is closed, ready for its first frame.
        const colors=await window.electronAPI.backdropColors(guest.getWebContentsId())
        if(colors && getBackdropGuest()===guest) {
          backdropCache={guest,colors}
          paintBackdropInk()
        }
      }
    } catch { /* Navigation may replace the guest during sampling. */ }
    finally {
      backdropBusy=false
      if(backdropOn() && backdropContrast) {
        clearTimeout(backdropTimer)
        backdropTimer=setTimeout(updateBackdropContrast,400)
      }
    }
  }
  const backdropUiObserver=new MutationObserver(()=>{
    if(!backdropOn()) return
    paintBackdropInk()
  })
  backdropUiObserver.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','open']})
  function refreshBackdropSurfaces() { paintBackdropInk() }
  window.addEventListener('resize',refreshBackdropSurfaces)
  document.addEventListener('animationend',refreshBackdropSurfaces,true)
  document.addEventListener('transitionend',refreshBackdropSurfaces,true)
  backdropContrastInput.addEventListener('change', () => { backdropContrast = backdropContrastInput.checked; syncBackdropReadability(); if (!isPrivate) saveAllSettings() })
  window.addEventListener('beforeunload', () => {
    resetBackdropRaster(null,[])
    removeBackdropInvalidation()
    backdropContrast = false; clearTimeout(backdropTimer); backdropUiObserver.disconnect()
    window.removeEventListener('resize',refreshBackdropSurfaces)
    document.removeEventListener('animationend',refreshBackdropSurfaces,true)
    document.removeEventListener('transitionend',refreshBackdropSurfaces,true)
  }, { once: true })
  const AERO_AREAS = ['tabs', 'bookmarks', 'navigation', 'ui', 'cards']
  const AERO_DEFAULT_AREAS = [...AERO_AREAS]
  let aeroAreas = [...AERO_DEFAULT_AREAS]
  let aeroLayoutFrame = 0
  function scheduleNativeAero() {
    if (aeroLayoutFrame) return
    aeroLayoutFrame = requestAnimationFrame(() => {
      aeroLayoutFrame = 0
      const regions = []
      if (currentTheme === 'transparent') {
        for (const [area, id] of [['tabs','titlebar'],['navigation','navbar'],['bookmarks','bookmarks-bar']]) {
          if (!aeroAreas.includes(area)) continue
          const rect = document.getElementById(id).getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) regions.push({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })
        }
      }
      window.electronAPI.setAeroRegions?.({ regions, strength: aeroTopOpacity }).catch(() => {})
    })
  }
  const aeroLayoutObserver = new ResizeObserver(scheduleNativeAero)
  for (const id of ['titlebar','navbar','bookmarks-bar']) aeroLayoutObserver.observe(document.getElementById(id))
  window.addEventListener('resize', scheduleNativeAero)
  window.addEventListener('beforeunload', () => {
    aeroLayoutObserver.disconnect()
    cancelAnimationFrame(aeroLayoutFrame)
    window.removeEventListener('resize', scheduleNativeAero)
  }, { once: true })
  const aeroScopeControl = document.getElementById('select-aero-scope')
  function syncAeroScope() {
    const glass = currentTheme === 'transparent'
    const root = document.documentElement
    root.classList.toggle('aero-enabled', glass)
    root.classList.toggle('aero-cards', glass && aeroAreas.includes('cards'))
    root.classList.toggle('theme-transparent', glass && aeroAreas.includes('ui'))
    for (const [area, cssName] of [['tabs','tabs'],['bookmarks','bookmarks'],['navigation','navigation']]) {
      root.classList.toggle('aero-' + cssName + '-only', glass && aeroAreas.includes(area))
      root.classList.toggle('aero-solid-' + cssName, glass && !aeroAreas.includes(area))
    }
    syncWhatsNewTheme()
    scheduleNativeAero()
    syncBackdropReadability()
  }
  function applyAeroAreas(value, legacyScope) {
    const legacy = { all: AERO_DEFAULT_AREAS, tabs: ['tabs'], bookmarks: ['bookmarks'], navigation: ['navigation'],
      ui: ['ui'], 'tabs-ui': ['tabs','ui'], 'bookmarks-ui': ['bookmarks','ui'], 'navigation-ui': ['navigation','ui'] }
    const selected = Array.isArray(value) ? value : (legacy[legacyScope] || AERO_DEFAULT_AREAS)
    aeroAreas = AERO_AREAS.filter(area => selected.includes(area))
    aeroScopeControl.querySelectorAll('[data-aero-area]').forEach(input => {
      input.checked = aeroAreas.includes(input.dataset.aeroArea)
    })
    document.getElementById('aero-area-count').textContent = aeroAreas.length + ' / ' + AERO_AREAS.length
    syncAeroScope()
  }
  aeroScopeControl.addEventListener('change', () => {
    applyAeroAreas([...aeroScopeControl.querySelectorAll('[data-aero-area]:checked')].map(input => input.dataset.aeroArea))
    if (!isPrivate) saveAllSettings()
  })
  document.addEventListener('click', event => {
    if (!aeroScopeControl.contains(event.target)) aeroScopeControl.open = false
  })
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && aeroScopeControl.open) {
      event.preventDefault()
      event.stopImmediatePropagation()
      aeroScopeControl.open = false
      aeroScopeControl.querySelector('summary').focus()
    }
  }, true)
  const aeroBlurRange = document.getElementById('theme-blur-range')
  const aeroBlurValue = document.getElementById('theme-blur-value')
  const aeroBlurControl = document.getElementById('theme-blur-control')
  const aeroTopRange = document.getElementById('theme-top-opacity')
  function applyTopAero(opacity, save = false) {
    const value = Number(opacity)
    aeroTopOpacity = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 75
    document.documentElement.style.setProperty('--nitrix-top-tint', '.08')
    document.documentElement.style.setProperty('--nitrix-top-blur', `${(32 * aeroTopOpacity / 100).toFixed(2)}px`)
    document.documentElement.style.setProperty('--nitrix-top-surface-alpha', (0.04 + 0.18 * aeroTopOpacity / 100).toFixed(4))
    aeroTopRange.value = String(aeroTopOpacity)
    document.getElementById('theme-top-value').textContent = aeroTopOpacity + '%'
    scheduleNativeAero()
    if (save && !isPrivate) saveAllSettings()
  }
  aeroTopRange.addEventListener('input', () => applyTopAero(aeroTopRange.value))
  aeroTopRange.addEventListener('change', () => applyTopAero(aeroTopRange.value, true))

  function applyAeroBlur(value, save = true) {
    const numeric = Number(value)
    aeroBlur = Number.isFinite(numeric) ? Math.max(0, Math.min(100, Math.round(numeric))) : 75
    const strength = aeroBlur / 100
    document.documentElement.style.setProperty('--nitrix-aero-blur', `${(32 * strength).toFixed(2)}px`)
    document.documentElement.style.setProperty('--nitrix-aero-tint', '.10')
    document.documentElement.classList.toggle('backdrop-has-strength', aeroBlur > 0)
    if (aeroBlurRange) {
      aeroBlurRange.value = String(aeroBlur)
      aeroBlurRange.setAttribute('aria-valuenow', String(aeroBlur))
    }
    if (aeroBlurValue) aeroBlurValue.textContent = `${aeroBlur}%`
    scheduleNativeAero()
    syncWhatsNewTheme()
    if (save && !isPrivate) saveAllSettings()
  }

  function syncWhatsNewTheme() {
    const doc = whatsNewFrame?.contentDocument
    if (doc) {
      doc.documentElement.classList.toggle('theme-transparent', currentTheme === 'transparent' && aeroAreas.includes('ui'))
      doc.documentElement.style.setProperty('--nitrix-aero-tint', '.10')
      doc.documentElement.style.setProperty('--nitrix-aero-blur', `${(32 * aeroBlur / 100).toFixed(2)}px`)
    }
  }
  whatsNewFrame?.addEventListener('load', syncWhatsNewTheme)
  function applyTheme(theme, save = true) {
    if (settingsOverlay.classList.contains('open')) {
      settingsOverlay.style.animation='none'
      document.getElementById('settings-panel').style.animation='none'
    }
    if (!['dark', 'light', 'private', 'transparent'].includes(theme)) theme = 'dark'
    currentTheme = theme
    syncAeroScope()
    document.getElementById('theme-glass-note').hidden = theme !== 'transparent'
    if (aeroBlurControl) aeroBlurControl.hidden = theme !== 'transparent'
    document.getElementById('theme-top-controls').hidden = theme !== 'transparent'
    document.getElementById('theme-aero-scope-row').hidden = theme !== 'transparent'
    Promise.resolve(window.electronAPI.setWindowTheme?.(theme)).then(result => {
      if (currentTheme === theme) document.getElementById('theme-glass-restart').hidden = !result?.requiresRestart
    }).catch(() => { if (currentTheme === theme) document.getElementById('theme-glass-restart').hidden = theme !== 'transparent' })
    // Klasy dla normalnego okna
    document.documentElement.classList.toggle('light',         theme === 'light' && !isPrivate)
    document.documentElement.classList.toggle('theme-private', theme === 'private' && !isPrivate)
    // Klasy dla prywatnego okna (nadpisują domyślny fiolet)
    document.documentElement.classList.toggle('private-theme-dark',  theme === 'dark'  && isPrivate)
    document.documentElement.classList.toggle('private-theme-light', theme === 'light' && isPrivate)
    // Zaznaczenie karty w ustawieniach
    document.querySelectorAll('.theme-wrap').forEach(w => {
      w.classList.toggle('selected', w.dataset.theme === theme)
      w.setAttribute('aria-pressed', String(w.dataset.theme === theme))
    })
    // Zapisz TYLKO w normalnym trybie — prywatny motyw obowiązuje tylko na tę sesję
    if (!isPrivate) {
      persistedTheme = theme
      if (save) saveAllSettings()
    }
    if (typeof applyBlockedPageTheme === 'function') {
      tabs.forEach(tab => applyBlockedPageTheme(tab))
    }
  }
  document.querySelectorAll('.theme-wrap').forEach(card => {
    card.tabIndex = 0; card.setAttribute('role', 'button')
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click() }
    })
  })
  document.getElementById('wrap-transparent').addEventListener('click', () => applyTheme('transparent'))
  document.getElementById('wrap-dark').addEventListener('click',    () => applyTheme('dark'))
  document.getElementById('wrap-light').addEventListener('click',   () => applyTheme('light'))
  document.getElementById('wrap-private').addEventListener('click', () => applyTheme('private'))
  aeroBlurRange?.addEventListener('input', () => applyAeroBlur(aeroBlurRange.value, false))
  aeroBlurRange?.addEventListener('change', () => applyAeroBlur(aeroBlurRange.value, true))

  // Ochrona lokalnego adresu IP w WebRTC
  const toggleBlockLocalIp = document.getElementById('toggle-block-local-ip')

  function applyBlockLocalIp(enabled, save = true) {
    window.blockLocalIpEnabled = enabled
    toggleBlockLocalIp.checked = enabled
    if (save) saveAllSettings()
  }

  toggleBlockLocalIp.addEventListener('change', () => {
    applyBlockLocalIp(toggleBlockLocalIp.checked)
  })

  // Opcja rozszerzania paska wyszukiwania
  const toggleExpandBar = document.getElementById('toggle-expand-bar')
  let _expandBarRaf = null

  function applyExpandBar(enabled, save = true, instant = false) {
    window.expandBarEnabled = enabled
    toggleExpandBar.checked = enabled
    document.getElementById('navbar').classList.toggle('bar-compact', !enabled)

    if (_expandBarRaf) { cancelAnimationFrame(_expandBarRaf); _expandBarRaf = null }

    const shouldExpand = enabled

    if (instant) {
      // Bez animacji — wyłącz transition na jeden frame
      urlWrap.style.transition = 'none'
      urlWrap.classList.toggle('bar-expanded', shouldExpand)
      urlWrap.getBoundingClientRect() // wymuś reflow
      urlWrap.style.transition = ''
    } else {
      urlWrap.classList.toggle('bar-expanded', shouldExpand)
    }

    if (save) saveAllSettings()
  }

  toggleExpandBar.addEventListener('change', () => {
    applyExpandBar(toggleExpandBar.checked)
  })

  // Sugestie historii — włącz/wyłącz
  let historySuggestionsEnabled = true
  const toggleHistorySuggestions = document.getElementById('toggle-history-suggestions')

  function applyHistorySuggestions(enabled, save = true) {
    historySuggestionsEnabled = enabled
    toggleHistorySuggestions.checked = enabled
    if (!enabled) closeSuggestions()
    if (save) saveAllSettings()
  }

  toggleHistorySuggestions.addEventListener('change', () => {
    applyHistorySuggestions(toggleHistorySuggestions.checked)
  })

  // Sugestie zakładek — włącz/wyłącz
  let bookmarkSuggestionsEnabled = true
  const toggleBookmarkSuggestions = document.getElementById('toggle-bookmark-suggestions')

  function applyBookmarkSuggestions(enabled, save = true) {
    bookmarkSuggestionsEnabled = enabled
    toggleBookmarkSuggestions.checked = enabled
    if (!enabled) closeSuggestions()
    if (save) saveAllSettings()
  }

  toggleBookmarkSuggestions.addEventListener('change', () => {
    applyBookmarkSuggestions(toggleBookmarkSuggestions.checked)
  })

  // Sugestie w trybie prywatnym — all / history / bookmarks / none
  let privateSuggestionsMode = 'all'
  const selectPrivateSuggestions = document.getElementById('select-private-suggestions')
  const privSugBtns = selectPrivateSuggestions.querySelectorAll('.seg-btn')

  function applyPrivateSuggestionsMode(mode, save = true) {
    privateSuggestionsMode = mode
    privSugBtns.forEach(b => b.classList.toggle('active', b.dataset.value === mode))
    if (save) saveAllSettings()
  }
  privSugBtns.forEach(b => b.addEventListener('click', () => applyPrivateSuggestionsMode(b.dataset.value)))

  // QR Prześlij na urządzenie — włącz/wyłącz
  const qrToggleShow = document.getElementById('qr-toggle-show')
  const qrDivider = document.getElementById('qr-divider')
  const qrToggleDisableYtTime = document.getElementById('qr-toggle-disable-yt-time')

  function applyQrShowInBar(enabled, save = true) {
    qrToggleShow.checked = enabled
    if (enabled) {
      qrBtn.classList.remove('hidden')
      qrDivider.classList.remove('hidden')
    } else {
      qrBtn.classList.add('hidden')
      qrDivider.classList.add('hidden')
    }
    if (save) saveAllSettings()
  }

  qrToggleShow.addEventListener('change', () => {
    applyQrShowInBar(qrToggleShow.checked)
  })

  qrToggleDisableYtTime.addEventListener('change', () => {
    saveAllSettings()
  })

  // Śledzenie kliknięć zakładek — klucz: url, wartość: liczba kliknięć
  const BK_CLICKS_KEY = 'nitrix_bk_clicks'
  let _bkClicks = {}
  try { _bkClicks = JSON.parse(localStorage.getItem(BK_CLICKS_KEY) || '{}') } catch { _bkClicks = {} }

  function trackBookmarkClick(url) {
    _bkClicks[url] = (_bkClicks[url] || 0) + 1
    try { localStorage.setItem(BK_CLICKS_KEY, JSON.stringify(_bkClicks)) } catch {}
  }

  function getBookmarkScore(url) {
    return _bkClicks[url] || 0
  }

  // Pasek zakładek — tryb widoczności
  let bkBarMode = 'always'
  const selectBkBarMode = document.getElementById('select-bkbar-mode')
  const segBtns = selectBkBarMode.querySelectorAll('.seg-btn')

  function applyBkBarMode(mode, save = true) {
    bkBarMode = mode
    segBtns.forEach(b => b.classList.toggle('active', b.dataset.value === mode))
    updateBkBarVisibility()
    if (save) saveAllSettings()
  }

  function updateBkBarVisibility() {
    const tab = getActiveTab()
    const url = tab ? tab.url : ''
    if (bkBarMode === 'never') {
      bkBar.classList.add('bk-hidden')
    } else if (bkBarMode === 'newtab') {
      bkBar.classList.toggle('bk-hidden', !isHomePage(url))
    } else {
      bkBar.classList.remove('bk-hidden')
    }
  }

  segBtns.forEach(b => b.addEventListener('click', () => applyBkBarMode(b.dataset.value)))

   const initialSettingsReady = window.electronAPI.loadSettings().then(s => {
     persistedTheme = s.theme || 'dark'
     backdropContrast = s.backdropContrast === true
     applyAeroBlur(s.aeroBlur ?? 75, false)
     applyTopAero(s.aeroTopOpacity ?? s.aeroBlur ?? 75)
     applyAeroAreas(s.aeroAreas, s.aeroScope)
     applyTheme(isPrivate ? 'private' : persistedTheme, false)
     applyBlockLocalIp(s.blockLocalIp !== false, false)
     applyExpandBar(s.expandBar !== false, false, true)
     applyBkBarMode(s.bkBarMode || 'always', false)
     applySearchEngine(s.searchEngine || 'google', false)
     customHomepageUrl = s.customHomepageUrl || ''
     applyHomepage(s.homepage || 'google', s.homepageUrl || 'https://www.google.pl', false)
     applyHistorySuggestions(s.historySuggestions !== false, false)
     applyBookmarkSuggestions(s.bookmarkSuggestions !== false, false)
     applyPrivateSuggestionsMode(s.privateSuggestionsMode || 'all', false)
     applyQrShowInBar(s.qrShowInBar !== false, false)
     if (qrToggleDisableYtTime) qrToggleDisableYtTime.checked = s.qrDisableYtTime === true
     _lastOpenedUrl = s.lastOpenedUrl || ''
     startupBookmarks = Array.isArray(s.startupBookmarks) ? s.startupBookmarks : []
     applyStartupBehavior(s.startupBehavior || 'homepage', s.startupCustomUrl || '', false)
     // Załaduj ustawienia adblockera po głównych ustawieniach
     initAdblockSettings()
   }).catch(() => {
     persistedTheme = 'dark'
     applyAeroBlur(75, false)
     applyTheme(isPrivate ? 'private' : 'dark', false)
     applyBlockLocalIp(true, false)
     applyExpandBar(true, false, true)
     applyBkBarMode('always', false)
     applySearchEngine('google', false)
     applyHomepage('google', 'https://www.google.pl', false)
     applyHistorySuggestions(true, false)
     applyBookmarkSuggestions(true, false)
     applyPrivateSuggestionsMode('all', false)
     // Załaduj ustawienia adblockera po głównych ustawieniach
     initAdblockSettings()
   })

  // Zakładki
  let bookmarks = []
  const bkBar       = document.getElementById('bookmarks-bar')
  const bkAddBtn    = document.getElementById('bk-add-btn')
  const bkOverlay   = document.getElementById('bk-modal-overlay')
  const bkNameInput = document.getElementById('bk-name-input')
  const bkUrlInput  = document.getElementById('bk-url-input')
  let bkEditIndex   = -1   // -1 = nowa zakładka, >=0 = edycja

  function getFavicon(url) {
    return _getCachedFavicon(url) || ''
  }

  function openBkModal(idx = -1) {
    bkEditIndex = idx
    const modal = bkOverlay.querySelector('h3') || bkOverlay
    const heading = bkOverlay.querySelector('h3')
    if (idx === -1) {
      if (heading) heading.textContent = t('add_bookmark')
      // Pobierz URL i tytuł z aktywnej karty — nie z pola adresu (które może być puste lub skrócone)
      const activeTab = typeof getActiveTab === 'function' ? getActiveTab() : null
      const tabUrl    = activeTab && activeTab.url && !/^about:|^nitrix:/i.test(activeTab.url)
                          ? activeTab.url : ''
      const tabTitle  = activeTab && activeTab.titleEl && activeTab.titleEl.textContent
                          ? activeTab.titleEl.textContent.replace(' — Nitrix', '').trim() : ''
      bkUrlInput.value  = tabUrl  || urlInput.value || 'https://'
      bkNameInput.value = tabTitle || document.title.replace(' — Nitrix', '').trim()
    } else {
      const bk = bookmarks[idx]
      if (heading) heading.textContent = t('edit_bookmark')
      bkNameInput.value = bk.name
      bkUrlInput.value  = bk.url
    }
    bkOverlay.classList.add('open')
    setTimeout(() => bkNameInput.focus(), 50)
  }

  function renderBookmarks() {
    document.querySelectorAll('.bk-item').forEach(el => el.remove())
    const MAX_BAR = 11
    bookmarks.slice(0, MAX_BAR).forEach((bk, idx) => {
      const btn = document.createElement('button')
      btn.className = 'bk-item'
      btn.title = bk.url
      btn.innerHTML = `
        <img src="${getFavicon(bk.url)}" alt="">
        <span class="bk-name">${escHtml(bk.name)}</span>
        <span class="bk-delete" data-idx="${idx}" title="${t('bk_delete_title')}">×</span>
      `
      btn.addEventListener('click', e => {
        if (e.target.classList.contains('bk-delete')) {
          e.stopPropagation()
          bookmarks.splice(idx, 1)
          if (!isPrivate) window.electronAPI.saveBookmarks(bookmarks)
          renderBookmarks()
          renderBkAllList()
          return
        }
        navigate(bk.url)
        trackBookmarkClick(bk.url)
      })
      btn.addEventListener('contextmenu', e => {
        e.preventDefault()
        e.stopPropagation()
        showCtxMenu(e.clientX, e.clientY, 'bookmark', idx)
      })
      bkBar.insertBefore(btn, bkAddBtn)
    })
    // Ukryj przycisk dodawania gdy pasek jest pełny — import też to obejmuje
    const barFull = bookmarks.length >= MAX_BAR
    bkAddBtn.style.display = barFull ? 'none' : ''
  }

  // ── "Wszystkie Zakładki" modal ──────────────────────────────────────
  const bkAllOverlay   = document.getElementById('bk-all-overlay')
  const bkAllList      = document.getElementById('bk-all-list')
  const bkAllEmpty     = document.getElementById('bk-all-empty')
  const bkAllSearch    = document.getElementById('bk-all-search')
  const bkAllBtn       = document.getElementById('bk-all-btn')
  const bkAllClose     = document.getElementById('bk-all-close')
  const bkAllAddBtn    = document.getElementById('bk-all-add-btn')

  const bkAllDragHint  = document.getElementById('bk-all-drag-hint')
  let bkDragSrcIdx = null   // realny idx w bookmarks[] przeciąganego elementu

  function renderBkAllList() {
    const query = (bkAllSearch ? bkAllSearch.value.trim().toLowerCase() : '')
    const isFiltered = query.length > 0
    const MAX_BAR = 11

    // hint o wyłączonym drag podczas wyszukiwania
    if (bkAllDragHint) bkAllDragHint.classList.toggle('visible', isFiltered)
    bkAllList.classList.toggle('is-searching', isFiltered)

    const filtered = bookmarks
      .map((bk, idx) => ({ bk, idx }))
      .filter(({ bk }) => !isFiltered || bk.name.toLowerCase().includes(query) || bk.url.toLowerCase().includes(query))

    bkAllList.innerHTML = ''
    bkAllEmpty.classList.toggle('visible', filtered.length === 0)

    filtered.forEach(({ bk, idx }) => {
      // ── Normal row ────────────────────────────────────────────────
      const onBar = idx < MAX_BAR
      const row = document.createElement('div')
      row.className = 'bkall-item'
      row.dataset.realIdx = idx
      row.draggable = !isFiltered   // drag tylko gdy nie ma filtra

      const badgeHtml = onBar
        ? `<span class="bkall-bar-badge" title="Widoczna na pasku">${t('bk_bar_badge') || 'pasek'}</span>`
        : ''

      row.innerHTML = `
        <span class="bkall-drag-handle" title="Przeciągnij, aby zmienić kolejność">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="19" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="19" r="1" fill="currentColor" stroke="none"/></svg>
        </span>
        <img src="${getFavicon(bk.url)}" alt="">
        <button class="bkall-open-btn" title="${escHtml(bk.url)}">
          <div class="bkall-item-info">
            <div class="bkall-item-name"><span class="bkall-item-name-text">${escHtml(bk.name)}</span>${badgeHtml}</div>
            <div class="bkall-item-url">${escHtml(bk.url)}</div>
          </div>
        </button>
        <div class="bkall-item-actions">
          <button class="bkall-action edit" title="${t('edit_bookmark') || 'Edytuj'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="bkall-action danger delete" title="${t('delete_bookmark') || 'Usuń'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      `

      // ── klik otwiera URL ──
      row.querySelector('.bkall-open-btn').addEventListener('click', () => {
        navigate(bk.url)
        trackBookmarkClick(bk.url)
        bkAllOverlay.classList.remove('open')
      })

      // ── edytuj — otwiera wspólny modal zakładki, bkAllOverlay zostaje ──
      row.querySelector('.edit').addEventListener('click', e => {
        e.stopPropagation()
        openBkModal(idx)
      })

      // ── usuń ──
      row.querySelector('.delete').addEventListener('click', e => {
        e.stopPropagation()
        bookmarks.splice(idx, 1)
        if (!isPrivate) window.electronAPI.saveBookmarks(bookmarks)
        renderBookmarks()
        renderBkAllList()
      })

      // ── DRAG & DROP (tylko gdy brak filtra) ──
      if (!isFiltered) {
        row.addEventListener('dragstart', e => {
          bkDragSrcIdx = idx
          row.classList.add('dragging')
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', String(idx))
        })

        row.addEventListener('dragend', () => {
          bkDragSrcIdx = null
          document.querySelectorAll('.bkall-item').forEach(r => {
            r.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom')
            })
          })

          row.addEventListener('dragover', e => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
            if (bkDragSrcIdx === null || bkDragSrcIdx === idx) return
            const rect = row.getBoundingClientRect()
            const mid  = rect.top + rect.height / 2
            document.querySelectorAll('.bkall-item').forEach(r => r.classList.remove('drag-over-top', 'drag-over-bottom'))
            row.classList.add(e.clientY < mid ? 'drag-over-top' : 'drag-over-bottom')
          })

          row.addEventListener('dragleave', () => {
            row.classList.remove('drag-over-top', 'drag-over-bottom')
          })

          row.addEventListener('drop', e => {
            e.preventDefault()
            row.classList.remove('drag-over-top', 'drag-over-bottom')
            if (bkDragSrcIdx === null || bkDragSrcIdx === idx) return

            // ustal pozycję docelową (przed lub po)
            const rect = row.getBoundingClientRect()
            const mid  = rect.top + rect.height / 2
            let targetIdx = e.clientY < mid ? idx : idx + 1

            // wytnij element źródłowy
            const [moved] = bookmarks.splice(bkDragSrcIdx, 1)
            // skoryguj targetIdx jeśli src był przed target
            if (bkDragSrcIdx < targetIdx) targetIdx--
            bookmarks.splice(targetIdx, 0, moved)

            if (!isPrivate) window.electronAPI.saveBookmarks(bookmarks)
            renderBookmarks()
            bkDragSrcIdx = null
            renderBkAllList()
          })
        }

        bkAllList.appendChild(row)
    })
  }

  bkAllBtn.addEventListener('click', e => {
    e.stopPropagation()
    bkAllSearch.value = ''
    renderBkAllList()
    bkAllOverlay.classList.add('open')
  })
  bkAllClose.addEventListener('click', () => bkAllOverlay.classList.remove('open'))
  bkAllOverlay.addEventListener('click', e => { if (e.target === bkAllOverlay) bkAllOverlay.classList.remove('open') })
  bkAllSearch.addEventListener('input', () => renderBkAllList())
  bkAllAddBtn.addEventListener('click', e => {
    e.stopPropagation()
    openBkModal(-1)  // bkAllOverlay zostaje otwarty pod spodem
  })

  bkAddBtn.addEventListener('click', e => {
    e.stopPropagation()
    openBkModal(-1)
  })
  document.getElementById('bk-cancel').addEventListener('click', () => bkOverlay.classList.remove('open'))
  bkOverlay.addEventListener('click', e => { if (e.target === bkOverlay) bkOverlay.classList.remove('open') })
  document.getElementById('bk-save').addEventListener('click', () => {
    const name = bkNameInput.value.trim()
    let   url  = bkUrlInput.value.trim()
    if (!name || !url) return
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url
    if (bkEditIndex === -1) {
      bookmarks.push({ name, url })
    } else {
      bookmarks[bkEditIndex] = { name, url }
    }
    if (!isPrivate) window.electronAPI.saveBookmarks(bookmarks)  // prywatny = tylko pamięć
    renderBookmarks()
    if (typeof renderBkAllList === 'function') renderBkAllList()
    bkOverlay.classList.remove('open')
  })
  bkUrlInput.addEventListener('keydown',  e => { if (e.key === 'Enter') document.getElementById('bk-save').click() })
  bkNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('bk-save').click() })
  window.electronAPI.loadBookmarks().then(data => {
    bookmarks = Array.isArray(data) ? data : []
    preloadFavicons(bookmarks.map(b => b.url), 0)
    renderBookmarks()
    if (startupBehavior === 'bookmarks') {
      updateSbkCountBadge()
      if (typeof window._renderSbkList === 'function') {
        const searchIn = document.getElementById('sbk-search')
        window._renderSbkList(searchIn ? searchIn.value : '')
      }
    }
  }).catch(() => { bookmarks = []; renderBookmarks() })

  // Eager preload favicon historii — od razu po starcie, ale z limitowaną kolejką
  window.electronAPI.loadHistory().then(all => {
    if (Array.isArray(all)) preloadFavicons(all.slice(0, 150).map(h => h.url), 0)
  }).catch(() => {})

  // ══════════════════════════════════════════════════════════════════
  //  HISTORIA PRZEGLĄDANIA
  // ══════════════════════════════════════════════════════════════════
  const historyOverlay  = document.getElementById('history-overlay')
  const historyList     = document.getElementById('history-list')
  const historySearch   = document.getElementById('history-search')
  const historyEmpty    = document.getElementById('history-empty')
  const historyClearBtn = document.getElementById('history-clear-btn')
  const historyCloseBtn = document.getElementById('history-close-btn')

  let historyData = []

  function closeHistoryOverlay() {
    historyOverlay.classList.remove('open')
    setTimeout(() => { urlInput.focus(); urlInput.select() }, 60)
  }

  function formatHistoryTime(timestamp) {
    const d = new Date(timestamp)
    return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
  }

  function formatHistoryDayLabel(timestamp) {
    const d = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return t('day_today')
    if (d.toDateString() === yesterday.toDateString()) return t('day_yesterday')
    const locale = _currentLang === 'en' ? 'en-GB' : 'pl-PL'
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  function renderHistory(filter = '') {
    Array.from(historyList.children).forEach(el => {
      if (el.id !== 'history-empty') el.remove()
    })
    const q = filter.trim().toLowerCase()
    const filtered = q
      ? historyData.filter(h => h.title.toLowerCase().includes(q) || h.url.toLowerCase().includes(q))
      : historyData

    if (filtered.length === 0) {
      historyEmpty.style.display = 'flex'
      if (q) {
        historyEmpty.innerHTML = ''
        historyEmpty.textContent = `${t('no_results_for')} "${filter}"`
      } else {
        historyEmpty.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          ${t('no_history')}`
      }
      return
    }
    historyEmpty.style.display = 'none'

    let lastDay = null
    filtered.forEach(entry => {
      const dayLabel = formatHistoryDayLabel(entry.timestamp)
      if (dayLabel !== lastDay) {
        lastDay = dayLabel
        const label = document.createElement('div')
        label.className = 'history-day-label'
        label.textContent = dayLabel
        historyList.appendChild(label)
      }
      const item = document.createElement('div')
      item.className = 'history-item'

      const favicon = document.createElement('img')
      favicon.className = 'history-favicon'
      try { favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(entry.url).hostname}&sz=32` }
      catch { favicon.style.display = 'none' }
      favicon.onerror = () => { favicon.style.display = 'none' }

      const info = document.createElement('div')
      info.className = 'history-info'
      const titleDiv = document.createElement('div')
      titleDiv.className = 'history-title'
      titleDiv.textContent = entry.title || entry.url
      const urlDiv = document.createElement('div')
      urlDiv.className = 'history-url'
      urlDiv.textContent = entry.url
      info.appendChild(titleDiv)
      info.appendChild(urlDiv)
      const time = document.createElement('div')
      time.className = 'history-time'
      time.textContent = formatHistoryTime(entry.timestamp)

      const delBtn = document.createElement('button')
      delBtn.className = 'history-delete'
      delBtn.title = t('delete_from_history')
      delBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M9 6V4h6v2"/>
      </svg>`
      delBtn.addEventListener('click', async e => {
        e.stopPropagation()
        await window.electronAPI.deleteHistory(entry.timestamp)
        historyData = historyData.filter(h => h.timestamp !== entry.timestamp)
        renderHistory(historySearch.value)
      })

      item.append(favicon, info, time, delBtn)
      item.addEventListener('click', () => { navigate(entry.url); closeHistoryOverlay() })
      historyList.appendChild(item)
    })
  }

  function openHistory() {
    dropdown.classList.remove('open')
    // Pokaż/ukryj komunikat trybu prywatnego
    const notice = document.getElementById('history-private-notice')
    if (notice) notice.classList.toggle('visible', isPrivate)
    window.electronAPI.loadHistory().then(data => {
      historyData = Array.isArray(data) ? data : []
      preloadFavicons(historyData.slice(0, 200).map(h => h.url), 0)
      historySearch.value = ''
      renderHistory()
      historyOverlay.classList.add('open')
      // Przywróć aktywną zakładkę sidebar do przeglądania
      document.querySelectorAll('.history-sidebar-item').forEach(i => i.classList.remove('active'))
      document.querySelectorAll('.history-section').forEach(s => s.classList.remove('active'))
      document.querySelector('.history-sidebar-item[data-hsection="browsing"]').classList.add('active')
      document.getElementById('history-section-browsing').classList.add('active')
      setTimeout(() => { historySearch.focus(); historySearch.click() }, 150)
      setTimeout(() => historySearch.focus(), 300)
    })
  }

  document.getElementById('dd-history').addEventListener('click', e => { e.stopPropagation(); openHistory() })
  historyCloseBtn.addEventListener('click', () => closeHistoryOverlay())
  historyOverlay.addEventListener('click', e => { if (e.target === historyOverlay) closeHistoryOverlay() })
  historySearch.addEventListener('input', () => renderHistory(historySearch.value))
  historySearch.addEventListener('keydown', e => {
    e.stopPropagation()
    if (e.key === 'Escape') closeHistoryOverlay()
  })
  historySearch.addEventListener('keyup',    e => e.stopPropagation())
  historySearch.addEventListener('keypress', e => e.stopPropagation())
  historySearch.addEventListener('mousedown',e => e.stopPropagation())
  historySearch.addEventListener('click',    e => { e.stopPropagation(); historySearch.focus() })

  historyClearBtn.addEventListener('click', async () => {
    const confirmed = await new Promise(resolve => {
      const overlay = document.createElement('div')
      overlay.style.cssText = `position:absolute;inset:0;z-index:100;background:rgba(0,0,0,.55);border-radius:16px;display:flex;align-items:center;justify-content:center;`
      const box = document.createElement('div')
      box.style.cssText = `background:var(--settings-bg);border:1px solid var(--border);border-radius:12px;padding:24px 28px;width:320px;box-shadow:0 8px 32px rgba(0,0,0,.4);text-align:center;`
      box.innerHTML = `
        <div style="font-size:15px;font-weight:600;margin-bottom:8px;color:var(--text)">${t('confirm_clear_history')}</div>
        <div style="font-size:13px;color:var(--text-dim);margin-bottom:20px">${t('irreversible')}</div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button id="_hc_cancel" style="padding:8px 20px;border-radius:8px;border:none;background:var(--hover);color:var(--text);font-size:14px;font-family:inherit;cursor:pointer">${t('cancel')}</button>
          <button id="_hc_ok"     style="padding:8px 20px;border-radius:8px;border:none;background:#c42b1c;color:#fff;font-size:14px;font-family:inherit;cursor:pointer">${t('clear')}</button>
        </div>`
      overlay.appendChild(box)
      const panel = document.getElementById('history-section-browsing')
      panel.style.position = 'relative'
      panel.appendChild(overlay)
      box.querySelector('#_hc_cancel').onclick = () => { overlay.remove(); resolve(false) }
      box.querySelector('#_hc_ok').onclick     = () => { overlay.remove(); resolve(true)  }
      overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); resolve(false) } })
    })
    if (!confirmed) return
    await window.electronAPI.clearHistory()
    historyData = []
    renderHistory()
    closeHistoryOverlay()
  })

  // ══════════════════════════════════════════════════════════════════
  //  HISTORIA POBIERANIA — renderowanie
  // ══════════════════════════════════════════════════════════════════
  const dlHistoryList      = document.getElementById('dl-history-list')
  const dlHistorySearch    = document.getElementById('dl-history-search')
  const dlHistoryEmpty     = document.getElementById('dl-history-empty')
  const dlHistoryClearBtn  = document.getElementById('dl-history-clear-btn')
  const dlHistoryCloseBtn  = document.getElementById('dl-history-close-btn')

  function getDlStateIcon(state) {
    if (state === 'completed') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
  }

  // ── Helpers stanu pliku w historii pobierania ──────────────────────
  function markHistoryItemMissing(item, icon, metaEl, folderBtn, badge, stateLabel) {
    if (item.classList.contains('file-missing')) return
    item.classList.remove('clickable')
    item.classList.add('file-missing')
    item.title = t('dl_file_missing_title')
    icon.className = 'dl-history-icon missing'
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`
    metaEl.textContent = t('dl_file_moved')
    metaEl.classList.add('missing')
    if (folderBtn) folderBtn.style.display = 'none'
    if (badge) badge.style.display = ''
  }

  function markHistoryItemRestored(item, icon, metaEl, folderBtn, badge, stateLabel, iconHtml) {
    if (!item.classList.contains('file-missing')) return
    item.classList.add('clickable')
    item.classList.remove('file-missing')
    item.title = t('dl_click_open')
    icon.className = 'dl-history-icon done'
    icon.innerHTML = iconHtml
    metaEl.textContent = stateLabel
    metaEl.classList.remove('missing')
    if (folderBtn) folderBtn.style.display = ''
    if (badge) badge.style.display = 'none'
  }

  function renderDlHistory(filter = '') {
    Array.from(dlHistoryList.children).forEach(el => {
      if (el.id !== 'dl-history-empty') el.remove()
    })

    // ── Sekcja aktywnych pobierań na górze ──────────────────────────
    const activeEntries = [...dlItems.entries()].filter(([, e]) =>
      e.state === 'progressing' || e.state === 'network-error' || e.dlState === 'paused'
    )
    if (activeEntries.length > 0) {
      const sectionLabel = document.createElement('div')
      sectionLabel.className = 'dl-active-section-label'
      sectionLabel.textContent = t('dl_active_section')
      dlHistoryList.appendChild(sectionLabel)

      activeEntries.forEach(([dlId, entry]) => {
        const item = document.createElement('div')
        item.className = 'dl-active-history-item'
        item.dataset.dlId = dlId

        const isNetErr  = entry.state === 'network-error'
        const isPaused  = entry.dlState === 'paused'

        // ── Ikona ──
        const icon = document.createElement('div')
        icon.className = 'dl-history-icon'
        icon.innerHTML = getDlIcon('progressing')

        // ── Info ──
        const info = document.createElement('div')
        info.className = 'dl-history-info'
        info.style.cssText = 'flex:1;min-width:0'

        const nameEl = document.createElement('div')
        nameEl.className = 'dl-history-name'
        nameEl.title = entry.filename
        nameEl.textContent = entry.filename

        const metaEl = document.createElement('div')
        metaEl.className = 'dl-history-meta'
        metaEl.textContent = isNetErr ? '' : (entry.metaEl ? entry.metaEl.textContent : t('dl_starting'))

        const progressWrap = document.createElement('div')
        progressWrap.className = 'dl-active-history-progress'
        const bar = document.createElement('div')
        bar.className = 'dl-active-history-bar' +
          (entry.totalBytes <= 0 ? ' indeterminate' : '') +
          (isPaused || isNetErr ? ' paused-bar' : '')
        if (entry.totalBytes > 0 && entry.barEl) bar.style.width = entry.barEl.style.width || '0%'
        progressWrap.appendChild(bar)

        // ── Baner utraty sieci ──
        const netErr = document.createElement('div')
        netErr.className = 'dl-network-error'
        netErr.style.display = isNetErr ? '' : 'none'
        netErr.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;flex-shrink:0">
            <line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
          </svg>
          <span>${t('dl_net_error')}</span>
          <button class="dl-net-retry-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;pointer-events:none">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            ${t('dl_net_retry')}
          </button>`

        info.append(nameEl, metaEl, progressWrap, netErr)

        // ── Przyciski kontroli ──
        const ctrlDiv = document.createElement('div')
        ctrlDiv.className = 'dl-ctrl-btns'

        const pauseBtn = document.createElement('button')
        pauseBtn.className = 'dl-ctrl-btn pause-btn'
        pauseBtn.title = t('dl_pause_title')
        pauseBtn.style.display = (isPaused || isNetErr) ? 'none' : ''
        pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`

        const resumeBtn = document.createElement('button')
        resumeBtn.className = 'dl-ctrl-btn resume-btn'
        resumeBtn.title = t('dl_resume_title')
        resumeBtn.style.display = (isPaused || isNetErr) ? '' : 'none'
        resumeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`

        const cancelBtn = document.createElement('button')
        cancelBtn.className = 'dl-ctrl-btn cancel-btn'
        cancelBtn.title = t('dl_cancel_title')
        cancelBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`

        ctrlDiv.append(pauseBtn, resumeBtn, cancelBtn)
        item.append(icon, info, ctrlDiv)
        dlHistoryList.appendChild(item)

        // ── Eventy ──
        pauseBtn.addEventListener('click', e => {
          e.stopPropagation()
          pauseBtn.style.display  = 'none'
          resumeBtn.style.display = ''
          bar.classList.add('paused-bar')
          metaEl.textContent = t('dl_paused')
          window.electronAPI.downloadPause(dlId)
        })

        resumeBtn.addEventListener('click', e => {
          e.stopPropagation()
          if (!window.electronAPI.isOnline()) return
          pauseBtn.style.display  = ''
          resumeBtn.style.display = 'none'
          bar.classList.remove('paused-bar')
          netErr.style.display = 'none'
          metaEl.textContent = t('dl_resumed')
          window.electronAPI.downloadResume(dlId)
        })

        netErr.querySelector('.dl-net-retry-btn').addEventListener('click', e => {
          e.stopPropagation()
          if (!window.electronAPI.isOnline()) return
          netErr.style.display = 'none'
          pauseBtn.style.display  = ''
          resumeBtn.style.display = 'none'
          bar.classList.remove('paused-bar')
          metaEl.textContent = t('dl_resumed')
          window.electronAPI.downloadResume(dlId)
        })

        cancelBtn.addEventListener('click', e => {
          e.stopPropagation()
          const existing = item.querySelector('.dl-cancel-confirm')
          if (existing) { existing.remove(); return }
          const confirm = document.createElement('div')
          confirm.className = 'dl-cancel-confirm'
          confirm.innerHTML = `<span>${t('dl_cancel_confirm')}</span>
            <button class="dl-cancel-confirm-yes">${t('dl_cancel_yes')}</button>
            <button class="dl-cancel-confirm-no">${t('dl_cancel_no')}</button>`
          item.appendChild(confirm)
          confirm.querySelector('.dl-cancel-confirm-yes').addEventListener('click', ev => {
            ev.stopPropagation(); window.electronAPI.downloadCancel(dlId)
          })
          confirm.querySelector('.dl-cancel-confirm-no').addEventListener('click', ev => {
            ev.stopPropagation(); confirm.remove()
          })
        })
      })

      const sep = document.createElement('div')
      sep.className = 'dl-history-section-sep'
      dlHistoryList.appendChild(sep)
    }

    const q = filter.trim().toLowerCase()
    const filtered = q
      ? dlHistoryData.filter(d => d.filename.toLowerCase().includes(q))
      : dlHistoryData

    if (filtered.length === 0) {
      dlHistoryEmpty.style.display = 'flex'
      if (q) {
        dlHistoryEmpty.textContent = `${t('no_results_for')} "${filter}"`
      } else {
        dlHistoryEmpty.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          ${t('no_downloads')}`
      }
      return
    }
    dlHistoryEmpty.style.display = 'none'

    let lastDay = null
    filtered.forEach((entry, idx) => {
      const dayLabel = formatHistoryDayLabel(entry.timestamp)
      if (dayLabel !== lastDay) {
        lastDay = dayLabel
        const label = document.createElement('div')
        label.className = 'history-day-label'
        label.textContent = dayLabel
        dlHistoryList.appendChild(label)
      }

      const item = document.createElement('div')
      const isCompleted = entry.state === 'completed'
      item.className = 'dl-history-item' + (isCompleted ? ' clickable' : '')
      if (isCompleted && entry.savePath) {
        item.title = t('dl_click_open')
        item.addEventListener('click', e => {
          if (e.target.closest('.dl-history-delete')) return
          if (e.target.closest('.dl-history-folder-btn')) return
          if (item.classList.contains('file-missing')) return
          window.electronAPI.openFile(entry.savePath)
        })
        // Sprawdź asynchronicznie czy plik istnieje i dostosuj UI
        window.electronAPI.fileExists(entry.savePath).then(({ exists }) => {
          if (!exists) {
            markHistoryItemMissing(item, icon, metaEl, folderBtn, missingBadge, stateLabel)
          } else {
            markHistoryItemRestored(item, icon, metaEl, folderBtn, missingBadge, stateLabel, getDlStateIcon(entry.state))
          }
        }).catch(() => {})
      }

      const icon = document.createElement('div')
      icon.className = 'dl-history-icon ' + (isCompleted ? 'done' : 'error')
      icon.innerHTML = getDlStateIcon(entry.state)

      const info = document.createElement('div')
      info.className = 'dl-history-info'
      const stateLabel = isCompleted
        ? `${t('dl_done')} · ${formatBytes(entry.totalBytes)}`
        : (entry.state === 'cancelled' ? t('dl_cancelled') : t('dl_error'))
      const metaEl = document.createElement('div')
      const nameEl = document.createElement('div')
      nameEl.className = 'dl-history-name'
      nameEl.title = entry.filename
      nameEl.textContent = entry.filename
      metaEl.className = 'dl-history-meta'
      metaEl.textContent = stateLabel + (entry.savePath && !isCompleted ? '' : entry.savePath ? ' · ' + entry.savePath : '')
      info.append(nameEl, metaEl)

      const time = document.createElement('div')
      time.className = 'dl-history-time'
      time.textContent = formatHistoryTime(entry.timestamp)

      // Znaczek "plik usunięty" — domyślnie ukryty
      const missingBadge = document.createElement('span')
      missingBadge.className = 'dl-history-missing-badge'
      missingBadge.textContent = t('file_missing')
      missingBadge.style.display = 'none'

      // Przycisk "pokaż w folderze" — dla ukończonych plików
      const folderBtn = document.createElement('button')
      folderBtn.className = 'dl-history-folder-btn'
      folderBtn.title = t('show_in_folder')
      folderBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>`
      if (isCompleted && entry.savePath) {
        folderBtn.addEventListener('click', e => {
          e.stopPropagation()
          window.electronAPI.showInFolder(entry.savePath)
        })
        // Cykliczne sprawdzanie pliku co 3s póki historia jest otwarta
        const recheckInterval = setInterval(() => {
          if (!historyOverlay.classList.contains('open') || !document.contains(item)) {
            clearInterval(recheckInterval)
            return
          }
          window.electronAPI.fileExists(entry.savePath).then(({ exists }) => {
            if (!exists) markHistoryItemMissing(item, icon, metaEl, folderBtn, missingBadge, stateLabel)
            else         markHistoryItemRestored(item, icon, metaEl, folderBtn, missingBadge, stateLabel, getDlStateIcon(entry.state))
          }).catch(() => {})
        }, 3000)
      } else {
        folderBtn.style.display = 'none'
      }

      const delBtn = document.createElement('button')
      delBtn.className = 'dl-history-delete'
      delBtn.title = t('delete_from_history')
      delBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M9 6V4h6v2"/>
      </svg>`
      delBtn.addEventListener('click', e => {
        e.stopPropagation()
        const realIdx = dlHistoryData.findIndex(d => d.timestamp === entry.timestamp && d.filename === entry.filename)
        if (realIdx !== -1) dlHistoryData.splice(realIdx, 1)
        saveDlHistory()
        renderDlHistory(dlHistorySearch.value)
      })

      item.append(icon, info, time, missingBadge, folderBtn, delBtn)
      dlHistoryList.appendChild(item)
    })
  }

  // Historia pobierania — sidebar switcher
  document.querySelectorAll('.history-sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.history-sidebar-item').forEach(i => i.classList.remove('active'))
      document.querySelectorAll('.history-section').forEach(s => s.classList.remove('active'))
      item.classList.add('active')
      const section = item.dataset.hsection
      document.getElementById('history-section-' + section).classList.add('active')
      if (section === 'downloads') {
        renderDlHistory(dlHistorySearch.value)
        setTimeout(() => { dlHistorySearch.focus() }, 100)
      } else {
        setTimeout(() => { historySearch.focus() }, 100)
      }
    })
  })

  dlHistorySearch.addEventListener('input', () => renderDlHistory(dlHistorySearch.value))
  dlHistorySearch.addEventListener('keydown', e => {
    e.stopPropagation()
    if (e.key === 'Escape') closeHistoryOverlay()
  })
  dlHistorySearch.addEventListener('keyup',    e => e.stopPropagation())
  dlHistorySearch.addEventListener('keypress', e => e.stopPropagation())
  dlHistorySearch.addEventListener('mousedown',e => e.stopPropagation())
  dlHistorySearch.addEventListener('click',    e => { e.stopPropagation(); dlHistorySearch.focus() })

  dlHistoryCloseBtn.addEventListener('click', () => closeHistoryOverlay())

  dlHistoryClearBtn.addEventListener('click', async () => {
    const confirmed = await new Promise(resolve => {
      const overlay = document.createElement('div')
      overlay.style.cssText = `position:absolute;inset:0;z-index:100;background:rgba(0,0,0,.55);border-radius:16px;display:flex;align-items:center;justify-content:center;`
      const box = document.createElement('div')
      box.style.cssText = `background:var(--settings-bg);border:1px solid var(--border);border-radius:12px;padding:24px 28px;width:320px;box-shadow:0 8px 32px rgba(0,0,0,.4);text-align:center;`
      box.innerHTML = `
        <div style="font-size:15px;font-weight:600;margin-bottom:8px;color:var(--text)">${t('confirm_clear_dl')}</div>
        <div style="font-size:13px;color:var(--text-dim);margin-bottom:20px">${t('irreversible')}</div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button id="_dlhc_cancel" style="padding:8px 20px;border-radius:8px;border:none;background:var(--hover);color:var(--text);font-size:14px;font-family:inherit;cursor:pointer">${t('cancel')}</button>
          <button id="_dlhc_ok"     style="padding:8px 20px;border-radius:8px;border:none;background:#c42b1c;color:#fff;font-size:14px;font-family:inherit;cursor:pointer">${t('clear')}</button>
        </div>`
      overlay.appendChild(box)
      const section = document.getElementById('history-section-downloads')
      section.style.position = 'relative'
      section.appendChild(overlay)
      box.querySelector('#_dlhc_cancel').onclick = () => { overlay.remove(); resolve(false) }
      box.querySelector('#_dlhc_ok').onclick     = () => { overlay.remove(); resolve(true)  }
      overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); resolve(false) } })
    })
    if (!confirmed) return
    dlHistoryData = []
    saveDlHistory()
    renderDlHistory()
  })

  // Polling odświeżający sekcję aktywnych pobierań w historii co 1s
  let _dlActivePollingTimer = null
  function _startDlActivePolling() {
    if (_dlActivePollingTimer) return
    _dlActivePollingTimer = setInterval(() => {
      const section = document.getElementById('history-section-downloads')
      if (!section || !section.classList.contains('active') || !historyOverlay.classList.contains('open')) return
      const activeEntries = [...dlItems.entries()].filter(([, e]) =>
        e.state === 'progressing' || e.state === 'network-error' || e.dlState === 'paused'
      )
      const existing = dlHistoryList.querySelectorAll('.dl-active-history-item')
      // Jeśli liczba zmieniła się — pełny rerender
      if (existing.length !== activeEntries.length) {
        renderDlHistory(dlHistorySearch.value); return
      }
      activeEntries.forEach(([dlId, entry], i) => {
        const el = existing[i]
        if (!el || el.dataset.dlId != dlId) { renderDlHistory(dlHistorySearch.value); return }
        const metaEl   = el.querySelector('.dl-history-meta')
        const bar      = el.querySelector('.dl-active-history-bar')
        const netErr   = el.querySelector('.dl-network-error')
        const pauseBtn = el.querySelector('.pause-btn')
        const resumeBtn= el.querySelector('.resume-btn')

        const isNetErr = entry.state === 'network-error'
        const isPaused = entry.dlState === 'paused'

        if (metaEl && entry.metaEl && !isNetErr) metaEl.textContent = entry.metaEl.textContent
        if (bar && entry.totalBytes > 0 && entry.barEl) {
          bar.classList.remove('indeterminate')
          bar.style.width = entry.barEl.style.width || '0%'
        }
        if (netErr) netErr.style.display = isNetErr ? '' : 'none'
        if (pauseBtn)  pauseBtn.style.display  = (isPaused || isNetErr) ? 'none' : ''
        if (resumeBtn) resumeBtn.style.display = (isPaused || isNetErr) ? ''     : 'none'
        if (bar) bar.classList.toggle('paused-bar', isPaused || isNetErr)
      })
    }, 1000)
  }
  _startDlActivePolling()

  // Historia — debounce
  const _historyDebounce = new Map()

  function scheduleAddToHistory(url, title) {
    if (!url || url.startsWith('about:') || url.startsWith('chrome:')) return
    if (_historyDebounce.has(url)) clearTimeout(_historyDebounce.get(url))
    _historyDebounce.set(url, setTimeout(() => {
      _historyDebounce.delete(url)
      addToHistory(url, title)
    }, 800))
  }

  function addToHistory(url, title) {
    if (!url || url.startsWith('about:') || url.startsWith('chrome:')) return
    if (isPrivate) return   // tryb prywatny — nigdy nie zapisuj historii
    const entry = { url, title: title || url, timestamp: Date.now() }
    window.electronAPI.addHistory(entry)
    if (historyOverlay.classList.contains('open')) {
      historyData.unshift(entry)
      renderHistory(historySearch.value)
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  AUTO-UPDATE — UI
  // ══════════════════════════════════════════════════════════════════
  const updateOverlay      = document.getElementById('update-overlay')
  const updateCardSub      = document.getElementById('update-card-sub')
  const updateProgressWrap = document.getElementById('update-progress-wrap')
  const updateProgressFill = document.getElementById('update-progress-fill')
  const updateProgressLbl  = document.getElementById('update-progress-label')
  const updateBtnNow       = document.getElementById('update-btn-now')
  const updateBtnLater     = document.getElementById('update-btn-later')

  let updateReady = false

  function showOverlay(sub, { progress = false, ready = false, downloading = false } = {}) {
    updateCardSub.textContent        = sub
    updateProgressWrap.style.display = progress ? '' : 'none'
    updateBtnNow.disabled            = downloading
    updateBtnNow.textContent         = ready ? t('update_install') : downloading ? t('update_downloading') : t('update_download')
    updateReady = ready
    updateOverlay.classList.add('open')
  }

  // ── Bezpieczeństwo połączenia ────────────────────────────────────────
  const iconSecure   = document.getElementById('icon-secure')
  const iconInsecure = document.getElementById('icon-insecure')
  const secPopup     = document.getElementById('sec-popup')
  const secPopupIcon  = document.getElementById('sec-popup-icon')
  const secPopupTitle = document.getElementById('sec-popup-title')
  const secPopupDesc  = document.getElementById('sec-popup-desc')
  const secCertBtn    = document.getElementById('sec-cert-btn')
  const secCertLabel  = document.getElementById('sec-cert-label')
  const secCertStatus = document.getElementById('sec-cert-status')

  let currentIsHttps = true
  let currentIsNitrixBlock = false
  let currentIsInternalNitrix = false

  function isInternalNitrixUrl(value) {
    try {
      const url = new URL(value)
      if (url.protocol === 'nitrix:' && Object.prototype.hasOwnProperty.call(INTERNAL_ROUTES, url.hostname.toLowerCase()) && !url.username && !url.password && !url.port) return true
      const bundled = new URL('strona.html', window.location.href)
      return url.protocol === 'file:' && url.host === bundled.host && url.pathname === bundled.pathname
    } catch { return false }
  }

  function setSecurityState(url) {
    const isNitrixBlock = (url || '').startsWith('nitrix-block://')
    const isHttps = !isNitrixBlock && (url || '').startsWith('https')
    currentIsHttps = isHttps
    currentIsNitrixBlock = isNitrixBlock
    currentIsInternalNitrix = isInternalNitrixUrl(url) || !!getActiveTab()?.hasError
    iconSecure.style.display   = (isHttps || isNitrixBlock) ? '' : 'none'
    iconInsecure.style.display = (isHttps || isNitrixBlock) ? 'none' : ''
    // Zarządzaj ikoną Nitrix w URL barze
    let _nIcon = document.getElementById('nitrix-n-icon')
    if (isNitrixBlock || currentIsInternalNitrix) {
      iconSecure.style.display = 'none'
      iconInsecure.style.display = 'none'
      if (!_nIcon) {
        _nIcon = document.createElement('img')
        _nIcon.id = 'nitrix-n-icon'
        _nIcon.width = 16
        _nIcon.height = 16
        _nIcon.style.cssText = 'border-radius:3px;vertical-align:middle;pointer-events:none'
        window.__nitrixBlockIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAACAMElEQVR42u29eYBlWVEm/kWcc9+ae9be1V29L9UL3TQge1UrAoIiymSJAi6IIKiAgoOKTnbOKOIgKIjMNOAwLApTNaOjorJJdynQKLSydbH33l177pnvvXvvifj9cc65976sZrYfSnfWDch+S758mfXeizgRX3zxBVBbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVlttD1uj+iXYjO+pArMgHDnk398TW4ff5/3f4idvAbDtpAIA9s4o5qDhKbV+WesAUNtD7r2bJcxcSYWD798vmCP59v8qJcwcYuwNv+fIScXBGQHVgaEOALX9K1lwwhNbCdtOKg4dcA/6KIDPH3/XGK6d3rGItR2wo7a5dWxHlue7slQSNInJWoOGhVFVSUiM4cwk6LHqqUFv7XjS7qTbp1on3d35iakdWfrpNzxxRf1zn2kH1eD2WwjYLz5jqINCHQBq+/a8N7NKuOUWfrCT/cW4PvmLx/3irhUzcol0Wldps3WxgC6jbmOHWrsTDTuujZYVZohNoMaEZyX/rlN465nD/QKIAMgBBuAGOWBWyMiAgLuN1dOc8JEG4f4G51/YMmG+8vVfuOKBMwLDQfW/6PYbFXNzUr+NdQCo7f/F6Q/fkFffpHN2v2Nq8aLte/NG8ji1jcdJq32FNMy56Ix00W4D1sKxAnkGSA6kDoAKLNRa0naDtN0yNDJikSQGpmXQajGShgEzwRiCkJIjwsA56g2UswwYKKHnDFLnkDqDTBXaT4FsbQWgb1hDXzCQT0w2+VPvf/UlX/tuorwICLPKwC2MG/e7ulyoA0Bt39JmGfv2Dzm9AjT16EN7+5Nbvlds8tQ8SR6l7c5WbXVBDQbYQTQHRBz6olCBSZQmRhLaPp3Q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/WIjdV9Pvzw4/vbbsL7xUzX772CvPAKtT/o6ANT27TYFzRzw2cG2K6Gxm7DRrgeSk1djZOfe8XE77nZnq1lCXdPqdpNu02BUiVvWKpGSSiq5G+i69nUl76frlvK8yc2lk8fW7+8qBh/7GJa+ZdUy62GDK49A65q+DgC1fYcyhJkjoBN7/Xu6/0bIHH17HXFWwbjRwwZHjkD3emeP6zprqwNAbQ/J9zcEh+o3YqDYaNuOlM68dy907kYMjyPWVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttf0r2P8H6E1cz3VawjkAAAAASUVORK5CYII='
        _nIcon.src = window.__nitrixBlockIcon || ''
        urlIcon.insertBefore(_nIcon, urlIcon.firstChild)
      }
      _nIcon.src = 'icon.ico'
      _nIcon.style.display = ''
      urlIcon.title = _currentLang === 'en' ? 'Nitrix page' : 'Strona Nitrix'
    } else {
      if (_nIcon) _nIcon.style.display = 'none'
      iconSecure.setAttribute('stroke', '#34a853')
      iconSecure.innerHTML = '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
      urlIcon.title = isHttps ? t('conn_secure') : t('conn_insecure')
    }
  }

  function showSecPopup() {
    const branded = currentIsInternalNitrix || currentIsNitrixBlock
    secPopup.classList.toggle('nitrix-official', branded)
    let logo = secPopup.querySelector('.sec-nitrix-logo')
    if (!logo) {
      logo = document.createElement('img'); logo.className = 'sec-nitrix-logo'
      logo.src = 'icon.ico'; logo.alt = ''; logo.width = 24; logo.height = 24
      secPopupIcon.before(logo)
    }
    logo.hidden = !branded
    secPopupIcon.style.display = branded ? 'none' : ''
    const rect = urlIcon.getBoundingClientRect()
    secPopup.style.left = rect.left + 'px'
    secPopup.style.top  = (rect.bottom + 6) + 'px'

    if (branded) {
      secPopupIcon.setAttribute('stroke', '#00f5a0')
      secPopupIcon.innerHTML = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
      secPopupTitle.textContent = _currentLang === 'en' ? 'Built-in Nitrix page' : 'Wbudowana strona Nitrix'
      secPopupDesc.textContent = _currentLang === 'en' ? 'This page is part of the Nitrix browser, not an external website.' : 'To strona wbudowana w przeglądarkę Nitrix, a nie zewnętrzna witryna.'
      secCertLabel.textContent  = 'Nitrix Browser'
      secCertStatus.textContent = '✓'
      secCertStatus.className   = 'sec-cert-status valid'
      secCertBtn.style.display  = 'none'
    } else if (currentIsHttps) {
      secPopupIcon.setAttribute('stroke', '#34a853')
      secPopupIcon.innerHTML = '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
      secPopupTitle.textContent = t('secure_conn')
      secPopupDesc.textContent  = t('secure_desc')
      secCertLabel.textContent  = t('cert_valid')
      secCertStatus.textContent = '✓'
      secCertStatus.className   = 'sec-cert-status valid'
      secCertBtn.style.display  = ''
    } else {
      secPopupIcon.setAttribute('stroke', '#fbbc04')
      secPopupIcon.innerHTML = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
      secPopupTitle.textContent = t('insecure_conn')
      secPopupDesc.textContent  = t('insecure_desc')
      secCertBtn.style.display  = 'none'
    }

    secPopup.classList.add('open')
  }

  urlIcon.addEventListener('click', e => {
    e.stopPropagation()
    if (secPopup.classList.contains('open')) { hideSecPopup(); return }
    closeAllMenus()
    showSecPopup()
  })

  secCertBtn.addEventListener('click', async e => {
    e.stopPropagation()
    if (currentIsInternalNitrix || currentIsNitrixBlock) return
    hideSecPopup()
    const tab = getActiveTab()
    if (!tab || !tab.url) return
    let hostname = ''
    try { hostname = new URL(tab.url).hostname } catch { return }

    const certModalOverlay   = document.getElementById('cert-modal-overlay')
    const certSectionOgolne  = document.getElementById('cert-section-ogolne')
    const certSectionZaawans = document.getElementById('cert-section-zaawansowane')

    // Reset do Ogólne
    document.querySelectorAll('.cert-sidebar-item').forEach(i => i.classList.remove('active'))
    document.querySelector('[data-certsection="ogolne"]').classList.add('active')
    certSectionOgolne.classList.add('active')
    certSectionZaawans.classList.remove('active')

    certSectionOgolne.innerHTML  = `<div style="text-align:center;padding:30px;color:var(--text-dim);font-size:13px">Ładowanie…</div>`
    certSectionZaawans.innerHTML = ''
    certModalOverlay.classList.add('open')

    const info = await window.electronAPI.getCertInfo(hostname).catch(() => null)

    if (!info || !info.cert) {
      certSectionOgolne.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-dim);font-size:13px">${t('cert_no_data')}</div>`
      return
    }

    const c = info.cert
    const isValid = info.valid !== false
    const BRAK = `<span style="color:var(--text-dim);font-style:italic">&lt;${t('cert_missing')}&gt;</span>`

    function formatDate(ts) {
      if (!ts) return BRAK
      return new Date(ts * 1000).toLocaleDateString(_currentLang === 'en' ? 'en-GB' : 'pl-PL', { day: '2-digit', month: 'long', year: 'numeric' })
    }
    function val(v) {
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) return BRAK
      if (Array.isArray(v)) return v.join(', ')
      return v
    }
    function mono(v) {
      if (!v) return BRAK
      return `<span style="font-family:monospace;font-size:11px">${v}</span>`
    }

    const now = Date.now() / 1000
    const expired = c.validExpiry && now > c.validExpiry
    const notYet  = c.validStart  && now < c.validStart
    const certOk  = isValid && !expired && !notYet

    // ── Sekcja Ogólne ──────────────────────────────────────────────
    certSectionOgolne.innerHTML = `
      <div class="cert-section">
        <span class="cert-validity-badge ${certOk ? 'valid' : 'invalid'}">
          ${certOk ? `✓ ${t('cert_valid')}` : `✗ ${t('cert_invalid')}`}
        </span>
      </div>

      <div class="cert-section">
        <div class="cert-section-title">${t('cert_subject')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_cn')}</span><span class="cert-row-value">${val(c.subject?.commonName)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_org')}</span><span class="cert-row-value">${val(c.subject?.organizations)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_country')}</span><span class="cert-row-value">${val(c.subject?.country)}</span></div>
      </div>

      <div class="cert-section">
        <div class="cert-section-title">${t('cert_issuer')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_cn')}</span><span class="cert-row-value">${val(c.issuer?.commonName)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_org')}</span><span class="cert-row-value">${val(c.issuer?.organizations)}</span></div>
      </div>

      <div class="cert-section">
        <div class="cert-section-title">${t('cert_validity')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_valid_from')}</span><span class="cert-row-value">${formatDate(c.validStart)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_valid_to')}</span><span class="cert-row-value" style="${expired ? 'color:#e57373' : ''}">${formatDate(c.validExpiry)}${expired ? ` <span style="color:#e57373;font-size:11px">(${t('cert_expired')})</span>` : ''}</span></div>
      </div>

      <div class="cert-section">
        <div class="cert-section-title">${t('cert_sha256')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_title')}</span><span class="cert-row-value" style="font-family:monospace;font-size:11px;word-break:break-all">${info.sha256 || BRAK}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_pubkey')}</span><span class="cert-row-value" style="font-family:monospace;font-size:11px;word-break:break-all">${info.pkSha256 || BRAK}</span></div>
      </div>
    `

    // ── Sekcja Zaawansowane ────────────────────────────────────────
    const pkAlgo = val(c.publicKey?.algorithm?.name || c.publicKey?.type || null)
    const pkSize = val(c.publicKey?.algorithm?.modulusLength || c.publicKey?.algorithm?.namedCurve || null)

    certSectionZaawans.innerHTML = `
      <div class="cert-section">
        <div class="cert-section-title">${t('cert_subject_details')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_cn')}</span><span class="cert-row-value">${val(c.subject?.commonName)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_org')}</span><span class="cert-row-value">${val(c.subject?.organizations)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_ou')}</span><span class="cert-row-value">${val(c.subject?.organizationUnits)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_country')}</span><span class="cert-row-value">${val(c.subject?.country)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_state')}</span><span class="cert-row-value">${val(c.subject?.stateOrProvince)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_locality')}</span><span class="cert-row-value">${val(c.subject?.locality)}</span></div>
      </div>

      <div class="cert-section">
        <div class="cert-section-title">${t('cert_issuer_details')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_cn')}</span><span class="cert-row-value">${val(c.issuer?.commonName)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_org')}</span><span class="cert-row-value">${val(c.issuer?.organizations)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_ou')}</span><span class="cert-row-value">${val(c.issuer?.organizationUnits)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_country')}</span><span class="cert-row-value">${val(c.issuer?.country)}</span></div>
      </div>

      <div class="cert-section">
        <div class="cert-section-title">${t('cert_title')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_serial')}</span><span class="cert-row-value">${mono(c.serialNumber)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_sig_algo')}</span><span class="cert-row-value">${val(c.signatureAlgorithm || c.algorithm || null)}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_version')}</span><span class="cert-row-value">${val(c.version != null ? 'v' + c.version : null)}</span></div>
        <div class="cert-row"><span class="cert-row-label">SAN</span><span class="cert-row-value" style="word-break:break-all">${val(c.subjectAltName || null)}</span></div>
      </div>

      <div class="cert-section">
        <div class="cert-section-title">${t('cert_pubkey')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_algo')}</span><span class="cert-row-value">${pkAlgo}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_size_curve')}</span><span class="cert-row-value">${pkSize}</span></div>
      </div>

      <div class="cert-section">
        <div class="cert-section-title">${t('cert_sha256')}</div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_title')}</span><span class="cert-row-value" style="font-family:monospace;font-size:11px;word-break:break-all">${info.sha256 || BRAK}</span></div>
        <div class="cert-row"><span class="cert-row-label">${t('cert_pubkey')}</span><span class="cert-row-value" style="font-family:monospace;font-size:11px;word-break:break-all">${info.pkSha256 || BRAK}</span></div>
      </div>
    `
  })

  // Sidebar switcher certyfikatu
  document.querySelectorAll('.cert-sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.cert-sidebar-item').forEach(i => i.classList.remove('active'))
      document.querySelectorAll('.cert-section-wrap').forEach(s => s.classList.remove('active'))
      item.classList.add('active')
      document.getElementById('cert-section-' + item.dataset.certsection).classList.add('active')
    })
  })

  document.getElementById('cert-modal-close').addEventListener('click', () => {
    document.getElementById('cert-modal-overlay').classList.remove('open')
  })
  document.getElementById('cert-modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('cert-modal-overlay'))
      document.getElementById('cert-modal-overlay').classList.remove('open')
  })

  // Zamknij po kliknięciu gdziekolwiek
  document.addEventListener('click', () => hideSecPopup())
  secPopup.addEventListener('click', e => e.stopPropagation())
  const ctxMenu     = document.getElementById('ctx-menu')
  const ctxBackdrop = document.getElementById('ctx-backdrop')
  let ctxBkIdx  = -1
  let ctxParams = null   // e.params z ostatniego context-menu webview

  function showCtxMenu(x, y, mode = 'webview', bkIdx = -1, params = null) {
    for (const [action, pl, en] of [['copy','Kopiuj','Copy'],['paste','Wklej','Paste'],['sleep-tab','Uśpij kartę','Sleep tab']]) {
      let item = ctxMenu.querySelector('[data-action="'+action+'"]')
      if (!item) {
        item = document.createElement('div')
        item.className = 'ctx-item ctx-mode-' + (action === 'sleep-tab' ? 'tab' : 'webview')
        item.dataset.action = action
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        for (const [key, value] of Object.entries({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2.2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' })) icon.setAttribute(key, value)
        const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        outline.setAttribute('d', {
          copy: 'M8 8h11a2 2 0 0 1 2 2v11H10a2 2 0 0 1-2-2V8Z M16 4V3H5a2 2 0 0 0-2 2v11h1',
          paste: 'M9 5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3 M9 3h6v5H9V3Z M8 13h8 M8 17h6',
          'sleep-tab': 'M20.4 14.2A8.7 8.7 0 0 1 9.8 3.6a8.8 8.8 0 1 0 10.6 10.6Z'
        }[action])
        icon.appendChild(outline)
        item.append(icon, document.createElement('span'))
        ctxMenu.prepend(item)
      }
      item.querySelector('span').textContent = _currentLang === 'en' ? en : pl
      item.style.display = action === 'copy' ? (params?.selectionText && params?.editFlags?.canCopy !== false ? '' : 'none') : action === 'paste' ? (params?.isEditable && params?.editFlags?.canPaste !== false ? '' : 'none') : ''
      item.classList.toggle('ctx-item-disabled', action === 'sleep-tab' && !!params?.tab?.sleeping)
    }
    ctxBkIdx  = bkIdx
    ctxParams = params
    ctxMenu.className = ''
    ctxMenu.classList.add('open', 'mode-' + mode)
    if (params && params.linkURL) ctxMenu.classList.add('has-link')
    if (params && params.mediaType === 'image' && params.srcURL) ctxMenu.classList.add('has-image')
    ctxBackdrop.classList.add('open')

    // Zaktualizuj etykiety pozycji linku
    const linkCurrentEl = ctxMenu.querySelector('[data-action="open-link-current"] span')
    const linkNewEl     = ctxMenu.querySelector('[data-action="open-link-new"] span')
    if (linkCurrentEl) linkCurrentEl.textContent = t('ctx_open_link_current')
    if (linkNewEl)     linkNewEl.textContent     = t('ctx_open_link_new')

    // Zmień etykietę "Zapisz jako" zależnie od kontekstu
    const saveLabel = ctxMenu.querySelector('[data-action="save-as"] .ctx-save-label')
    if (saveLabel) {
      const isImg = params && params.mediaType === 'image' && params.srcURL
      saveLabel.textContent = isImg ? t('save_image_as') : t('save_as')
    }

    // Wyszarz Wstecz / Dalej gdy brak historii
    if (mode === 'webview') {
      const t = getActiveTab()
      const backItem    = ctxMenu.querySelector('[data-action="back"]')
      const forwardItem = ctxMenu.querySelector('[data-action="forward"]')
      if (backItem)    backItem.classList.toggle('ctx-item-disabled',    !(t && t.wv.canGoBack()))
      if (forwardItem) forwardItem.classList.toggle('ctx-item-disabled', !(t && t.wv.canGoForward()))

      // Ukryj "Usuń element" gdy adblock wyłączony globalnie lub per-karta
      const pickItem = ctxMenu.querySelector('[data-action="pick-element"]')
      const pickSep  = pickItem ? pickItem.previousElementSibling : null
      const globalOn = (document.getElementById('adb-toggle-enabled')?.checked !== false)
      const perTabOn = t ? (_adbEnabledMap[t.id] !== false) : true
      const adbEnabled = globalOn && perTabOn
      if (pickItem) pickItem.style.display = adbEnabled ? '' : 'none'
      if (pickSep && pickSep.classList.contains('ctx-separator')) {
        pickSep.style.display = adbEnabled ? '' : 'none'
      }
    }

    const mw = 220, mh = ctxMenu.offsetHeight || 80
    const wx = window.innerWidth, wy = window.innerHeight
    ctxMenu.style.left = (x + mw > wx ? wx - mw - 8 : x) + 'px'
    ctxMenu.style.top  = (y + mh > wy ? wy - mh - 8 : y) + 'px'
  }

  function hideCtxMenu() {
    ctxMenu.classList.remove('open')
    ctxBackdrop.classList.remove('open')
    ctxBkIdx  = -1
    ctxParams = null
  }

  ctxBackdrop.addEventListener('click', () => hideCtxMenu())
  ctxBackdrop.addEventListener('contextmenu', e => { e.preventDefault(); hideCtxMenu() })

  ctxMenu.addEventListener('click', e => {
      const item = e.target.closest('.ctx-item')
      if (!item || item.classList.contains('ctx-item-disabled')) return
      const action      = item.dataset.action
      const savedBkIdx  = ctxBkIdx    // zapamiętaj PRZED hideCtxMenu które resetuje ctxBkIdx
      const savedParams = ctxParams   // zapamiętaj PRZED hideCtxMenu które zeruje ctxParams
      hideCtxMenu()
      if (action === 'copy' || action === 'paste') {
        const view = savedParams?.webview
        if (view?.isConnected) { view.focus(); if (action === 'copy') view.copy(); else view.paste() }
      } else if (action === 'sleep-tab') {
        browserFeatures?.sleepTab(savedParams?.tab)
      } else if (action === 'refresh') {
      const t = getActiveTab()
      if (t) t.wv.reload()
    } else if (action === 'open-link-current') {
      const t = getActiveTab()
      const url = savedParams && savedParams.linkURL
      if (t && url) t.wv.loadURL(url)
    } else if (action === 'open-link-new') {
      const url = savedParams && savedParams.linkURL
      if (url) createTab(url)
    } else if (action === 'open-image-current') {
      const t = getActiveTab()
      const url = savedParams && savedParams.srcURL
      if (t && url) t.wv.loadURL(url)
    } else if (action === 'open-image-new') {
      const url = savedParams && savedParams.srcURL
      if (url) createTab(url)
    } else if (action === 'back') {
      const t = getActiveTab()
      if (t) t.wv.goBack()
    } else if (action === 'forward') {
      const t = getActiveTab()
      if (t) t.wv.goForward()
    } else if (action === 'save-as') {
      const t = getActiveTab()
      if (!t) return
      const wvId      = t.wv.getWebContentsId()
      const isImg     = savedParams && savedParams.mediaType === 'image' && savedParams.srcURL
      const srcURL    = isImg ? savedParams.srcURL : ''
      const pageUrl   = t.url || ''
      const pageTitle = t.titleEl?.textContent?.trim() || 'strona'
      window.electronAPI.savePage(wvId, pageTitle, isImg ? srcURL : pageUrl, isImg ? 'image' : 'page', pageUrl)
    } else if (action === 'pick-element') {
      const t = getActiveTab()
      if (t) enterElementPickerMode(t)
    } else if (action === 'bk-edit') {
      openBkModal(savedBkIdx)   // działa normalnie — zapis obsługuje bk-save
    } else if (action === 'bk-delete') {
      if (savedBkIdx !== -1) {
        bookmarks.splice(savedBkIdx, 1)
        if (!isPrivate) window.electronAPI.saveBookmarks(bookmarks)  // prywatny = tylko pamięć
        renderBookmarks()
        if (typeof renderBkAllList === 'function') renderBkAllList()
      }
    }
  })
  ctxMenu.addEventListener('click', e => e.stopPropagation())

  window.electronAPI.onContextMenuAction(action => {
    if (action === 'refresh') {
      const t = getActiveTab()
      if (t) t.wv.reload()
    }
  })

  // Strony otwierające nowe okna → nowa karta
  window.electronAPI.onOpenInNewTab(url => {
    if (url && url !== 'about:blank') createTab(url)
  })

  window.electronAPI.onUpdateStatus(data => {
    switch (data.status) {
      case 'available':
        showOverlay(`${t('update_version')} ${data.version} ${t('update_sub_available')}`, { progress: false })
        break
      case 'downloading':
        updateProgressFill.style.width = data.percent + '%'
        updateProgressLbl.textContent  = data.percent + '%'
        showOverlay(`${t('update_sub_downloading')} ${data.percent}%`, { progress: true, downloading: true })
        break
      case 'downloaded':
        showOverlay(`${t('update_version')} ${data.version} ${t('update_sub_downloaded')}`, { ready: true })
        break
    }
  })

  updateBtnNow.addEventListener('click', () => {
    if (updateReady) {
      window.electronAPI.installUpdate()
    } else {
      // Rozpocznij pobieranie i pokaż pasek postępu
      window.electronAPI.downloadUpdate()
      updateBtnNow.disabled = true
      updateBtnNow.textContent = t('update_downloading')
      updateProgressWrap.style.display = ''
    }
  })

  updateBtnLater.addEventListener('click', () => {
    updateOverlay.classList.remove('open')
    window.electronAPI.dismissUpdate()   // main.js ustawi flagę — nie pokaże w tej sesji
  })

  // Wymuszenie wymiarów webview
  let _resizeTimer = null
  function fixWebviewSizes() {
    const rect = wvCont.getBoundingClientRect()
    if (rect.height < 10) return
    tabs.forEach(t => {
      t.wv.style.width  = rect.width  + 'px'
      t.wv.style.height = rect.height + 'px'
    })
  }
  const resizeObs = new ResizeObserver(() => {
    if (_resizeTimer) clearTimeout(_resizeTimer)
    _resizeTimer = setTimeout(() => { fixWebviewSizes(); updateTabSizes() }, 50)
  })
  resizeObs.observe(wvCont)
  window.addEventListener('resize', () => {
    if (_resizeTimer) clearTimeout(_resizeTimer)
    _resizeTimer = setTimeout(() => { fixWebviewSizes(); updateTabSizes() }, 50)
  })
  setTimeout(fixWebviewSizes, 200)

  // ── DevTools strony — F12 lub Ctrl+Shift+I ───────────────────────────
  document.addEventListener('keydown', e => {
    const isF12        = e.key === 'F12'
    const isCtrlShiftI = e.ctrlKey && e.shiftKey && e.key === 'I'
    if (!isF12 && !isCtrlShiftI) return
    e.preventDefault()
    const t = getActiveTab()
    if (!t) return
    const id = t.wv.getWebContentsId()
    window.electronAPI.openWebviewDevTools(id)
  })

  // Otwórz pierwszą kartę / karty przy starcie
  browserFeatures = window.NitrixFeatures({
    getTabs: () => tabs, getActiveTab, createTab, closeTab, getLang: () => _currentLang,
    isPrivate, container: wvCont, setAddress: value => { setUrlDisplay(value, true); setSecurityState(value); hideSecPopup() }, tabsBar, tabNewBtn
  })
  const dockPanels=[
    ['settings','settings-overlay','[id^="settings-close"]','dd-settings','Ustawienia','Settings'],
    ['history','history-overlay','#history-close-btn, #dl-history-close-btn','dd-history','Historia','History'],
    ['passwords','passwords-overlay','#passwords-close','dd-passwords','Menedżer haseł','Passwords'],
    ['whats-new','whatsnew-overlay','#whatsnew-close','dd-whatsnew','Co nowego?','What’s new?']
  ]
  for(const [key,overlayId,selector,menu,pl,en]of dockPanels) {
    document.querySelectorAll(selector).forEach(close=>{
      const open=document.createElement('button');open.className='icon-btn nitrix-open-panel-tab'
      open.title=_currentLang==='en'?'Open in new tab':'Otwórz w nowej karcie';open.setAttribute('aria-label',open.title)
      open.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6m0-6-9 9M10 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-5"/></svg>'
      open.onclick=event=>{event.stopPropagation();openPanelTab(key,overlayId,_currentLang==='en'?en:pl)}
      close.before(open)
      close.addEventListener('click',event=>{const tab=panelTabs.get(key);if(tab){event.preventDefault();event.stopImmediatePropagation();closeTab(tab.id)}},true)
    })
    document.getElementById(menu)?.addEventListener('click',event=>{
      const tab=panelTabs.get(key)
      if(tab && !tab.closing){event.preventDefault();event.stopImmediatePropagation();activateTab(tab.id);dropdown.classList.remove('open')}
    },true)
  }
  document.addEventListener('mouseup',event=>{
    if(event.button!==3 && event.button!==4)return
    event.preventDefault()
    const tab=getActiveTab();if(!tab || tab.internalPage)return
    try {if(event.button===3 && tab.wv.canGoForward())tab.wv.goForward();if(event.button===4 && tab.wv.canGoBack())tab.wv.goBack()}catch{}
  },true)
  const initialLaunchUrl = window.electronAPI.getInitialLaunchUrl?.() || null
  setTimeout(async () => {
    await initialSettingsReady
    const restored = await browserFeatures.initialize()
    if (restored && !initialLaunchUrl) return
    if (initialLaunchUrl) {
      createTab(initialLaunchUrl)
      setUrlDisplay(initialLaunchUrl, true)
    } else if (startupBehavior === 'bookmarks' && startupBookmarks.length > 0) {
      startupBookmarks.forEach((url, i) => setTimeout(() => createTab(url), i * 80))
    } else {
      createTab(getStartupUrl())
    }
  }, 100)

  // ══════════════════════════════════════════════════════════════════
  //  IMPORT DANYCH Z INNYCH PRZEGLĄDAREK
  // ══════════════════════════════════════════════════════════════════
  ;(function initImportSection() {
    const BROWSER_ICONS = {
      firefox: `<img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg" width="28" height="28" style="display:block">`,
      chrome:  `<img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" width="28" height="28" style="display:block">`,
      brave:   `<img src="https://raw.githubusercontent.com/TheNitrixBrowser/bravesvg/eaa50c9e646023b6fc5a145ae2bbb1b9b1417d88/svgviewer-output.svg" width="28" height="28" style="display:block">`,
      'brave-origin': `<img src="https://brave.com/leo-icons/brave-origin-release-color.svg" width="28" height="28" style="display:block">`,
      edge:    `<img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg" width="28" height="28" style="display:block">`,
      opera:   `<img src="https://upload.wikimedia.org/wikipedia/commons/4/49/Opera_2015_icon.svg" width="28" height="28" style="display:block">`,
      operagx: `<img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Opera_GX_Icon.svg" width="28" height="28" style="display:block">`,
      vivaldi: `<img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Vivaldi_web_browser_logo.svg" width="28" height="28" style="display:block">`,
    }
    const BROWSER_COLORS = {
      chrome: '#4285f4', edge: '#0078d4', brave: '#fb542b', 'brave-origin': '#fb542b', opera: '#e0303a', operagx: '#ff3366', vivaldi: '#ef3939', firefox: '#ff7139',
    }

    let detectedBrowsers = []
    let selectedBrowser  = null

    const scanningEl    = document.getElementById('import-scanning')
    const noBrowsersEl  = document.getElementById('import-no-browsers')
    const listEl        = document.getElementById('import-browser-list')
    const whatRowEl     = document.getElementById('import-what-row')
    const runBtn        = document.getElementById('import-run-btn')
    const resultEl      = document.getElementById('import-result')
    const noteEl        = document.getElementById('import-note')
    const chkBk         = document.getElementById('import-chk-bookmarks')
    const chkHi         = document.getElementById('import-chk-history')
    const bkCountEl     = document.getElementById('import-bk-count')
    const hiNoteEl      = document.getElementById('import-hi-note')

    function importT(key, vars = {}) {
      return t(key).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '')
    }

    // Suwaki — nasłuchuj natywnego zdarzenia change
    chkBk.addEventListener('change', updateRunBtn)
    chkHi.addEventListener('change', updateRunBtn)

    function updateRunBtn() {
      const anyChk = chkBk.checked || chkHi.checked
      runBtn.disabled = !selectedBrowser || !anyChk
    }

    function refreshImportText() {
      if (detectedBrowsers.length && listEl.style.display !== 'none') {
        renderBrowserList()
        if (selectedBrowser) {
          listEl.querySelectorAll('.import-browser-card').forEach(c => {
            const active = c.dataset.id === selectedBrowser.id
            c.classList.toggle('selected', active)
            c.querySelector('.import-card-check').style.opacity = active ? '1' : '0'
          })
        }
      }

      if (selectedBrowser) {
        const hasBk = !!selectedBrowser.bookmarksPath && (selectedBrowser.type === 'chromium' || selectedBrowser.type === 'firefox')
        const hasHi = !!selectedBrowser.historyPath
        bkCountEl.textContent = hasBk ? '' : t('import_unavailable')
        hiNoteEl.textContent  = hasHi ? '' : t('import_unavailable')
      }
    }

    window.refreshImportText = refreshImportText

    function renderBrowserList() {
      listEl.innerHTML = ''
      detectedBrowsers.forEach(b => {
        const card = document.createElement('div')
        card.className = 'import-browser-card'
        card.dataset.id = b.id
        const meta = [
          b.bookmarksPath ? t('import_meta_bookmarks') : null,
          b.historyPath   ? t('import_meta_history') : null,
        ].filter(Boolean).join(' · ')
        card.innerHTML = `
          <div class="import-browser-icon">
            ${BROWSER_ICONS[b.id] || `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>`}
          </div>
          <div class="import-browser-info">
            <div class="import-browser-name">${b.name}</div>
            <div class="import-browser-meta">${meta || t('import_meta_no_data')}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" class="import-card-check" style="opacity:0;transition:opacity .15s">
            <polyline points="20 6 9 17 4 12"/>
          </svg>`
        card.addEventListener('click', () => selectBrowser(b))
        listEl.appendChild(card)
      })
    }

    function selectBrowser(b) {
      selectedBrowser = b
      // Zaznacz kartę
      listEl.querySelectorAll('.import-browser-card').forEach(c => {
        const active = c.dataset.id === b.id
        c.classList.toggle('selected', active)
        c.querySelector('.import-card-check').style.opacity = active ? '1' : '0'
      })
      // Pokaż opcje
      whatRowEl.style.display = ''
      runBtn.style.display    = ''
      noteEl.style.display    = ''
      resultEl.classList.remove('visible')

      // Aktualizuj dostępność opcji
      const hasBk = !!b.bookmarksPath && (b.type === 'chromium' || b.type === 'firefox')
      const hasHi = !!b.historyPath
      chkBk.checked = hasBk
      chkHi.checked = hasHi
      document.getElementById('import-chk-bookmarks-row').style.opacity = hasBk ? '1' : '.35'
      document.getElementById('import-chk-bookmarks-row').style.pointerEvents = hasBk ? '' : 'none'
      document.getElementById('import-chk-history-row').style.opacity = hasHi ? '1' : '.35'
      document.getElementById('import-chk-history-row').style.pointerEvents = hasHi ? '' : 'none'

      bkCountEl.textContent = hasBk ? '' : t('import_unavailable')
      hiNoteEl.textContent  = hasHi ? '' : t('import_unavailable')

      updateRunBtn()
    }

    async function runImport() {
      if (!selectedBrowser) return
      runBtn.disabled  = true
      runBtn.textContent = t('import_running')
      resultEl.classList.remove('visible')

      try {
        const res = await window.electronAPI.browserImportRun({
          browserId:       selectedBrowser.id,
          importBookmarks: chkBk.checked,
          importHistory:   chkHi.checked,
        })

        runBtn.textContent = t('import_run')
        runBtn.disabled    = false

        if (!res || !res.ok) {
          resultEl.className = 'error visible'
          resultEl.innerHTML = `<div class="import-result-line"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e57373" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>${t('import_error')}</span></div>`
          return
        }

        const _icoOk   = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><polyline points="7 12 10.5 15.5 17 8.5"/></svg>`
        const _icoInfo = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" style="flex-shrink:0;opacity:.6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="12" y1="12" x2="12" y2="16"/></svg>`
        const _icoWarn = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
        const _line = (ico, txt) => `<div class="import-result-line">${ico}<span>${txt}</span></div>`

        let msg = ''
        if (res.importedBookmarks > 0) msg += _line(_icoOk, importT('import_added_bookmarks', { count: res.importedBookmarks }))
        else if (chkBk.checked && selectedBrowser.bookmarksPath) msg += _line(_icoInfo, t('import_no_new_bookmarks'))

        if (res.historyUnavailable) {
          msg += _line(_icoWarn, t('import_history_unavailable'))
        } else if (res.importedHistory > 0) {
          msg += _line(_icoOk, importT('import_added_history', { count: res.importedHistory }))
        } else if (chkHi.checked && selectedBrowser.historyPath) {
          msg += _line(_icoInfo, t('import_no_new_history'))
        }

        if (!msg) msg = _line(_icoInfo, t('import_nothing'))

        resultEl.className = 'visible'
        resultEl.innerHTML = msg

        // ── Odśwież dane w UI bez restartu ──────────────────────────
        if (res.importedBookmarks > 0) {
          window.electronAPI.loadBookmarks().then(data => {
            bookmarks = Array.isArray(data) ? data : []
            renderBookmarks()
            if (typeof renderBkAllList === 'function') renderBkAllList()
            preloadFavicons(bookmarks.map(b => b.url), 0)
          }).catch(() => {})
        }
        if (res.importedHistory > 0) {
          // Wyczyść cache sugestii historii — przy następnym wpisaniu adresu
          // zostaną wczytane świeże dane
          _historyData = null
          // Wyczyść lokalny bufor historii — openHistory() wczyta świeże dane
          historyData = []
        }
      } catch(err) {
        runBtn.textContent = t('import_run')
        runBtn.disabled    = false
        resultEl.className = 'error visible'
        resultEl.innerHTML = `<div class="import-result-line"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e57373" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>${importT('import_unexpected_error', { error: escHtml(err.message || err) })}</span></div>`
      }
    }

    runBtn.addEventListener('click', runImport)

    // Uruchom wykrywanie gdy użytkownik wejdzie do sekcji importu
    let alreadyScanned = false
    document.querySelector('.sidebar-item[data-section="import"]').addEventListener('click', async () => {
      if (alreadyScanned) return
      alreadyScanned = true
      scanningEl.style.display = 'flex'
      noBrowsersEl.style.display = 'none'
      listEl.style.display = 'none'

      try {
        detectedBrowsers = await window.electronAPI.browserImportDetect() || []
        console.log('[Import] wykryte przeglądarki:', JSON.stringify(detectedBrowsers))
      } catch(e) {
        console.error('[Import] błąd detekcji:', e)
        detectedBrowsers = []
      }

      scanningEl.style.display = 'none'

      if (detectedBrowsers.length === 0) {
        noBrowsersEl.style.display = 'flex'
      } else {
        listEl.style.display = 'flex'
        renderBrowserList()
      }
    })
  })()
  // ── Koniec importu ────────────────────────────────────────────────

  // ══════════════════════════════════════════════════════════════════
  //  DOMYŚLNA PRZEGLĄDARKA
  // ══════════════════════════════════════════════════════════════════
  ;(function() {
    const setDefaultBtn  = document.getElementById('set-default-btn')
    const statusEl       = document.getElementById('default-browser-status')
    const statusText     = document.getElementById('db-status-text')
    const statusIcon     = document.getElementById('db-status-icon')

    const SVG_OK   = `<circle cx="12" cy="12" r="10"/><polyline points="7 12 10.5 15.5 17 8.5"/>`
    const SVG_INFO = `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="12" y1="12" x2="12" y2="16"/>`
    let lastDefaultStatus = null
    let defaultCheckTimer = null
    let defaultCheckInProgress = false
    let lastDefaultCheckAt = 0

    function isDefaultSectionActive() {
      return settingsOverlay.classList.contains('open') &&
        document.getElementById('section-domyslna')?.classList.contains('active')
    }

    function scheduleStatusCheck(delay = 250, force = false) {
      if (defaultCheckTimer) clearTimeout(defaultCheckTimer)
      defaultCheckTimer = setTimeout(() => {
        defaultCheckTimer = null
        if (isDefaultSectionActive()) checkStatus(force)
      }, delay)
    }

    function applyStatus(isDefault) {
      lastDefaultStatus = !!isDefault
      if (isDefault) {
        statusEl.className = 'is-default'
        statusIcon.innerHTML = SVG_OK
        statusText.textContent = t('default_browser_is_default')
        setDefaultBtn.disabled = true
        setDefaultBtn.textContent = t('default_browser_already_default')
      } else {
        statusEl.className = 'not-default'
        statusIcon.innerHTML = SVG_INFO
        statusText.textContent = t('default_browser_not_default')
        setDefaultBtn.disabled = false
        setDefaultBtn.textContent = t('set_default_browser')
      }
    }

    window.refreshDefaultBrowserText = () => {
      if (lastDefaultStatus === null) {
        statusText.textContent = t('default_browser_checking')
        setDefaultBtn.textContent = t('set_default_browser')
      } else {
        applyStatus(lastDefaultStatus)
      }
    }

    async function checkStatus(force = false) {
      if (!isDefaultSectionActive() && !force) return
      if (defaultCheckInProgress) return
      const now = Date.now()
      if (!force && now - lastDefaultCheckAt < 10000) return
      defaultCheckInProgress = true
      lastDefaultCheckAt = now
      try {
        const result = await window.electronAPI.isDefaultBrowser()
        const isDefault = typeof result === 'object' ? !!result.isDefault : !!result
        applyStatus(!!isDefault)
      } catch(e) {
        statusEl.className = 'not-default'
        statusIcon.innerHTML = SVG_INFO
        statusText.textContent = t('default_browser_status_unavailable')
        setDefaultBtn.disabled = false
        setDefaultBtn.textContent = t('set_default_browser')
      } finally {
        defaultCheckInProgress = false
      }
    }

    setDefaultBtn.addEventListener('click', async () => {
      setDefaultBtn.disabled = true
      setDefaultBtn.textContent = t('default_browser_setting')
      try {
        const result = await window.electronAPI.setDefaultBrowser()
        const isDefault = typeof result === 'object' ? !!result.isDefault : !!result
        applyStatus(isDefault)
        if (!isDefault) {
          statusText.textContent = result?.platform === 'win32'
            ? t('default_browser_choose_windows')
            : t('default_browser_linux_failed')
          setDefaultBtn.disabled = false
          setDefaultBtn.textContent = t('default_browser_check_again')
          setTimeout(() => { if (isDefaultSectionActive()) checkStatus(true) }, 1500)
          setTimeout(() => { if (isDefaultSectionActive()) checkStatus(true) }, 4000)
          setTimeout(() => { if (isDefaultSectionActive()) checkStatus(true) }, 8000)
        }
      } catch(e) {
        setDefaultBtn.disabled = false
        setDefaultBtn.textContent = t('set_default_browser')
        statusText.textContent = t('default_browser_open_failed')
      }
    })

    // Sprawdź status gdy użytkownik wejdzie do sekcji
    document.querySelector('.sidebar-item[data-section="domyslna"]').addEventListener('click', () => scheduleStatusCheck(100, true))
    window.addEventListener('focus', () => scheduleStatusCheck(300))
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) scheduleStatusCheck(300)
    })
  })()
  // ── Koniec domyślnej przeglądarki ─────────────────────────────────
