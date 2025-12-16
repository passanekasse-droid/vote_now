
let candidats = JSON.parse(localStorage.getItem('votenow_candidats')) || [];
let votes = JSON.parse(localStorage.getItem('votenow_votes')) || {};
let votants = JSON.parse(localStorage.getItem('votenow_votants')) || [];


const formVote = document.getElementById('form-vote');
const listeCandidatsVote = document.getElementById('liste-candidats-vote');
const messageVote = document.getElementById('message-vote');


function sauvegarderDonnees() {
    localStorage.setItem('votenow_candidats', JSON.stringify(candidats));
    localStorage.setItem('votenow_votes', JSON.stringify(votes));
    localStorage.setItem('votenow_votants', JSON.stringify(votants));
}


function afficherMessage(element, texte, type) {
    element.textContent = texte;
    element.className = `message ${type} show`;
    
    setTimeout(() => {
        element.classList.remove('show');
    }, 3000);
}

function afficherCandidatsPourVote() {
    if (candidats.length === 0) {
        listeCandidatsVote.innerHTML = `
            <p class="empty-message" style="text-align: center; color: #999; padding: 20px;">
                Aucun candidat disponible pour le moment.<br>
                Veuillez contacter l'administrateur.
            </p>
        `;
        return;
    }
    
    listeCandidatsVote.innerHTML = candidats.map(candidat => `
        <label class="candidat-card">
            <input type="radio" name="candidat" value="${candidat.id}" required>
            <span>${candidat.nom}</span>
            <small>"${candidat.slogan}"</small>
        </label>
    `).join('');
    
    
    const cartes = listeCandidatsVote.querySelectorAll('.candidat-card');
    cartes.forEach(carte => {
        carte.addEventListener('click', function() {
            cartes.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

formVote.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const votantId = document.getElementById('votant-id').value.trim();
    const candidatSelectionne = document.querySelector('input[name="candidat"]:checked');
    
    
    if (!votantId) {
        afficherMessage(messageVote, '❌ Veuillez entrer votre identifiant.', 'erreur');
        return;
    }
    
    if (!candidatSelectionne) {
        afficherMessage(messageVote, '❌ Veuillez sélectionner un candidat.', 'erreur');
        return;
    }
    
    
    if (votants.includes(votantId)) {
        afficherMessage(messageVote, '❌ Vous avez déjà voté avec cet identifiant !', 'erreur');
        return;
    }
    

    const candidatId = candidatSelectionne.value;
    votes[candidatId]++;
    votants.push(votantId);
    
    sauvegarderDonnees();
    
    afficherMessage(messageVote, '✅ Vote enregistré avec succès ! Merci pour votre participation.', 'succes');
    
    
    this.reset();
    
    const cartes = listeCandidatsVote.querySelectorAll('.candidat-card');
    cartes.forEach(c => c.classList.remove('selected'));
});


document.addEventListener('DOMContentLoaded', function() {
    afficherCandidatsPourVote();
});