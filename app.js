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

gsap.to(".world", {
  z: profondeurTotale, // On avance de 8000
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,

    // LE FAMEUX RADAR : S'exécute en continu pendant le scroll
    onUpdate: (self) => {
      // self.progress est un chiffre entre 0 (début) et 1 (fin du scroll)
      const avancementCamera = self.progress * profondeurTotale;

      cards.forEach((card) => {
        // On récupère la position Z de la carte dans le HTML
        const positionCarte = parseFloat(card.dataset.z) || 0;

        // La distance réelle entre la caméra et la carte
        const distance = positionCarte + avancementCamera;

        // ZONE DE VISIBILITÉ :
        // Si la carte est entre -2500px (loin devant) et 300px (juste derrière la tête)
        if (distance > -500 && distance < 500) {
          card.style.opacity = 1; // Apparaît !
          card.style.pointerEvents = "auto"; // Rend cliquable
        } else {
          card.style.opacity = 0; // Disparaît !
          card.style.pointerEvents = "none"; // Empêche de cliquer dans le vide
        }
      });
    },
  },
});

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
