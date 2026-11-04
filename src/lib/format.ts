export const padNumber = (num: number, length = 2) => String(num).padStart(length, '0');

export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  if (digits.length === 10) return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  return phone;
};

export const formatRelativeTime = (date: string | Date, now: Date = new Date()) => {
  const diffSec = Math.max(0, (now.getTime() - new Date(date).getTime()) / 1000);
  const min = diffSec / 60;
  const hour = min / 60;
  const day = hour / 24;
  if (min < 1) return '방금 전';
  if (hour < 1) return `${Math.floor(min)}분 전`;
  if (day < 1) return `${Math.floor(hour)}시간 전`;
  if (day < 30) return `${Math.floor(day)}일 전`;
  if (day < 365) return `${Math.floor(day / 30)}달 전`;
  return `${Math.floor(day / 365)}년 전`;
};
