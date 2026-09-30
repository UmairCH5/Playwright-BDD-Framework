export class DateUtils {
  static todayISO(): string {
    return new Date().toISOString().slice(0, 10);
  }

  static addDaysISO(days: number, from = new Date()): string {
    const date = new Date(from);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  static toDisplayDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }
}
