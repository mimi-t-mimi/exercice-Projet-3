// on met une variable de type boolen pour indiquer si on est connecté ou non ça affiche t /flase
const connecte = (localStorage.getItem('token') !== null)

if (connecte) { 
    document.querySelector('.boutonLogin').innerText = 'logout'
} else {
    // Pas connecté
    document.querySelector('.headerAdmin').classList.add('hidden')
    document.querySelectorAll('.boutonModifier').forEach((element) => {
        element.classList.add('hidden')
    })
}

// Ajouter un écouteur d'événement pour le clic sur le bouton de connexion
document.querySelector('.boutonLogin').addEventListener('click', function(){
    if(connecte){
        localStorage.clear()
        window.location.href="index.html"
    }
    else{
        window.location.href="loginPage.html"
    }
})

// Récupération des données (works et catégories) dans la base de données
const resultatWorks = await fetch('http://localhost:5678/api/works')
const works = await resultatWorks.json()

const resultatCategories = await fetch('http://localhost:5678/api/categories');
const categories = await resultatCategories.json();

// Création des boutons des catégories (Seulement si connecté)
function chargerCategories() {
    
    // creation des boutons pour les categories (ici j'ai renommer l'element / category ) d'abord le bouton tous + les 3 categories
    // unshift pour ajouter la categorie tous au tableau /     
    categories.unshift({ id: 0, name: 'Tous' })
    console.log(categories);
    categories.forEach(category => {
        const button = document.createElement('button');
        button.innerText = category.name;

        // Ajouter un écouteur d'événement pour le clic sur chaque bouton qui executera l'id de la categorie
        // e.target permet faire reference à la cible bouton 
        button.addEventListener('click', () => {
            chargerProjets(category.id)
        });
    
        // element DOM qui accueille tous les boutons
        const filtres = document.querySelector('.filtres');
        filtres.appendChild(button);
    });

}

// Chargement des projets
function chargerProjets(category){ 

    // Filtrer les works en se basant sur les categories
    let worksFiltered = new Array
    if (category === 0)
        worksFiltered = works
    else 
        worksFiltered = works.filter(function(work){return work.categoryId === category})

    // element DOM qui accueille toutes les images on le reinitialise 
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ""
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
};

// appel de la fonction
if (!connecte) { chargerCategories() }
chargerProjets(0)




// ici la fonctionnalité qui permet d'ouvrir la fenetre modale mise en place dans le html 
// La fonction récupère l'élément modal par son ID et change la valeur de son style pour l'afficher 
// la fonction ouvrirModal pour qu'elle appelle une nouvelle fonction afficherProjets qui récupérera 
// les projets depuis l'API et les affichera dans la fenêtre modale :
function ouvrirModal() {
	const modal = document.querySelector('#overlay');
    // dans cette partie la que la fenetre modale va s'afficher comme un bloc et que son display "none" du css se modifie en bloc 
	modal.style.display = 'flex'; 
    // Afficher les projets dans la fenêtre modale
    afficherProjets();
}

function fermerModal() {
    // ATTENTION : il faut pas oublier de fermer aussi la fenetre modale d'ajout
	const modal = document.querySelector('#overlay');
    const modalAjout= document.querySelector('#modal-ajout');
    // dans cette partie la que la fenetre modale va s'afficher 
    // comme un bloc et que son display "none" du css se modifie en bloc 
    // On doit réinitialiser le contenu de la fenêtre modale ajout
    document.querySelector("#preview-container").classList.add("hidden")
    document.querySelector("#ajout-image").classList.remove("hidden")
	// On cache les 2 modales
    modalAjout.style.display = 'none'; 
    modal.style.display = 'none'; 
}

// Ajouter un écouteur d'événement pour le clic sur le bouton "Modifier les projets"
document.querySelector('#boutonModifierProjets').addEventListener('click', () => {
    ouvrirModal();
});

// Ajouter un écouteur d'événement pour le clic sur tout le overlay
document.querySelector('#overlay').addEventListener('click', () => {
    fermerModal();   
});

// Eviter que les clics sur la fenêtre modale ne se transmettent à l'overlay
document.querySelector('#modal').addEventListener('click', (e) => {
    e.stopPropagation()
    // je met un stop propagation avec fonction (e) 
});

