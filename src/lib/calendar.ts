/**
 * Helper to generate .ics iCalendar files for exams and school events
 */
import type { NewsletterSummary } from '../types';

export function downloadIcsFile(event: {
  title: string;
  date: string;
  details?: string;
  cohort?: string;
}) {
  // Parse date or default to current date
  let eventDate = new Date();
  const dateParts = event.date.match(/(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?/);

  if (dateParts) {
    const day = parseInt(dateParts[1], 10);
    const month = parseInt(dateParts[2], 10) - 1;
    const year = dateParts[3]
      ? parseInt(dateParts[3].length === 2 ? '20' + dateParts[3] : dateParts[3], 10)
      : eventDate.getFullYear();
    eventDate = new Date(year, month, day, 8, 0, 0);
  }

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KAG Bonn//Eltern-Briefing//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:kag-event-${Date.now()}@adenauer-bonn.de`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(eventDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:KAG Bonn: ${event.title} [${event.cohort || 'Alle'}]`,
    `DESCRIPTION:${(event.details || 'Schultermin Konrad-Adenauer-Gymnasium Bonn').replace(/\n/g, '\\n')}`,
    'LOCATION:Konrad-Adenauer-Gymnasium Bonn, Max-Planck-Str. 24-36, 53177 Bonn',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `KAG-Termin-${event.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadAllExamsIcs(newsletter: NewsletterSummary) {
  const events = newsletter.upcomingExamsAndEvents;
  if (!events || events.length === 0) return;

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const nowStr = formatIcsDate(new Date());

  const vevents = events.map((ev, idx) => {
    let eventDate = new Date();
    const dateParts = ev.date.match(/(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?/);
    if (dateParts) {
      const day = parseInt(dateParts[1], 10);
      const month = parseInt(dateParts[2], 10) - 1;
      const year = dateParts[3]
        ? parseInt(dateParts[3].length === 2 ? '20' + dateParts[3] : dateParts[3], 10)
        : eventDate.getFullYear();
      eventDate = new Date(year, month, day, 8, 0, 0);
    }
    const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000);

    return [
      'BEGIN:VEVENT',
      `UID:kag-all-event-${idx}-${Date.now()}@adenauer-bonn.de`,
      `DTSTAMP:${nowStr}`,
      `DTSTART:${formatIcsDate(eventDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:KAG Bonn: ${ev.title} [${ev.cohort}]`,
      `DESCRIPTION:${(ev.details || 'Schultermin / Klassenarbeit Konrad-Adenauer-Gymnasium Bonn').replace(/\n/g, '\\n')}`,
      'LOCATION:Konrad-Adenauer-Gymnasium Bonn, Max-Planck-Str. 24-36, 53177 Bonn',
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');
  });

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KAG Bonn//Eltern-Briefing//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...vevents,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `KAG-Termine-${newsletter.weekLabel.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
