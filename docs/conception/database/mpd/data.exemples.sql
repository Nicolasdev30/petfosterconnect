BEGIN;

-- 🎭 Rôles
INSERT INTO role (id_role, label) VALUES 
(1, 'foster'),
(2, 'association');

-- 🏢 Associations
INSERT INTO association (id_association, name, email, phone, address) VALUES 
(1, 'Refuge des 4 Pattes', 'contact@4pattes.org', '0123456789', '12 rue des Animaux, 75011 Paris'),
(2, 'SOS Matous', 'contact@sosmatous.org', '0987654321', '99 avenue des Chats, 69003 Lyon'),
(3, 'Amis des Animaux', 'contact@amisanimaux.fr', '0145678912', '45 boulevard de la Liberté, 13001 Marseille'),
(4, 'Refuge du Bonheur', 'info@refugebonheur.org', '0567891234', '8 chemin des Roses, 31000 Toulouse'),
(5, 'Protection Animale 33', 'contact@pa33.org', '0556789123', '23 rue Victor Hugo, 33000 Bordeaux');

-- 👤 Utilisateurs
INSERT INTO "user" (id_user, first_name, last_name, email, password, id_role, id_association) VALUES 
-- Familles d'accueil (foster) - id_association = NULL
(1, 'Marie', 'Dupont', 'marie.dupont@example.com', '$argon2id$v=19$m=65536,t=3,p=4$XnZQKXJmNzBuRGFzSGVyZQ$YQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 1, NULL), -- password: marie123
(2, 'Pierre', 'Bernard', 'pierre.bernard@email.fr', '$argon2id$v=19$m=65536,t=3,p=4$bGVzU2VsVXNhZ2VzUGFzc3dvcmQ$VQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 1, NULL), -- password: pierre456
(3, 'Sophie', 'Moreau', 'sophie.moreau@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$QXV0cmVTZWxQYXNzd29yZEhhc2g$WQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 1, NULL), -- password: sophie789
(4, 'Julien', 'Petit', 'julien.petit@outlook.fr', '$argon2id$v=19$m=65536,t=3,p=4$UGFzc3dvcmRIYXNoU2VjdXJl$XQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 1, NULL), -- password: julien2025
(5, 'Camille', 'Rousseau', 'camille.rousseau@yahoo.fr', '$argon2id$v=19$m=65536,t=3,p=4$U2VjdXJlSGFzaFBhc3N3b3Jk$ZQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 1, NULL), -- password: camille555
(6, 'Lucas', 'Martin', 'lucas.martin@hotmail.fr', '$argon2id$v=19$m=65536,t=3,p=4$THVjYXNNYXJ0aW5QYXNzd29yZA$fQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 1, NULL), -- password: lucas999

-- Gestionnaires d'associations (association) - id_association correspondante
(7, 'Jean', 'Dubois', 'jean.dubois@4pattes.org', '$argon2id$v=19$m=65536,t=3,p=4$SGFzaGVkUGFzc3dvcmRBcmdvbjI$aQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 2, 1), -- password: admin4pattes
(8, 'Anne', 'Durand', 'anne.durand@sosmatous.org', '$argon2id$v=19$m=65536,t=3,p=4$QXJnb24ySGFzaGVkUGFzc3dvcmQ$bQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 2, 2), -- password: sosmatous123
(9, 'Paul', 'Leroy', 'paul.leroy@amisanimaux.fr', '$argon2id$v=19$m=65536,t=3,p=4$SGFzaFNlY3VyZUFyZ29uMlBhc3M$cQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 2, 3), -- password: amisanimaux456
(10, 'Laura', 'Roux', 'laura.roux@refugebonheur.org', '$argon2id$v=19$m=65536,t=3,p=4$QXJnb24yU2VjdXJlSGFzaFBhc3M$dQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 2, 4), -- password: bonheur789
(11, 'Thomas', 'Blanc', 'thomas.blanc@pa33.org', '$argon2id$v=19$m=65536,t=3,p=4$U2VjdXJlQXJnb24ySGFzaFBhc3N3$eQHPJqgqXQZ2q+8vFg7RNGzqxL4I3FgZgQZgQZgQZgQ', 2, 5); -- password: protection33

-- 🐾 Animaux (statuts : 'disponible' ou 'accueilli' uniquement)
INSERT INTO animal (id_animal, name, species, breed, age, description, photo_url, status, id_association) VALUES 
-- Animaux de l'association "Refuge des 4 Pattes" (id=1)
(1, 'Rex', 'Chien', 'Berger Allemand', 5, 'Gentil chien protecteur, très loyal et obéissant. Parfait pour une famille expérimentée.', 'https://example.com/photos/rex.jpg', 'disponible', 1),
(2, 'Luna', 'Chien', 'Golden Retriever', 3, 'Chienne douce et affectueuse, parfaite avec les enfants. Très joueuse et sociable.', 'https://example.com/photos/luna.jpg', 'disponible', 1),
(3, 'Max', 'Chien', 'Labrador', 7, 'Chien calme et obéissant, idéal pour seniors. Très posé et affectueux.', 'https://example.com/photos/max.jpg', 'accueilli', 1),

-- Animaux de l'association "SOS Matous" (id=2)
(4, 'Minette', 'Chat', 'Chartreux', 2, 'Adorable chatte joueuse et câline. S''entend bien avec les autres chats.', 'https://example.com/photos/minette.jpg', 'disponible', 2),
(5, 'Whiskers', 'Chat', 'Maine Coon', 4, 'Chat majestueux et indépendant. Caractère bien trempé mais très affectueux.', 'https://example.com/photos/whiskers.jpg', 'disponible', 2),
(6, 'Smokey', 'Chat', 'British Shorthair', 1, 'Jeune chat très affectueux et joueur. Première adoption.', 'https://example.com/photos/smokey.jpg', 'disponible', 2),

-- Animaux de l'association "Amis des Animaux" (id=3)
(7, 'Bella', 'Chien', 'Border Collie', 2, 'Chienne énergique qui adore jouer et courir. Besoin d''exercice quotidien.', 'https://example.com/photos/bella.jpg', 'disponible', 3),
(8, 'Oscar', 'Chat', 'Persan', 6, 'Chat tranquille qui cherche un foyer paisible. Parfait pour appartement.', 'https://example.com/photos/oscar.jpg', 'disponible', 3),

-- Animaux de l'association "Refuge du Bonheur" (id=4)
(9, 'Rocky', 'Chien', 'Bulldog Français', 4, 'Chien sociable et drôle. Caractère jovial et attachant.', 'https://example.com/photos/rocky.jpg', 'disponible', 4),
(10, 'Mimi', 'Chat', 'Siamois', 3, 'Chatte bavarde et attachante. Très communicative et affectueuse.', 'https://example.com/photos/mimi.jpg', 'accueilli', 4),

-- Animaux de l'association "Protection Animale 33" (id=5)
(11, 'Buddy', 'Chien', 'Beagle', 5, 'Chien chasseur reconverti en chien de famille. Très gentil avec les enfants.', 'https://example.com/photos/buddy.jpg', 'disponible', 5),
(12, 'Shadow', 'Chat', 'Chat de gouttière', 2, 'Chat noir mystérieux mais très affectueux. Récupéré dans la rue.', 'https://example.com/photos/shadow.jpg', 'disponible', 5),
(13, 'Coco', 'Chien', 'Cocker Spaniel', 6, 'Chien doux et patient, excellent avec les enfants.', 'https://example.com/photos/coco.jpg', 'disponible', 5),
(14, 'Nala', 'Chat', 'Bengal', 1, 'Jeune chatte très active et joueuse. Caractère espiègle.', 'https://example.com/photos/nala.jpg', 'disponible', 5);

-- ✉️ Demandes d'accueil (statuts : 'pending', 'accepted', 'refused')
INSERT INTO request (id_request, created_at, status, message, id_user, id_animal) VALUES 
-- Demandes en attente (pending)
(1, '2025-07-30 10:00:00', 'pending', 'Je suis disponible dès août pour accueillir Rex. J''ai déjà eu des bergers allemands et je connais bien cette race.', 1, 1),
(2, '2025-07-30 11:00:00', 'pending', 'Je peux accueillir Minette pour quelques mois. J''ai un appartement adapté aux chats avec balcon sécurisé.', 2, 4),
(3, '2025-07-30 14:30:00', 'pending', 'Nous aimerions adopter Luna définitivement. Nous avons un grand jardin et des enfants qui adorent les chiens.', 3, 2),
(4, '2025-07-30 16:45:00', 'pending', 'Je souhaite accueillir Bella temporairement. Je fais du jogging tous les jours et je peux lui offrir l''exercice dont elle a besoin.', 4, 7),
(5, '2025-07-30 18:20:00', 'pending', 'Rocky semble parfait pour notre famille. Quand peut-on organiser une rencontre ?', 5, 9),

-- Demandes acceptées (accepted)
(6, '2025-07-29 09:15:00', 'accepted', 'Nous sommes ravis d''accueillir Whiskers. Notre maison est parfaite pour lui !', 6, 5),
(7, '2025-07-28 13:20:00', 'accepted', 'Shadow correspond exactement à ce que nous cherchions. Merci pour votre confiance !', 1, 12),
(8, '2025-07-27 15:45:00', 'accepted', 'Coco sera très bien chez nous. Nous avons déjà eu des cockers.', 3, 13),

-- Demandes refusées (refused)
(9, '2025-07-26 11:30:00', 'refused', 'Malheureusement, notre logement n''est pas adapté pour Buddy après réflexion.', 2, 11),
(10, '2025-07-25 15:45:00', 'refused', 'Après discussion en famille, nous ne sommes pas encore prêts pour accueillir un animal.', 4, 8),

-- Nouvelles demandes récentes
(11, '2025-07-30 20:00:00', 'pending', 'Nala a l''air adorable ! Je suis intéressée par cette petite Bengal.', 6, 14),
(12, '2025-07-30 21:15:00', 'pending', 'Nous souhaitons donner une seconde chance à Oscar. Notre appartement est calme et paisible.', 5, 8),
(13, '2025-07-30 22:30:00', 'pending', 'Smokey serait parfait pour notre famille. Nous cherchons un jeune chat affectueux.', 2, 6);

COMMIT;