// ici j'ai ajouter l'OPTION DE FERMETURE DE LA MODALE CA FONCTIONNNE
// on  parcours tous les boutons avec la class xmark 
const xmarks = document.querySelectorAll('.fa-xmark');
xmarks.forEach (xmark=>{xmark.addEventListener('click', fermerModal)})




// Affichage des projets dans la fenêtre modale
function afficherProjets() {
    // element DOM qui accueille tous les projets
    const modalContenu = document.querySelector('#modal-content');
    // code pour vider le modal contenu 
    modalContenu.innerHTML=""

    // Parcourir tous les projets et les afficher avec une corbeille 
    // j'essaie de créer une div qui contiendra le projet isssu de l'api 'works'
    works.forEach(projet => {
        const projetElement = document.createElement('div');
        projetElement.classList.add('modal-projet');
        
        // Créer d'abord une picture qui contiendra et en css hover pour faire apparaitre et disparaitre la croix et elle apparait que quand on passe la souris dessu  
        // l'image du projet et une figcaption qui contiendra le titre du projet 
        const image = document.createElement('img');
        image.src = projet.imageUrl;
        image.alt = projet.title;
        projetElement.appendChild(image);
        const menu = document.createElement ('div')
        menu.classList.add ('menu-projet')

        const deplacer = document.createElement('i');
        deplacer.classList.add('fa', 'fa-arrows-up-down-left-right', 'bouton-element','bouton-deplacer');
       
// // jessaie de creer l'option suppression via le bouton corbeille surlaquelle je pourrais cliquer pour supp le projet 
        const corbeille = document.createElement('i');
        corbeille.classList.add('fa', 'fa-trash', 'bouton-element');
        corbeille.addEventListener('click', () => alert('Supprimer le projet ?'));
       
        menu.appendChild(deplacer)
        menu.appendChild(corbeille)
        projetElement.appendChild(menu);
        modalContenu.appendChild(projetElement);
        
    });

};

// Ajouter un écouteur d'événement pour le clic sur le bouton "Ajouter une photo"
document.querySelector(".bouton-Ajouter-Photo").addEventListener('click', function (e) {
    e.stopPropagation()
    document.querySelector('#modal-ajout').style.display='flex'
})

// Ajouter un événement de clic au bouton "retour"
document.querySelector(".retour-modal-ajout").addEventListener("click", function(e) {
    e.stopPropagation()
    // On réinitialise le contenu de la fenêtre modale ajout
    document.querySelector("#preview-container").classList.add("hidden")
    document.querySelector("#ajout-image").classList.remove("hidden")
    // On cache la fenêtre modale
    document.querySelector("#modal-ajout").style.display = "none";
});

// Ajouter un écouteur d'événement pour le clic sur le bouton
document.querySelector("#ajout-image").addEventListener("click", function () {
  
    // Crée un élément input de type "file"
    let input = document.createElement("input");
    input.type = "file";

    // Ajouter un écouteur d'événement pour le changement de valeur de l'input file 
    // lorsqu'un chngement est effectué a savoir un nvx fichier est selectionné 
    input.addEventListener("change", function() {
        let file = input.files[0]; // Récupérer le fichier sélectionné
    
        if (file && file.size <= 4 * 1024 * 1024) { 
            // Le fichier est valide, afficher la prévisualisation de l'image  filesreader pour lire le contenu du fichier 
            let reader = new FileReader();

            // Ajouter un écouteur d'événement pour le chargement du fichier  pour détecter lorsque le chargement du fichier est terminé 
            reader.addEventListener("load", function() {
                // Créer un élément d'image pour la prévisualisation
                var preview = document.querySelector("#preview-image");
                // j'attribu ici toutes les notions css que doit inclure mon iiamge prévisualisée 
                preview.src = reader.result;
                
                // Ajouter la prévisualisation de l'image à l'élément div : je supprime tout contenu existant de l'élément  ; et le append child prview cotainerpourvoir mon image 
                document.querySelector("#preview-container").classList.remove("hidden")
                document.querySelector("#ajout-image").classList.add("hidden")
            });

            // Lire le fichier en tant que données URL
            reader.readAsDataURL(file);
            mettreAJourBoutonValider();
        } else {
            // Le fichier est trop volumineux, afficher un message d'erreur
            alert("La taille maximale de l'image est de 4 Mo.");
        }
    });

    // Déclencher le clic sur l'élément input pour afficher la boîte de dialogue de sélection de fichiers
    input.click();
});

