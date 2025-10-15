async function fetchHours() {
  const response = await fetch('/portfolio-sites/open-hours.json');
  if (!response.ok) throw new Error('Failed to load hours');
  return response.json();
}

function isOpenNow(hours) {
  const now = new Date();
  const day = now.toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase();
  const dayHours = hours[day];
  if (!dayHours || dayHours.closed) return false;
  const [start, end] = dayHours.hours.split('-');
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  return current >= startMinutes && current <= endMinutes;
}

async function updateBadges() {
  try {
    const hours = await fetchHours();
    const open = isOpenNow(hours);
    document.querySelectorAll('[data-open-now]').forEach((el) => {
      const translate = typeof window.__i18n?.t === 'function' ? window.__i18n.t : null;
      const openText = translate ? translate('restaurant.hero.badgeOpen') : 'Open now';
      const closedText = translate ? translate('restaurant.hero.badgeClosed') : 'Closed';
      el.textContent = open ? openText : closedText;
      el.classList.toggle('bg-green-600', open);
      el.classList.toggle('bg-rose-600', !open);
    });
  } catch (error) {
    console.error(error);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', updateBadges);
}
