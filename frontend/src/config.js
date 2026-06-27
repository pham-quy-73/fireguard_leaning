// Configure API base URL depending on environment.
// - localhost / 127.0.0.1            -> backend local
// - IP LAN nội bộ (192.168.x, 10.x, 172.16-31.x) -> backend local trên cùng máy dev (port 5000)
// - tên miền công khai (deploy)      -> backend deploy trên Render
const host = window.location.hostname;
const isLocalDev =
  host === 'localhost' ||
  host === '127.0.0.1' ||
  /^192\.168\./.test(host) ||
  /^10\./.test(host) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(host);

export const API_BASE_URL = isLocalDev
  ? `http://${host}:5000`
  : 'https://fireguard-leaning.onrender.com';
