const FREE_STREAMING_SERVICES = [
  'Tubi',
  'Pluto TV',
  'Peacock',
  'Crackle',
  'Freevee',
  'YouTube',
  'Rakuten',
  'Kanopy',
  'Xumo',
  'Plex',
  'Hoopla'
];

function checkFreeStreaming(name) {
  if (!name) return false;
  const lower = String(name).toLowerCase();
  return FREE_STREAMING_SERVICES.some((f) => lower.includes(f.toLowerCase()));
}

module.exports = {
  FREE_STREAMING_SERVICES,
  checkFreeStreaming
};
