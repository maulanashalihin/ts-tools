/** Dispatch event on click outside of node */
export function clickOutside(node) {
  
    const handleClick = event => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(
          new CustomEvent('click_outside', node)
        )
      }
    }
  
      document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
      }
  }

  export function validatePhone(phone) {

    const selected_dial_code = "+62"
    
    var number = phone.toString().split('-').join(' ').split(' ').join('');
    if (number[0] == '0') {
    number = number.replace('0', '')
    }

    if (number.includes(selected_dial_code)) {
    number = number.replace(selected_dial_code, '')
    }

    if (number.substring(0, selected_dial_code.length - 1) == selected_dial_code.replace("+",
        '')) {
    number = number.replace(selected_dial_code.replace("+", ''), '')
    }

    number = selected_dial_code.replace("+", '') + number;


    return number;


    }