/**
 * ===================================
 * VoteNow - Page d'administration
 * ===================================
 */

// Identifiants par défaut
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

// Récupération des données
let candidats = JSON.parse(localStorage.getItem('votenow_candidats')) || [];
let votes = JSON.parse(localStorage.getItem('votenow_votes')) || {};
let votants = JSON.parse(localStorage.getItem('votenow_votants')) || [];

// Éléments DOM
const sectionLogin = document.getElementById('section-login');
const sectionAdmin = document.getElementById('section-admin');
const formLogin = document.getElementById('form-login');
const formCandidat = document.getElementById('form-candidat');
const listeCandidats = document.getElementById('liste-candidats');
const messageLogin = document.getElementById('message-login');
const btnDeconnexion = document.getElementById('btn-deconnexion');
const btnReset = document.getElementById('btn-reset');

/**
 * Sauvegarde les données dans localStorage
 */
function sauvegarderDonnees() {
    localStorage.setItem('votenow_candidats', JSON.stringify(candidats));
    localStorage.setItem('votenow_votes', JSON.stringify(votes));
    localStorage.setItem('votenow_votants', JSON.stringify(votants));
}

/**
 * Affiche un message à l'utilisateur
 */
function afficherMessage(element, texte, type) {
    element.textContent = texte;
    element.className = `message ${type} show`;
    
    setTimeout(() => {
        element.classList.remove('show');
    }, 3000);
}

/**
 * Vérifie si l'utilisateur est connecté
 */
function verifierConnexion() {
    const isConnected = sessionStorage.getItem('votenow_admin_connected') === 'true';
    
    if (isConnected) {
        afficherPanneauAdmin();
    } else {
        afficherFormulaireConnexion();
    }
}

/**
 * Affiche le formulaire de connexion
 */
function afficherFormulaireConnexion() {
    sectionLogin.classList.remove('hidden');
    sectionAdmin.classList.add('hidden');
}

/**
 * Affiche le panneau d'administration
 */
function afficherPanneauAdmin() {
    sectionLogin.classList.add('hidden');
    sectionAdmin.classList.remove('hidden');
    afficherListeCandidats();
}

/**
 * Gestion de la connexion
 */
formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('votenow_admin_connected', 'true');
        afficherPanneauAdmin();
        this.reset();
    } else {
        afficherMessage(messageLogin, '❌ Identifiants incorrects !', 'erreur');
    }
});

/**
 * Gestion de la déconnexion
 */
btnDeconnexion.addEventListener('click', function() {
    sessionStorage.removeItem('votenow_admin_connected');
    afficherFormulaireConnexion();
});

/**
 * Ajoute un nouveau candidat
 */
formCandidat.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nomInput = document.getElementById('nom-candidat');
    const sloganInput = document.getElementById('slogan-candidat');
    
    const nom = nomInput.value.trim();
    const slogan = sloganInput.value.trim();
    
    if (!nom || !slogan) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    const nouveauCandidat = {
        id: Date.now(),
        nom: nom,
        slogan: slogan
    };
    
    candidats.push(nouveauCandidat);
    votes[nouveauCandidat.id] = 0;
    
    sauvegarderDonnees();
    afficherListeCandidats();
    
    this.reset();
});

/**
 * Affiche la liste des candidats dans l'admin
 */
function afficherListeCandidats() {
    if (candidats.length === 0) {
        listeCandidats.innerHTML = '<li class="empty-message">Aucun candidat pour le moment</li>';
        return;
    }
    
    listeCandidats.innerHTML = candidats.map(candidat => `
        <li>
            <span><strong>${candidat.nom}</strong> - "${candidat.slogan}"</span>
            <button class="btn-supprimer" data-id="${candidat.id}">🗑️ Supprimer</button>
        </li>
    `).join('');
    
    // Gestion de la suppression
    const boutonsSuppression = listeCandidats.querySelectorAll('.btn-supprimer');
    boutonsSuppression.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            supprimerCandidat(id);
        });
    });
}

/**
 * Supprime un candidat
 */
function supprimerCandidat(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
        candidats = candidats.filter(c => c.id !== id);
        delete votes[id];
        sauvegarderDonnees();
        afficherListeCandidats();
    }
}

/**
 * Réinitialise l'élection
 */
btnReset.addEventListener('click', function() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toute l\'élection ?\n\nCette action supprimera tous les candidats et votes.')) {
        candidats = [];
        votes = {};
        votants = [];
        sauvegarderDonnees();
        afficherListeCandidats();
        alert('✅ L\'élection a été réinitialisée.');
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    verifierConnexion();
});