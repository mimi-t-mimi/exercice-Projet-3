// Afficher un message dans la console pour indiquer que le fichier index.js est chargé
console.log("load index.js");

// Vérifier si l'utilisateur est connecté en vérifiant la présence du token
const connecte = (localStorage.getItem('token') !== null);

// Si l'utilisateur est connecté, mettre à jour le texte du bouton de connexion
if (connecte) {
    document.querySelector('.boutonLogin').innerText = 'logout';
} else {
    // Si l'utilisateur n'est pas connecté, masquer les éléments liés à l'administration
    document.querySelector('.headerAdmin').classList.add('hidden');
    document.querySelectorAll('.boutonModifier').forEach((element) => {
        element.classList.add('hidden');
    });
}

// Gérer le clic sur le bouton de connexion
document.querySelector('.boutonLogin').addEventListener('click', function(){
    if (connecte) {
        // Déconnexion en effaçant le token
        localStorage.clear();
        window.location.href = "index.html";
    } else {
        // Redirection vers la page de connexion
        window.location.href = "loginPage.html";
    }
});

// Récupérer les données des projets et des catégories depuis l'API
let resultatWorks = await fetch('http://localhost:5678/api/works');
let works = await resultatWorks.json();

const resultatCategories = await fetch('http://localhost:5678/api/categories');
const categories = await resultatCategories.json();

// Créer les boutons de filtrage par catégorie (uniquement si connecté)
function chargerCategories() {
    // Ajouter une catégorie "Tous" au début du tableau de catégories
    categories.unshift({ id: 0, name: 'Tous' });

    // Créer et ajouter des boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.innerText = category.name;

        // Ajouter un écouteur pour le clic sur chaque bouton de catégorie
        button.addEventListener('click', () => {
            chargerProjets(category.id);
        });

        // Ajouter le bouton au conteneur de filtres
        const filtres = document.querySelector('.filtres');
        filtres.appendChild(button);
    });
}

// Charger les projets en fonction de la catégorie sélectionnée
function chargerProjets(category) {
    let worksFiltered = [];
    
    if (category === 0) {
        worksFiltered = works; // Afficher tous les projets
    } else {
        worksFiltered = works.filter(work => work.categoryId === category);
    }

    // Mettre à jour la galerie d'images avec les projets filtrés
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    worksFiltered.forEach(element => {
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.src = element.imageUrl;
        img.alt = element.title;
        const caption = document.createElement('figcaption');
        caption.innerText = element.title;
        fig.appendChild(img);
        fig.appendChild(caption);
        gallery.appendChild(fig);
    });
}

// Appeler les fonctions pour charger les catégories et les projets
if (!connecte) {
    chargerCategories();
}
chargerProjets(0);

// Gérer l'ouverture de la fenêtre modale
function ouvrirModal() {
	const modal = document.querySelector('#overlay');
	modal.style.display = 'flex';
    afficherProjets();
}

// Gérer la fermeture de la fenêtre modale
function fermerModal() {
	const modal = document.querySelector('#overlay');
	fermerModalAjout();
	modal.style.display = 'none';
}

// Gérer la fermeture de la fenêtre modale d'ajout
function fermerModalAjout() {
    const modalAjout = document.querySelector('#modal-ajout');
    document.querySelector("#preview-container").classList.add("hidden");
    document.querySelector("#ajout-image").classList.remove("hidden");
    modalAjout.style.display = 'none';
}

// Ajouter un écouteur d'événement pour le bouton "Modifier les projets"
document.querySelector('#boutonModifierProjets').addEventListener('click', () => {
    ouvrirModal();
});

// Ajouter un écouteur d'événement pour le clic sur tout l'overlay
document.querySelector('#overlay').addEventListener('click', () => {
    fermerModal();   
});

// Empêcher la propagation des clics sur la fenêtre modale
document.querySelector('#modal').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Ajouter un écouteur d'événement pour les boutons de fermeture
const xmarks = document.querySelectorAll('.fa-xmark');
xmarks.forEach(xmark => {
    xmark.addEventListener('click', fermerModal);
});

