const showPopup = ({ text, color, timeout }) => {
  const popupWindow = document.createElement('div');
  popupWindow.classList.add('popup');
  popupWindow.innerHTML = text;
  popupWindow.style.borderColor = color;
  document.body.append(popupWindow);
  setTimeout(() => {
    popupWindow.remove();
  }, timeout);
};