// Chargement de la liste des catégories dans le formulaire d'ajout
const selectCategories = document.querySelector('#select-categories'); // Utilisation de querySelector
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectCategories.appendChild(option);
});

// CHANGER L'APPARENCE DU BOUTON QD JE VALIDE TOUTES LES CATEGORIES 


// Ajouter des écouteurs d'événement pour les champs input et select / UNE FOIS MES CHAMPS COMPLETER LA FONCTION DU BOUTON VALIDER SERA APPELÉE 
document.querySelector("#input-titre").addEventListener("change", mettreAJourBoutonValider);
document.querySelector("#select-categories").addEventListener("change", mettreAJourBoutonValider);

// Fonction pour mettre à jour l'apparence du bouton Valider
function mettreAJourBoutonValider() {
    const boutonValider = document.querySelector("#bouton-valider");
    // Vérifier si les champs titre et catégorie ont une valeur non vide
    if (document.querySelector("#input-titre").value !== "" && document.querySelector("#select-categories").value !== "") {
        boutonValider.classList.add("valider-actif"); //  une classe CSS pour mettre en évidence le bouton Valider avc les couleur de la maquette 
        // Ajouter la nouvelle photo à la variable nouvellesPhotos
        // nouvellesPhotos.push({
        //     imageUrl: document.querySelector("#preview-image").src,
        //     title: inputTitre.value
        // });
    } else {
        boutonValider.classList.remove("valider-actif"); // Supprimer la classe CSS pour désactiver le bouton Valider
    }
}

// Déclencher la fonction pour vérifier l'état initial des champs
mettreAJourBoutonValider();


// // Bouton Valider
document.querySelector('#bouton-valider').addEventListener("click", function () {


      // Actualiser la galerie avec la nouvelle photo
      chargerProjets(0);

      // Fermer la fenêtre modale après avoir ajouté la photo
      fermerModal();
  }     
  )


// Gérer la soumission du formulaire d'ajout
document.querySelector('#ajout-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Récupérer les valeurs du formulaire
    const titre = document.querySelector('#input-titre').value;
    const categorieId = parseInt(document.querySelector('#select-categories').value);
    const imageFile = document.querySelector('#input-image').files[0];
    console.log(titre)
    console.log(categorieId)
    console.log(imageFile)


    // Préparer les données pour l'envoi à l'API (FormData)
    const formData = new FormData();
    formData.append('title', titre);
    formData.append('categoryId', categorieId);
    formData.append('image', imageFile);

    // Envoyer les données à l'API pour ajouter la nouvelle image
    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData
    });

//     if (response.ok) {
//         // Ajouter la nouvelle photo à la galerie
//         nouvellesPhotos.push({
//             imageUrl: URL.createObjectURL(imageFile), // Utiliser l'URL locale temporaire de l'image
//             title: titre
//         });



//         // Mettre à jour la galerie et fermer la fenêtre modale
//         chargerProjets(0);
//         fermerModal();
//     } 
//     else {
//         console.error('Erreur lors de l\'ajout de l\'image');
//     }
// });
        if (response.ok) {
        // Ajouter la nouvelle photo à la galerie
        const nouvellePhoto = {
            imageUrl: URL.createObjectURL(imageFile),
            title: titre
        };

        nouvellesPhotos.push(nouvellePhoto);

        // Mettre à jour la galerie et fermer la fenêtre modale
        chargerProjets(0);
        fermerModal();

        // Récupérer le contenu du modèle
        const template = document.querySelector('#template-nouvelle-photo').innerHTML;

        // Remplacer les variables dans le modèle avec les données de la nouvelle photo
        const nouvellePhotoHTML = template
            .replace('{{imageUrl}}', nouvellePhoto.imageUrl)
            .replace('{{title}}', nouvellePhoto.title);

        // Ajouter la nouvelle photo au DOM avc l'operateur+= POU que l'image sajoute au contenu deja existant 
        const modalContent = document.querySelector('#modal-content');
        modalContent.innerHTML += nouvellePhotoHTML;
        } else {
        console.error('Erreur lors de l\'ajout de l\'image');
        }
    });