// on met une variable de type boolen pour indiquer si on est connecté ou non ça affiche t /flase
const connecte = (localStorage.getItem('token') !== null)
console.log(connecte);

if (connecte) { 
    //document.querySelector('.filtres').classList.add('hidden')
    document.querySelector('.boutonLogin').innerText = 'logout'
} else {
    // Pas connecté
    document.querySelector('.headerAdmin').classList.add('hidden')
    document.querySelectorAll('.boutonModifier').forEach((element) => {
        element.classList.add('hidden')
    })
}

// Récupération des données (works et catégories) dans la base de données
const resultatWorks = await fetch('http://localhost:5678/api/works')
const works = await resultatWorks.json()
console.log(works)

const resultatCategories = await fetch('http://localhost:5678/api/categories');
const categories = await resultatCategories.json();
console.log(categories)
// 
function chargerProjets(category){ 
    console.log(category)

    // Filtrer les works en se basant sur les categories
    let worksFiltered= new Array
    if (category === 0)
        worksFiltered = works
    else 
        worksFiltered = works.filter(function(work){return work.categoryId === category})

    // element DOM qui accueille toutes les images on le reinitialise 
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML=""
    worksFiltered.forEach(element => {
        // console.log(element)
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
chargerProjets(0)

if (!connecte) {
    // creation des boutons pour les categories (ici j'ai renommer l'element / category ) d'abord le bouton tous + les 3 categories
    // unshift pour ajouter la categorie tous au tableau /     
    categories.unshift({ id: 0, name: 'Tous' })
    console.log(categories)
    categories.forEach(category => {
        console.log(category)
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

document.querySelector('.boutonLogin').addEventListener('click', function(){
if(connecte){
    localStorage.clear()
    window.location.href="index.html"
}
else{
    window.location.href="loginPage.html"
}
})
// ici la fonctionnalité qui permet d'ouvrir la fenetre modale mise en place dans le html 
// La fonction récupère l'élément modal par son ID et change la valeur de son style pour l'afficher 
// la fonction ouvrirModal pour qu'elle appelle une nouvelle fonction afficherProjets qui récupérera 
// les projets depuis l'API et les affichera dans la fenêtre modale :

function ouvrirModal() {
    // afficherProjets();
	const modal = document.querySelector('#overlay');
    // dans cette partie la que la fenetre modale va s'afficher comme un bloc et que son display "none" du css se modifie en bloc 
	modal.style.display = 'flex'; 
    afficherProjets();
}
function fermerModal() {
    // afficherProjets();
	const modal = document.querySelector('#overlay');
    // dans cette partie la que la fenetre modale va s'afficher comme un bloc et que son display "none" du css se modifie en bloc 
	modal.style.display = 'none'; 

}
document.querySelector('#boutonModifierProjets').addEventListener('click', () => {
    ouvrirModal();
});
document.querySelector('#overlay').addEventListener('click', () => {
    fermerModal();
});

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
        deplacer.classList.add('fa', 'fa-arrows-up-down-left-right', 'bouton-element');
       
// // jessaie de creer l'option suppression via le bouton corbeille surlaquelle je pourrais cliquer pour supp le projet 
        const corbeille = document.createElement('i');
        corbeille.classList.add('fa', 'fa-trash', 'bouton-element');
        corbeille.addEventListener('click', () => alert('Supprimer le projet ?'));
       
        menu.appendChild(deplacer)
        menu.appendChild(corbeille)
        projetElement.appendChild(menu);
        modalContenu.appendChild(projetElement);
        
    });
}

// Créer le bouton afficher les image 
const boutonAjouterPhoto = document.createElement('button');
boutonAjouterPhoto.textContent = 'Ajouter une photo';
boutonAjouterPhoto.classList.add('bouton-Ajouter-Photo');

// Créer le lien de suppression de la galerie 
const lienSupprimer = document.createElement('a');
lienSupprimer.href = '#';
lienSupprimer.textContent = 'Supprimer la galerie';

// Récupérer la balise footer avec l'ID "modal"
const footer = document.querySelector('#modal footer');

// Ajouter le bouton et le lien à l'intérieur du footer
footer.appendChild(boutonAjouterPhoto);
footer.appendChild(lienSupprimer);

