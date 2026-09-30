export class RandomDataUtils {
  static string(prefix = 'auto'): string {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  static email(prefix = 'guest'): string {
    return `${this.string(prefix)}@example.com`;
  }

  static phone(): string {
    return `07${Math.floor(100000000 + Math.random() * 899999999)}`;
  }
}
