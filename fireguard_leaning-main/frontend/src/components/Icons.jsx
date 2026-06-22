import React from 'react';

export const FiretruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12h2v4h-2zm-2-5h-3v5H9V5H3v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h1v-4h-2.5L17 7zm-9 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-4.5H5V7h12v4.5z" fill="currentColor"/>
    <circle cx="16" cy="3" r="1" fill="currentColor" />
  </svg>
);

export const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M3 5.25A2.25 2.25 0 00.75 7.5v9a2.25 2.25 0 002.25 2.25h18a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0021 5.25H3zm1.5 3.03l6.72 4.2a1.5 1.5 0 001.56 0l6.72-4.2V16.5a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V8.28zm14.49-1.53H5.01L12 11.1l6.99-4.35z" fill="currentColor"/>
  </svg>
);

export const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 1.5C9.1005 1.5 6.75 3.8505 6.75 6.75V9H5.25A2.25 2.25 0 003 11.25v7.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-7.5A2.25 2.25 0 0018.75 9H17.25V6.75C17.25 3.8505 14.8995 1.5 12 1.5zm3.75 7.5V6.75c0-2.071-1.679-3.75-3.75-3.75S8.25 4.679 8.25 6.75V9h7.5zM5.25 10.5h13.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-7.5a.75.75 0 01.75-.75z" fill="currentColor"/>
  </svg>
);

export const UserSilhouetteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM12 3a3 3 0 100 6 3 3 0 000-6zm-7.07 13.57A6.47 6.47 0 0112 14.25c2.6 0 4.96.96 6.77 2.53l.3.24c1.07.96 1.07 2.65 0 3.61l-.3.24c-1.81 1.57-4.17 2.53-6.77 2.53s-4.96-.96-6.77-2.53l-.3-.24C3.86 19.68 3.86 18 4.93 17.04l.3-.24zm.8 1.15a4.97 4.97 0 006.27 0c1.03-.89 1.03-2.39 0-3.28a4.97 4.97 0 00-6.27 0c-1.03.89-1.03 2.39 0 3.28z" fill="currentColor"/>
  </svg>
);

export const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
  </svg>
);

export const MapMarkerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.54 22.35a.75.75 0 00.92 0C13.25 21.8 21 15.53 21 10.5 21 5.253 16.97 1 12 1 7.03 1 3 5.253 3 10.5c0 5.03 7.75 11.3 8.54 11.85zM4.5 10.5C4.5 6.082 7.858 2.5 12 2.5s7.5 3.582 7.5 8c0 3.82-5.755 9.074-7.5 10.505-1.745-1.431-7.5-6.685-7.5-10.505zM12 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0-1A1.5 1.5 0 1112 9a1.5 1.5 0 010 3z" fill="currentColor"/>
  </svg>
);

export const EyeIcon = ({ visible }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {visible ? (
      <path fillRule="evenodd" clipRule="evenodd" d="M1.5 12c0-3 6-9 10.5-9s10.5 6 10.5 9-6 9-10.5 9S1.5 15 1.5 12zm10.5 5.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5zm0-1.5a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z" fill="currentColor"/>
    ) : (
      <path fillRule="evenodd" clipRule="evenodd" d="M2.636 4.05a.75.75 0 011.06 0l16.264 16.264a.75.75 0 11-1.06 1.06L15.358 17.83a10.428 10.428 0 01-3.358.57C7.5 18.4 1.5 12.4 1.5 12c0-.3.356-.99 1.04-1.89L2.636 4.05zM12 5.6c4.5 0 10.5 6 10.5 6.4 0 .1-.26.54-.77 1.155l-1.3-1.3a5.256 5.256 0 00-6.88-6.88L12.35 3.722A10.42 10.42 0 0112 5.6zm.53 4.29a3.75 3.75 0 00-4.82 4.82l4.82-4.82z" fill="currentColor"/>
    )}
  </svg>
);

export const PlayMenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653zm2.779-.143a.3.3 0 00-.3.3v12.38a.3.3 0 00.45.26l11.54-6.347a.3.3 0 000-.52l-11.54-6.347a.3.3 0 00-.15-.033z" fill="currentColor"/>
  </svg>
);

export const GridDashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" fill="currentColor"/>
  </svg>
);

export const HistoryClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8h-1.5z" fill="currentColor"/>
  </svg>
);

export const VideoManagerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="currentColor" />
  </svg>
);

export const SettingsGearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
  </svg>
);

export const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.94 4.94a.75.75 0 11-1.06 1.06l-4.94-4.94A8.25 8.25 0 012.25 10.5z" fill="currentColor"/>
  </svg>
);

export const NotifyBellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
  </svg>
);

export const ArrowChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor"/>
  </svg>
);

export const ArrowChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" fill="currentColor"/>
  </svg>
);

export const ChatBubbleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" fill="currentColor"/>
  </svg>
);

export const QuestionMarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" fill="currentColor"/>
  </svg>
);

export const LogOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
  </svg>
);
