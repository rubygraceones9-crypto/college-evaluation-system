-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2026 at 10:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cite_es`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_periods`
--

CREATE TABLE `academic_periods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `academic_year` varchar(10) NOT NULL,
  `semester` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_periods`
--

INSERT INTO `academic_periods` (`id`, `name`, `academic_year`, `semester`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
(4, 'First Semester 2024-2025', '2024-2025', 1, '2024-08-01', '2024-12-15', 0, '2026-02-24 17:53:44', '2026-03-15 02:45:03'),
(5, '2025-2026 S2', '2025-2026', 2, '2025-12-09', '2026-04-24', 0, '2026-02-25 05:54:45', '2026-03-15 02:34:36'),
(7, '2025-2026 S3', '2025-2026', 3, '2026-05-01', '2026-05-31', 1, '2026-03-15 02:45:03', '2026-03-15 03:18:49');

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` varchar(36) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` varchar(36) NOT NULL,
  `author_id` varchar(36) DEFAULT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `content` text NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `status` enum('success','failed','pending') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `description`, `ip_address`, `user_agent`, `status`, `created_at`) VALUES
(1, NULL, 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 17:46:46'),
(2, NULL, 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 17:47:07'),
(3, NULL, 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 17:47:32'),
(4, NULL, 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 17:54:03'),
(5, NULL, 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 17:54:28'),
(6, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 17:55:44'),
(7, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 17:58:48'),
(8, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:03:52'),
(9, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:04:18'),
(10, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:05:20'),
(11, '7f2c816c-b11d-4ae4-9497-ce3a766b54f7', 'SIGNUP', 'User signed up as student', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:07:09'),
(12, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'SIGNUP', 'User signed up as teacher', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:08:30'),
(13, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:21:30'),
(14, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:21:48'),
(15, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:27:44'),
(16, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-24 18:27:51'),
(17, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 02:05:08'),
(18, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 02:05:26'),
(19, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 02:06:01'),
(21, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 03:12:39'),
(22, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 03:13:41'),
(23, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 03:14:24'),
(24, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 03:37:18'),
(25, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 03:43:55'),
(26, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 03:44:31'),
(27, 'eacf5742-b0e7-44fb-a87a-8459f2f1580e', 'SIGNUP', 'User signed up as student', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 03:46:14'),
(28, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 05:47:14'),
(29, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 05:49:37'),
(30, 'eacf5742-b0e7-44fb-a87a-8459f2f1580e', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 06:03:40'),
(31, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 06:05:21'),
(32, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 08:16:27'),
(33, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 08:25:42'),
(34, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 08:27:09'),
(35, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 08:38:11'),
(36, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 08:41:38'),
(37, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 08:54:29'),
(38, '3fc28442-f332-471a-9d72-2819329c0aa5', 'SIGNUP', 'User signed up as student', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 08:56:57'),
(39, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 08:57:59'),
(40, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 09:00:04'),
(41, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-02-25 09:01:31'),
(42, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 14:43:57'),
(43, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 14:44:17'),
(44, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 14:44:37'),
(45, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 14:50:43'),
(46, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 14:50:59'),
(47, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 14:51:10'),
(48, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 14:58:28'),
(49, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:27:47'),
(50, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:33:57'),
(51, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:41:22'),
(52, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:42:34'),
(53, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:44:58'),
(54, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:45:27'),
(55, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:46:50'),
(56, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:49:53'),
(57, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:52:29'),
(58, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:55:08'),
(59, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:57:23'),
(60, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 15:58:59'),
(61, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:03:57'),
(62, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:06:16'),
(63, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:07:08'),
(64, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:07:30'),
(65, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:12:38'),
(66, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:15:02'),
(67, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:18:48'),
(68, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:19:01'),
(69, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:22:06'),
(70, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:22:25'),
(71, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:22:43'),
(72, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:23:57'),
(73, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:24:05'),
(74, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:44:33'),
(75, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:45:36'),
(76, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 16:46:03'),
(77, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 17:55:09'),
(78, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 17:55:25'),
(79, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 17:55:40'),
(80, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 18:05:39'),
(81, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 18:08:55'),
(82, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 18:09:21'),
(83, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 18:09:40'),
(84, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 18:10:39'),
(85, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-05 18:11:00'),
(86, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-06 08:26:35'),
(87, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-08 18:12:26'),
(88, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-08 18:12:34'),
(89, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-08 18:12:42'),
(90, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-09 09:41:08'),
(91, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-09 09:42:00'),
(92, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-09 10:10:18'),
(93, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-09 10:11:55'),
(94, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-09 10:14:35'),
(95, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-09 10:14:50'),
(96, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-09 10:15:50'),
(97, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-09 10:16:16'),
(98, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 01:20:27'),
(99, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 01:20:40'),
(100, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 01:46:30'),
(101, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 02:49:00'),
(102, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 02:50:16'),
(103, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 02:51:22'),
(104, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 03:01:19'),
(105, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 03:01:34'),
(106, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-11 03:03:43'),
(107, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 00:50:49'),
(108, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 00:52:02'),
(109, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 00:52:47'),
(110, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 00:53:15'),
(111, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 00:58:05'),
(112, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:07:48'),
(113, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:14:33'),
(114, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:16:31'),
(115, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:20:17'),
(116, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:20:36'),
(117, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:20:37'),
(118, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:32:11'),
(119, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:33:01'),
(120, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:34:23'),
(121, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:35:51'),
(122, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:37:13'),
(123, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 01:46:25'),
(124, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 02:00:08'),
(125, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 02:12:33'),
(126, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 02:12:37'),
(127, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 02:12:47'),
(128, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 02:33:08'),
(129, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 02:43:11'),
(130, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 02:43:56'),
(131, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:04:54'),
(132, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:14:37'),
(133, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:15:15'),
(134, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:17:50'),
(135, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:18:34'),
(136, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:27:03'),
(137, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:27:28'),
(138, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:29:15'),
(139, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:32:20'),
(140, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:32:51'),
(141, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:33:20'),
(142, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 03:59:18'),
(143, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:04:02'),
(144, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:04:13'),
(145, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:05:05'),
(146, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:05:13'),
(147, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:17:41'),
(148, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:29:42'),
(149, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:30:19'),
(150, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:38:56'),
(151, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:49:52'),
(152, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:51:56'),
(153, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:59:01'),
(154, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 04:59:31'),
(155, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 05:12:09'),
(156, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 05:18:20'),
(157, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 05:21:25'),
(158, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 05:23:08'),
(159, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 05:38:09'),
(160, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 05:41:47'),
(161, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 05:57:12'),
(162, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 06:10:08'),
(163, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 06:18:32'),
(164, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 06:28:08'),
(165, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 06:33:30'),
(166, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 06:37:39'),
(167, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 06:55:34'),
(168, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 07:07:39'),
(169, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 07:09:11'),
(170, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 07:28:31'),
(171, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 07:30:51'),
(172, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 07:38:13'),
(173, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 08:20:14'),
(174, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 08:23:49'),
(175, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 08:27:54'),
(176, 'teacher-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 08:41:31'),
(177, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 08:44:25'),
(178, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 09:29:57'),
(179, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 09:30:25'),
(180, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 09:31:24'),
(181, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 09:32:08'),
(182, 'admin-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 09:32:55'),
(183, 'student-1', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 09:33:17'),
(184, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'LOGIN', 'User login via email', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 'success', '2026-03-15 09:33:40');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `teacher_id` varchar(36) NOT NULL,
  `section` varchar(10) DEFAULT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `course_program` enum('BSIT','BSEMC') DEFAULT NULL,
  `year_level` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_enrollments`
--

CREATE TABLE `course_enrollments` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `period_id` int(11) DEFAULT NULL,
  `evaluatee_id` varchar(36) DEFAULT NULL,
  `evaluator_id` varchar(36) NOT NULL,
  `evaluation_type` varchar(50) DEFAULT NULL,
  `status` enum('pending','draft','submitted','locked') DEFAULT 'pending',
  `overall_score` decimal(5,2) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_criteria`
--

CREATE TABLE `evaluation_criteria` (
  `id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `weight` decimal(5,2) NOT NULL,
  `max_score` int(11) DEFAULT 5,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluation_criteria`
--

INSERT INTO `evaluation_criteria` (`id`, `form_id`, `name`, `description`, `weight`, `max_score`, `created_at`) VALUES
(1, 1, 'Instructional Skills', NULL, 40.00, 5, '2026-02-24 17:46:24'),
(2, 1, 'Professionalism', NULL, 30.00, 5, '2026-02-24 17:46:24'),
(3, 1, 'Student Engagement', NULL, 30.00, 5, '2026-02-24 17:46:24');

--
-- Table structure for table `evaluation_questions`
--

CREATE TABLE `evaluation_questions` (
  `id` int(11) NOT NULL,
  `criteria_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluation_questions`
--

INSERT INTO `evaluation_questions` (`id`, `criteria_id`, `text`) VALUES
(1, 1, 'The instructor explains the lesson clearly.'),
(2, 1, 'The instructor uses effective teaching materials.'),
(3, 1, 'The instructor relates lessons to real-world applications.'),
(4, 2, 'The instructor arrives and leaves the class on time.'),
(5, 2, 'The instructor treats all students with respect.'),
(6, 2, 'The instructor maintains a professional classroom environment.'),
(7, 3, 'The instructor encourages active student participation.'),
(8, 3, 'The instructor is approachable for student concerns and questions.'),
(9, 3, 'The instructor provides constructive feedback on student work.');

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_forms`
--

CREATE TABLE `evaluation_forms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('student-to-teacher','peer-review') NOT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluation_forms`
--

INSERT INTO `evaluation_forms` (`id`, `name`, `description`, `type`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'Teacher Evaluation Form', 'Standard faculty evaluation form with criteria and questions.', 'student-to-teacher', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_periods`
--

CREATE TABLE `evaluation_periods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('draft','upcoming','active','closed') DEFAULT 'upcoming',
  `form_id` varchar(255) DEFAULT NULL,
  `academic_period_id` int(11) DEFAULT NULL,
  `academic_year` varchar(20) DEFAULT NULL,
  `semester` varchar(20) DEFAULT NULL,
  `assignments_json` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluation_periods`
--

INSERT INTO `evaluation_periods` (`id`, `name`, `start_date`, `end_date`, `status`, `form_id`, `academic_period_id`, `created_at`, `updated_at`) VALUES
(1, 'Prelim', '2026-01-01', '2026-02-25', 'upcoming', NULL, NULL, '2026-02-25 05:59:09', '2026-02-25 05:59:09');

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_responses`
--

CREATE TABLE `evaluation_responses` (
  `id` int(11) NOT NULL,
  `evaluation_id` int(11) NOT NULL,
  `criteria_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; -- Note: Match collation if possible, but general_ci is common in this file. schema.sql uses unicode_ci.


-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `token` varchar(500) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `token`, `ip_address`, `user_agent`, `expires_at`, `created_at`) VALUES
(6, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5NTU3NDQsImV4cCI6MTc3MjA0MjE0NH0.QtDG51ogr-rE_7I39YUFICAMEf1sLMbP-1gz0y-L56Y', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 17:55:44', '2026-02-24 17:55:44'),
(7, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5NTU5MjgsImV4cCI6MTc3MjA0MjMyOH0.JNkErlKTIpp3cTThuWKT0VU5SJceYoIxmHOfO_ebbdc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 17:58:48', '2026-02-24 17:58:48'),
(8, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5NTYyMzIsImV4cCI6MTc3MjA0MjYzMn0.syTndOAwh1oFat4zjxCZbOR9SfWS2SAOzVPE_QZDTVw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 18:03:52', '2026-02-24 18:03:52'),
(9, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MTk1NjI1OCwiZXhwIjoxNzcyMDQyNjU4fQ.BNhibNP_veeCE46-WL7ZWaLtKM0OWHZA6b61fuPGHFQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 18:04:18', '2026-02-24 18:04:18'),
(10, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MTk1NjMyMCwiZXhwIjoxNzcyMDQyNzIwfQ.gKwDHUcUsen4kCaEq_048Fhmhav0xlKzJC1Qj7T2QBo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 18:05:20', '2026-02-24 18:05:20'),
(11, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MTk1NzI5MCwiZXhwIjoxNzcyMDQzNjkwfQ.WahjPsOFBxOrdo1lh1TwB4rPUFH7Fet7uyarAkEqvIc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 18:21:30', '2026-02-24 18:21:30'),
(12, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5NTczMDgsImV4cCI6MTc3MjA0MzcwOH0.acm1lDQOoKBJ7_uBRRFrL7-WNYMUiyitu0NtRW0EEbI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 18:21:48', '2026-02-24 18:21:48'),
(13, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5NTc2NjQsImV4cCI6MTc3MjA0NDA2NH0.CDj57cuni_63nPaxWLP9UsufJ2Z2fGHKM27Jjbl2ArE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 18:27:44', '2026-02-24 18:27:44'),
(14, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MTk1NzY3MSwiZXhwIjoxNzcyMDQ0MDcxfQ.Ui5CdkM_Xq8ltEYOuIgfYqnMdwMx5J1OJSR9BnDAw7Y', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-25 18:27:51', '2026-02-24 18:27:51'),
(15, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MTk4NTEwOCwiZXhwIjoxNzcyMDcxNTA4fQ.2QI2kY1YvDPnA81EAWFD8A0T0u_Z42KH0qPCPQtBHTw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 02:05:08', '2026-02-25 02:05:08'),
(16, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5ODUxMjYsImV4cCI6MTc3MjA3MTUyNn0.YV6KDXJAyHPAfq1sXS8cNUCS6swn6bQMr12o8AFmpIs', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 02:05:26', '2026-02-25 02:05:26'),
(17, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MTk4NTE2MSwiZXhwIjoxNzcyMDcxNTYxfQ.5ETaW2fLdlxRVnfC0pDhgU_zWLT2l0Ay5sIgcn1vYBo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 02:06:01', '2026-02-25 02:06:01'),
(18, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MTk4OTE1OSwiZXhwIjoxNzcyMDc1NTU5fQ.AVdHuFl5nke-siIOrsGoP4F91lhR5KPU0TcQ89ffr_Y', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 03:12:39', '2026-02-25 03:12:39'),
(19, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MTk4OTIyMSwiZXhwIjoxNzcyMDc1NjIxfQ.VJpCEs4ERdIopnLdEmLdU2Ay9t7-ULKGu6VdFAYA09I', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 03:13:41', '2026-02-25 03:13:41'),
(20, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5ODkyNjQsImV4cCI6MTc3MjA3NTY2NH0.qZHB_AWdDt4lUAmhiYc6XsdyfOxY7jk2rsJW_sydHA8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 03:14:24', '2026-02-25 03:14:24'),
(22, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5OTEwMzUsImV4cCI6MTc3MjA3NzQzNX0.4sQvsR4I1b20vkbNkZeiZybGjdmcFdlfmyS_TA8pLdM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 03:43:55', '2026-02-25 03:43:55'),
(23, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MTk5MTA3MSwiZXhwIjoxNzcyMDc3NDcxfQ.rA_u7lQOOE8Ue5lRNBtkcIbdX4eLxKF9RhpSDBuDsUo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 03:44:31', '2026-02-25 03:44:31'),
(24, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5OTg0MzQsImV4cCI6MTc3MjA4NDgzNH0.QiYCzopMVMZmOnx9F1u6guM8Ink-ZZgtqCHrZz-WOuI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 05:47:14', '2026-02-25 05:47:14'),
(25, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzE5OTg1NzcsImV4cCI6MTc3MjA4NDk3N30.cTmtxoHWlpYBiLVOjiqoT83mPLvCn2mjmvo6fAmjk18', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 05:49:37', '2026-02-25 05:49:37'),
(26, 'eacf5742-b0e7-44fb-a87a-8459f2f1580e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWNmNTc0Mi1iMGU3LTQ0ZmItYTg3YS04NDU5ZjJmMTU4MGUiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MTk5OTQyMCwiZXhwIjoxNzcyMDg1ODIwfQ.357cGgaJUv_qaIgmYs5QGm2vh89u2PmpkR8WgVAEKFg', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 06:03:40', '2026-02-25 06:03:40'),
(27, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MTk5OTUyMSwiZXhwIjoxNzcyMDg1OTIxfQ.WLs1-HNoQ2FvpgEjaxO_mMwaOSJlgh5WCb8y5thdSGg', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 06:05:21', '2026-02-25 06:05:21'),
(28, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjAwNzM4NywiZXhwIjoxNzcyMDkzNzg3fQ.3pIP1AlaqCIBe_q4G_r7fjI1cDRjtsP6YIE_xOkKpUY', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 08:16:27', '2026-02-25 08:16:27'),
(29, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjAwNzk0MiwiZXhwIjoxNzcyMDk0MzQyfQ.eFonphDCfb1dcbWDzcAFfiJbdXMjwLsQ2AklHVCUoMM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 08:25:42', '2026-02-25 08:25:42'),
(30, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjAwODAyOSwiZXhwIjoxNzcyMDk0NDI5fQ.9N8C9Jvg-1-FWASyMR0U72nE6pYYzG3gGBOyH6jzRf4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 08:27:09', '2026-02-25 08:27:09'),
(31, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzIwMDg2OTEsImV4cCI6MTc3MjA5NTA5MX0.fHlv3b9-omCijG1_GlD7kUN9btRkl_fkNqOOvP-_baM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 08:38:11', '2026-02-25 08:38:11'),
(32, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzIwMDg4OTgsImV4cCI6MTc3MjA5NTI5OH0.IHRcsICbsmJ8PeL1yXMWFw6j7shrEgPT1qQxfqKpMHg', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 08:41:38', '2026-02-25 08:41:38'),
(33, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzIwMDk2NjksImV4cCI6MTc3MjA5NjA2OX0.QkJKoS7yeIB5vKzdUff9eh3T_CWFABqY1LrmC1_vFSI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 08:54:29', '2026-02-25 08:54:29'),
(34, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzIwMDk4NzksImV4cCI6MTc3MjA5NjI3OX0.omAgFK-YaIzDDfTIECpbciuoe39rCP5o--mE6nNLrjE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 08:57:59', '2026-02-25 08:57:59'),
(35, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjAxMDAwNCwiZXhwIjoxNzcyMDk2NDA0fQ.K_23xMyimrlGG9RUt1ckJpeJsI15_RREom88fsfGpb4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 09:00:04', '2026-02-25 09:00:04'),
(36, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjAxMDA5MSwiZXhwIjoxNzcyMDk2NDkxfQ.jMVPgyONV_Rbl3CW0UniBkiHJqYCF6Vjeth2OWGRENM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-02-26 09:01:31', '2026-02-25 09:01:31'),
(37, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyMTgzNywiZXhwIjoxNzcyODA4MjM3fQ.fmfdaYkBczvyN_vlyFZvjIxi8tQco7hTUuxIdPZ_67o', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 14:43:57', '2026-03-05 14:43:57'),
(38, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyMTg1NywiZXhwIjoxNzcyODA4MjU3fQ.br_FMg9lwBgQ-I04mLSay4ib9aiWb9CJztiPb6AX66w', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 14:44:17', '2026-03-05 14:44:17'),
(39, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjE4NzcsImV4cCI6MTc3MjgwODI3N30.UgxkzwsIoLOzF0VvBcq1rpGYol_3XfIVa2b7Q5ss_3s', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 14:44:37', '2026-03-05 14:44:37'),
(40, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyMjI0MywiZXhwIjoxNzcyODA4NjQzfQ.jz_B2lUDvsA4nyCjB4nxMVvr6KB9NNLoNiwlXRkWySk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 14:50:43', '2026-03-05 14:50:43'),
(41, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyMjI1OSwiZXhwIjoxNzcyODA4NjU5fQ.qQON4J4ychbvN9Fcuj1XCtGe3iOHhJvek1qjXkSpCrU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 14:50:59', '2026-03-05 14:50:59'),
(42, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjIyNzAsImV4cCI6MTc3MjgwODY3MH0.P4U70u7TxApL2bC7_y-nZ_yuRvJQ8zEJYTb0DsrO7lk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 14:51:10', '2026-03-05 14:51:10'),
(43, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjI3MDgsImV4cCI6MTc3MjgwOTEwOH0.pJwnkbgWaX1V_N011qP5VDhpmhsxeW-hxZtjB7hmhvI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 14:58:28', '2026-03-05 14:58:28'),
(44, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjQ0NjcsImV4cCI6MTc3MjgxMDg2N30.QoxIDdfaFJnhjAFSU01dPcgGcZf5YoGHITuq5pSIw2E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:27:47', '2026-03-05 15:27:47'),
(45, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjQ4MzcsImV4cCI6MTc3MjgxMTIzN30.UY5rLms9r7vjWw7KznZQzMeCr_urlzdeqttPjCE39do', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:33:57', '2026-03-05 15:33:57'),
(46, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjUyODIsImV4cCI6MTc3MjgxMTY4Mn0.4BMf9HBW_0zznDX4DoGA7PHlUk6etJCyWQC9zVT2WAE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:41:22', '2026-03-05 15:41:22'),
(47, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjUzNTQsImV4cCI6MTc3MjgxMTc1NH0.0BHfUxSG8wMpChUga3bAkoDxCbZ0B94xfdks8YAKIpM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:42:34', '2026-03-05 15:42:34'),
(48, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjU0OTgsImV4cCI6MTc3MjgxMTg5OH0.Egl-CgUxcI123RV4jIAJOscHwuRaEUPtDYlUG80qqAE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:44:58', '2026-03-05 15:44:58'),
(49, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNTUyNywiZXhwIjoxNzcyODExOTI3fQ.s9DPvmWrD9zY7n25KWOZUjnIuGnwLDc8QQ9yZAT_hBs', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:45:27', '2026-03-05 15:45:27'),
(50, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNTYxMCwiZXhwIjoxNzcyODEyMDEwfQ.79pTGA4PDY6NtfoZ4a7s4mQO59JlY5QIG7t6py8jTww', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:46:50', '2026-03-05 15:46:50'),
(51, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNTc5MywiZXhwIjoxNzcyODEyMTkzfQ.vhAWQkA4DQjXtJn6enbKAV3GfjJZjHIUbizMdJoJcsY', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:49:53', '2026-03-05 15:49:53'),
(52, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNTk0OSwiZXhwIjoxNzcyODEyMzQ5fQ.R4pmXgOYfhXORL3XPAxIdil-aeUgd3ARpmaO-xCq_es', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:52:29', '2026-03-05 15:52:29'),
(53, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNjEwOCwiZXhwIjoxNzcyODEyNTA4fQ.lMVq9mAoxVw13fq7nl3Ovbjt6M_IT2423ryHeDgqDJs', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:55:08', '2026-03-05 15:55:08'),
(54, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNjI0MywiZXhwIjoxNzcyODEyNjQzfQ.YU0uZ4X6Sd7CSyqfEz_sEqxgkabaB7peh8qpJTCDQxQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:57:23', '2026-03-05 15:57:23'),
(55, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNjMzOSwiZXhwIjoxNzcyODEyNzM5fQ.tCZJIawcb6GLgz3IKk4uwu2dxVO1YPyb6z-aluuIPWU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 15:58:59', '2026-03-05 15:58:59'),
(56, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNjYzNywiZXhwIjoxNzcyODEzMDM3fQ.pmazF5M641GznpwIwZMCOQggFZNqQO2rbnc3ALRHNpk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:03:57', '2026-03-05 16:03:57'),
(57, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNjc3NiwiZXhwIjoxNzcyODEzMTc2fQ.K_RyEI8N6MciIwlNqsP09sgkdormu8jZzXyDcu2uKSU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:06:16', '2026-03-05 16:06:16'),
(58, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNjgyOCwiZXhwIjoxNzcyODEzMjI4fQ.kwdJU-mrDRF9YjQCkJfMLD2-IlNZZqy8WOxtD9grYYc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:07:08', '2026-03-05 16:07:08'),
(59, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyNjg1MCwiZXhwIjoxNzcyODEzMjUwfQ.3pvacMJlm23PJAS5ZYFSy5cQF68N2Pd9_3gzimVSQRc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:07:30', '2026-03-05 16:07:30'),
(60, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyNzE1OCwiZXhwIjoxNzcyODEzNTU4fQ.tWtOtgjUMKXDHLI_B1u3GHaX9cR9_DrTiwA4KazAEf0', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:12:38', '2026-03-05 16:12:38'),
(61, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyNzMwMiwiZXhwIjoxNzcyODEzNzAyfQ.K1XOQUANvBcXsUfcYB8gkBOIGWWtnU-zmxKd2KMqnLA', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:15:02', '2026-03-05 16:15:02'),
(62, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyNzUyOCwiZXhwIjoxNzcyODEzOTI4fQ.PSpm3jDWQJqF4U02wjXaQtBLWZkx9xbDrG6-NdhE5o8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:18:48', '2026-03-05 16:18:48'),
(63, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyNzU0MSwiZXhwIjoxNzcyODEzOTQxfQ.K4NdSCTIxUNFGkdbSNmfE54h7bY0JJ5NHYCLOF_hpaQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:19:01', '2026-03-05 16:19:01'),
(64, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyNzcyNiwiZXhwIjoxNzcyODE0MTI2fQ.dP4Q-7zTXL0WL_E-u2qCOe8xWxLHNlu5K56s7ibPdpQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:22:06', '2026-03-05 16:22:06'),
(65, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyNzc0NSwiZXhwIjoxNzcyODE0MTQ1fQ.5LjjstksQYqvjj6xlNvnWD3DoNXIVzY9dcEHwozXILs', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:22:25', '2026-03-05 16:22:25'),
(66, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3Mjc3NjMsImV4cCI6MTc3MjgxNDE2M30.-jV1jeIWJuN5Wb_N83hEimRe3g2F_qT8Alh0KNHJ4lw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:22:43', '2026-03-05 16:22:43'),
(67, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3Mjc4MzcsImV4cCI6MTc3MjgxNDIzN30.z2Z4LgTVXP4B-w1K4Ml9MiWhcQDJmWx-YKyhO7cFt74', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:23:57', '2026-03-05 16:23:57'),
(68, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3Mjc4NDUsImV4cCI6MTc3MjgxNDI0NX0.77Ly55HixSQ-Jx8RwePeyJUvwPKIEComNWDufJjkPOI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:24:05', '2026-03-05 16:24:05'),
(69, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MjkwNzMsImV4cCI6MTc3MjgxNTQ3M30.PZnt1a5GbZ1rSp7QsA-Hi-5_MwTZO1WSWv94Ty1yLGQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:44:33', '2026-03-05 16:44:33'),
(70, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjcyOTEzNiwiZXhwIjoxNzcyODE1NTM2fQ.-hw_XNi4JxC3dBrTXdsjNwrtXQlb3BOFOVWmYHn5mkM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:45:36', '2026-03-05 16:45:36'),
(71, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjcyOTE2MiwiZXhwIjoxNzcyODE1NTYyfQ.fqcUpY-PFO1VCsDA8AnDsiJp1zeDTMUtWePeY-ZhKfA', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 16:46:03', '2026-03-05 16:46:03'),
(72, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjczMzMwOSwiZXhwIjoxNzcyODE5NzA5fQ.ChnhQGrdZE4eSvQWNxvt_zxJFs1kTRPhGje8ScqLSME', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 17:55:09', '2026-03-05 17:55:09'),
(73, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjczMzMyNSwiZXhwIjoxNzcyODE5NzI1fQ.BRbkZd_Xh3uftZyubT2Q-TTNIF0Au7qkLnU9hgqvhj8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 17:55:25', '2026-03-05 17:55:25'),
(74, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MzMzNDAsImV4cCI6MTc3MjgxOTc0MH0.NC184ymg8GQog0MO2VjSnpk65FTF_H-7WI4aoOuIGm4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 17:55:40', '2026-03-05 17:55:40'),
(75, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MzM5MzksImV4cCI6MTc3MjgyMDMzOX0.UeEu3UqkfNDgEoZLXJAf1Dhp6k6D1mjBGkD8zNKXOhM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 18:05:39', '2026-03-05 18:05:39'),
(76, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MzQxMzUsImV4cCI6MTc3MjgyMDUzNX0.Am3zKAoRb4--bRyWbnaO8pMIc0dIwe2op46VemjpLmE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 18:08:55', '2026-03-05 18:08:55'),
(77, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MjczNDE2MSwiZXhwIjoxNzcyODIwNTYxfQ.EBCIqcDVNt3s68jj7lere4NfA1oaETmYwJaViqWPCw8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 18:09:21', '2026-03-05 18:09:21'),
(78, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MzQxODAsImV4cCI6MTc3MjgyMDU4MH0.ysPawZlRjTNBSby0ovOL8H7mtPL-JhVkjv6Z2pC4028', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 18:09:40', '2026-03-05 18:09:40'),
(79, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MjczNDIzOSwiZXhwIjoxNzcyODIwNjM5fQ.gqG5gBMT1Q0Y1fMQE4wRt2W_LOOiGktPzjl_65jHklk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 18:10:39', '2026-03-05 18:10:39'),
(80, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3MzQyNjAsImV4cCI6MTc3MjgyMDY2MH0.UsRW3DczRLi3Si8OZp2vI9ZrM91iSQxUeXqkLX_5OEQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-06 18:11:00', '2026-03-05 18:11:00'),
(81, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI3ODU1OTUsImV4cCI6MTc3Mjg3MTk5NX0.FpnacBVYrpMSVQQl7L3V2rcH0yF3VyMQ1-mQGk9oG3o', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-07 08:26:35', '2026-03-06 08:26:35'),
(82, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzI5OTM1NDYsImV4cCI6MTc3MzA3OTk0Nn0.nq2T04QALSvtlOGXH3qtH1kuNyMyYdL_g__cQd-cKyU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-09 18:12:26', '2026-03-08 18:12:26'),
(83, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3Mjk5MzU1NCwiZXhwIjoxNzczMDc5OTU0fQ.Yy3X4tkB6so6b0oU4iTkzmjH-KCI1RP0KZyf1msxfNM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-09 18:12:34', '2026-03-08 18:12:34'),
(84, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3Mjk5MzU2MiwiZXhwIjoxNzczMDc5OTYyfQ.p4Ez5ezgl0z27kCp-w6wj_Bm7-NlJXGDQD6y5qIdXhc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-09 18:12:42', '2026-03-08 18:12:42'),
(85, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzA0OTI2OCwiZXhwIjoxNzczMTM1NjY4fQ._KKHWLJknTFVd-97BerjAMmQV3cAn6uWv9w873O-DsA', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-10 09:41:08', '2026-03-09 09:41:08'),
(86, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzA0OTMyMCwiZXhwIjoxNzczMTM1NzIwfQ.jV_2qK0WD__1wGrr-wnntFNzIzuQ9cK2MgdI0uFMvVY', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-10 09:42:00', '2026-03-09 09:42:00'),
(87, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzA1MTAxOCwiZXhwIjoxNzczMTM3NDE4fQ.7fcC8NGwloEG2jB9iP61D0adLvLcbvDGesp8lho-Ns4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-10 10:10:18', '2026-03-09 10:10:18'),
(88, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzMwNTExMTUsImV4cCI6MTc3MzEzNzUxNX0.WeCCtDtlC_Ul_0to4dfouydtLUfDX9GJ2iFgms309uU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-10 10:11:55', '2026-03-09 10:11:55'),
(89, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzA1MTI3NSwiZXhwIjoxNzczMTM3Njc1fQ.oJ019r6gkU-s8rO0AUyxHe26uEfTMdQFAqE0bjvhi5s', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-10 10:14:35', '2026-03-09 10:14:35'),
(90, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzMwNTEyOTAsImV4cCI6MTc3MzEzNzY5MH0.-SvE1OI8l0QuyBJhZshFcJIeHU5reAh5uC24MPeJzgw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-10 10:14:50', '2026-03-09 10:14:50'),
(91, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzA1MTM1MCwiZXhwIjoxNzczMTM3NzUwfQ.NN2I5dr5CzwwCyEzA7dSYNSGpNZusry1xpW1K45kdGg', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-10 10:15:50', '2026-03-09 10:15:50'),
(92, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzA1MTM3NiwiZXhwIjoxNzczMTM3Nzc2fQ.PoBWdfFiSR73oL-mg00V7eHkFxV3tKFT_PgViACDbDs', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-10 10:16:16', '2026-03-09 10:16:16'),
(93, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzE5MjAyNywiZXhwIjoxNzczMjc4NDI3fQ.1M1BQ-PrTq8simll9GpKK5y3aLEeHGmgQctxlZC3Rfw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 01:20:27', '2026-03-11 01:20:27'),
(94, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzMxOTIwNDAsImV4cCI6MTc3MzI3ODQ0MH0.KXj5Pci20QVGaJSqCIaQV4kuFNrBDDWOsVH8zCcPcEg', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 01:20:40', '2026-03-11 01:20:40'),
(95, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzMxOTM1OTAsImV4cCI6MTc3MzI3OTk5MH0.oC4YufFExzcoMmHBxR09duZmtpeTZEHS7X0a2pOeH7E', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 01:46:30', '2026-03-11 01:46:30'),
(96, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzE5NzM0MCwiZXhwIjoxNzczMjgzNzQwfQ.BGb-fe-tIwOcbujGHUjYRylNGJP6SyWcbF4pys_nQ2U', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 02:49:00', '2026-03-11 02:49:00'),
(97, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzE5NzQxNiwiZXhwIjoxNzczMjgzODE2fQ.5_qA4fxnLdpP5Lakq5FFvgcKwWljKWC6gy0rovqyjJU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 02:50:16', '2026-03-11 02:50:16'),
(98, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzMxOTc0ODIsImV4cCI6MTc3MzI4Mzg4Mn0._k4PF-t_ALHZDgozgWRWoIU2kELRAeRf74ZHWhcDMHo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 02:51:22', '2026-03-11 02:51:22'),
(99, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzMxOTgwNzksImV4cCI6MTc3MzI4NDQ3OX0.vlP2MVkcQuKEyzluiTRmnMBtmJMXXrXOD0wwz71tz4w', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 03:01:19', '2026-03-11 03:01:19'),
(100, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzE5ODA5NCwiZXhwIjoxNzczMjg0NDk0fQ.XP55Rl-TXgA6tPkw2ECKtvg2js4Utim9yHhXQsV04Rk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 03:01:34', '2026-03-11 03:01:34'),
(101, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzMxOTgyMjMsImV4cCI6MTc3MzI4NDYyM30.9kUeBfU2K8hr3T6A05LBjtmf3PJF_oVRWOlUGnJNKNY', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-12 03:03:43', '2026-03-11 03:03:43'),
(102, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1MzU4NDksImV4cCI6MTc3MzYyMjI0OX0.P7Qm2viOea4WyojJZLhnyHyDI5tvzTOctbqYfMMyZ_Y', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 00:50:49', '2026-03-15 00:50:49'),
(103, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzUzNTkyMiwiZXhwIjoxNzczNjIyMzIyfQ.VA5VfaJgE4VIl8HFUeQ3ymaRVlRzYWS_gzATl4LLll0', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 00:52:02', '2026-03-15 00:52:02'),
(104, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzUzNTk2NywiZXhwIjoxNzczNjIyMzY3fQ.FUlvOFa7eJV6WQRMAYWNZpeemLUnwjTqhAiyCu1aMjQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 00:52:47', '2026-03-15 00:52:47'),
(105, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzUzNTk5NSwiZXhwIjoxNzczNjIyMzk1fQ.eyf0FRDEhhEEZADnF886YkdbyUCJqF34gcgZLmIE58I', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 00:53:15', '2026-03-15 00:53:15'),
(106, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1MzYyODUsImV4cCI6MTc3MzYyMjY4NX0.WjA7UyY575BfOdUlB3UHhYpq09ScDMOHjP6hzhhwW-k', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 00:58:05', '2026-03-15 00:58:05'),
(107, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1MzY4NjgsImV4cCI6MTc3MzYyMzI2OH0.7RWUYvvT9Ujliv3YIGXaCuK0H41uNwSu_p02Ps5us9c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:07:48', '2026-03-15 01:07:48'),
(108, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1MzcyNzMsImV4cCI6MTc3MzYyMzY3M30.9U2fpxi_AoMqP81pCViGfCYsUtYBSSInxwnEeAToGRE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:14:34', '2026-03-15 01:14:34'),
(109, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1MzczOTEsImV4cCI6MTc3MzYyMzc5MX0.sbpRoVBLaUq-KQx6gy-GYPpeKn7OSPkIE4UQ1WGv8lw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:16:31', '2026-03-15 01:16:31'),
(110, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1Mzc2MTcsImV4cCI6MTc3MzYyNDAxN30.Z3OauACVxJysW2Z8xbZBfx-V_HPdpDduvlT75zzFQJY', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:20:17', '2026-03-15 01:20:17'),
(111, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1Mzc2MzYsImV4cCI6MTc3MzYyNDAzNn0.igvef5EQ345w8WC0KJwAmyun5LA9EdSuGjrvtKKrSJ4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:20:36', '2026-03-15 01:20:36'),
(112, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1Mzc2MzcsImV4cCI6MTc3MzYyNDAzN30.g2VWfuxlSB_EflBsEjoch6AVo6ZjUq4tJi7GpH57bL4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:20:37', '2026-03-15 01:20:37'),
(113, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1MzgzMzEsImV4cCI6MTc3MzYyNDczMX0.3qKTOZlUOKrZ9YkuetiuO_kJynz1xwbarJ2De1YRa3w', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:32:11', '2026-03-15 01:32:11'),
(114, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1MzgzODEsImV4cCI6MTc3MzYyNDc4MX0.-qEYhukwPgC4kAO68cCPf8De6AH4Q1oAvwQ1WVi_s_4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:33:01', '2026-03-15 01:33:01'),
(115, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1Mzg0NjMsImV4cCI6MTc3MzYyNDg2M30.WHtPxN2t8Fbuf89M3DesE6pfp0lyfvcct0jQGaIdsiQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:34:23', '2026-03-15 01:34:23'),
(116, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1Mzg1NTEsImV4cCI6MTc3MzYyNDk1MX0.aeWlalq-eyO7LD5in_LOXGDjQjR4qMI2rLlQZpAQxSk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:35:51', '2026-03-15 01:35:51'),
(117, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1Mzg2MzMsImV4cCI6MTc3MzYyNTAzM30.bahCjuVX_99PeESo2Gkuan9r478LZ9MU8RCTT36wtrQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:37:13', '2026-03-15 01:37:13'),
(118, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1MzkxODUsImV4cCI6MTc3MzYyNTU4NX0.aN7b5JIpzySnmlIowLsyXoqTD-hugalPCKqz_OP78XM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 01:46:25', '2026-03-15 01:46:25'),
(119, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDAwMDgsImV4cCI6MTc3MzYyNjQwOH0.Iuo1PcSpZXU3OgmLqGh47zBYXIH9JVfT4Yivuk2pz5s', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 02:00:08', '2026-03-15 02:00:08'),
(120, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDA3NTMsImV4cCI6MTc3MzYyNzE1M30.ZKZ86VkBCwUOz9S2yCTXj8V-zydXeKEkaPBPg_JJIig', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 02:12:33', '2026-03-15 02:12:33'),
(121, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDA3NTcsImV4cCI6MTc3MzYyNzE1N30.7sBhLmPAHxYl3ZpUr_wnL44K5xXeH1AUI9UJbysypW0', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 02:12:37', '2026-03-15 02:12:37'),
(122, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDA3NjcsImV4cCI6MTc3MzYyNzE2N30.3-8sBKELveA10zf-f6xvOvyptUhJdPMRQRxj0c4gueM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 02:12:47', '2026-03-15 02:12:47'),
(123, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDE5ODgsImV4cCI6MTc3MzYyODM4OH0.2TQEusX6Mk1uTWtzMA3t_4CSKFmL7IMs42RFhxX9o1M', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 02:33:08', '2026-03-15 02:33:08'),
(124, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDI1OTEsImV4cCI6MTc3MzYyODk5MX0.fyMVgGFWTGVhzVa3Jc7XUtxkpw2d_TiA0AIAyZ0f5PI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 02:43:11', '2026-03-15 02:43:11'),
(125, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDI2MzYsImV4cCI6MTc3MzYyOTAzNn0.S1N9bpAKgbsH92YmLWw6T_--zmnLteZFy7kDvGypxXU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 02:43:56', '2026-03-15 02:43:56'),
(126, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDM4OTQsImV4cCI6MTc3MzYzMDI5NH0._-KTBMIzE4eVKYTCHV3lXDO2Zjl9zqSPjwhwkQPhldo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:04:54', '2026-03-15 03:04:54'),
(127, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDQ0NzcsImV4cCI6MTc3MzYzMDg3N30._8iodwu0Nn46DXtqZjT02f4mmDU8BsoKiqgkwWVr4Us', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:14:37', '2026-03-15 03:14:37'),
(128, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzU0NDUxNSwiZXhwIjoxNzczNjMwOTE1fQ.WGGQB7n2nDxvPYtl30lTpV0zvzMfNOvjInkPoLDVe2k', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:15:15', '2026-03-15 03:15:15'),
(129, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzU0NDY3MCwiZXhwIjoxNzczNjMxMDcwfQ.3Qg0nizRF3QJhzU9Bm28csNkLnot-70vYfTk37dAWxM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:17:50', '2026-03-15 03:17:50'),
(130, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDQ3MTQsImV4cCI6MTc3MzYzMTExNH0.1gGluUm-V-dVJQMrSDhknxS_ervTfWV2jC9SBxEWprc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:18:34', '2026-03-15 03:18:34'),
(131, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDUyMjMsImV4cCI6MTc3MzYzMTYyM30.XTlwt8saiio_XdJp6XMAjcbIrhAn6B8mpRaUnx4NAhU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:27:03', '2026-03-15 03:27:03');
INSERT INTO `sessions` (`id`, `user_id`, `token`, `ip_address`, `user_agent`, `expires_at`, `created_at`) VALUES
(132, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzU0NTI0OCwiZXhwIjoxNzczNjMxNjQ4fQ.C7IEiShTqM5lVmds4I3jPQ9CMzpydQSio-ftc6TzFWU', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:27:28', '2026-03-15 03:27:28'),
(133, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzU0NTM1NSwiZXhwIjoxNzczNjMxNzU1fQ.UQT09YpDCxLaVEokHmIOCDqV1Wuw2gggWoDF3nbLkTs', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:29:15', '2026-03-15 03:29:15'),
(134, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzU0NTU0MCwiZXhwIjoxNzczNjMxOTQwfQ.HOfTZuwZBVtes8b_3lvmbfQTSRJNkNJtFjw35EHfiEA', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:32:20', '2026-03-15 03:32:20'),
(135, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDU1NzEsImV4cCI6MTc3MzYzMTk3MX0.ZwL85hTWhltyaOXWhj3s1RqqFsT3rSOJxyzpW1Q2IG8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:32:51', '2026-03-15 03:32:51'),
(136, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzU0NTYwMCwiZXhwIjoxNzczNjMyMDAwfQ.OjpCSapRMU5AcGUt_JGzNbcY4k9NnOvBM-7F3wd597Q', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:33:20', '2026-03-15 03:33:20'),
(137, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDcxNTgsImV4cCI6MTc3MzYzMzU1OH0.h0Q0Bmpi49hzGvYTMh8920XLJxo_zJ2EBYmyx32_xc0', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 03:59:18', '2026-03-15 03:59:18'),
(138, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDc0NDIsImV4cCI6MTc3MzYzMzg0Mn0.GZJG12wI43rNJmAMImSYtfnS0yyxGJloDibOfiPN5Rc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:04:02', '2026-03-15 04:04:02'),
(139, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDc0NTMsImV4cCI6MTc3MzYzMzg1M30.gVLh1CRR0Uf6rl-HDyHJRiUk4G0FMi37kxdINxa-F9s', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:04:13', '2026-03-15 04:04:13'),
(140, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDc1MDUsImV4cCI6MTc3MzYzMzkwNX0.m_qJxQvbyco1ub1Fhp2tByL-RE7A3bbhK4CYSH038tw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:05:05', '2026-03-15 04:05:05'),
(141, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDc1MTMsImV4cCI6MTc3MzYzMzkxM30.m8CMR-Vo1YcTCRBluygQLFpuronn22b-ed7T8I_uFTw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:05:13', '2026-03-15 04:05:13'),
(142, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDgyNjEsImV4cCI6MTc3MzYzNDY2MX0.Wq_dX33jQggxo1ud1dyUUem8OsakbuJEvdc-zRaXYx0', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:17:41', '2026-03-15 04:17:41'),
(143, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzU0ODk4MiwiZXhwIjoxNzczNjM1MzgyfQ.bPpVVBt8WVFmCH4kqK4Y-MnkgJc8n8tQYyFr76pPpjY', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:29:42', '2026-03-15 04:29:42'),
(144, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDkwMTksImV4cCI6MTc3MzYzNTQxOX0.eXdg22Hbq-nygb4SQp5v4EkxTLZ76Bb2_emzuUq8fQ8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:30:19', '2026-03-15 04:30:19'),
(145, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NDk1MzYsImV4cCI6MTc3MzYzNTkzNn0.e009F6gwm_ICLLEx4N98OmkUbFrt9H8smt-gVPwCnkY', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:38:57', '2026-03-15 04:38:57'),
(146, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTAxOTIsImV4cCI6MTc3MzYzNjU5Mn0.RymOFwol56m68PPA1YSVKjFzy22IK-gG7gNYPFxxEpc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:49:52', '2026-03-15 04:49:52'),
(147, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTAzMTYsImV4cCI6MTc3MzYzNjcxNn0.mC8itwugg-NvpZRPVxRhm--dib1WZ1t4A44mqKBYalc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:51:56', '2026-03-15 04:51:56'),
(148, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTA3NDAsImV4cCI6MTc3MzYzNzE0MH0.EuLUYa05x0FtIRtCXT8FmEF2sgZ0724FP5LsRoyWyNo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:59:01', '2026-03-15 04:59:01'),
(149, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTA3NzEsImV4cCI6MTc3MzYzNzE3MX0.bqxQvdlQNZU6rPs-AftoPpv28H-9BponqQUos8JREho', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 04:59:31', '2026-03-15 04:59:31'),
(150, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTE1MjksImV4cCI6MTc3MzYzNzkyOX0.RBc51w11MqIDCOqgNrTqr87d7BVGsWrsgXbnwJxLThM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 05:12:09', '2026-03-15 05:12:09'),
(151, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTE5MDAsImV4cCI6MTc3MzYzODMwMH0.1TQBM3krxjOy8P_bzZm7L8Io17FhbDBweODmEKIcfk8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 05:18:20', '2026-03-15 05:18:20'),
(152, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTIwODUsImV4cCI6MTc3MzYzODQ4NX0.tQBtALAoSmnFDKZVfbYWLSMVsONQjzUI040j2qYecbs', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 05:21:25', '2026-03-15 05:21:25'),
(153, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTIxODgsImV4cCI6MTc3MzYzODU4OH0.A4H5YDq-MI3tjjxZThsuCuTMHE-ceQHnC_BlT8e37JE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 05:23:08', '2026-03-15 05:23:08'),
(154, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTMwODksImV4cCI6MTc3MzYzOTQ4OX0.H6je_ATydexSbbur2xLWIRDHnOtg8tQoZUBrGOknmu4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 05:38:09', '2026-03-15 05:38:09'),
(155, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTMzMDcsImV4cCI6MTc3MzYzOTcwN30.nQdHutLybws3NHMLQDgOMGO2UBBMb-J8WoKPzfv3ddQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 05:41:47', '2026-03-15 05:41:47'),
(156, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTQyMzIsImV4cCI6MTc3MzY0MDYzMn0.dTOIf2YAX5fIXp3-acD7Q9LCbpJ3LRJ19Ym5-VWWL0M', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 05:57:12', '2026-03-15 05:57:12'),
(157, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTUwMDgsImV4cCI6MTc3MzY0MTQwOH0.By3xtM7gJsAQ_lYDE25qLIGghQPJsUnKDKFyOhTTc3c', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 06:10:08', '2026-03-15 06:10:08'),
(158, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTU1MTIsImV4cCI6MTc3MzY0MTkxMn0.LvXBjaB8zAkD4T2bKFr-NcrJ4DO_4E7eyglJSavaB3o', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 06:18:32', '2026-03-15 06:18:32'),
(159, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTYwODgsImV4cCI6MTc3MzY0MjQ4OH0.OFuDv7kUPcKFX31YqAd-tFrIcRmhczWmvNX42xmVE3Y', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 06:28:08', '2026-03-15 06:28:08'),
(160, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTY0MTAsImV4cCI6MTc3MzY0MjgxMH0.5Cj0bgyog6XiBoz7F0toewqYbyGDOshfjIEMKxOd_uk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 06:33:30', '2026-03-15 06:33:30'),
(161, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTY2NTksImV4cCI6MTc3MzY0MzA1OX0.tC1wMEEqfmFBJszQr656NHBx1lYv9RrIV8o4tf8yfRk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 06:37:39', '2026-03-15 06:37:39'),
(162, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTc3MzQsImV4cCI6MTc3MzY0NDEzNH0.iscgu-1XPGwaDJywLjgaDURwOGYQ348GEK5XL8GPlbI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 06:55:34', '2026-03-15 06:55:34'),
(163, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTg0NTksImV4cCI6MTc3MzY0NDg1OX0.e_pMcKC9NRaIwewWYB_gcLSV5gxYY4L6sqpa9VpXacI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 07:07:39', '2026-03-15 07:07:39'),
(164, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTg1NTEsImV4cCI6MTc3MzY0NDk1MX0.8vSLKfZ6z7Jry2OlAcq2lY7wC5U8JJwzn40NHB40TTw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 07:09:11', '2026-03-15 07:09:11'),
(165, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTk3MTEsImV4cCI6MTc3MzY0NjExMX0.0y_7S7VV1QPNXQVa-xUgDkCF07smr4P49JsUoror9zA', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 07:28:32', '2026-03-15 07:28:32'),
(166, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NTk4NTEsImV4cCI6MTc3MzY0NjI1MX0.z2oFfyCnShmXdspBQwr_BlNc_ioYqlsl18OAb3D36z8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 07:30:51', '2026-03-15 07:30:51'),
(167, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NjAyOTMsImV4cCI6MTc3MzY0NjY5M30.HPKAEEUJ9wZdmyDozPKPPqv3ZXeUtA1dYrTeL0PLkxM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 07:38:13', '2026-03-15 07:38:13'),
(168, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NjI4MTQsImV4cCI6MTc3MzY0OTIxNH0.ftoMk_ZftP-J_gC9mF2mTJNbTiZZukGdDGy_aO5ATmQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 08:20:14', '2026-03-15 08:20:14'),
(169, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NjMwMjksImV4cCI6MTc3MzY0OTQyOX0.wL8Q5jPRSrK3OjpZPXTA2sQJrdfvi-eYJlbbzNIuiz4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 08:23:49', '2026-03-15 08:23:49'),
(170, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NjMyNzQsImV4cCI6MTc3MzY0OTY3NH0.VmcrlGp1oenTfSXgIKBGBWTRDYsvMpqLYxZgkqsDZzM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 08:27:54', '2026-03-15 08:27:54'),
(171, 'teacher-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZWFjaGVyLTEiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzU2NDA5MSwiZXhwIjoxNzczNjUwNDkxfQ.TcJJruv2je88SkoCBTfdtOywR9TaYq_FCxABoPV9fv8', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 08:41:31', '2026-03-15 08:41:31'),
(172, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NjQyNjUsImV4cCI6MTc3MzY1MDY2NX0.6GhVqgHkJq5hSa3rw2093nPj9J0gYh_mSb5KxFsdsAg', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 08:44:25', '2026-03-15 08:44:25'),
(173, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NjY5OTcsImV4cCI6MTc3MzY1MzM5N30.lWmfeIvvzD2abAPQgP72RLh5GN2ktyTEQg0J-Q1BN4o', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 09:29:57', '2026-03-15 09:29:57'),
(174, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzU2NzAyNSwiZXhwIjoxNzczNjUzNDI1fQ.YJP8ZxxvcCdkC8vYLzaZdZizZSZOwfyQn8dX8ohhzSQ', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 09:30:25', '2026-03-15 09:30:25'),
(175, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzU2NzA4NCwiZXhwIjoxNzczNjUzNDg0fQ.Ainj06NIL_YRotbxZMiQieRTYv8Tbyhdq08HS6n6kAk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 09:31:24', '2026-03-15 09:31:24'),
(176, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NjcxMjgsImV4cCI6MTc3MzY1MzUyOH0.wTFAEuJ2Ku1MFJN186mC7nFVS7aQwSa1mfKmThCQAco', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 09:32:08', '2026-03-15 09:32:08'),
(177, 'admin-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xIiwicm9sZSI6ImRlYW4iLCJpYXQiOjE3NzM1NjcxNzUsImV4cCI6MTc3MzY1MzU3NX0.vD0cfg67YtAzVNP-lVWObddz8ODZAfdYXDYJqEayJUI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 09:32:55', '2026-03-15 09:32:55'),
(178, 'student-1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdHVkZW50LTEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3MzU2NzE5NywiZXhwIjoxNzczNjUzNTk3fQ.zlsMqHbG7uxtDNseh2e8OWuO2n-ZaBqAgzMjT8FfIRE', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 09:33:17', '2026-03-15 09:33:17'),
(179, 'af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjk1MGNiMS1jYzg0LTRhZTYtYTdhZS1kNjgzNDhiY2Q5ZGUiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc3MzU2NzIyMCwiZXhwIjoxNzczNjUzNjIwfQ.deqc0kiISHldIO13CwTajBgkK1vN4HgBXpNH4dh7Gaw', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '2026-03-16 09:33:40', '2026-03-15 09:33:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','teacher','dean') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `course` varchar(100) DEFAULT NULL,
  `year_level` int(11) DEFAULT NULL,
  `section` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `course`, `year_level`, `section`, `created_at`, `updated_at`) VALUES
('3fc28442-f332-471a-9d72-2819329c0aa5', 'Liza Nazareno', 'liza.nazareno@jmc.edu.ph', 'nazareno123', 'student', 1, 'BSIT', NULL, NULL, '2026-02-25 08:56:57', '2026-02-25 08:56:57'),
('7f2c816c-b11d-4ae4-9497-ce3a766b54f7', 'Ruby  Mae', 'rubymae.ones@jmc.edu.ph', 'khakibaby', 'student', 1, 'BSIT', NULL, NULL, '2026-02-24 18:07:09', '2026-02-24 18:07:09'),
('admin-1', 'Admin User', 'admin@jmc.edu.ph', 'admin123', 'dean', 1, 'BSIT', NULL, NULL, '2026-02-24 17:55:33', '2026-02-24 17:55:33'),
('af950cb1-cc84-4ae6-a7ae-d68348bcd9de', 'Ryan Billera', 'ryan.billera@jmc.edu.ph', 'ryan1234', 'teacher', 1, NULL, NULL, NULL, '2026-02-24 18:08:30', '2026-02-24 18:08:30'),
('eacf5742-b0e7-44fb-a87a-8459f2f1580e', 'Milller Lana', 'miller.lana@jmc.edu.ph', 'miller1234', 'student', 1, 'BSEMC', NULL, NULL, '2026-02-25 03:46:14', '2026-02-25 03:46:14'),
('student-1', 'Student User', 'student@jmc.edu.ph', 'student123', 'student', 1, 'BSIT', NULL, NULL, '2026-02-24 17:55:33', '2026-02-24 17:55:33'),
('teacher-1', 'Teacher User', 'teacher@jmc.edu.ph', 'teacher123', 'teacher', 1, 'BSIT', NULL, NULL, '2026-02-24 17:55:33', '2026-02-24 17:55:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_periods`
--
ALTER TABLE `academic_periods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_period` (`academic_year`,`semester`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_audit_user` (`user_id`),
  ADD KEY `idx_audit_logs_user` (`user_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_teacher_id` (`teacher_id`),
  ADD KEY `idx_code` (`code`);

--
-- Indexes for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_enrollment` (`course_id`,`student_id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_course_enrollments_student` (`student_id`),
  ADD KEY `idx_course_enrollments_course` (`course_id`);

--
-- Indexes for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course_id` (`course_id`),
  ADD KEY `idx_evaluatee_id` (`evaluatee_id`),
  ADD KEY `idx_evaluator_id` (`evaluator_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_evaluations_course` (`course_id`),
  ADD KEY `idx_evaluations_evaluator` (`evaluator_id`),
  ADD KEY `idx_evaluations_evaluatee` (`evaluatee_id`),
  ADD KEY `idx_evaluations_period` (`period_id`);

--
-- Indexes for table `evaluation_criteria`
--
ALTER TABLE `evaluation_criteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_form_id` (`form_id`);

--
-- Indexes for table `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_criteria_id` (`criteria_id`);

--
-- Indexes for table `evaluation_forms`
--
ALTER TABLE `evaluation_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `evaluation_periods`
--
ALTER TABLE `evaluation_periods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `academic_period_id` (`academic_period_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `evaluation_responses`
--
ALTER TABLE `evaluation_responses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_response` (`evaluation_id`,`criteria_id`),
  ADD KEY `criteria_id` (`criteria_id`),
  ADD KEY `idx_evaluation_id` (`evaluation_id`),
  ADD KEY `idx_evaluation_responses_evaluation` (`evaluation_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_sessions_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_periods`
--
ALTER TABLE `academic_periods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=185;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluation_criteria`
--
ALTER TABLE `evaluation_criteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `evaluation_forms`
--
ALTER TABLE `evaluation_forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `evaluation_periods`
--
ALTER TABLE `evaluation_periods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `evaluation_responses`
--
ALTER TABLE `evaluation_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  ADD CONSTRAINT `course_enrollments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_enrollments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `evaluations_ibfk_3` FOREIGN KEY (`evaluatee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `evaluations_ibfk_4` FOREIGN KEY (`evaluator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_5` FOREIGN KEY (`period_id`) REFERENCES `evaluation_periods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `evaluation_criteria`
--
ALTER TABLE `evaluation_criteria`
  ADD CONSTRAINT `evaluation_criteria_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `evaluation_forms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  ADD CONSTRAINT `evaluation_questions_ibfk_1` FOREIGN KEY (`criteria_id`) REFERENCES `evaluation_criteria` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `evaluation_periods`
--
ALTER TABLE `evaluation_periods`
  ADD CONSTRAINT `evaluation_periods_ibfk_1` FOREIGN KEY (`academic_period_id`) REFERENCES `academic_periods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `evaluation_responses`
--
ALTER TABLE `evaluation_responses`
  ADD CONSTRAINT `evaluation_responses_ibfk_1` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluation_responses_ibfk_2` FOREIGN KEY (`criteria_id`) REFERENCES `evaluation_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
