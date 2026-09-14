import type { NewsletterSummary } from './types';

export function getClientFallbackBriefing(lang: 'de' | 'en' | 'ru' = 'de'): NewsletterSummary {
  const generatedAt = new Date().toISOString();
  const id = `briefing-${lang}-${Date.now()}`;

  if (lang === 'ru') {
    return {
      id,
      language: 'ru',
      generatedAt,
      weekLabel: 'Календарная неделя 38 (14.09. – 20.09.2026)',
      headline: 'Начало учебного года: Важные шаги для 5-х классов, запись в кружки (AG) и расписание',
      greeting: 'Уважаемые родители и законные представители учеников Konrad-Adenauer-Gymnasium!',
      grade5Focus: {
        title: '5-й класс (Erprobungsstufe): Главные ориентиры первых недель',
        keyPoints: [
          'Адаптация и наставники (Paten): Старшеклассники-наставники помогают пятиклассникам освоиться в здании школы и привыкнуть к новым кабинетам.',
          'Карта питания в столовой (Mensa-Chip): Пожалуйста, пополните баланс счета для горячих обедов по понедельникам, средам и четвергам.',
          'Школьный дневник (Hausaufgabenheft): Проверяйте записи домашних заданий и подписи классного руководителя в первые недели.',
          'Запись в кружки и секции (AG): Открыта запись в спортивные, музыкальные и научные секции (каноэ, театр, естественные науки).',
        ],
        parentAction: 'Проверьте наличие проездного билета (Schülerticket) и защитных обложек на выданных школьных учебниках.',
      },
      executiveHighlights: [
        {
          title: 'Прием пятиклассников в школьную семью KAG',
          detail: 'Новые ученики 5-х классов успешно начали обучение. Учителя и классные руководители проводят вводные дни.',
          urgent: false,
          tag: '5-й класс',
          sourceUrl: 'https://adenauer-bonn.de/erprobungsstufe/',
        },
        {
          title: 'Запись в кружки и продленный день (AG-Wahl)',
          detail: 'Бланки выбора секций на 2026/27 уч. год необходимо сдать до 25 сентября классному руководителю.',
          urgent: true,
          tag: 'Сроки / Секции',
          sourceUrl: 'https://adenauer-bonn.de/ganztag/',
        },
        {
          title: 'Первые проверочные тесты в 6–10 классах',
          detail: 'В классах 6a, 8ac и 10a запланированы проверочные словарные тесты по иностранным языкам.',
          urgent: false,
          tag: 'Контрольные',
          sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
        },
      ],
      gradeLevelSections: [
        {
          gradeBand: 'Младшая ступень: 5–7 классы (Unterstufe)',
          items: [
            {
              title: '5-е классы: Знакомство со школой и наставничество',
              description: 'Классные руководители 5a, 5b, 5c проводят регулярные классные часы для сплочения коллектива.',
              actionItem: 'Убедитесь, что у ребенка есть спортивная форма для зала.',
            },
            {
              title: '6-е и 7-е классы: Словарные тесты по английскому',
              description: 'Классы 6a и 6b пишут короткие словарные тесты по пройденным темам учебника.',
            },
          ],
        },
        {
          gradeBand: 'Средняя и старшая ступень: 8–10 классы и Oberstufe',
          items: [
            {
              title: '8-е классы: Латынь и второй иностранный язык',
              description: 'Класс 8ac сдает первый проверочный тест по латыни 17 сентября.',
            },
            {
              title: 'Старшая ступень (Q1/Q2): Консультации по курсовым работам',
              description: 'Ученики Q1 согласовывают темы углубленных работ (Facharbeiten).',
            },
          ],
        },
      ],
      upcomingExamsAndEvents: [
        {
          date: '17.09.2026',
          time: '08:00',
          title: 'Klassenarbeit / Vokabeltest Latein (8ac)',
          cohort: '8ac',
          type: 'exam',
          details: 'Lektion 1-3 Wiederholung',
          sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
        },
        {
          date: '18.09.2026',
          time: '09:45',
          title: 'Englisch Vokabelüberprüfung (6a)',
          cohort: '6a',
          type: 'exam',
          details: 'Unit 1 Check',
          sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
        },
        {
          date: '22.09.2026',
          time: '18:30',
          title: 'Klassenpflegschaftsabende (Klassen 5 & 6)',
          cohort: '5-6',
          type: 'meeting',
          details: 'Wahl der Elternvertreter',
          sourceUrl: 'https://adenauer-bonn.de/termine/',
        },
        {
          date: '25.09.2026',
          time: '13:00',
          title: 'Abgabefrist AG-Wahlzettel 2026/27',
          cohort: 'Alle',
          type: 'event',
          details: 'Rückgabe an Klassenleitung',
          sourceUrl: 'https://adenauer-bonn.de/ganztag/',
        },
        {
          date: '02.10.2026',
          time: 'Ganztägig',
          title: 'Pädagogischer Tag (Unterrichtsfrei)',
          cohort: 'Alle',
          type: 'holiday',
          details: 'Ganztägige Lehrerkonferenz',
          sourceUrl: 'https://adenauer-bonn.de/termine/',
        },
      ],
      schoolLifeAndProjects: [
        {
          title: 'Einschulung der neuen 5. Klassen am KAG',
          summary: 'Feierliche Aufnahme in die KAG-Schulgemeinschaft mit Segensfeier und Begrüßung durch die Schulleitung.',
          sourceUrl: 'https://adenauer-bonn.de/',
          category: 'Schulleben',
        },
        {
          title: 'Kanu- und Wassersport-AG startet ins neue Schuljahr',
          summary: 'Das KAG Bonn nutzt den nahen Rhein und die Bonner Bootshäuser für einzigartige sportliche Angebote.',
          sourceUrl: 'https://adenauer-bonn.de/',
          category: 'AGs & Sport',
        },
      ],
      parentTipsAndMensa: {
        mensaNotes:
          'Столовая (Mensa) работает по длинным учебным дням (понедельник, среда, четверг). Дети находятся под присмотром дежурных педагогов.',
        importantContacts: [
          { role: 'Секретариат школы', contact: '0228 777630 / sekretariat@adenauer-bonn.de' },
          { role: 'Родительский комитет (Schulpflegschaft)', contact: 'schulpflegschaft@adenauer-bonn.de' },
        ],
        actionDeadlines: [
          { task: 'Сдача бланков записи в кружки (AG)', deadline: '25.09.2026' },
          { task: 'Проверка обложек на школьных книгах', deadline: '20.09.2026' },
        ],
      },
      closingNote: 'Желаем всем родителям и ученикам легкой и успешной учебной недели в гимназии Konrad-Adenauer-Gymnasium!',
      rawHtml: '',
    };
  }

  if (lang === 'en') {
    return {
      id,
      language: 'en',
      generatedAt,
      weekLabel: 'Calendar Week 38 (Sep 14 – Sep 20, 2026)',
      headline: 'School Year Kickoff: 5th Grade Transition Essentials, Club Registration & Key Dates',
      greeting: 'Dear Parents and Guardians of Konrad-Adenauer-Gymnasium,',
      grade5Focus: {
        title: '5th Grade (Erprobungsstufe): Essential Orientation Checklist',
        keyPoints: [
          'Student Mentors (Paten): Senior students are guiding 5th graders to classrooms, lockers, and school grounds.',
          'Cafeteria Card (Mensa): Top up your online meal account for hot lunches on Mondays, Wednesdays, and Thursdays.',
          'Homework Planner: Please inspect the student homework diary daily during the initial transition period.',
          'Clubs (AG): Registration for canoe/kayak, choir, sciences, and sports clubs is now open.',
        ],
        parentAction: 'Verify public transit pass (Schülerticket) and ensure protective book covers are on textbook loans.',
      },
      executiveHighlights: [
        {
          title: 'Welcome to Our New 5th Grade Classes',
          detail: 'Our youngest Gymnasium students were warmly received. Dedicated mentor teachers are supporting their transition.',
          urgent: false,
          tag: '5th Grade',
          sourceUrl: 'https://adenauer-bonn.de/erprobungsstufe/',
        },
        {
          title: 'Extracurricular Club (AG) Registration',
          detail: 'Choose sports, arts, and science clubs for 2026/27. Return registration forms to class teachers by Sept 25.',
          urgent: true,
          tag: 'Clubs Deadline',
          sourceUrl: 'https://adenauer-bonn.de/ganztag/',
        },
        {
          title: 'First Vocabulary Checks (Grades 6–10)',
          detail: 'Initial vocabulary checkpoints in English and Latin take place this week. Check the schedule below.',
          urgent: false,
          tag: 'Exams',
          sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
        },
      ],
      gradeLevelSections: [
        {
          gradeBand: 'Lower Secondary: Grades 5–7 (Unterstufe)',
          items: [
            {
              title: 'Grade 5: Class Bonding & Routines',
              description: 'Classes 5a, 5b, and 5c have dedicated class advisor hours to settle into Gymnasium expectations.',
              actionItem: 'Pack indoor gym shoes and labeled water bottles.',
            },
            {
              title: 'Grades 6 & 7: Vocabulary Quizzes',
              description: 'Short English and French checks for 6a and 7b as announced by subject teachers.',
            },
          ],
        },
        {
          gradeBand: 'Middle & Upper Secondary: Grades 8–10 & Oberstufe',
          items: [
            {
              title: 'Grade 8: Latin & Second Foreign Language',
              description: 'Class 8ac has its first Latin review on Sept 17.',
            },
            {
              title: 'Upper Secondary (Q1/Q2): Term Paper Topics',
              description: 'Students in Q1 are meeting with advisory tutors regarding term paper (Facharbeit) proposals.',
            },
          ],
        },
      ],
      upcomingExamsAndEvents: [
        {
          date: '17.09.2026',
          time: '08:00',
          title: 'Latin Vocabulary Assessment (8ac)',
          cohort: '8ac',
          type: 'exam',
          details: 'Lessons 1-3 Revision',
          sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
        },
        {
          date: '18.09.2026',
          time: '09:45',
          title: 'English Vocabulary Quiz (6a)',
          cohort: '6a',
          type: 'exam',
          details: 'Unit 1 Check',
          sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
        },
        {
          date: '22.09.2026',
          time: '18:30',
          title: 'Parents Evening (Grades 5 & 6)',
          cohort: '5-6',
          type: 'meeting',
          details: 'Election of parent representatives',
          sourceUrl: 'https://adenauer-bonn.de/termine/',
        },
        {
          date: '25.09.2026',
          time: '13:00',
          title: 'Extracurricular (AG) Registration Deadline',
          cohort: 'All',
          type: 'event',
          details: 'Return slip to class teacher',
          sourceUrl: 'https://adenauer-bonn.de/ganztag/',
        },
        {
          date: '02.10.2026',
          time: 'All Day',
          title: 'Staff Development Day (No Classes)',
          cohort: 'All',
          type: 'holiday',
          details: 'Faculty conference',
          sourceUrl: 'https://adenauer-bonn.de/termine/',
        },
      ],
      schoolLifeAndProjects: [
        {
          title: 'Welcome Celebration for New Grade 5 Students',
          summary: 'Special welcome assembly and mentor introductions at KAG Bonn.',
          sourceUrl: 'https://adenauer-bonn.de/',
          category: 'School Life',
        },
        {
          title: 'Canoe & Watersports Club Starts Autumn Season',
          summary: 'KAG Bonn makes full use of its close proximity to the Rhine River for water sports programs.',
          sourceUrl: 'https://adenauer-bonn.de/',
          category: 'Clubs & Sports',
        },
      ],
      parentTipsAndMensa: {
        mensaNotes:
          'The cafeteria operates on full days (Mon, Wed, Thu). Students are supervised during lunch breaks.',
        importantContacts: [
          { role: 'School Office (Sekretariat)', contact: '0228 777630 / sekretariat@adenauer-bonn.de' },
          { role: 'Parent Council (Schulpflegschaft)', contact: 'schulpflegschaft@adenauer-bonn.de' },
        ],
        actionDeadlines: [
          { task: 'Submit Extracurricular (AG) Forms', deadline: '25.09.2026' },
          { task: 'Check Textbook Covers', deadline: '20.09.2026' },
        ],
      },
      closingNote: 'We wish all students and families an encouraging, rewarding school week at KAG Bonn!',
      rawHtml: '',
    };
  }

  // Default: German (DE)
  return {
    id,
    language: 'de',
    generatedAt,
    weekLabel: 'Kalenderwoche 38 (14.09. – 20.09.2026)',
    headline: 'Schuljahresbeginn: Fokus 5. Klassen, AG-Wahl und anstehende Termine',
    greeting: 'Liebe Eltern und Erziehungsberechtigte des Konrad-Adenauer-Gymnasiums,',
    grade5Focus: {
      title: '5. Klasse (Erprobungsstufe): Das Wichtigste für die ersten Wochen',
      keyPoints: [
        'Patenbetreuung & Orientierung: Die Schülerpaten aus der Mittelstufe begleiten die Fünftklässler zu Fachräumen und Spinden.',
        'Mensa-Chip & Verpflegung: Bitte Guthaben für das warme Mittagessen an Langtagen (Mo, Mi, Do) prüfen.',
        'Hausaufgabenheft: Bitte in der Eingewöhnungsphase regelmäßig das Schulplaner-Heft einsehen und abzeichnen.',
        'AG-Angebot: Die Wahlzettel für die Nachmittags-AGs (Kanu, Theater, MINT, Chor) liegen bereit.',
      ],
      parentAction: 'Schülerticket (VRS) und Schutzumschläge für ausgeliehene Schulbücher kontrollieren.',
    },
    executiveHighlights: [
      {
        title: 'Herzlich willkommen an unsere neuen 5. Klassen!',
        detail: 'Die neuen Fünftklässler wurden feierlich am KAG Bonn aufgenommen. Die Klassenleitungsteams begleiten die Eingewöhnung.',
        urgent: false,
        tag: '5. Klasse',
        sourceUrl: 'https://adenauer-bonn.de/erprobungsstufe/',
      },
      {
        title: 'Neues AG-Angebot 2026/27 jetzt wählen',
        detail: 'Vielfältige Arbeitsgemeinschaften stehen zur Wahl. Rückgabe der Wahlzettel bitte bis 25. September an die Klassenleitung.',
        urgent: true,
        tag: 'Frist / Ganztag',
        sourceUrl: 'https://adenauer-bonn.de/ganztag/',
      },
      {
        title: 'Erste Vokabelüberprüfungen in den Klassen 6–10',
        detail: 'In Englisch und Latein finden in den kommenden Tagen kurze Überprüfungen statt. Termine siehe Übersicht unten.',
        urgent: false,
        tag: 'Klassenarbeiten',
        sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
      },
    ],
    gradeLevelSections: [
      {
        gradeBand: 'Unterstufe: Klassen 5–7',
        items: [
          {
            title: 'Klasse 5: Klassenleitungsstunden zur Orientierung',
            description: 'Die Klassen 5a, 5b und 5c haben feste Ordinariatsstunden zur Stärkung der Klassengemeinschaft.',
            actionItem: 'Turnbeutel und beschriftete Trinkflaschen mitgeben.',
          },
          {
            title: 'Klassen 6 & 7: Vokabeltests in den Fremdsprachen',
            description: 'Kurze Vokabelüberprüfungen in Englisch und Französisch laut Ankündigung der Fachlehrkräfte.',
          },
        ],
      },
      {
        gradeBand: 'Mittelstufe & Oberstufe: Klassen 8–10 & EF–Q2',
        items: [
          {
            title: 'Klasse 8: Lateinische Grammatik und Vokabeln',
            description: 'Erste Lernzielkontrolle in Klasse 8ac am 17. September.',
          },
          {
            title: 'Oberstufe Q1: Vorbereitung der Facharbeiten',
            description: 'Beratungsgespräche mit den Betreuungslehrkräften zur Themenfindung laufen an.',
          },
        ],
      },
    ],
    upcomingExamsAndEvents: [
      {
        date: '17.09.2026',
        time: '08:00',
        title: 'Klassenarbeit / Vokabeltest Latein (8ac)',
        cohort: '8ac',
        type: 'exam',
        details: 'Lektion 1-3 Wiederholung',
        sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
      },
      {
        date: '18.09.2026',
        time: '09:45',
        title: 'Englisch Vokabelüberprüfung (6a)',
        cohort: '6a',
        type: 'exam',
        details: 'Unit 1 Check',
        sourceUrl: 'https://adenauer-bonn.de/klassenarbeitstermine/',
      },
      {
        date: '22.09.2026',
        time: '18:30',
        title: 'Klassenpflegschaftsabende (Klassen 5 & 6)',
        cohort: '5-6',
        type: 'meeting',
        details: 'Wahl der Klassenelternvertreter',
        sourceUrl: 'https://adenauer-bonn.de/termine/',
      },
      {
        date: '25.09.2026',
        time: '13:00',
        title: 'Abgabefrist AG-Wahlzettel 2026/27',
        cohort: 'Alle',
        type: 'event',
        details: 'Rückgabe an die Klassenleitung',
        sourceUrl: 'https://adenauer-bonn.de/ganztag/',
      },
      {
        date: '02.10.2026',
        time: 'Ganztägig',
        title: 'Pädagogischer Tag (Unterrichtsfrei)',
        cohort: 'Alle',
        type: 'holiday',
        details: 'Ganztägige schulpädagogische Lehrerkonferenz',
        sourceUrl: 'https://adenauer-bonn.de/termine/',
      },
    ],
    schoolLifeAndProjects: [
      {
        title: 'Feierliche Begrüßung der 5. Klassen',
        summary: 'Mit einem stimmungsvollen Gottesdienst und herzlichen Worten der Schulleitung starteten 120 neue Fünftklässler.',
        sourceUrl: 'https://adenauer-bonn.de/',
        category: 'Schulleben',
      },
      {
        title: 'Kanu- und Wassersport am KAG',
        summary: 'Dank der unmittelbaren Rheinnähe bietet das KAG traditionell eigene Kanu- und Wassersportkurse an.',
        sourceUrl: 'https://adenauer-bonn.de/',
        category: 'AGs & Sport',
      },
    ],
    parentTipsAndMensa: {
      mensaNotes:
        'Die Schulmensa bietet an Langtagen (Mo, Mi, Do) warme Menüs und Salate. Bitte Mensa-Chip aufladen.',
      importantContacts: [
        { role: 'Sekretariat', contact: '0228 777630 / sekretariat@adenauer-bonn.de' },
        { role: 'Schulpflegschaft', contact: 'schulpflegschaft@adenauer-bonn.de' },
      ],
      actionDeadlines: [
        { task: 'Rückgabe der AG-Wahlzettel', deadline: '25.09.2026' },
        { task: 'Bücherschutzumschläge anbringen', deadline: '20.09.2026' },
      ],
    },
    closingNote: 'Wir wünschen allen Familien einen erfolgreichen und sonnigen Start in die neue Schulwoche am KAG Bonn!',
    rawHtml: '',
  };
}
