export const setTheme = (theme) => {
  Object.keys(theme).forEach(key => {
    document.documentElement.style.setProperty(`--${key}`, theme[key]);
  });

  localStorage.setItem("theme", JSON.stringify(theme));
};

export const loadTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) {
    const theme = JSON.parse(saved);
    Object.keys(theme).forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    });
  }
};