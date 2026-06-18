import { DateTime } from 'luxon';

export const useDateFormat = () => {
  const { locale, t } = useI18n();

  const fromNow = (date: Date) => {
    return DateTime.fromJSDate(new Date(date)).setLocale(locale.value).toRelative();
  };

  const formattedDuration = (start: Date, end: Date) => {
    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = DateTime.fromJSDate(new Date(end))
      .diff(DateTime.fromJSDate(new Date(start)), ['days', 'hours', 'minutes', 'seconds'])
      .toObject();

    return days > 0
      ? `${Math.floor(days)}${t('units.day')} ${Math.floor(hours)}${t('units.hour')} ${Math.floor(minutes)}${t('units.minute')}`
      : hours > 0
        ? `${Math.floor(hours)}${t('units.hour')} ${Math.floor(minutes)}${t('units.minute')}`
        : minutes > 0
          ? `${Math.floor(minutes)}${t('units.minute')}`
          : `${Math.floor(seconds)}${t('units.second')}`;
  };

  return { fromNow, formattedDuration };
};
