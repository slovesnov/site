-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2021 at 04:41 AM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `s378259_site`
--

-- --------------------------------------------------------

--
-- Table structure for table `journal_slovesno`
--

CREATE TABLE `journal_slovesno` (
  `id` int(11) NOT NULL,
  `text` varchar(10000) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `money_addons_slovesno`
--

CREATE TABLE `money_addons_slovesno` (
  `parameter` varchar(128) COLLATE utf8_bin NOT NULL,
  `value` varchar(128) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `money_categories_slovesno`
--

CREATE TABLE `money_categories_slovesno` (
  `name` varchar(128) COLLATE utf8_bin NOT NULL,
  `round` int(1) NOT NULL DEFAULT '0',
  `food` tinyint(4) NOT NULL DEFAULT '0',
  `empty text` varchar(128) COLLATE utf8_bin NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `money_goods_slovesno`
--

CREATE TABLE `money_goods_slovesno` (
  `name` varchar(64) COLLATE utf8_bin NOT NULL,
  `name0` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `name1` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `alias` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `protein` float NOT NULL,
  `fat` float NOT NULL,
  `carbohydrate` float NOT NULL,
  `mass` int(11) DEFAULT NULL,
  `mass loss` float NOT NULL DEFAULT '0',
  `density` float NOT NULL DEFAULT '1',
  `b12` float NOT NULL DEFAULT '0',
  `food` tinyint(1) NOT NULL DEFAULT '1',
  `has check` tinyint(1) NOT NULL DEFAULT '1',
  `comment` varchar(1024) COLLATE utf8_bin DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin
-- --------------------------------------------------------

--
-- Table structure for table `money_slovesno`
--

CREATE TABLE `money_slovesno` (
  `date` date NOT NULL,
  `text` mediumtext COLLATE utf8_bin NOT NULL,
  `category` varchar(100) COLLATE utf8_bin NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `journal_slovesno`
--
ALTER TABLE `journal_slovesno`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `money_addons_slovesno`
--
ALTER TABLE `money_addons_slovesno`
  ADD PRIMARY KEY (`parameter`);

--
-- Indexes for table `money_categories_slovesno`
--
ALTER TABLE `money_categories_slovesno`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `money_goods_slovesno`
--
ALTER TABLE `money_goods_slovesno`
  ADD PRIMARY KEY (`name`),
  ADD KEY `alias` (`alias`);

--
-- Indexes for table `money_slovesno`
--
ALTER TABLE `money_slovesno`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_slovesno` (`category`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `money_slovesno`
--
ALTER TABLE `money_slovesno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `money_goods_slovesno`
--
ALTER TABLE `money_goods_slovesno`
  ADD CONSTRAINT `alias_slovesno` FOREIGN KEY (`alias`) REFERENCES `money_goods_slovesno` (`name`);

--
-- Constraints for table `money_slovesno`
--
ALTER TABLE `money_slovesno`
  ADD CONSTRAINT `category_slovesno` FOREIGN KEY (`category`) REFERENCES `money_categories_slovesno` (`name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
