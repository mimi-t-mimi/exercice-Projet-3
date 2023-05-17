// Récupération des données (works et catégories) dans la base de données
const resultatWorks = await fetch('http://localhost:5678/api/works')
const works = await resultatWorks.json()
console.log(works)

const resultatCategories = await fetch('http://localhost:5678/api/categories');
const categories = await resultatCategories.json();
console.log(categories)


works.forEach(element => {
    // console.log(element)
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = element.imageUrl;
    img.alt = element.title;
    const caption = document.createElement('figcaption');
    caption.innerText = element.title;
    fig.appendChild(img);
    fig.appendChild(caption);

    // element DOM qui accueille toue les images 
    const gallery = document.querySelector('.gallery');
    gallery.appendChild(fig); 
});

// creation des boutons pour les categories (ici j'ai renommer l'element / category )
categories.forEach( category => {
    console.log(category)
    const button = document.createElement('button');
button.innerText= category.name;
 // element DOM qui accueille tous les boutons
 const filtres = document.querySelector('.filtres');
 filtres.appendChild(button); 
});
  // Ajouter un écouteur d'événement pour le clic sur chaque bouton
  button.addEventListener('click', () => {
    const button = document.createElement('button');
button.innerText= category.name;
    // Filtrer les works en se basant sur les categories
    const worksFiltred = works.filter(work => work.category === category.name);
    });     


        //  creation des elements pour tous les works qui iront dans les catégories correspondantes 
    worksFiltred.forEach( work => {
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.src=work.imageUrl;
        img.alt=work.title; 
        const caption =document.createElement ('figcaption');
        caption.innerText= work.title ; 
        fig.appendChild(img);
        fig.appendChild(caption);
      
    // Élément du DOM qui accueille toutes les images
 gallery.appendChild(fig);
    });
        

// reference à la premiere categorie appelée (pourquoi je n'arrive pas afficher la catégorie tous ??????)
const firstcategory = categories[0];

// element <P> dans le HTML pour afficher le nom de la categorie que je selectionne
const categoryNom= document.createElement ("p");
categorieNom.innerText= firstcategory.name;


// Élément du DOM qui accueille le nom de la catégorie
const categorieContainer = document.querySelector('.filtres');
categorieContainer.appendChild(categoryNom);
