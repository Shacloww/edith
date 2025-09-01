import { CreateResearchSchemaDto } from '../types';

// Predefiniowane schematy badawcze zgodne z normami ISO i ASTM
export const predefinedSchemas: CreateResearchSchemaDto[] = [
  {
    title: "ISO 1133 - Ocena wskaźnika szybkości płynięcia (MFR/MVR)",
    description: "Badanie wskaźnika szybkości płynięcia dla analizy parametrów przetwórczych tworzywa i jego zachowania podczas wytłaczania",
    questions: [
      {
        id: "1",
        title: "Materiał testowy",
        type: "TEXT",
        required: true,
        description: "Podaj nazwę i typ materiału poddawanego badaniu"
      },
      {
        id: "2", 
        title: "Temperatura badania",
        type: "NUMBER",
        required: true,
        description: "Temperatura w °C (standardowe: 190°C, 200°C, 230°C w zależności od materiału)"
      },
      {
        id: "3",
        title: "Obciążenie",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"2,16 kg (standardowe dla PE)",
"5 kg",
"10 kg (standardowe dla PP)",
"21,6 kg (standardowe dla PS)"
        ],
        description: "Masa obciążnika w kg"
      },
      {
        id: "4",
        title: "Czas przygotowania próbki",
        type: "NUMBER",
        required: true,
        description: "Czas kondycjonowania w minutach (standardowo 4 min)"
      },
      {
        id: "5",
        title: "Czas odcięcia",
        type: "NUMBER", 
        required: true,
        description: "Czas zbierania próbki w sekundach (standardowo 10 s)"
      },
      {
        id: "6",
        title: "Wynik MFR",
        type: "NUMBER",
        required: true,
        description: "Wskaźnik szybkości płynięcia w g/10min"
      },
      {
        id: "7",
        title: "Norma zastosowana",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"ISO 1133-1 (metoda A - MFR)",
"ISO 1133-2 (metoda B - MVR)"
        ]
      },
      {
        id: "8",
        title: "Uwagi dodatkowe",
        type: "TEXT",
        required: false,
        description: "Obserwacje dotyczące płynięcia, jednolitości itp."
      }
    ]
  },
  {
    title: "ISO 289 - Pomiar lepkości Mooneya",
    description: "Badanie lepkości Mooneya dla oceny elastyczności i przetwarzalności elastomerów w stanie niezwulkanizowanym",
    questions: [
      {
        id: "1",
        title: "Typ elastomeru",
        type: "TEXT",
        required: true,
        description: "Rodzaj gumy/elastomeru (np. NR, SBR, EPDM)"
      },
      {
        id: "2",
        title: "Temperatura badania",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"100°C (standardowa)",
"120°C",
"125°C"
        ],
        description: "Temperatura pomiaru w °C"
      },
      {
        id: "3",
        title: "Typ rotora",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Duży rotor (ML)",
"Mały rotor (MS)"
        ]
      },
      {
        id: "4",
        title: "Czas pomiaru",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"1 minuta",
"4 minuty (standardowy)",
"8 minut"
        ]
      },
      {
        id: "5",
        title: "Grubość próbki",
        type: "NUMBER",
        required: true,
        description: "Grubość próbki w mm (5,0 ± 0,3 mm)"
      },
      {
        id: "6",
        title: "Wynik lepkości Mooneya",
        type: "NUMBER",
        required: true,
        description: "Wynik w jednostkach Mooneya"
      },
      {
        id: "7",
        title: "Czas żelowania t5",
        type: "NUMBER",
        required: false,
        description: "Czas wzrostu lepkości o 5 punktów (min)"
      },
      {
        id: "8",
        title: "Uwagi",
        type: "TEXT",
        required: false,
        description: "Obserwacje dotyczące żelowania, jednorodności próbki"
      }
    ]
  },
  {
    title: "Finat FTM 8 - Test odporności na ścinanie statyczne",
    description: "Badanie zdolności materiału do utrzymania przyczepności pod długotrwałym obciążeniem statycznym",
    questions: [
      {
        id: "1",
        title: "Typ taśmy/materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego materiału samoprzylepnego"
      },
      {
        id: "2",
        title: "Podłoże testowe",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Stal nierdzewna",
"Szkło",
"Polietylen",
"Polipropylen"
        ]
      },
      {
        id: "3",
        title: "Powierzchnia kontaktu",
        type: "TEXT",
        required: true,
        description: "Wymiary powierzchni klejenia (standardowo 25mm x 25mm)"
      },
      {
        id: "4",
        title: "Temperatura badania",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"23°C ± 2°C (temperatura pokojowa)",
"40°C",
"70°C"
        ]
      },
      {
        id: "5",
        title: "Obciążenie",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"1 kg",
"2 kg",
"5 kg"
        ],
        description: "Masa obciążnika w kg"
      },
      {
        id: "6",
        title: "Czas do oderwania",
        type: "NUMBER",
        required: true,
        description: "Czas w minutach do całkowitego oderwania próbki"
      },
      {
        id: "7",
        title: "Typ zniszczenia",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Adhezyjne (oderwanie od podłoża)",
"Kohezyjne (rozerwanie kleju)",
"Mieszane"
        ]
      },
      {
        id: "8",
        title: "Wilgotność względna",
        type: "NUMBER",
        required: false,
        description: "Wilgotność względna podczas testu (%)"
      }
    ]
  },
  {
    title: "Finat FTM 18 - Badanie odporności na ścinanie dynamiczne",
    description: "Test trwałości i niezawodności w środowiskach narażonych na zmienne siły mechaniczne",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego materiału samoprzylepnego"
      },
      {
        id: "2",
        title: "Podłoże testowe",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Stal nierdzewna",
"Szkło",
"Aluminium"
        ]
      },
      {
        id: "3",
        title: "Częstotliwość obciążenia",
        type: "NUMBER",
        required: true,
        description: "Częstotliwość cykli w Hz (standardowo 1 Hz)"
      },
      {
        id: "4",
        title: "Amplituda przesunięcia",
        type: "NUMBER",
        required: true,
        description: "Maksymalne przesunięcie w mm"
      },
      {
        id: "5",
        title: "Siła obciążenia",
        type: "NUMBER",
        required: true,
        description: "Siła w N przyłożona podczas testu"
      },
      {
        id: "6",
        title: "Liczba cykli do zniszczenia",
        type: "NUMBER",
        required: true,
        description: "Ilość cykli przed całkowitym zniszczeniem"
      },
      {
        id: "7",
        title: "Temperatura testu",
        type: "NUMBER",
        required: true,
        description: "Temperatura w °C"
      },
      {
        id: "8",
        title: "Charakterystyka zniszczenia",
        type: "TEXT",
        required: false,
        description: "Opis procesu degradacji i typu zniszczenia"
      }
    ]
  },
  {
    title: "Finat FTM 1 - Ocena odporności na odrywanie pod kątem 180°",
    description: "Kluczowe badanie dla oceny trwałości adhezji w wymagających zastosowaniach",
    questions: [
      {
        id: "1",
        title: "Typ taśmy",
        type: "TEXT",
        required: true,
        description: "Rodzaj i szerokość badanej taśmy samoprzylepnej"
      },
      {
        id: "2",
        title: "Szerokość próbki",
        type: "NUMBER",
        required: true,
        description: "Szerokość próbki w mm (standardowo 25 mm)"
      },
      {
        id: "3",
        title: "Podłoże testowe",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Stal nierdzewna",
"Szkło",
"Polietylen HD",
"PMMA (akryl)"
        ]
      },
      {
        id: "4",
        title: "Prędkość odrywania",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"300 mm/min (standardowa)",
"150 mm/min",
"600 mm/min"
        ]
      },
      {
        id: "5",
        title: "Czas kontaktu",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"20 minut",
"24 godziny (standardowy)",
"7 dni"
        ]
      },
      {
        id: "6",
        title: "Siła przyczepności",
        type: "NUMBER",
        required: true,
        description: "Średnia siła odrywania w N/25mm"
      },
      {
        id: "7",
        title: "Typ zniszczenia",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Adhezyjne (czyste oderwanie)",
"Kohezyjne (rozerwanie kleju)",
"Mieszane",
"Zniszczenie substratu"
        ]
      },
      {
        id: "8",
        title: "Temperatura i wilgotność",
        type: "TEXT",
        required: false,
        description: "Warunki środowiskowe podczas testu"
      }
    ]
  },
  {
    title: "ISO 2137 - Pomiar penetracji",
    description: "Badanie konsystencji i plastyczności materiałów, szczególnie przydatne w analizie mieszanek butylowych",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego materiału (np. guma butylowa, masa uszczelniająca)"
      },
      {
        id: "2",
        title: "Temperatura próbki",
        type: "NUMBER",
        required: true,
        description: "Temperatura kondycjonowania w °C (standardowo 25°C)"
      },
      {
        id: "3",
        title: "Czas kondycjonowania",
        type: "NUMBER",
        required: true,
        description: "Czas w godzinach przed testem"
      },
      {
        id: "4",
        title: "Typ penetrometru",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Stożek standardowy (100g)",
"Stożek modyfikowany"
        ]
      },
      {
        id: "5",
        title: "Czas penetracji",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"5 sekund (standardowy)",
"10 sekund"
        ]
      },
      {
        id: "6",
        title: "Głębokość penetracji",
        type: "NUMBER",
        required: true,
        description: "Wynik w 0,1 mm (dziesiąte części milimetra)"
      },
      {
        id: "7",
        title: "Liczba pomiarów",
        type: "NUMBER",
        required: true,
        description: "Ilość wykonanych pomiarów (minimum 3)"
      },
      {
        id: "8",
        title: "Jednorodność materiału",
        type: "SINGLE_CHOICE",
        required: false,
        options: [
"Materiał jednorodny",
"Materiał niejednorodny",
"Struktura warstwowa"
        ]
      }
    ]
  },
  {
    title: "ASTM C772 - Test migracji plastyfikatora",
    description: "Istotny test dla oceny stabilności chemicznej materiałów w długoterminowych zastosowaniach",
    questions: [
      {
        id: "1",
        title: "Typ plastyfikatora",
        type: "TEXT",
        required: true,
        description: "Nazwa i typ zastosowanego plastyfikatora"
      },
      {
        id: "2",
        title: "Materiał absorbujący",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Węgiel aktywny",
"Żel krzemionkowy",
"Papier filtracyjny"
        ]
      },
      {
        id: "3",
        title: "Temperatura testu",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"70°C",
"80°C",
"100°C"
        ]
      },
      {
        id: "4",
        title: "Czas ekspozycji",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"24 godziny",
"168 godzin (7 dni)",
"336 godzin (14 dni)"
        ]
      },
      {
        id: "5",
        title: "Masa początkowa próbki",
        type: "NUMBER",
        required: true,
        description: "Masa początkowa w gramach"
      },
      {
        id: "6",
        title: "Masa końcowa próbki",
        type: "NUMBER",
        required: true,
        description: "Masa po ekspozycji w gramach"
      },
      {
        id: "7",
        title: "Ubytek masy",
        type: "NUMBER",
        required: true,
        description: "Procentowy ubytek masy (%)"
      },
      {
        id: "8",
        title: "Zmiany wizualne",
        type: "TEXT",
        required: false,
        description: "Obserwacje zmian koloru, faktury, elastyczności"
      }
    ]
  },
  {
    title: "ISO 1183 - Badanie gęstości",
    description: "Kluczowe dla oceny jednorodności mieszanek oraz ich efektywności logistycznej",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego tworzywa lub kompozytu"
      },
      {
        id: "2",
        title: "Metoda pomiaru",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Metoda A - Metoda zanurzenia",
"Metoda B - Piknometr",
"Metoda C - Kolumna gradientowa"
        ]
      },
      {
        id: "3",
        title: "Temperatura pomiaru",
        type: "NUMBER",
        required: true,
        description: "Temperatura w °C (standardowo 23°C)"
      },
      {
        id: "4",
        title: "Ciecz zanurzeniowa",
        type: "SINGLE_CHOICE",
        required: false,
        options: [
"Etanol",
"Woda destylowana",
"Izopropanol"
        ]
      },
      {
        id: "5",
        title: "Gęstość próbki",
        type: "NUMBER",
        required: true,
        description: "Wynik w g/cm³"
      },
      {
        id: "6",
        title: "Masa próbki",
        type: "NUMBER",
        required: true,
        description: "Masa próbki w gramach"
      },
      {
        id: "7",
        title: "Jednorodność",
        type: "SINGLE_CHOICE",
        required: false,
        options: [
"Próbka jednorodna",
"Obecność porów",
"Wtrącenia/zanieczyszczenia"
        ]
      },
      {
        id: "8",
        title: "Uwagi",
        type: "TEXT",
        required: false,
        description: "Dodatkowe obserwacje dotyczące próbki"
      }
    ]
  },
  {
    title: "ISO 11357 - Różnicowa kalorymetria skaningowa (DSC)",
    description: "Ocena stabilności termicznej i analiza starzeniowa materiałów",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego polimeru/materiału"
      },
      {
        id: "2",
        title: "Masa próbki",
        type: "NUMBER",
        required: true,
        description: "Masa próbki w mg (5-20 mg)"
      },
      {
        id: "3",
        title: "Atmosfera badania",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Azot (inertna)",
"Powietrze (utleniająca)",
"Argon"
        ]
      },
      {
        id: "4",
        title: "Szybkość ogrzewania",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"10°C/min (standardowa)",
"5°C/min",
"20°C/min"
        ]
      },
      {
        id: "5",
        title: "Zakres temperatur",
        type: "TEXT",
        required: true,
        description: "Zakres temperatur badania (np. -50°C do 300°C)"
      },
      {
        id: "6",
        title: "Temperatura topnienia (Tm)",
        type: "NUMBER",
        required: false,
        description: "Temperatura topnienia w °C"
      },
      {
        id: "7",
        title: "Temperatura zeszklenia (Tg)",
        type: "NUMBER",
        required: false,
        description: "Temperatura zeszklenia w °C"
      },
      {
        id: "8",
        title: "Entalpia topnienia",
        type: "NUMBER",
        required: false,
        description: "Entalpia topnienia w J/g"
      },
      {
        id: "9",
        title: "Stabilność termiczna",
        type: "TEXT",
        required: false,
        description: "Obserwacje dotyczące degradacji termicznej"
      }
    ]
  },
  {
    title: "ISO 3451 - Określenie zawartości popiołu",
    description: "Analiza czystości i składu chemicznego materiału",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego materiału polimerowego"
      },
      {
        id: "2",
        title: "Masa próbki",
        type: "NUMBER",
        required: true,
        description: "Masa próbki przed spaleniem w gramach"
      },
      {
        id: "3",
        title: "Temperatura spalania",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"600°C ± 25°C (standardowa)",
"850°C ± 25°C"
        ]
      },
      {
        id: "4",
        title: "Czas spalania",
        type: "NUMBER",
        required: true,
        description: "Czas w minutach (standardowo 15 min na 600°C)"
      },
      {
        id: "5",
        title: "Typ pieca",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Piec muflowy",
"Piec rurowy",
"Piec z tyglem platynowym"
        ]
      },
      {
        id: "6",
        title: "Masa popiołu",
        type: "NUMBER",
        required: true,
        description: "Masa pozostałości po spaleniu w gramach"
      },
      {
        id: "7",
        title: "Zawartość popiołu",
        type: "NUMBER",
        required: true,
        description: "Procentowa zawartość popiołu (%)"
      },
      {
        id: "8",
        title: "Uwagi dotyczące popiołu",
        type: "TEXT",
        required: false,
        description: "Opis koloru, struktury pozostałości"
      }
    ]
  },
  {
    title: "UL 94 - Klasyfikacja palności",
    description: "Ocena zdolności materiału do samogaśnięcia i minimalizacji ryzyka pożarowego",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego materiału polimerowego"
      },
      {
        id: "2",
        title: "Grubość próbki",
        type: "NUMBER",
        required: true,
        description: "Grubość próbki w mm"
      },
      {
        id: "3",
        title: "Metoda testowa",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"HB - Test poziomy",
"V-0 - Test pionowy",
"V-1 - Test pionowy",
"V-2 - Test pionowy"
        ]
      },
      {
        id: "4",
        title: "Czas płomienia 1",
        type: "NUMBER",
        required: true,
        description: "Czas płomienia po pierwszym zapaleniu (s)"
      },
      {
        id: "5",
        title: "Czas płomienia 2",
        type: "NUMBER",
        required: true,
        description: "Czas płomienia po drugim zapaleniu (s)"
      },
      {
        id: "6",
        title: "Czas żarzenia",
        type: "NUMBER",
        required: false,
        description: "Czas żarzenia po ugaszeniu płomienia (s)"
      },
      {
        id: "7",
        title: "Zapalenie waty",
        type: "SINGLE_CHOICE",
        required: false,
        options: [
"Zapalenie waty",
"Brak zapalenia waty"
        ]
      },
      {
        id: "8",
        title: "Klasyfikacja UL94",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"HB - Wolno paląca poziomo",
"V-2 - Samogasnąca z kroplami",
"V-1 - Samogasnąca bez zapalenia waty",
"V-0 - Najwyższa klasa"
        ]
      }
    ]
  },
  {
    title: "ASTM D2863 - Test wskaźnika tlenowego (LOI)",
    description: "Wskazuje minimalne stężenie tlenu potrzebne do podtrzymania spalania",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego materiału"
      },
      {
        id: "2",
        title: "Wymiary próbki",
        type: "TEXT",
        required: true,
        description: "Długość x szerokość x grubość (mm)"
      },
      {
        id: "3",
        title: "Orientacja próbki",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Pionowa (standardowa)",
"Pozioma"
        ]
      },
      {
        id: "4",
        title: "Przepływ gazu",
        type: "NUMBER",
        required: true,
        description: "Przepływ mieszaniny O2/N2 w l/min"
      },
      {
        id: "5",
        title: "Temperatura testu",
        type: "NUMBER",
        required: true,
        description: "Temperatura w °C (standardowo 23°C)"
      },
      {
        id: "6",
        title: "Wskaźnik tlenowy (LOI)",
        type: "NUMBER",
        required: true,
        description: "Minimalne stężenie tlenu w % objętościowych"
      },
      {
        id: "7",
        title: "Czas płomienia",
        type: "NUMBER",
        required: true,
        description: "Czas utrzymania płomienia w sekundach"
      },
      {
        id: "8",
        title: "Charakterystyka spalania",
        type: "TEXT",
        required: false,
        description: "Obserwacje dotyczące spalania, dymu, odpadania kropli"
      }
    ]
  },
  {
    title: "ASTM E28-18 - Pomiar temperatury mięknienia metodą pierścienia i kuli",
    description: "Określenie odporności materiałów na deformację cieplną",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego materiału (asfalt, żywica, itp.)"
      },
      {
        id: "2",
        title: "Grubość próbki",
        type: "NUMBER",
        required: true,
        description: "Grubość próbki w mm"
      },
      {
        id: "3",
        title: "Średnica pierścienia",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"15,9 mm (standardowy)",
"19,1 mm"
        ]
      },
      {
        id: "4",
        title: "Masa kulki",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"3,5 g (standardowa)",
"9,5 g"
        ]
      },
      {
        id: "5",
        title: "Medium grzewcze",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Woda destylowana",
"Gliceryna",
"Olej silikonowy"
        ]
      },
      {
        id: "6",
        title: "Szybkość ogrzewania",
        type: "NUMBER",
        required: true,
        description: "Szybkość w °C/min (standardowo 5°C/min)"
      },
      {
        id: "7",
        title: "Temperatura mięknienia",
        type: "NUMBER",
        required: true,
        description: "Temperatura w °C przy której kulka przechodzi przez pierścień"
      },
      {
        id: "8",
        title: "Uwagi",
        type: "TEXT",
        required: false,
        description: "Obserwacje dotyczące procesu mięknienia"
      }
    ]
  },
  {
    title: "ISO 4892-2 - Symulacja działania światła słonecznego",
    description: "Analiza wpływu promieniowania UV na trwałość materiałów",
    questions: [
      {
        id: "1",
        title: "Typ materiału",
        type: "TEXT",
        required: true,
        description: "Rodzaj badanego materiału"
      },
      {
        id: "2",
        title: "Typ lampy",
        type: "SINGLE_CHOICE",
        required: true,
        options: [
"Lampa ksenonowa (standardowa)",
"Lampa UV fluorescencyjna",
"Lampa metal-halide"
        ]
      },
      {
        id: "3",
        title: "Irradiancja",
        type: "NUMBER",
        required: true,
        description: "Natężenie promieniowania w W/m² (standardowo 60 W/m²)"
      },
      {
        id: "4",
        title: "Temperatura panelu czarnego",
        type: "NUMBER",
        required: true,
        description: "Temperatura w °C (standardowo 65°C)"
      },
      {
        id: "5",
        title: "Wilgotność względna",
        type: "NUMBER",
        required: true,
        description: "Wilgotność względna w %"
      },
      {
        id: "6",
        title: "Czas ekspozycji",
        type: "NUMBER",
        required: true,
        description: "Czas naświetlania w godzinach"
      },
      {
        id: "7",
        title: "Cykl nawilżania",
        type: "SINGLE_CHOICE",
        required: false,
        options: [
"Bez nawilżania",
"18 min deszcz / 102 min sucho",
"Ciągłe nawilżanie"
        ]
      },
      {
        id: "8",
        title: "Zmiany właściwości",
        type: "TEXT",
        required: false,
        description: "Obserwowane zmiany koloru, elastyczności, pęknięcia"
      }
    ]
  }
];

export default predefinedSchemas;
