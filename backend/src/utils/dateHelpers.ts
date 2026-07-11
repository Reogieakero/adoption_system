export function formatDateTime(date: Date | null | undefined): string | null {
    if (!date) return null;
    const pad = (n: number) => String(n).padStart(2, '0');
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(hours)}:${pad(
      date.getMinutes()
    )} ${ampm}`;
  }
  
  export function parseDateTime(input: string): Date | null {
    const match = input.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    const [, y, mo, da, h, mi, ap] = match;
    let hour = parseInt(h, 10);
    const upper = ap.toUpperCase();
    if (upper === 'PM' && hour !== 12) hour += 12;
    if (upper === 'AM' && hour === 12) hour = 0;
    return new Date(Number(y), Number(mo) - 1, Number(da), hour, Number(mi));
  }