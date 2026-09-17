gsap.registerPlugin(ScrollTrigger);

const cards = document.querySelectorAll(".card");
const decors = document.querySelectorAll(".decor");

gsap.set(cards, {
  x: (index, element) => parseFloat(element.dataset.x) || 0,
  y: (index, element) => parseFloat(element.dataset.y) || 0,
  z: (index, element) => parseFloat(element.dataset.z) || 0,
  width: (index, element) => element.dataset.width ? element.dataset.width + "px" : "300px",
  height: (index, element) => element.dataset.height ? element.dataset.height + "px" : "200px",
  xPercent: -50, 
  yPercent: -50
});

gsap.set(decors, {
  x: (index, element) => parseFloat(element.dataset.x) || 0,
  y: (index, element) => parseFloat(element.dataset.y) || 0,
  z: (index, element) => parseFloat(element.dataset.z) || 0,
  width: (index, element) => element.dataset.width ? element.dataset.width + "px" : "auto",
  height: (index, element) => element.dataset.height ? element.dataset.height + "px" : "auto",
  xPercent: -50,
  yPercent: -50
});

const profondeurTotale = 8000; 

function gererVisibilite(progress) {
    const avancementCamera = progress * profondeurTotale;

    cards.forEach(card => {
        const positionCarte = parseFloat(card.dataset.z) || 0;
        const distance = positionCarte + avancementCamera;

        if (distance > -2500 && distance < 300) {
            card.style.opacity = 1;
            card.style.pointerEvents = "auto";
        } else {
            card.style.opacity = 0;
            card.style.pointerEvents = "none";
        }
    });
}

//scroll

gsap.to(".world", {
    z: profondeurTotale,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => gererVisibilite(self.progress)
    }
});


//souris

gererVisibilite(0);

window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  gsap.to(".camera", {
    rotationY: x * 15,
    rotationX: y * -15,
    ease: "power2.out",
    duration: 1,
  });
});

//Ligne

function relierElements(el1, el2) {
    const x1 = parseFloat(el1.dataset.x) || 0;
    const y1 = parseFloat(el1.dataset.y) || 0;
    const z1 = parseFloat(el1.dataset.z) || 0;

    const x2 = parseFloat(el2.dataset.x) || 0;
    const y2 = parseFloat(el2.dataset.y) || 0;
    const z2 = parseFloat(el2.dataset.z) || 0;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    let axisY = -dz;
    let axisZ = dy;
    let axisLength = Math.sqrt(axisY * axisY + axisZ * axisZ);
    
    let angle;
    if (axisLength === 0) {
        axisY = 1;
        axisZ = 0;
        angle = (dx < 0) ? 180 : 0;
    } else {
        axisY = axisY / axisLength;
        axisZ = axisZ / axisLength;
        angle = Math.acos(dx / distance) * (180 / Math.PI);
    }

    const ligne = document.createElement('div');
    ligne.className = 'line';
    ligne.style.width = distance + 'px';
    
    ligne.style.transform = `translate3d(${x1}px, ${y1}px, ${z1}px) rotate3d(0, ${axisY}, ${axisZ}, ${angle}deg)`;

    document.querySelector('.world').prepend(ligne);
}


decors.forEach(decor => {
    const cibles = decor.dataset.connectTo; 
    
    if (cibles) {
        const listeIdCibles = cibles.split(','); 
        
        listeIdCibles.forEach(idCible => {
            const elementCible = document.getElementById(idCible.trim()); 
            
            if (elementCible) {
                relierElements(decor, elementCible);
            }
        });
    }
});