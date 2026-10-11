
const temperatureInput = document.getElementById("temperature");
const humiditeInput = document.getElementById("humidite");
const evaluerButton = document.getElementById("evaluer");
const erreur = document.getElementById("erreur");

// ======================================
// 1. Fonctions d'appartenance
// ======================================

// Température : Froide, Modérée, Chaude

function temperatureFroide(t) {
    if (t <= 10) return 1;
    if (t >= 20) return 0;
    return (20 - t) / 10;
}

function temperatureModeree(t) {
    if (t <= 15 || t >= 30) return 0;
    if (t <= 22.5) return (t - 15) / 7.5;
    return (30 - t) / 7.5;
}

function temperatureChaude(t) {
    if (t <= 25) return 0;
    if (t >= 35) return 1;
    return (t - 25) / 10;
}

// Humidité : Faible, Moyenne, Élevée

function humiditeFaible(h) {
    if (h <= 20) return 1;
    if (h >= 40) return 0;
    return (40 - h) / 20;
}

function humiditeMoyenne(h) {
    if (h <= 30 || h >= 70) return 0;
    if (h <= 50) return (h - 30) / 20;
    return (70 - h) / 20;
}

function humiditeElevee(h) {
    if (h <= 60) return 0;
    if (h >= 80) return 1;
    return (h - 60) / 20;
}

// ======================================
// 2. Affichage des degrés d'appartenance
// ======================================

function afficherDegre(nom, valeur) {
    document.getElementById(nom + "-val").textContent =
        valeur.toFixed(2);

    document.getElementById(nom + "-bar").style.width =
        (valeur * 100) + "%";
}

// ======================================
// 3. Évaluation du confort thermique
// ======================================

function evaluerConfort() {
    const t = Number(temperatureInput.value);
    const h = Number(humiditeInput.value);

    // Vérification des valeurs
    if (
        temperatureInput.value.trim() === "" ||
        humiditeInput.value.trim() === "" ||
        !Number.isFinite(t) ||
        !Number.isFinite(h) ||
        t < 0 || t > 45 ||
        h < 0 || h > 100
    ) {
        erreur.textContent =
            "Température : entre 0 et 45 °C. Humidité : entre 0 et 100 %.";

        return;
    }

    erreur.textContent = "";

    // Fuzzification
    const froide = temperatureFroide(t);
    const moderee = temperatureModeree(t);
    const chaude = temperatureChaude(t);

    const faible = humiditeFaible(h);
    const moyenne = humiditeMoyenne(h);
    const elevee = humiditeElevee(h);

    // Affichage des degrés
    afficherDegre("froide", froide);
    afficherDegre("moderee", moderee);
    afficherDegre("chaude", chaude);

    afficherDegre("faible", faible);
    afficherDegre("moyenne", moyenne);
    afficherDegre("elevee", elevee);

    // ======================================
    // 4. Règles floues
    // Opérateur ET = minimum
    // Opérateur OU = maximum
    // ======================================

    // Niveau de confort mauvais
    const mauvais = Math.max(
        froide,
        Math.min(chaude, faible),
        Math.min(chaude, elevee)
    );

    // Niveau de confort moyen
    const moyen = Math.max(
        Math.min(moderee, faible),
        Math.min(moderee, elevee),
        Math.min(chaude, moyenne)
    );

    // Niveau de confort bon
    const bon = Math.min(moderee, moyenne);

    // Affichage des résultats agrégés
    afficherDegre("mauvais", mauvais);
    afficherDegre("moyen", moyen);
    afficherDegre("bon", bon);

    // ======================================
    // 5. Calcul du score sur 100
    // ======================================

    const score = Math.round(
        Math.max(
            0,
            Math.min(
                100,
                20 + 90 * bon + 40 * moyen - 20 * mauvais
            )
        )
    );

    document.getElementById("score").textContent = score;

    document.getElementById("score-bar").style.width =
        score + "%";

    // ======================================
    // 6. Interprétation et messages
    // ======================================

    let niveau;
    let titreMaison;
    let texteMaison;
    let message;
    let couleur;
    let fondNiveau;

    if (score < 40) {
        niveau = "Confort faible";

        titreMaison = "Un confort à améliorer";

        texteMaison =
            "Les conditions thermiques sont peu favorables. " +
            "Une adaptation de la température ou de l’humidité " +
            "peut améliorer le confort.";

        message =
            "Le confort évalué est faible. Les conditions observées " +
            "peuvent nécessiter un ajustement.";

        couleur = "#d94152";
        fondNiveau = "#fde5e8";

    } else if (score < 70) {
        niveau = "Confort moyen";

        titreMaison = "Vers un meilleur équilibre";

        texteMaison =
            "Les conditions sont intermédiaires. " +
            "Un meilleur équilibre entre température et humidité " +
            "peut renforcer le confort.";

        message =
            "Le confort est intermédiaire. Une amélioration " +
            "des conditions environnementales peut être envisagée.";

        couleur = "#b78314";
        fondNiveau = "#fff0c9";

    } else {
        niveau = "Confort élevé";

        titreMaison = "Un environnement confortable";

        texteMaison =
            "La température et l’humidité offrent des conditions " +
            "favorables à un quotidien plus agréable.";

        message =
            "Le niveau de confort est élevé selon les règles du système. " +
            "Les conditions évaluées sont favorables.";

        couleur = "#078f4d";
        fondNiveau = "#d5f3dc";
    }

    // Mise à jour du score et de son niveau
    const niveauElement = document.getElementById("niveau");
    const scoreElement = document.getElementById("score");
    const barreScore = document.getElementById("score-bar");

    niveauElement.textContent = niveau;
    niveauElement.style.color = couleur;
    niveauElement.style.backgroundColor = fondNiveau;

    scoreElement.style.color = couleur;
    barreScore.style.backgroundColor = couleur;

    // Mise à jour du texte d'information
    document.getElementById("message").textContent = message;

    // Mise à jour du titre et du texte sous la maison
    document.getElementById("house-title").textContent =
        titreMaison;

    document.getElementById("house-message").textContent =
        texteMaison;
}

// ======================================
// 7. Événements
// ======================================

evaluerButton.addEventListener("click", evaluerConfort);

temperatureInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        evaluerConfort();
    }
});

humiditeInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        evaluerConfort();
    }
});

// ======================================
// 8. Initialisation
// ======================================

evaluerConfort();