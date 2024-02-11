import {THEME_BACKGROUND_COLOR} from "../constants/common";

export const applyPreloadStyle = (bodyBackground?: string): void => {
  const backgroundColor = bodyBackground || localStorage.getItem(THEME_BACKGROUND_COLOR) || '#1A1A1A';

  document.body.style.backgroundColor = backgroundColor;

  localStorage.setItem(THEME_BACKGROUND_COLOR, backgroundColor);
};
