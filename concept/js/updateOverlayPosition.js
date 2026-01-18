function updateOverlayPosition() {
    const overlay = document.querySelector('.overlay-wrapper');
    const aspectRatio = window.innerWidth / window.innerHeight;
  
    let topValue;
  
    if (aspectRatio >= 1.7) {
      // Very wide screens (e.g. 16:9)
      topValue = 5;
      widthValue = 35.5;
      leftValue = 32.75;
    } else {
      // Portrait or tall screens (aspectRatio < 1)
      // Make top slightly higher to keep visible placement
      topValue =  7 * Math.log(1.7 - aspectRatio) + 15; //43.04535;
      //topValue =  10.83525 * Math.log(2 - aspectRatio) + 10;
      // Example: aspectRatio=0.75 → top=14.5vh
      widthValue = 40;
      leftValue = 30.5;

      //console.log(aspectRatio)
      //console.log(topValue)
    }
  
    // Constrain and apply
    topValue = Math.min(Math.max(topValue, 2), 20);
    overlay.style.top = `${topValue}vh`;
    overlay.style.width = `${widthValue}vw`;
    overlay.style.left= `${leftValue}vw`;
  }
  
// Initial run and resize updates
window.addEventListener('load', updateOverlayPosition);
window.addEventListener('resize', updateOverlayPosition);