CREATE DATABASE IF NOT EXISTS hospital;
USE hospital;
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2023 at 10:10 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hospital`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversaciones`
--

CREATE TABLE `conversaciones` (
  `codConversacion` int(11) NOT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFin` datetime DEFAULT NULL,
  `tema` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `conversaciones`
--

INSERT INTO `conversaciones` (`codConversacion`, `fechaInicio`, `fechaFin`, `tema`) VALUES
(60, '2023-03-01 09:37:19', NULL, 'Conversación con UN MÉDICO'),
(61, '2023-03-01 09:48:31', NULL, 'Dolor de lumbar DOS MÉDICOS');

-- --------------------------------------------------------

--
-- Table structure for table `medico`
--

CREATE TABLE `medico` (
  `codMedico` int(11) NOT NULL,
  `codUsuario` int(11) NOT NULL,
  `numColegiado` int(10) NOT NULL,
  `especialidad` varchar(42) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `medico`
--

INSERT INTO `medico` (`codMedico`, `codUsuario`, `numColegiado`, `especialidad`) VALUES
(49, 68, 1234567891, 'Medicina general'),
(50, 75, 1230252363, 'Medicina general'),
(51, 76, 1234567894, 'Pediatría');

-- --------------------------------------------------------

--
-- Table structure for table `mensajes`
--

CREATE TABLE `mensajes` (
  `codMensaje` int(11) NOT NULL,
  `codConversacion` int(11) NOT NULL,
  `codRemitente` int(11) NOT NULL,
  `contenido` text NOT NULL,
  `fechaHora` datetime NOT NULL,
  `leido` enum('N','Y') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mensajes`
--

INSERT INTO `mensajes` (`codMensaje`, `codConversacion`, `codRemitente`, `contenido`, `fechaHora`, `leido`) VALUES
(27, 60, 69, 'Hola, le escribo porque a mi hijo le duele mucho la tripa, tiene fiebre y no sabemos que hacer.', '2023-03-01 09:37:19', 'Y'),
(28, 60, 76, 'Hola Raúl, lo que tiene que hacer es hacerle una sopa de pollo caliente y se le pasará. Espero su respuesta', '2023-03-01 09:38:16', 'Y'),
(29, 60, 69, 'No creo que eso sea lo más adecuado, ¿no puede recetarme algo?', '2023-03-01 09:39:00', 'Y'),
(30, 60, 76, 'Le voy a recetar Paracetamol para niños, serían 2mg al día, no se puede pasar de la dosis porque si  no le va a sentar mal. Puede ver sus recetas en el apartado \'Tus recetas\'. Espero su mensaje', '2023-03-01 09:43:57', 'Y'),
(31, 60, 69, 'Gracias señor pediatra, a mi hijo ya se le ha pasado el dolor de tripa. Gracias', '2023-03-01 09:45:05', 'N'),
(32, 61, 69, 'Buenos días, he decidido escribirle a los dos porque cada vez que voy a un hospital público cada doctor me diagnostica algo diferente. Recientemente me caí de espaldas y no puedo agacharme como antes o correr ya que me duele mucho la zona lumbar', '2023-03-01 09:48:31', 'Y'),
(33, 61, 75, 'Usted lo que necesita es reposo y no levantar mucho peso durante mínimo tres semanas.', '2023-03-01 09:50:16', 'Y'),
(34, 61, 68, 'Discrepo, usted necesita morfina durante dos semanas para estar bien de nuevo. Le voy a recetar una pastilla al día durante dos semanas.', '2023-03-01 09:51:13', 'Y'),
(35, 61, 69, 'Muchas gracias a los dos. Que tengan un buen día.', '2023-03-01 09:52:19', 'N');

-- --------------------------------------------------------

--
-- Table structure for table `paciente`
--

CREATE TABLE `paciente` (
  `codPaciente` int(11) NOT NULL,
  `codUsuario` int(11) NOT NULL,
  `medicoCabecera` int(11) NOT NULL,
  `nss` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paciente`
--

INSERT INTO `paciente` (`codPaciente`, `codUsuario`, `medicoCabecera`, `nss`) VALUES
(4, 69, 49, 1234567892),
(9, 74, 49, 1234567892);

-- --------------------------------------------------------

--
-- Table structure for table `participantes`
--

CREATE TABLE `participantes` (
  `codParticipante` int(11) NOT NULL,
  `codConversacion` int(11) NOT NULL,
  `codUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `participantes`
--

INSERT INTO `participantes` (`codParticipante`, `codConversacion`, `codUsuario`) VALUES
(46, 60, 69),
(47, 60, 76),
(48, 61, 69),
(49, 61, 68),
(50, 61, 75);

-- --------------------------------------------------------

--
-- Table structure for table `receta`
--

CREATE TABLE `receta` (
  `codReceta` int(11) NOT NULL,
  `codPaciente` int(11) NOT NULL,
  `codMedico` int(11) NOT NULL,
  `nombreMedicamento` varchar(42) NOT NULL,
  `dosis` varchar(42) NOT NULL,
  `cantidad` varchar(42) NOT NULL,
  `motivo` varchar(42) NOT NULL,
  `fechaHora` date NOT NULL,
  `codConversacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `receta`
--

INSERT INTO `receta` (`codReceta`, `codPaciente`, `codMedico`, `nombreMedicamento`, `dosis`, `cantidad`, `motivo`, `fechaHora`, `codConversacion`) VALUES
(14, 4, 51, 'Paracetamol Kids', 'Diaria', '2mg', 'Dolor de tripa', '2023-03-01', 60),
(15, 4, 49, 'Morfina', 'Diaria/Dos semanas', '1 pastilla', 'Dolor de lumbar', '2023-03-01', 61);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `usuario` varchar(42) NOT NULL,
  `codUsuario` int(11) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `nombre` varchar(42) NOT NULL,
  `apellido` varchar(42) NOT NULL,
  `confirmado` varchar(1) NOT NULL DEFAULT 'N',
  `fechaNac` date NOT NULL,
  `telefono` int(9) NOT NULL,
  `fotoPerfil` varchar(255) NOT NULL,
  `tipo` enum('Medico','Paciente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`usuario`, `codUsuario`, `clave`, `nombre`, `apellido`, `confirmado`, `fechaNac`, `telefono`, `fotoPerfil`, `tipo`) VALUES
('gregorio@comem.es', 68, '$argon2i$v=19$m=65536,t=4,p=1$T1pFV2JrZmd4NVBQSlZMcQ$KSZkNGbnb6F4K6oaYNC/V7c6aG+oiSH39gJHF+1kbWU', 'Gregorio', 'Maranon', 'Y', '1990-06-06', 695552332, 'fotosDePerfil/68Gregorio.png', 'Medico'),
('pacienteRaul@gmail.com', 69, '$argon2i$v=19$m=65536,t=4,p=1$WmdSYlZJZEpVSjFuN2lBQg$jZHnEkoxmrKq5cLvpIoynbBiSHPySUtCtkjMfBnE7CA', 'Raúl', 'González', 'Y', '1991-06-05', 696663221, 'fotosDePerfil/69Raúl.jpg', 'Paciente'),
('pacienteNoVerificado@gmail.com', 74, '$argon2i$v=19$m=65536,t=4,p=1$WmdSYlZJZEpVSjFuN2lBQg$jZHnEkoxmrKq5cLvpIoynbBiSHPySUtCtkjMfBnE7CA', 'NoEstoy', 'Verificado', 'N', '2023-03-01', 653332556, 'fotosDePerfil/null.jpg', 'Paciente'),
('ramonycajal@comem.es', 75, '$argon2i$v=19$m=65536,t=4,p=1$WmdSYlZJZEpVSjFuN2lBQg$jZHnEkoxmrKq5cLvpIoynbBiSHPySUtCtkjMfBnE7CA', 'Santiago', 'Ramón y Cajal', 'Y', '2023-03-01', 698889889, 'fotosDePerfil/75Santiago.jpg', 'Medico'),
('pediatra@comem.es', 76, '$argon2i$v=19$m=65536,t=4,p=1$WmdSYlZJZEpVSjFuN2lBQg$jZHnEkoxmrKq5cLvpIoynbBiSHPySUtCtkjMfBnE7CA', 'Pediatra', 'Prueba', 'Y', '2023-03-02', 636663663, 'fotosDePerfil/76Pediatra.jpg', 'Medico');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversaciones`
--
ALTER TABLE `conversaciones`
  ADD PRIMARY KEY (`codConversacion`);

--
-- Indexes for table `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`codMedico`),
  ADD UNIQUE KEY `numColegiado` (`numColegiado`),
  ADD KEY `user` (`codUsuario`);

--
-- Indexes for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`codMensaje`),
  ADD KEY `conversacion` (`codConversacion`),
  ADD KEY `remi` (`codRemitente`);

--
-- Indexes for table `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`codPaciente`),
  ADD KEY `cusu` (`codUsuario`),
  ADD KEY `medcab` (`medicoCabecera`);

--
-- Indexes for table `participantes`
--
ALTER TABLE `participantes`
  ADD PRIMARY KEY (`codParticipante`),
  ADD KEY `usu` (`codUsuario`),
  ADD KEY `conv` (`codConversacion`);

--
-- Indexes for table `receta`
--
ALTER TABLE `receta`
  ADD PRIMARY KEY (`codReceta`),
  ADD KEY `paciente` (`codPaciente`),
  ADD KEY `medico` (`codMedico`),
  ADD KEY `conversacion` (`codConversacion`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`codUsuario`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `telefono` (`telefono`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `conversaciones`
--
ALTER TABLE `conversaciones`
  MODIFY `codConversacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `medico`
--
ALTER TABLE `medico`
  MODIFY `codMedico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `codMensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `paciente`
--
ALTER TABLE `paciente`
  MODIFY `codPaciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `participantes`
--
ALTER TABLE `participantes`
  MODIFY `codParticipante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `receta`
--
ALTER TABLE `receta`
  MODIFY `codReceta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `codUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `medico`
--
ALTER TABLE `medico`
  ADD CONSTRAINT `user` FOREIGN KEY (`codUsuario`) REFERENCES `usuario` (`codUsuario`);

--
-- Constraints for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `conversacion` FOREIGN KEY (`codConversacion`) REFERENCES `conversaciones` (`codConversacion`),
  ADD CONSTRAINT `remi` FOREIGN KEY (`codRemitente`) REFERENCES `usuario` (`codUsuario`);

--
-- Constraints for table `paciente`
--
ALTER TABLE `paciente`
  ADD CONSTRAINT `cusu` FOREIGN KEY (`codUsuario`) REFERENCES `usuario` (`codUsuario`),
  ADD CONSTRAINT `medcab` FOREIGN KEY (`medicoCabecera`) REFERENCES `medico` (`codMedico`);

--
-- Constraints for table `participantes`
--
ALTER TABLE `participantes`
  ADD CONSTRAINT `conv` FOREIGN KEY (`codConversacion`) REFERENCES `conversaciones` (`codConversacion`),
  ADD CONSTRAINT `usu` FOREIGN KEY (`codUsuario`) REFERENCES `usuario` (`codUsuario`);

--
-- Constraints for table `receta`
--
ALTER TABLE `receta`
  ADD CONSTRAINT `conver` FOREIGN KEY (`codConversacion`) REFERENCES `conversaciones` (`codConversacion`),
  ADD CONSTRAINT `emi` FOREIGN KEY (`codPaciente`) REFERENCES `paciente` (`codPaciente`),
  ADD CONSTRAINT `rece` FOREIGN KEY (`codMedico`) REFERENCES `medico` (`codMedico`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
