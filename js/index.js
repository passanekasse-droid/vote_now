
let candidats = JSON.parse(localStorage.getItem('votenow_candidats')) || [];
let votes = JSON.parse(localStorage.getItem('votenow_votes')) || {};
let votants = JSON.parse(localStorage.getItem('votenow_votants')) || [];
function calculerTotalVotes() {
    return Object.values(votes).reduce((total, nb) => total + nb, 0);
}

function afficherResultats() {
    const totalVotes = calculerTotalVotes();
    
    document.getElementById('total-votes').textContent = totalVotes;
    document.getElementById('total-candidats').textContent = candidats.length;
    document.getElementById('total-votants').textContent = votants.length;
    
    const gagnantEl = document.getElementById('gagnant');
    const resultatsContainer = document.getElementById('resultats-container');

    if (candidats.length === 0) {
        resultatsContainer.innerHTML = `
            <p style="text-align: center; color: #999; padding: 40px;">
                Aucun candidat disponible
            </p>
        `;
        gagnantEl.textContent = 'Aucun candidat enregistré';
        gagnantEl.classList.add('no-votes');
        return;
    }
    
    let html = '<div class="resultats-liste">';

    const candidatsTries = [...candidats].sort((a, b) => 
        (votes[b.id] || 0) - (votes[a.id] || 0)
    );
    
    candidatsTries.forEach(candidat => {
        const nbVoix = votes[candidat.id] || 0;
        const pourcentage = totalVotes > 0 ? (nbVoix / totalVotes) * 100 : 0;
        
        html += `
            <div class="resultat-item">
                <span>${candidat.nom}: ${nbVoix} voix (${pourcentage.toFixed(1)}%)</span>
                <div class="barre-container">
                    <div class="barre" style="width: ${pourcentage}%">
                        ${pourcentage > 15 ? pourcentage.toFixed(1) + '%' : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultatsContainer.innerHTML = html;
    

    if (totalVotes > 0) {
        const gagnant = candidatsTries[0];
        gagnantEl.textContent = `🏆 Gagnant : ${gagnant.nom} avec ${votes[gagnant.id]} voix`;
        gagnantEl.classList.remove('no-votes');
    } else {
        gagnantEl.textContent = 'Aucun vote enregistré pour le moment';
        gagnantEl.classList.add('no-votes');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    afficherResultats();
    
    setInterval(() => {
        candidats = JSON.parse(localStorage.getItem('votenow_candidats')) || [];
        votes = JSON.parse(localStorage.getItem('votenow_votes')) || {};
        votants = JSON.parse(localStorage.getItem('votenow_votants')) || [];
        afficherResultats();
    }, 5000);
});