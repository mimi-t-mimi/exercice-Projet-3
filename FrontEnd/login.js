// Récupération des éléments du formulaire de connexion
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Écouteur d'événement sur la soumission du formulaire de connexion
loginForm.addEventListener('submit', async function(event) {

  // empeche le comportement stdr du bouton submit  qui est de revenir sur la pag vide et pas dans le code
  event.preventDefault(); 

  // Récupération des valeurs saisies
  const email = emailInput.value;
  const password = passwordInput.value;

  // Construction de l'objet javascript de données à envoyer
  const data = {
    email: email,
    password: password
  };

  // Envoi de la requête POST pour la connexion
  await fetch('http://localhost:5678/api/users/login', {
      // on veut transmettre l'info donc on met post et pas get 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify(data)
    })
    .then(response => {
        
        // Vérification de la réponse
      if (response.ok ) {
          // Récupération du token JWT
        response.json()
          .then(data => {
            // Stockage du token JWT dans le localStorage
            localStorage.setItem('token', data.token);
            // Redirection vers la page index.html après la connexion réussie
            window.location.href = 'index.html';
          })
          .catch(error => {
            throw new Error('Erreur dans la traduction json()');
          }); 

      } else {
          // Gestion des erreurs de connexion
          throw new Error('Erreur dans l’identifiant ou le mot de passe');
      }
    })
    .catch(error => {
      // Afficher un message d'erreur dans une boîte de dialogue
      alert(error.message);
      // error.message est un objet  qui contient le contenu du message il depend de l'erreur indiquée 
    });
});
