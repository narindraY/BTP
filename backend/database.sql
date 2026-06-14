CREATE TABLE utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    contact VARCHAR(20),
    mot_de_passe VARCHAR(30) NOT NULL,
    role VARCHAR(50) NOT NULL,
    actif BOOLEAN DEFAULT TRUE
);

CREATE TABLE discussion (
    id_discussion INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    statut VARCHAR(20) DEFAULT 'ouverte',
    FOREIGN KEY (client_id) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE message (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    discussion_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    contenu TEXT,
    lu BOOLEAN DEFAULT FALSE,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discussion_id) REFERENCES discussion(id_discussion),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE piece_jointe_message (
    id_piece_jointe INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    nom_fichier VARCHAR(70) NOT NULL,
    url_fichier VARCHAR(500) NOT NULL,
    type_fichier VARCHAR(50) NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES message(id_message)
);
CREATE TABLE demande (
    id_demande INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    type_realisation VARCHAR(100),
    budget_client DECIMAL,
    date_souhaitee DATE,
    statut VARCHAR(50) DEFAULT 'nouvelle',
    FOREIGN KEY (client_id) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE contrat (
    id_contrat INT AUTO_INCREMENT PRIMARY KEY,
    demande_id INT NOT NULL,
    reference VARCHAR(100) UNIQUE,
    budget DECIMAL,
    description TEXT,
    date_signature DATE,
    date_debut DATE,
    date_fin DATE,
    statut VARCHAR(50) DEFAULT 'brouillon',
    FOREIGN KEY (demande_id) REFERENCES demande(id_demande)
);

CREATE TABLE projet (
    id_projet INT AUTO_INCREMENT PRIMARY KEY,
    contrat_id INT NOT NULL,
    nom_projet VARCHAR(100),
    description TEXT,
    responsable_id INT,
    statut VARCHAR(50) DEFAULT 'planifie',
    date_debut DATE,
    date_fin_prevue DATE,
    date_fin_reelle DATE,
    FOREIGN KEY (contrat_id) REFERENCES contrat(id_contrat),
    FOREIGN KEY (responsable_id) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE tache (
    id_tache INT AUTO_INCREMENT PRIMARY KEY,
    projet_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    assigne_a INT,
    statut VARCHAR(30) DEFAULT 'a_faire',
    FOREIGN KEY (projet_id) REFERENCES projet(id_projet),
    FOREIGN KEY (assigne_a) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE suivi (
    id_suivi INT AUTO_INCREMENT PRIMARY KEY,
    tache_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    pourcentage INT NOT NULL,
    commentaire TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tache_id) REFERENCES tache(id_tache),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE photo_chantier (
    id_photo INT AUTO_INCREMENT PRIMARY KEY,
    projet_id INT NOT NULL,
    tache_id INT,
    utilisateur_id INT NOT NULL,
    fichier VARCHAR(255) NOT NULL,
    description TEXT,
    date_prise DATETIME,
    FOREIGN KEY (projet_id) REFERENCES projet(id_projet),
    FOREIGN KEY (tache_id) REFERENCES tache(id_tache),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE ressource (
    id_ressource INT AUTO_INCREMENT PRIMARY KEY,
    nom_ressource VARCHAR(100) NOT NULL,
    type_ressource VARCHAR(50) NOT NULL,
    quantite DECIMAL,
    unite VARCHAR(50),
    prix_unitaire DECIMAL(15,2)
);
CREATE TABLE tache_ressource (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tache_id INT NOT NULL,
    ressource_id INT NOT NULL,
    quantite_utilisee DECIMAL(10,2),
    FOREIGN KEY (tache_id) REFERENCES tache(id_tache),
    FOREIGN KEY (ressource_id) REFERENCES ressource(id_ressource)
);

CREATE TABLE notification (
    id_notification INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id_utilisateur)
);

CREATE TABLE publication (
    id_publication INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    img VARCHAR(255),
    description TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);
