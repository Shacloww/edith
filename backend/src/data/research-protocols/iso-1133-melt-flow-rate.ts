/**
 * ISO 1133-1:2011 - Plastics — Determination of the melt mass-flow rate (MFR) and melt volume-flow rate (MVR) of thermoplastics
 * Protokół badania wskaźnika płynięcia termoplastów
 */

export const ISO1133Protocol = {
  id: 'iso-1133-mfr',
  title: 'ISO 1133 - Wskaźnik płynięcia termoplastów (MFR/MVR)',
  version: '2011',
  category: 'rheology',
  description: 'Oznaczanie wskaźnika płynięcia masy (MFR) i objętości (MVR) termoplastów',
  
  equipment: {
    required: [
      'Plastometr do badania wskaźnika płynięcia zgodny z ISO 1133',
      'Waga analityczna (dokładność ±0,001 g)',
      'Suszarka lub piec do kondycjonowania próbek',
      'Narzędzia do cięcia próbek',
      'Sekundomierz lub timer cyfrowy'
    ],
    optional: [
      'Mieszadło do homogenizacji materiału',
      'Forma do przygotowania próbek',
      'Mikrometr do pomiaru grubości'
    ]
  },

  testConditions: {
    temperature: {
      ranges: [
        { material: 'PE', temperature: '190°C', load: '2.16 kg' },
        { material: 'PP', temperature: '230°C', load: '2.16 kg' },
        { material: 'PS', temperature: '200°C', load: '5.0 kg' },
        { material: 'ABS', temperature: '220°C', load: '10.0 kg' },
        { material: 'PC', temperature: '300°C', load: '1.2 kg' },
        { material: 'POM', temperature: '190°C', load: '2.16 kg' }
      ]
    },
    loads: ['0.325 kg', '1.2 kg', '2.16 kg', '3.8 kg', '5.0 kg', '10.0 kg', '21.6 kg'],
    preheatingTime: '300 ± 30 sekund',
    cuttingInterval: '10 ± 0.1 sekund lub 30 ± 0.1 sekund'
  },

  steps: [
    {
      id: 'preparation',
      title: 'Przygotowanie próbki',
      duration: '15-30 minut',
      instructions: [
        '1. **Wybór próbki**: Pobierz reprezentatywną próbkę materiału (minimum 5-8 g)',
        '2. **Kondycjonowanie**: Wysusz próbkę zgodnie z wymaganiami materiału:',
        '   - PE/PP: 80°C przez 4 godziny',
        '   - PS: 80°C przez 2 godziny', 
        '   - ABS: 80°C przez 2-4 godziny',
        '   - PC: 120°C przez 4 godziny',
        '3. **Homogenizacja**: Wymieszaj materiał aby zapewnić jednorodność',
        '4. **Kontrola**: Sprawdź czy próbka nie zawiera zanieczyszczeń lub defektów'
      ],
      safety: [
        'Używaj rękawic ochronnych podczas pracy z gorącym materiałem',
        'Zapewnij odpowiednią wentylację w pomieszczeniu',
        'Uważaj na ostre krawędzie podczas cięcia próbek'
      ],
      tips: [
        'Próbka powinna być sucha - wilgoć może wpłynąć na wyniki',
        'Unikaj próbek z widocznymi defektami lub zanieczyszczeniami',
        'Przechowuj przygotowane próbki w suchym miejscu'
      ]
    },
    {
      id: 'apparatus-setup',
      title: 'Przygotowanie aparatury',
      duration: '20-30 minut',
      instructions: [
        '1. **Czyszczenie**: Dokładnie wyczyść cylinder i tłok plastometru',
        '2. **Montaż**: Zamontuj odpowiednią dyszę (średnica 2.095 ± 0.005 mm, długość 8.000 ± 0.025 mm)',
        '3. **Ustawienie temperatury**: Ustaw temperaturę zgodnie z normą dla badanego materiału',
        '4. **Stabilizacja**: Poczekaj na stabilizację temperatury (±0.5°C)',
        '5. **Kalibracja**: Sprawdź kalibrację wagi i timera',
        '6. **Obciążenie**: Przygotuj odpowiednie obciążenie dla materiału'
      ],
      safety: [
        'Nie dotykaj gorących powierzchni plastometru',
        'Upewnij się że aparat jest prawidłowo uziemiony',
        'Sprawdź czy wszystkie połączenia są bezpieczne'
      ],
      tips: [
        'Temperatura powinna być stabilna przez co najmniej 15 minut przed testem',
        'Sprawdź czy dysza nie jest zablokowana',
        'Upewnij się że tłok porusza się swobodnie'
      ]
    },
    {
      id: 'sample-loading',
      title: 'Wprowadzenie próbki',
      duration: '5-10 minut',
      instructions: [
        '1. **Czyszczenie**: Wyczyść cylinder z pozostałości poprzedniego materiału',
        '2. **Ładowanie**: Wprowadź próbkę (3-8 g) do cylindra plastometru',
        '3. **Zagęszczenie**: Lekko zagęść materiał za pomocą tłoka',
        '4. **Obciążenie**: Nałóż odpowiednie obciążenie na tłok',
        '5. **Wstępne podgrzanie**: Poczekaj 300 ± 30 sekund na wygrzanie materiału'
      ],
      safety: [
        'Używaj narzędzi do wprowadzania próbki - nie używaj palców',
        'Uważaj na gorące pary wydobywające się z cylindra',
        'Nie nadmiernie zagęszczaj materiału'
      ],
      tips: [
        'Materiał powinien wypełnić cylinder równomiernie',
        'Unikaj wprowadzania powietrza do cylindra',
        'Obserwuj czy materiał zaczyna wypływać z dyszy'
      ]
    },
    {
      id: 'preheating',
      title: 'Wygrzewanie wstępne',
      duration: '5 minut',
      instructions: [
        '1. **Timer**: Uruchom timer na 300 ± 30 sekund',
        '2. **Obserwacja**: Obserwuj czy materiał zaczyna wypływać z dyszy',
        '3. **Czyszczenie**: Usuń materiał wypływający podczas wygrzewania',
        '4. **Przygotowanie**: Przygotuj narzędzia do cięcia próbek',
        '5. **Kontrola**: Sprawdź czy temperatura jest stabilna'
      ],
      safety: [
        'Nie blokuj wypływu materiału z dyszy',
        'Uważaj na gorący materiał wypływający z aparatu',
        'Zachowaj bezpieczną odległość od gorących części'
      ],
      tips: [
        'Pierwsza porcja materiału może zawierać pęcherzyki powietrza',
        'Materiał powinien wypływać równomiernie',
        'Jeśli materiał nie wypływa, sprawdź temperaturę i obciążenie'
      ]
    },
    {
      id: 'measurement',
      title: 'Pomiar MFR/MVR',
      duration: '10-15 minut',
      instructions: [
        '1. **Rozpoczęcie pomiaru**: Po zakończeniu wygrzewania rozpocznij pomiar',
        '2. **Cięcie próbek**: Tnij próbki co 10 ± 0.1 s lub 30 ± 0.1 s',
        '3. **Zbieranie**: Zbierz minimum 6-8 próbek o podobnej masie',
        '4. **Ważenie**: Zważ każdą próbkę z dokładnością do 0.001 g',
        '5. **Pomiar objętości**: Dla MVR zmierz również gęstość próbek'
      ],
      safety: [
        'Używaj odpowiednich narzędzi do cięcia gorącego materiału',
        'Uważaj na ostre krawędzie narzędzi tnących',
        'Nie dotykaj gorących próbek gołymi rękami'
      ],
      tips: [
        'Próbki powinny mieć podobną masę (odchylenie <10%)',
        'Tnij próbki jednym zdecydowanym ruchem',
        'Zapisuj czas cięcia każdej próbki'
      ]
    },
    {
      id: 'calculation',
      title: 'Obliczenia wyników',
      duration: '10 minut',
      instructions: [
        '1. **MFR**: Oblicz wskaźnik płynięcia masy według wzoru:',
        '   MFR = (600 × m) / t [g/10min]',
        '   gdzie: m = średnia masa próbki [g], t = czas cięcia [s]',
        '',
        '2. **MVR**: Oblicz wskaźnik płynięcia objętości według wzoru:',
        '   MVR = MFR / ρ [cm³/10min]',
        '   gdzie: ρ = gęstość materiału [g/cm³]',
        '',
        '3. **Niepewność**: Oblicz odchylenie standardowe z próbek',
        '4. **Walidacja**: Sprawdź czy wyniki mieszczą się w akceptowalnym zakresie'
      ],
      safety: [],
      tips: [
        'Odrzuć próbki o masie różniącej się więcej niż 10% od średniej',
        'Gęstość można zmierzyć piknometrem lub metodą wyporu',
        'Zapisz wszystkie parametry testu w protokole'
      ]
    },
    {
      id: 'reporting',
      title: 'Raportowanie wyników',
      duration: '15 minut',
      instructions: [
        '1. **Protokół**: Wypełnij kompletny protokół badania zawierający:',
        '   - Identyfikację próbki',
        '   - Warunki badania (temperatura, obciążenie)',
        '   - Czas wygrzewania',
        '   - Wyniki poszczególnych pomiarów',
        '   - Wartości średnie MFR/MVR',
        '   - Odchylenie standardowe',
        '',
        '2. **Format wyniku**: MFR/MVR (temperatura/obciążenie)',
        '   Przykład: MFR = 12.5 g/10min (190°C/2.16 kg)',
        '',
        '3. **Dokumentacja**: Dołącz zdjęcia próbek i warunków badania'
      ],
      safety: [],
      tips: [
        'Zachowaj próbki do ewentualnej weryfikacji',
        'Zapisz wszystkie obserwacje podczas badania',
        'Porównaj wyniki z danymi producenta materiału'
      ]
    }
  ],

  calculations: {
    mfr: {
      formula: 'MFR = (600 × m) / t',
      units: 'g/10min',
      description: 'Wskaźnik płynięcia masy'
    },
    mvr: {
      formula: 'MVR = MFR / ρ',
      units: 'cm³/10min', 
      description: 'Wskaźnik płynięcia objętości'
    }
  },

  acceptance_criteria: {
    repeatability: 'Współczynnik zmienności ≤ 10%',
    sample_count: 'Minimum 6 próbek',
    temperature_tolerance: '± 0.5°C',
    time_tolerance: '± 0.1 s'
  },

  common_issues: [
    {
      problem: 'Materiał nie wypływa z dyszy',
      causes: ['Za niska temperatura', 'Zablokowana dysza', 'Za małe obciążenie'],
      solutions: ['Sprawdź ustawienia temperatury', 'Wyczyść dyszę', 'Zwiększ obciążenie']
    },
    {
      problem: 'Nieregularny wypływ materiału',
      causes: ['Pęcherzyki powietrza', 'Niejednorodna próbka', 'Zanieczyszczenia'],
      solutions: ['Przedłuż czas wygrzewania', 'Przygotuj nową próbkę', 'Wyczyść aparat']
    },
    {
      problem: 'Duże rozrzuty wyników',
      causes: ['Niestabilna temperatura', 'Błędy w cięciu', 'Niejednorodny materiał'],
      solutions: ['Sprawdź kalibrację aparatu', 'Popraw technikę cięcia', 'Lepiej wymieszaj materiał']
    }
  ]
};

export default ISO1133Protocol;
