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

function relierElements(el1, el2) {
    const x1 = parseFloat(el1.dataset.x) || 0;
    const y1 = parseFloat(el1.dataset.y) || 0;
    const z1 = parseFloat(el1.dataset.z) || 0;

    const x2 = parseFloat(el2.dataset.x) || 0;
    const y2 = parseFloat(el2.dataset.y) || 0;
    const z2 = parseFloat(el2.dataset.z) || 0;

    // 1. Calcul des distances
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    
    // Longueur exacte du trait
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // 2. MATHÉMATIQUES VECTORIELLES (Produit vectoriel pour trouver l'axe 3D parfait)
    let axisY = -dz;
    let axisZ = dy;
    let axisLength = Math.sqrt(axisY * axisY + axisZ * axisZ);
    
    let angle;
    if (axisLength === 0) {
        // Cas particulier : si la ligne est parfaitement droite sur l'axe X
        axisY = 1;
        axisZ = 0;
        angle = (dx < 0) ? 180 : 0;
    } else {
        // On normalise l'axe
        axisY = axisY / axisLength;
        axisZ = axisZ / axisLength;
        // On calcule l'angle en degrés
        angle = Math.acos(dx / distance) * (180 / Math.PI);
    }

    // 3. Création du trait HTML
    const ligne = document.createElement('div');
    ligne.className = 'line';
    ligne.style.width = distance + 'px';
    
    // 4. On utilise rotate3d : 0 pour X, puis axisY, axisZ, et l'angle
    ligne.style.transform = `translate3d(${x1}px, ${y1}px, ${z1}px) rotate3d(0, ${axisY}, ${axisZ}, ${angle}deg)`;

    // 5. On l'ajoute au monde
    document.querySelector('.world').prepend(ligne); // prepend = ajoute au début au lieu de la fin
}


// --- CRÉATION DES LIGNES ENTRE LES DÉCORS ---

// On demande au JS de lire tes instructions HTML (le fameux data-connect-to)
decors.forEach(decor => {
    // On regarde si tu as mis un attribut "data-connect-to" sur cet élément
    const cibles = decor.dataset.connectTo; 
    
    if (cibles) {
        // S'il y a plusieurs cibles (séparées par des virgules), on les découpe
        const listeIdCibles = cibles.split(','); 
        
        listeIdCibles.forEach(idCible => {
            // On cherche l'élément cible dans la page
            const elementCible = document.getElementById(idCible.trim()); 
            
            // Si on a bien trouvé la cible, on tire le trait !
            if (elementCible) {
                relierElements(decor, elementCible);
            }
        });
    }
});