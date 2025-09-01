/**
 * ISO 289-1:2015 - Rubber, unvulcanized — Determinations using a shearing-disc viscometer
 * Protokół badania lepkości Mooneya nieutwardzonych kauczuków
 */

export const ISO289Protocol = {
  id: 'iso-289-mooney-viscosity',
  title: 'ISO 289 - Lepkość Mooneya nieutwardzonych kauczuków',
  version: '2015',
  category: 'rheology',
  description: 'Oznaczanie lepkości Mooneya i czasu podparzelenia nieutwardzonych kauczuków za pomocą wiskozymetru z tarczą ścinającą',
  
  equipment: {
    required: [
      'Wiskozymetr Mooneya zgodny z ISO 289',
      'Tarcza ścinająca duża (L) lub mała (S)',
      'Waga analityczna (dokładność ±0.01 g)',
      'Kalendrarz lub wałki do przygotowania próbek',
      'Narzędzia do cięcia próbek kauczuku',
      'Sekundomierz cyfrowy'
    ],
    optional: [
      'Mieszalnik laboratoryjny',
      'Forma do standardowych próbek',
      'Mikrometr do pomiaru grubości',
      'Nóż lub gilotyna do cięcia'
    ]
  },

  testConditions: {
    temperature: '100 ± 0.5°C',
    preheatingTime: '60 ± 2 sekundy',
    testTime: '240 ± 2 sekundy (4 minuty)',
    rotorSpeed: '2 ± 0.02 obr/min',
    discTypes: [
      { type: 'L', diameter: '38.10 ± 0.05 mm', thickness: '5.54 ± 0.02 mm' },
      { type: 'S', diameter: '30.48 ± 0.05 mm', thickness: '5.54 ± 0.02 mm' }
    ]
  },

  steps: [
    {
      id: 'sample-preparation',
      title: 'Przygotowanie próbki kauczuku',
      duration: '30-45 minut',
      instructions: [
        '1. **Pobór próbki**: Pobierz reprezentatywną próbkę nieutwardzonego kauczuku (50-60 g)',
        '2. **Kondycjonowanie**: Próbka powinna być w temperaturze pokojowej (23 ± 2°C)',
        '3. **Kalendrowanie**: Przepuść próbkę przez kalendrarz:',
        '   - Szerokość szczeliny: 1.5-2.0 mm',
        '   - 6-8 przepustów z rotacją 90° między przepustami',
        '   - Końcowa grubość: 5.0-6.0 mm',
        '4. **Cięcie**: Wytnij próbki o wymiarach:',
        '   - Dla rotora L: średnica 35 mm (4 krążki)',
        '   - Dla rotora S: średnica 28 mm (4 krążki)',
        '5. **Kontrola**: Sprawdź czy próbki nie zawierają pęcherzy powietrza'
      ],
      safety: [
        'Używaj rękawic podczas pracy z kauczukiem surowym',
        'Uważaj na ostre krawędzie kalendarza',
        'Zapewnij odpowiednią wentylację (możliwe opary z kauczuku)'
      ],
      tips: [
        'Próbki powinny mieć jednolitą grubość',
        'Unikaj nadmiernego nagrzewania podczas kalendrowania',
        'Przechowuj próbki w chłodnym miejscu przed testem'
      ]
    },
    {
      id: 'apparatus-preparation',
      title: 'Przygotowanie wiskozymetru',
      duration: '20-30 minut',
      instructions: [
        '1. **Czyszczenie**: Dokładnie wyczyść komory wiskozymetru i rotor',
        '2. **Montaż rotora**: Zamontuj odpowiednią tarczę (L lub S)',
        '3. **Kalibracja**: Sprawdź kalibrację temperatury i prędkości obrotowej',
        '4. **Nagrzewanie**: Nagrzej komory do 100 ± 0.5°C',
        '5. **Stabilizacja**: Poczekaj na stabilizację temperatury (minimum 30 min)',
        '6. **Test zerowy**: Przeprowadź test zerowy bez próbki dla sprawdzenia'
      ],
      safety: [
        'Nie dotykaj gorących powierzchni komór',
        'Upewnij się że rotor jest prawidłowo zamocowany',
        'Sprawdź czy wszystkie osłony są na miejscu'
      ],
      tips: [
        'Temperatura powinna być stabilna w całej komorze',
        'Rotor powinien obracać się płynnie bez wibracji',
        'Sprawdź czy komory domykają się szczelnie'
      ]
    },
    {
      id: 'sample-loading',
      title: 'Ładowanie próbki',
      duration: '5 minut',
      instructions: [
        '1. **Otwarcie komór**: Otwórz komory wiskozymetru',
        '2. **Umieszczenie próbek**: Umieść po 2 krążki w każdej komorze:',
        '   - Pierwszy krążek na dnie komory',
        '   - Drugi krążek na rotorze',
        '   - Próbki powinny pokrywać całą powierzchnię rotora',
        '3. **Pozycjonowanie**: Upewnij się że próbki są wyśrodkowane',
        '4. **Zamknięcie**: Delikatnie zamknij komory unikając uwięzienia powietrza'
      ],
      safety: [
        'Uważaj na gorące powierzchnie komór',
        'Nie dotykaj rotora podczas jego obracania',
        'Nie przyspieszaj zamykania komór'
      ],
      tips: [
        'Próbki powinny być płaskie i bez zagięć',
        'Unikaj nadmiaru materiału wypierającego się z komór',
        'Sprawdź czy rotor może się swobodnie obracać'
      ]
    },
    {
      id: 'preheating-phase',
      title: 'Faza wygrzewania',
      duration: '1 minuta',
      instructions: [
        '1. **Start timera**: Uruchom timer na 60 ± 2 sekundy',
        '2. **Pozycja rotora**: Rotor pozostaje nieruchomy',
        '3. **Obserwacja**: Obserwuj czy temperatura pozostaje stabilna',
        '4. **Przygotowanie**: Przygotuj się do rozpoczęcia rotacji',
        '5. **Sprawdzenie**: Upewnij się że komory są szczelnie zamknięte'
      ],
      safety: [
        'Nie otwieraj komór podczas wygrzewania',
        'Monitoruj temperaturę na wyświetlaczu',
        'Zachowaj bezpieczną odległość od aparatu'
      ],
      tips: [
        'Materiał powinien się rozgrzewać równomiernie',
        'Możliwe jest lekkie wyparowanie wilgoci z próbki',
        'Przygotuj się do natychmiastowego startu rotacji'
      ]
    },
    {
      id: 'viscosity-measurement',
      title: 'Pomiar lepkości',
      duration: '4 minuty',
      instructions: [
        '1. **Start rotacji**: Po 60 sekundach uruchom rotację rotora (2 obr/min)',
        '2. **Rozpoczęcie pomiaru**: Rozpocznij pomiar momentu obrotowego',
        '3. **Monitoring**: Obserwuj wzrost lepkości na wykresie',
        '4. **Odczyt**: Zapisuj wartości co 30 sekund przez 4 minuty',
        '5. **Końcowy odczyt**: Odczytaj wartość ML(1+4) po 4 minutach testu'
      ],
      safety: [
        'Nie zatrzymuj rotacji przed końcem pomiaru',
        'Monitoruj czy aparat pracuje normalnie',
        'Nie otwieraj komór podczas pomiaru'
      ],
      tips: [
        'Krzywa powinna być płynna bez skoków',
        'Normalne wartości: 20-150 jednostek Mooneya',
        'Notuj wszelkie nieprawidłowości w zachowaniu aparatu'
      ]
    },
    {
      id: 'scorch-test',
      title: 'Test czasu podparzelenia (opcjonalny)',
      duration: '15-45 minut',
      instructions: [
        '1. **Kontynuacja**: Po pomiarze ML(1+4) kontynuuj test',
        '2. **Monitoring wzrostu**: Obserwuj wzrost lepkości w czasie',
        '3. **Punkt początkowy**: Zanotuj moment rozpoczęcia wzrostu (ts1)',
        '4. **Punkt końcowy**: Zanotuj wzrost o 5 jednostek (ts2)',
        '5. **Obliczenia**: Oblicz czas podparzelenia: Δt = ts2 - ts1'
      ],
      safety: [
        'Test może trwać długo - zachowaj cierpliwość',
        'Monitoruj temperaturę przez cały czas',
        'Przygotuj się na możliwy wzrost temperatury próbki'
      ],
      tips: [
        'Niektóre kauczuki mogą nie wykazywać podparzelenia',
        'Czas podparzelenia zależy od składu mieszanki',
        'Zapisuj pełną krzywą dla analizy'
      ]
    },
    {
      id: 'calculation-reporting',
      title: 'Obliczenia i raportowanie',
      duration: '15 minut',
      instructions: [
        '1. **Lepkość Mooneya**: Odczytaj wartość ML(1+4) w jednostkach Mooneya',
        '2. **Krzywa lepkości**: Przeanalizuj kształt krzywej lepkości',
        '3. **Czas podparzelenia**: Jeśli wykonywano - oblicz ts1, ts2 i Δt',
        '4. **Walidacja**: Sprawdź czy wyniki są w oczekiwanym zakresie',
        '5. **Protokół**: Wypełnij kompletny protokół zawierający:',
        '   - Identyfikację próbki',
        '   - Typ rotora (L/S)',
        '   - Temperaturę testu',
        '   - Wartość ML(1+4)',
        '   - Krzywą lepkości',
        '   - Czas podparzelenia (jeśli mierzono)',
        '6. **Format wyniku**: ML(1+4) przy 100°C, rotor L/S'
      ],
      safety: [
        'Pozwól aparatowi ostygnąć przed czyszczeniem',
        'Usuń gorące próbki odpowiednimi narzędziami'
      ],
      tips: [
        'Porównaj wyniki z poprzednimi pomiarami tej samej mieszanki',
        'Zachowaj fragmenty próbki do ewentualnej weryfikacji',
        'Zapisz wszystkie parametry środowiskowe podczas testu'
      ]
    }
  ],

  calculations: {
    mooney_viscosity: {
      formula: 'ML(1+4) = odczyt po 4 minutach rotacji',
      units: 'Jednostki Mooneya (MU)',
      description: 'Lepkość Mooneya po 1 minucie wygrzewania i 4 minutach rotacji'
    },
    scorch_time: {
      formula: 'Δt = ts2 - ts1',
      units: 'minuty',
      description: 'Czas wzrostu lepkości o 5 jednostek Mooneya'
    }
  },

  acceptance_criteria: {
    temperature_tolerance: '± 0.5°C',
    time_tolerance: '± 2 sekundy',
    rotation_speed: '2 ± 0.02 obr/min',
    repeatability: 'Różnica między pomiarami ≤ 3 jednostki Mooneya'
  },

  typical_values: [
    { material: 'SBR', range: '45-65 MU', comment: 'Kauczuk styreno-butadienowy' },
    { material: 'NBR', range: '35-70 MU', comment: 'Kauczuk nitrylowy' },
    { material: 'EPDM', range: '25-90 MU', comment: 'Kauczuk etylenowo-propylenowy' },
    { material: 'BR', range: '35-55 MU', comment: 'Kauczuk butadienowy' },
    { material: 'NR', range: '60-85 MU', comment: 'Kauczuk naturalny' }
  ],

  common_issues: [
    {
      problem: 'Nieregularna krzywa lepkości',
      causes: ['Pęcherzyki powietrza w próbce', 'Niejednorodny materiał', 'Niestabilna temperatura'],
      solutions: ['Lepsze kalendrowanie próbki', 'Dokładniejsze mieszanie', 'Sprawdzenie kalibracji temperatury']
    },
    {
      problem: 'Za wysokie wartości lepkości',
      causes: ['Przedwulkanizacja materiału', 'Za gruba próbka', 'Za wysoka temperatura'],
      solutions: ['Sprawdzenie świeżości materiału', 'Korekta grubości próbki', 'Kalibracja temperatury']
    },
    {
      problem: 'Niestabilny pomiar',
      causes: ['Luzy w mechanizmie', 'Zanieczyszczenia w komorach', 'Błąd kalibracji'],
      solutions: ['Serwis aparatu', 'Dokładne czyszczenie', 'Ponowna kalibracja']
    },
    {
      problem: 'Brak podparzelenia',
      causes: ['Brak acceleratorów', 'Za niska temperatura', 'Materiał bez siarki'],
      solutions: ['Sprawdzenie składu mieszanki', 'Korekta temperatury', 'Analiza receptury']
    }
  ],

  maintenance: {
    daily: [
      'Czyszczenie komór i rotora',
      'Sprawdzenie temperatury',
      'Kontrola szczelności komór'
    ],
    weekly: [
      'Kalibracja temperatury',
      'Sprawdzenie prędkości rotacji',
      'Kontrola stanu rotora'
    ],
    monthly: [
      'Pełna kalibracja aparatu',
      'Wymiana uszczelek jeśli potrzeba',
      'Test z materiałem referencyjnym'
    ]
  }
};

export default ISO289Protocol;
