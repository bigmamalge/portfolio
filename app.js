gsap.registerPlugin(ScrollTrigger);

const cards = document.querySelectorAll(".card");
const decors = document.querySelectorAll(".decor"); // Si tu as ajouté les décors

// 1. On place les cartes en profondeur (sans changer)
gsap.set(cards, {
  x: (index, element) => parseFloat(element.dataset.x) || 0,
  y: (index, element) => parseFloat(element.dataset.y) || 0,
  z: (index, element) => parseFloat(element.dataset.z) || 0,
});

// 2. On place les décors aléatoirement (sans changer)
gsap.set(decors, {
  x: (index, element) => parseFloat(element.dataset.x) || 0,
  y: (index, element) => parseFloat(element.dataset.y) || 0,
  z: (index, element) => parseFloat(element.dataset.z) || 0,
});

// --- LE CHANGEMENT EST ICI ---

// 3. On ne fait plus avancer les cartes ou les décors.
// On fait avancer TOUT LE MONDE vers nous (en modifiant le Z du conteneur .world)
const profondeurTotale = 8000; 

// 1. On crée une fonction indépendante pour notre radar
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

// 2. On configure le ScrollTrigger pour qu'il utilise cette fonction
gsap.to(".world", {
    z: profondeurTotale,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        // À chaque scroll, on envoie l'avancement (entre 0 et 1) au radar
        onUpdate: (self) => gererVisibilite(self.progress)
    }
});

// 3. LA CORRECTION : On lance le radar manuellement au chargement (avancement = 0)
gererVisibilite(0);

window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  // ATTENTION AU CHANGEMENT ICI : on cible ".camera" et plus ".world"
  gsap.to(".camera", {
    rotationY: x * 15,
    rotationX: y * -15,
    ease: "power2.out",
    duration: 1,
  });
});
