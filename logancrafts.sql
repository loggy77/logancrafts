-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 12 juil. 2024 à 15:44
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `logancrafts`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `pseudo` text NOT NULL,
  `mot_de_passe` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`, `pseudo`, `mot_de_passe`) VALUES
(1, 'admin', '$2y$10$WOiz2LiNUXzLsgXJMErZuuVsoex6Vp7zK73okVovdyqDQlvl.Rfbm');

-- --------------------------------------------------------

--
-- Structure de la table `materiaux`
--

CREATE TABLE `materiaux` (
  `id` int(11) NOT NULL,
  `nom` text NOT NULL,
  `type` enum('Bois','Fer','Plastique') NOT NULL,
  `entreprise_fournissant` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `materiaux`
--

INSERT INTO `materiaux` (`id`, `nom`, `type`, `entreprise_fournissant`) VALUES
(1, 'frêne', 'Bois', 'BBois'),
(2, 'chêne', 'Bois', 'BBois'),
(3, 'noyer', 'Bois', 'BBois'),
(4, 'acier-inox', 'Fer', 'MetaLo'),
(5, 'aluminum', 'Fer', 'MetaLo'),
(6, 'Plastique', 'Plastique', 'pPlastique');

-- --------------------------------------------------------

--
-- Structure de la table `meubles`
--

CREATE TABLE `meubles` (
  `id` int(11) NOT NULL,
  `nom` text NOT NULL,
  `category` enum('Etagère','Armoire','','') NOT NULL,
  `materiaux` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `plans` text NOT NULL,
  `description` text NOT NULL,
  `creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `meubles`
--

INSERT INTO `meubles` (`id`, `nom`, `category`, `materiaux`, `plans`, `description`, `creation`) VALUES
(42, 'Meuble typé', 'Etagère', '\"[\"Plastique\",\"aluminum\",\"acier-inox\"]\"', '1720777280234.jpg', 'Une étagère Louis XVI', '2024-07-12 09:41:20'),
(43, 'Aciux*', 'Armoire', '\"[\"acier-inox\"]\"', '1720790255244.jpg', 'Une armoire en acier inoxidable', '2024-07-12 13:17:35');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `materiaux`
--
ALTER TABLE `materiaux`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `meubles`
--
ALTER TABLE `meubles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `materiaux`
--
ALTER TABLE `materiaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `meubles`
--
ALTER TABLE `meubles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
