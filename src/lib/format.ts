/** 숫자를 자릿수에 맞춰 0으로 채움 (1 → "01") */
export const padNumber = (num: number, length = 2) => String(num).padStart(length, '0');

/** 숫자만 있는 휴대폰 번호를 하이픈 형식으로 (01012345678 → 010-1234-5678) */
export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  if (digits.length === 10) return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  return phone;
};

/** 날짜를 "방금 전 / 5분 전 / 3시간 전 / 2일 전 / 몇 달 전 / 1년 전" 형식으로 */
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

const SERVER_OFFSET = '+09:00';

export const parseServerDate = (value: string) =>
  new Date(/(Z|[+-]\d{2}:?\d{2})$/.test(value) ? value : `${value}${SERVER_OFFSET}`);

export const toIsoString = (value: string) => parseServerDate(value).toISOString();

const parts = (value: string) => {
  const [y, m, d] = value.slice(0, 10).split('-');
  return { y, m, d };
};

export const formatDotDate = (value: string) => {
  const { y, m, d } = parts(value);
  return `${y}.${m}.${d}`;
};

export const formatShortDate = (value: string) => {
  const { y, m, d } = parts(value);
  return `${y.slice(2)}.${m}.${d}`;
};

export const formatMonth = (value: string) => {
  const { y, m } = parts(value);
  return `${y}.${m}`;
};

export const formatPeriod = (start: string | null, end: string | null, current = !end) => {
  if (!start) return '';
  return `${formatMonth(start)} - ${current || !end ? '현재' : formatMonth(end)}`;
};
