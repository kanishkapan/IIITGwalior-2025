// alert-system.js
const alertConfig = {
    // Theme colors - modify these to match your website theme
    colors: {
    //   success: '#28a745', // Green
    //   info: '#17a2b8',    // Blue
    //   warning: '#ffc107', // Yellow
    //   danger: '#dc3545',  // Red
      custom: '#7af0a8',  // Purple - YOUR CUSTOM THEME COLOR IS HERE
    },
    // Alert style configuration
    style: {
      fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
      fontSize: '14px',
      borderRadius: '4px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '12px 15px',
      margin: '10px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity: '0.95',
      transition: 'all 0.3s ease-in-out'
    }
  };
  
  // Helper functions for the alert system
  function initAlertContainer() {
    if (!document.getElementById('socket-alerts')) {
      const alertContainer = document.createElement('div');
      alertContainer.id = 'socket-alerts';
      alertContainer.style.position = 'fixed';
      alertContainer.style.top = '20px';
      alertContainer.style.right = '20px';
      alertContainer.style.zIndex = '9999';
      alertContainer.style.maxWidth = '350px';
      document.body.appendChild(alertContainer);
    }
    return document.getElementById('socket-alerts');
  }
  
  function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = initAlertContainer();
    
    const alert = document.createElement('div');
    Object.assign(alert.style, alertConfig.style);
    // console.log("Applied Styles:", alert.style);

    const bgColor = alertConfig.colors[type] || alertConfig.colors.custom;
    alert.style.backgroundColor = bgColor;
    alert.style.color = getContrastColor(bgColor);
    alert.style.borderLeft = `5px solid ${darkenColor(bgColor, 20)}`;
    
    alert.innerHTML = `
      <div>${message}</div>
      <button style="background: transparent; border: none; color: inherit; cursor: pointer; padding: 0; font-size: 18px; margin-left: 10px;">&times;</button>
    `;
    
    alertContainer.appendChild(alert);
    // console.log("Alert Styles:", alert.style);
    
    alert.style.transform = 'translateX(100%)';
    setTimeout(() => {
      alert.style.transform = 'translateX(0)';
    }, 10);
    
    const closeButton = alert.querySelector('button');
    closeButton.addEventListener('click', () => {
      dismissAlert(alert);
    });
    
    if (duration > 0) {
      setTimeout(() => {
        dismissAlert(alert);
      }, duration);
    }
    
    return alert;
  }
  
  function dismissAlert(alertElement) {
    alertElement.style.opacity = '0';
    alertElement.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      if (alertElement.parentNode) {
        alertElement.parentNode.removeChild(alertElement);
      }
    }, 300);
  }
  
  function getContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#333333' : '#ffffff';
  }
  
  function darkenColor(hexColor, percent) {
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    
    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
export { showAlert, dismissAlert };

window.showAlert = showAlert;
window.dismissAlert = dismissAlert;
