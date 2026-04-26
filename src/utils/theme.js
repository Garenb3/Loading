export const setTheme = (theme) => {
  Object.keys(theme).forEach(key => {
    document.documentElement.style.setProperty(`--${key}`, theme[key]);
  });
};

export const darkTheme = { bg:"#121212", text:"#ffffff", primary:"#e50914", secondary:"#1f1f1f", tertiary: "#8B0000" };
export const lightTheme = { bg:"#ffffff", text:"#000000", primary:"#007bff", secondary:"#f5f5f5", tertiary: "#00008B"};