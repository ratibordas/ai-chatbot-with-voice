export const isChromeOrEdge = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('chrome') || userAgent.includes('edge');
};

export const isTablet = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIPad = userAgent.includes('ipad');
  const isAndroid = userAgent.includes('android') && userAgent.includes('mobile');
  const isTabletDevice = /(android|ipad|tablet|playbook|silk)|(hp-tablet)/.test(userAgent);
  return isIPad || (!isAndroid && isTabletDevice);
};

export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};