// Afficher les projets dans la fenêtre modale
function afficherProjets() {
    const modalContenu = document.querySelector('#modal-content');
    modalContenu.innerHTML = '';

    works.forEach(projet => {
        const projetElement = document.createElement('div');
        projetElement.classList.add('modal-projet');

        const image = document.createElement('img');
        image.src = projet.imageUrl;
        image.alt = projet.title;
        projetElement.appendChild(image);
        const menu = document.createElement ('div');
        menu.classList.add ('menu-projet');

        const deplacer = document.createElement('i');
        deplacer.classList.add('fa', 'fa-arrows-up-down-left-right', 'bouton-element', 'bouton-deplacer');

        image.setAttribute('data-projet-id', projet.id);

        const corbeille = document.createElement('i');
        corbeille.classList.add('fa', 'fa-trash', 'bouton-element');
        corbeille.addEventListener('click', async (e) => {
            const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce projet ?');
            if (confirmation) {
                const response = await fetch(`http://localhost:5678/api/works/${projet.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    resultatWorks = await fetch('http://localhost:5678/api/works');
                    works = await resultatWorks.json();
                    chargerProjets(0);
                    afficherProjets();
                } else {
                    console.error('Erreur lors de la suppression du projet');
                }
            }
        });

        menu.appendChild(deplacer);
        menu.appendChild(corbeille);
        projetElement.appendChild(menu);
        modalContenu.appendChild(projetElement);
    });
}

// Gérer l'ajout d'une photo
document.querySelector(".bouton-Ajouter-Photo").addEventListener('click', function (e) {
    e.stopPropagation();
    document.querySelector('#modal-ajout').style.display = 'flex';
});

// Gérer le clic sur le bouton de retour dans la fenêtre modale d'ajout
document.querySelector(".retour-modal-ajout").addEventListener("click", function(e) {
    e.stopPropagation();
    fermerModalAjout();
});
// GERer le clicajout image 
document.querySelector("#input-image").addEventListener("change", function () {
    let file = this.files[0];
    if (file && file.size <= 4 * 1024 * 1024) {
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            var preview = document.querySelector("#preview-image");
            preview.src = reader.result;
            document.querySelector("#preview-container").classList.remove("hidden");
            document.querySelector("#ajout-image").classList.add("hidden");
        });
        reader.readAsDataURL(file);
        mettreAJourBoutonValider();
    } else {
        alert("La taille maximale de l'image est de 4 Mo.");
    }
});

// Charger les catégories dans le formulaire d'ajout
const selectCategories = document.querySelector('#select-categories');
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectCategories.appendChild(option);
});

// Mettre à jour l'apparence du bouton Valider en fonction des champs
document.querySelector("#input-titre").addEventListener("change", mettreAJourBoutonValider);
document.querySelector("#select-categories").addEventListener("change", mettreAJourBoutonValider);

function mettreAJourBoutonValider() {
    const boutonValider = document.querySelector("#bouton-valider");
    if (document.querySelector("#input-titre").value !== "" && document.querySelector("#select-categories").value !== "") {
        boutonValider.classList.add("valider-actif");
    } else {
        boutonValider.classList.remove("valider-actif");
    }
}

// Ajouter un événement 'submit' au formulaire d'ajout
document.querySelector("#ajout-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Empêcher le rafraîchissement de la page

    const titre = document.querySelector('#input-titre').value;
    const categorieId = parseInt(document.querySelector('#select-categories').value);
    const imageFile = document.querySelector('#input-image').files[0];

    const formData = new FormData();
    formData.append('title', titre);
    formData.append('category', categorieId);
    formData.append('image', imageFile);

    try {
        const reponse = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (reponse.ok) {
            resultatWorks = await fetch('http://localhost:5678/api/works');
            works = await resultatWorks.json();

            chargerProjets(0);

            // Mettre à jour la galerie principale sans fermer la modale d'ajout
            afficherProjets();
            // Réinitialiser le formulaire d'ajout
            document.querySelector("#input-titre").value = "";
            document.querySelector("#select-categories").value = "";
            document.querySelector("#input-image").value = "";
            document.querySelector("#preview-container").classList.add("hidden");

            // Masquer le formulaire d'ajout et afficher la modale d'affichage des images
            document.querySelector("#modal-ajout").style.display = "none";
            document.querySelector("#overlay").style.display = "flex";
        } else {
            console.error('Erreur lors de l\'ajout de l\'image');
        }
    } catch (erreur) {
        console.error('Erreur lors de la requête:', erreur);
    }


   

});
