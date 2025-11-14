-- 🎭 Données initiales pour la table role
BEGIN;

INSERT INTO role (id_role, label) VALUES
(1, 'utilisateur'),
(2, 'association'),
(3, 'admin');

-- 🏢 Données initiales pour la table association
INSERT INTO association (id_association, name, email, phone, address) VALUES
(1, 'Refuge des 4 Pattes', 'contact@4pattes.fr', '0556123456', '12 rue des Animaux, 33000 Bordeaux'),
(2, 'SOS Matous', 'contact@sosmatous.fr', '0557234567', '45 avenue Féline, 33200 Bordeaux'),
(3, 'Amis des Animaux', 'contact@amisanimaux.fr', '0558345678', '78 boulevard Canin, 33300 Bordeaux'),
(4, 'Refuge du Bonheur', 'contact@refugebonheur.fr', '0559456789', '23 impasse Joyeuse, 33400 Talence'),
(5, 'Protection Animale 33', 'contact@pa33.fr', '0551567890', '89 rue de la Protection, 33500 Libourne');

-- 👤 Données initiales pour la table user (mots de passe hachés avec argon2)
-- Mot de passe par défaut pour tous : "Password@123"
INSERT INTO "user" (id_user, first_name, last_name, email, password, id_role, id_association) VALUES
-- Utilisateurs standards (role=1, id_association=NULL)
(1, 'Jean', 'Dupont', 'jean.dupont@example.com', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 1, NULL),
(2, 'Marie', 'Martin', 'marie.martin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 1, NULL),
(3, 'Pierre', 'Bernard', 'pierre.bernard@example.com', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 1, NULL),
(4, 'Sophie', 'Dubois', 'sophie.dubois@example.com', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 1, NULL),

-- Représentants d'associations (role=2, avec id_association)
(5, 'Claire', 'Dupuis', 'claire.dupuis@4pattes.fr', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 2, 1),
(6, 'Luc', 'Moreau', 'luc.moreau@sosmatous.fr', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 2, 2),
(7, 'Emma', 'Laurent', 'emma.laurent@amisanimaux.fr', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 2, 3),
(8, 'Hugo', 'Simon', 'hugo.simon@refugebonheur.fr', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 2, 4),
(9, 'Camille', 'Petit', 'camille.petit@pa33.fr', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 2, 5),

-- Représentants secondaires d'associations (pour tests)
(10, 'Thomas', 'Roux', 'thomas.roux@4pattes.fr', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 2, 1),
(11, 'Alice', 'Blanc', 'alice.blanc@sosmatous.fr', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 2, 2),

-- Administrateurs système (admin) - id_association = NULL
(12, 'Admin', 'System', 'admin@petfosterconnect.com', '$argon2id$v=19$m=65536,t=3,p=4$7asDKNrYirHeiBYVj1C4pw$MwdGCSA6Z05T/K4fEWtBpkTInZnido2XGN7Un0HVpaQ', 3, NULL); -- password: Admin@123

-- 🐾 Animaux (statuts : 'disponible' ou 'accueilli' uniquement)
-- Images depuis LoremFlickr et autres sources
INSERT INTO animal (id_animal, name, species, breed, age, sex, description, photo_url, status, id_association) VALUES
-- Animaux de l'association "Refuge des 4 Pattes" (id=1)
(1, 'Rex', 'Chien', 'Berger Allemand', 5, 'Mâle', 'Gentil chien protecteur, très loyal et obéissant. Parfait pour une famille expérimentée.', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg', 'disponible', 1),
(2, 'Luna', 'Chien', 'Golden Retriever', 3, 'Femelle', 'Chienne douce et affectueuse, parfaite avec les enfants. Très joueuse et sociable.', 'https://loremflickr.com/500/500/golden-retriever', 'disponible', 1),
(3, 'Max', 'Chien', 'Labrador', 7, 'Mâle', 'Chien calme et obéissant, idéal pour seniors. Très posé et affectueux.', 'https://loremflickr.com/500/500/labrador', 'accueilli', 1),

-- Animaux de l'association "SOS Matous" (id=2)
(4, 'Minette', 'Chat', 'Chartreux', 2, 'Femelle', 'Adorable chatte joueuse et câline. S''entend bien avec les autres chats.', 'https://loremflickr.com/500/500/chartreux-cat', 'disponible', 2),
(5, 'Whiskers', 'Chat', 'Maine Coon', 4, 'Mâle', 'Chat majestueux et indépendant. Caractère bien trempé mais très affectueux.', 'https://loremflickr.com/500/500/maine-coon', 'disponible', 2),
(6, 'Smokey', 'Chat', 'British Shorthair', 1, 'Mâle', 'Jeune chat très affectueux et joueur. Première adoption.', 'https://loremflickr.com/500/500/british-shorthair', 'disponible', 2),

-- Animaux de l'association "Amis des Animaux" (id=3)
(7, 'Bella', 'Chien', 'Border Collie', 2, 'Femelle', 'Chienne énergique qui adore jouer et courir. Besoin d''exercice quotidien.', 'https://loremflickr.com/500/500/border-collie', 'disponible', 3),
(8, 'Oscar', 'Chat', 'Persan', 6, 'Mâle', 'Chat tranquille qui cherche un foyer paisible. Parfait pour appartement.', 'https://loremflickr.com/500/500/persian-cat', 'disponible', 3),

-- Animaux de l'association "Refuge du Bonheur" (id=4)
(9, 'Rocky', 'Chien', 'Bulldog Français', 4, 'Mâle', 'Chien sociable et drôle. Caractère jovial et attachant.', 'https://loremflickr.com/500/500/french-bulldog', 'disponible', 4),
(10, 'Mimi', 'Chat', 'Siamois', 3, 'Femelle', 'Chatte bavarde et attachante. Très communicative et affectueuse.', 'https://loremflickr.com/500/500/siamese-cat', 'accueilli', 4),

-- Animaux de l'association "Protection Animale 33" (id=5)
(11, 'Buddy', 'Chien', 'Beagle', 5, 'Mâle', 'Chien chasseur reconverti en chien de famille. Très gentil avec les enfants.', 'https://loremflickr.com/500/500/beagle', 'disponible', 5),
(12, 'Shadow', 'Chat', 'Chat de gouttière', 2, 'Mâle', 'Chat noir mystérieux mais très affectueux. Récupéré dans la rue.', 'https://loremflickr.com/500/500/black-cat', 'disponible', 5),
(13, 'Coco', 'Chien', 'Cocker Spaniel', 6, 'Femelle', 'Chien doux et patient, excellent avec les enfants.', 'https://loremflickr.com/500/500/cocker-spaniel', 'disponible', 5),
(14, 'Nala', 'Chat', 'Bengal', 1, 'Femelle', 'Jeune chatte très active et joueuse. Caractère espiègle.', 'https://loremflickr.com/500/500/bengal-cat', 'disponible', 5);

-- ✉️ Demandes d'accueil (statuts : 'pending', 'accepted', 'refused')
INSERT INTO request (id_request, created_at, status, message, id_user, id_animal) VALUES
-- Demandes en attente (pending)
(1, '2025-07-30 10:00:00', 'pending', 'Je suis disponible dès août pour accueillir Rex. J''ai déjà eu des bergers allemands et je connais bien cette race.', 1, 1),
(2, '2025-08-15 14:30:00', 'pending', 'Je cherche un chat câlin pour tenir compagnie à mon autre chat. Minette semble parfaite !', 2, 4),
(3, '2025-09-01 09:15:00', 'pending', 'Ma famille souhaite accueillir un chien actif. Bella correspond parfaitement à nos attentes.', 3, 7),
(4, '2025-09-20 16:45:00', 'pending', 'Je vis seul et je cherche un compagnon tranquille. Oscar m''intéresse beaucoup.', 4, 8),
(5, '2025-10-05 11:20:00', 'pending', 'Nous avons un grand jardin et adorerions accueillir Buddy. Nous avons de l''expérience avec les beagles.', 1, 11),

-- Demandes acceptées (accepted)
(6, '2025-07-10 10:30:00', 'accepted', 'Je recherche un chien adulte calme pour ma retraite. Max serait idéal.', 2, 3),
(7, '2025-08-01 15:00:00', 'accepted', 'Nous cherchons une chatte bavarde et affectueuse. Mimi nous plaît beaucoup !', 3, 10),

-- Demandes refusées (refused)
(8, '2025-07-25 13:45:00', 'refused', 'Je voudrais accueillir Luna mais je travaille beaucoup et suis souvent absent.', 4, 2),
(9, '2025-08-20 10:00:00', 'refused', 'J''aimerais prendre Whiskers mais j''habite en studio sans extérieur.', 1, 5),
(10, '2025-09-10 14:30:00', 'refused', 'Rocky me plaît mais je n''ai jamais eu de chien auparavant.', 2, 9),
(11, '2025-09-25 16:15:00', 'refused', 'Je cherche un chat pour mon appartement mais je suis souvent en déplacement.', 3, 6),
(12, '2025-10-10 11:00:00', 'refused', 'Shadow est magnifique mais j''ai déjà trois chats chez moi.', 4, 12),
(13, '2025-10-15 09:30:00', 'refused', 'Nala me plaît beaucoup mais mon propriétaire n''accepte pas les animaux.', 1, 14);

-- Réinitialiser les séquences d'auto-incrémentation
SELECT setval('role_id_role_seq', 3, true);
SELECT setval('association_id_association_seq', 5, true);
SELECT setval('user_id_user_seq', 12, true);
SELECT setval('animal_id_animal_seq', 14, true);
SELECT setval('request_id_request_seq', 13, true);

COMMIT;






