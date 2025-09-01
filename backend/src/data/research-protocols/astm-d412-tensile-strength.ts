/**
 * ASTM D412-16 - Standard Test Methods for Vulcanized Rubber and Thermoplastic Elastomers—Tension
 * Protokół badania wytrzymałości na rozciąganie wulkanizowanych kauczuków
 */

export const ASTMD412Protocol = {
  id: 'astm-d412-tensile-strength',
  title: 'ASTM D412 - Wytrzymałość na rozciąganie kauczuków',
  version: '2016',
  category: 'mechanical_properties',
  description: 'Oznaczanie właściwości wytrzymałościowych wulkanizowanych kauczuków i elastomerów termoplastycznych przy rozciąganiu',
  
  equipment: {
    required: [
      'Uniwersalna maszyna wytrzymałościowa z odpowiednią siłą',
      'Uchwyty do próbek kauczukowych (typu pneumatycznego lub mechanicznego)',
      'Ekstensometr lub system pomiaru wydłużenia',
      'Wykrojniki do próbek (typ C, typ 1, typ 2)',
      'Suwmiarka cyfrowa (dokładność ±0.01 mm)',
      'Mikrometr (dokładność ±0.001 mm)'
    ],
    optional: [
      'Kamera do pomiaru odkształceń (DIC)',
      'Komora klimatyczna do testów w kontrolowanych warunkach',
      'System automatycznego pomiaru grubości',
      'Oprogramowanie do analizy krzywej naprężenie-odkształcenie'
    ]
  },

  testConditions: {
    temperature: '23 ± 2°C (standardowo)',
    humidity: '50 ± 5% RH',
    testSpeed: [
      '500 ± 50 mm/min (standardowo)',
      '50 ± 5 mm/min (dla materiałów twardych)',
      '200 ± 20 mm/min (alternatywnie)'
    ],
    sampleTypes: [
      { type: 'C', width: '6.00 ± 0.05 mm', length: '25 mm', radius: '8.5 mm' },
      { type: '1', width: '6.00 ± 0.05 mm', length: '33 mm', radius: '14 mm' },
      { type: '2', width: '6.00 ± 0.05 mm', length: '25 mm', radius: '8.5 mm' }
    ]
  },

  steps: [
    {
      id: 'sample-preparation',
      title: 'Przygotowanie próbek',
      duration: '45-60 minut',
      instructions: [
        '1. **Wybór materiału**: Pobierz reprezentatywną próbkę wulkanizowanego kauczuku',
        '2. **Grubość płyty**: Użyj płyt o grubości 2.0 ± 0.2 mm (standardowo)',
        '3. **Wykrawanie**: Wykrój próbki odpowiednim wykrojnikiem:',
        '   - Typ C: do materiałów o twardości <50 Shore A',
        '   - Typ 1: do materiałów twardszych',
        '   - Typ 2: dla porównań międzynarodowych',
        '4. **Kontrola wymiarów**: Zmierz wymiary każdej próbki:',
        '   - Szerokość w 3 miejscach części roboczej',
        '   - Grubość w 5 miejscach',
        '   - Długość części roboczej',
        '5. **Oznaczenie**: Oznacz próbki numerami (minimum 5 próbek)',
        '6. **Kondycjonowanie**: Kondycjonuj w 23±2°C przez minimum 3 godziny'
      ],
      safety: [
        'Używaj ostrożnie wykrojników - bardzo ostre krawędzie',
        'Noś okulary ochronne podczas wykrawania',
        'Uważaj na odkształcenia próbki podczas pomiaru'
      ],
      tips: [
        'Wykrawaj próbki jednym zdecydowanym ruchem',
        'Unikaj rozciągania próbki podczas pomiaru wymiarów',
        'Sprawdź czy krawędzie są gładkie bez karbów',
        'Próbki powinny być płaskie bez fałdów'
      ]
    },
    {
      id: 'apparatus-setup',
      title: 'Przygotowanie aparatury',
      duration: '30 minut',
      instructions: [
        '1. **Kalibracja siły**: Sprawdź kalibrację czujnika siły',
        '2. **Ustawienie prędkości**: Ustaw prędkość rozciągania na 500 ± 50 mm/min',
        '3. **Montaż uchwytów**: Zamontuj odpowiednie uchwyty dla próbek kauczukowych',
        '4. **Sprawdzenie współosiowości**: Sprawdź współosiowość uchwytów',
        '5. **Kalibracja ekstensometru**: Skalibruj system pomiaru wydłużenia',
        '6. **Test zerowy**: Wykonaj test zerowy dla sprawdzenia systemu',
        '7. **Ustawienia oprogramowania**: Skonfiguruj parametry testu'
      ],
      safety: [
        'Sprawdź czy wszystkie osłony bezpieczeństwa są na miejscu',
        'Ustaw odpowiednie granice siły dla ochrony próbki',
        'Upewnij się że przycisk STOP jest dostępny'
      ],
      tips: [
        'Uchwyty powinny być czyste i bez uszkodzeń',
        'Sprawdź czy nie ma luzu w mechanizmach',
        'Ustawienia powinny być zapisane jako profil standardowy'
      ]
    },
    {
      id: 'sample-mounting',
      title: 'Montaż próbki',
      duration: '5 minut na próbkę',
      instructions: [
        '1. **Pozycjonowanie**: Umieść próbkę w środku szczęk uchwytu',
        '2. **Równoległość**: Upewnij się że próbka jest równoległa do osi rozciągania',
        '3. **Docisk**: Delikatnie dociśnij szczęki aby zabezpieczyć próbkę',
        '4. **Kontrola długości**: Sprawdź początkową długość pomiarową (L₀)',
        '5. **Oznaczenie punktów**: Nanieś znaczniki do pomiaru wydłużenia (jeśli używany ekstensometr)',
        '6. **Sprawdzenie luzu**: Upewnij się że próbka nie jest wstępnie naprężona'
      ],
      safety: [
        'Nie dokręcaj uchwytów zbyt mocno - może to uszkodzić próbkę',
        'Uważaj na ostre krawędzie uchwytów',
        'Zachowaj palce z daleka od stref zaciskania'
      ],
      tips: [
        'Próbka powinna być symetrycznie zamocowana',
        'Długość pomiarowa powinna być zgodna z normą',
        'Sprawdź czy próbka nie ześlizgnie się podczas testu'
      ]
    },
    {
      id: 'tensile-test',
      title: 'Wykonanie testu rozciągania',
      duration: '2-5 minut na próbkę',
      instructions: [
        '1. **Zerowanie**: Wyzeruj czujniki siły i przemieszczenia',
        '2. **Start testu**: Uruchom test z ustawioną prędkością',
        '3. **Monitoring**: Obserwuj krzywą naprężenie-odkształcenie w czasie rzeczywistym',
        '4. **Rejestracja danych**: Zapisuj dane z częstotliwością minimum 10 Hz',
        '5. **Obserwacja zerwania**: Notuj sposób i miejsce zerwania próbki',
        '6. **Zatrzymanie**: Test kończy się automatycznie po zerwaniu próbki',
        '7. **Zapis krzywej**: Zapisz kompletną krzywą S-S (naprężenie-odkształcenie)'
      ],
      safety: [
        'Nie zbliżaj się do próbki podczas testu',
        'Obserwuj test przez osłonę bezpieczeństwa',
        'Bądź gotowy na nagłe zerwanie próbki'
      ],
      tips: [
        'Krzywa powinna być płynna bez skoków',
        'Zwracaj uwagę na sposób zerwania (w części roboczej vs. w uchwytach)',
        'Niektóre materiały mogą wykazywać wydłużenie >500%'
      ]
    },
    {
      id: 'data-analysis',
      title: 'Analiza danych',
      duration: '15-20 minut',
      instructions: [
        '1. **Naprężenie przy zerwaniu (σᵦ)**:',
        '   σᵦ = Fmax / A₀ [MPa]',
        '   gdzie: Fmax = maksymalna siła, A₀ = pole przekroju początkowego',
        '',
        '2. **Wydłużenie przy zerwaniu (εᵦ)**:',
        '   εᵦ = (Lᵦ - L₀) / L₀ × 100% [%]',
        '   gdzie: Lᵦ = długość przy zerwaniu, L₀ = długość początkowa',
        '',
        '3. **Moduł sprężystości (E)**:',
        '   E = Δσ / Δε [MPa] (z części liniowej krzywej)',
        '',
        '4. **Naprężenia przy zadanych wydłużeniach**:',
        '   σ₁₀₀, σ₂₀₀, σ₃₀₀ = naprężenia przy 100%, 200%, 300% wydłużenia',
        '',
        '5. **Energia do zerwania**: Pole pod krzywą S-S do punktu zerwania'
      ],
      safety: [],
      tips: [
        'Odrzuć próbki które zerwały się w uchwytach',
        'Dla modułu używaj części liniowej krzywej (zazwyczaj 10-40% wydłużenia)',
        'Sprawdź czy wyniki są spójne między próbkami'
      ]
    },
    {
      id: 'statistical-analysis',
      title: 'Analiza statystyczna',
      duration: '10 minut',
      instructions: [
        '1. **Wartości średnie**: Oblicz średnie arytmetyczne wszystkich parametrów',
        '2. **Odchylenie standardowe**: Oblicz odchylenie standardowe dla każdego parametru',
        '3. **Współczynnik zmienności**: CV = (s/x̄) × 100%',
        '4. **Wartości odstające**: Sprawdź metodą Dixona lub Grubbsa',
        '5. **Minimum próbek**: Użyj minimum 5 próbek do obliczeń',
        '6. **Przedziały ufności**: Oblicz przedziały ufności 95%'
      ],
      safety: [],
      tips: [
        'Typowy CV dla kauczuków: 5-15%',
        'Jeśli CV > 20%, sprawdź przygotowanie próbek',
        'Zachowaj wszystkie dane do dokumentacji'
      ]
    },
    {
      id: 'reporting',
      title: 'Raportowanie wyników',
      duration: '20 minut',
      instructions: [
        '1. **Protokół badania** powinien zawierać:',
        '   - Identyfikację materiału i próbek',
        '   - Warunki badania (temperatura, wilgotność, prędkość)',
        '   - Typ próbki (C, 1, lub 2)',
        '   - Wymiary próbek',
        '   - Wyniki poszczególnych próbek',
        '   - Wartości średnie z odchyleniami standardowymi',
        '   - Krzywe naprężenie-odkształcenie',
        '',
        '2. **Format raportowania**:',
        '   - Wytrzymałość na rozciąganie: XX.X ± Y.Y MPa',
        '   - Wydłużenie przy zerwaniu: XXX ± YY %',
        '   - Moduł przy 100%: XX.X ± Y.Y MPa',
        '',
        '3. **Dokumentacja graficzna**:',
        '   - Reprezentatywne krzywe S-S',
        '   - Zdjęcia próbek po zerwaniu',
        '   - Wykresy statystyczne'
      ],
      safety: [],
      tips: [
        'Dołącz informacje o sposobie zerwania próbek',
        'Porównaj wyniki z danymi producenta lub normami',
        'Zachowaj fragmenty próbek do ewentualnej weryfikacji'
      ]
    }
  ],

  calculations: {
    tensile_strength: {
      formula: 'σᵦ = Fmax / A₀',
      units: 'MPa',
      description: 'Wytrzymałość na rozciąganie'
    },
    elongation_at_break: {
      formula: 'εᵦ = ((Lᵦ - L₀) / L₀) × 100',
      units: '%',
      description: 'Wydłużenie przy zerwaniu'
    },
    modulus: {
      formula: 'E = Δσ / Δε',
      units: 'MPa',
      description: 'Moduł sprężystości'
    },
    stress_at_strain: {
      formula: 'σₓ = F / A₀ przy x% wydłużenia',
      units: 'MPa',
      description: 'Naprężenie przy zadanym wydłużeniu'
    }
  },

  acceptance_criteria: {
    sample_count: 'Minimum 5 próbek',
    cv_limit: 'Współczynnik zmienności ≤ 20%',
    break_location: 'Zerwanie w części roboczej próbki',
    temperature_tolerance: '± 2°C',
    speed_tolerance: '± 10%'
  },

  typical_values: [
    { material: 'NR (miękki)', tensile_strength: '15-25 MPa', elongation: '400-700%' },
    { material: 'NR (twardy)', tensile_strength: '20-35 MPa', elongation: '300-500%' },
    { material: 'SBR', tensile_strength: '10-25 MPa', elongation: '300-600%' },
    { material: 'NBR', tensile_strength: '15-30 MPa', elongation: '200-500%' },
    { material: 'EPDM', tensile_strength: '10-20 MPa', elongation: '300-600%' },
    { material: 'Silikon', tensile_strength: '4-10 MPa', elongation: '100-800%' }
  ],

  common_issues: [
    {
      problem: 'Zerwanie w uchwytach',
      causes: ['Zbyt mocny docisk', 'Ostre krawędzie uchwytów', 'Nieprawidłowe pozycjonowanie'],
      solutions: ['Zmniejsz siłę docisku', 'Sprawdź stan uchwytów', 'Lepsze wyśrodkowanie próbki']
    },
    {
      problem: 'Duże rozrzuty wyników',
      causes: ['Niejednorodność materiału', 'Błędy w przygotowaniu próbek', 'Niestabilne warunki'],
      solutions: ['Sprawdź jakość materiału', 'Popraw technike wykrawania', 'Kontroluj warunki środowiskowe']
    },
    {
      problem: 'Nieprawidłowa krzywa S-S',
      causes: ['Poślizg w uchwytach', 'Błąd kalibracji', 'Za duża prędkość testu'],
      solutions: ['Zwiększ docisk (ostrożnie)', 'Sprawdź kalibrację', 'Zmniejsz prędkość testu']
    },
    {
      problem: 'Przedwczesne zerwanie',
      causes: ['Karby w próbce', 'Uszkodzenia przy wykrawaniu', 'Wady materiałowe'],
      solutions: ['Sprawdź ostrość wykrojnika', 'Popraw technikę wykrawania', 'Wybierz lepszy fragment materiału']
    }
  ]
};

export default ASTMD412Protocol;
