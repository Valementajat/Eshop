-- MySQL dump 10.13  Distrib 8.1.0, for Linux (x86_64)
--
-- Host: localhost    Database: eshop
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Cart`
--

DROP TABLE IF EXISTS `Cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cart` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cost` float NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_user_cart` (`user_id`),
  CONSTRAINT `fk_user_cart` FOREIGN KEY (`user_id`) REFERENCES `user` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cart`
--

LOCK TABLES `Cart` WRITE;
/*!40000 ALTER TABLE `Cart` DISABLE KEYS */;
INSERT INTO `Cart` VALUES (1,'Johannes1',120,12),(2,'Johannes2',111,12),(3,'takamaki1',1244,12);
/*!40000 ALTER TABLE `Cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CartItem`
--

DROP TABLE IF EXISTS `CartItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CartItem` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `counts` smallint NOT NULL,
  `costs` float NOT NULL,
  `cart_ID` int NOT NULL,
  `product_ID` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_Cart_Cartitem` (`cart_ID`),
  KEY `fk_Product_Cartitem` (`product_ID`),
  CONSTRAINT `fk_Cart_Cartitem` FOREIGN KEY (`cart_ID`) REFERENCES `Cart` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `fk_Product_Cartitem` FOREIGN KEY (`product_ID`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CartItem`
--

LOCK TABLES `CartItem` WRITE;
/*!40000 ALTER TABLE `CartItem` DISABLE KEYS */;
INSERT INTO `CartItem` VALUES (1,2,234,2,1),(2,1,123,2,2),(3,23,525,2,5),(4,2,51,2,6),(5,2,123,1,5),(6,2,123,1,15);
/*!40000 ALTER TABLE `CartItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderLine`
--

DROP TABLE IF EXISTS `OrderLine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderLine` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `cost` float NOT NULL,
  `order_ID` int NOT NULL,
  `product_ID` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_Orders_OrderLine` (`order_ID`),
  KEY `fk_Product_OrderLine` (`product_ID`),
  CONSTRAINT `fk_Orders_OrderLine` FOREIGN KEY (`order_ID`) REFERENCES `Orders` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `fk_Product_OrderLine` FOREIGN KEY (`product_ID`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderLine`
--

LOCK TABLES `OrderLine` WRITE;
/*!40000 ALTER TABLE `OrderLine` DISABLE KEYS */;
INSERT INTO `OrderLine` VALUES (1,123,1,5),(2,123,1,15),(3,234,2,1),(4,123,2,2),(5,525,2,5),(6,51,2,6);
/*!40000 ALTER TABLE `OrderLine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `orderDate` date NOT NULL,
  `state` enum('Pending', 'Paid', 'Invoiced', 'In Delivery','Delivered','Canceled') NOT NULL DEFAULT'Pending',
  `cost` float NOT NULL,
  `user_ID` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_User_Orders` (`user_ID`),
  CONSTRAINT `fk_User_Orders` FOREIGN KEY (`user_ID`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,'2023-12-04','Pending',120,11),(2,'2023-12-05','Pending',111,12);
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `picture` varchar(50) DEFAULT NULL,
  `tags` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `deprecated` tinyint(1) DEFAULT NULL,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Sata Fé - Peru','Coffee from peru',NULL,'beans',NULL,7.5),(2,'Sata Fé - México','Coffee beans',NULL,'beans',NULL,7.9),(3,'Decaf Don Jebrile - México','Coffee beans',NULL,'beans',NULL,7.92),(4,'Decaf Chiapas - México','Coffee beans',NULL,'beans',NULL,7.95),(5,'Los Montres - Brazil','Coffee beans',NULL,'beans',NULL,8.47),(6,'Huila - Colombia','Coffee beans',NULL,'beans',NULL,8.69),(7,'Baho - Ruanda','Coffee beans',NULL,'beans',NULL,8.47),(8,'FEMALE PRODUCERS, HUEHUETENANGO - GUATEMALA','Coffee beans',NULL,'beans',NULL,8.95),(9,'NAZARETH´S FORMULA II - CARMO DE MINAS, BRAZIL','Coffee beans',NULL,'beans',NULL,9),(10,'CACAO BOMB - BRAZIL','Coffee beans',NULL,'beans',NULL,9.9),(11,'KETIARA WOMEN\'S COOPERATIVE - SUMATRA','Coffee beans',NULL,'beans',NULL,8.95),(12,'VALLE DEL MANTARO - PERU','Coffee beans',NULL,'beans',NULL,9.9),(13,'YELLOW CATURRA - COLOMBIA','Coffee beans',NULL,'beans',NULL,9.9),(14,'ZANCADA - BRAZIL','Coffee beans',NULL,'beans',NULL,9.9),(15,'SAN JOSÉ, INZA - COLOMBIA','Coffee beans',NULL,'beans',NULL,9.95);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `surname` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` enum('admin','user','moderator') NOT NULL DEFAULT 'user',
  `activated` tinyint(1) NOT NULL DEFAULT '0',
  `verification_token` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (11,'Johannes','Takamäki','d','josku123@gmail.com','user',1,'3f679dd90fab332229b9723b325127889e859687'),(12,'Jan','Horak','test','admin@test.com','admin',1,'16a31a1eced23fc220ce6ecb2cd498c12d33705f'),(14,'Jan','Horak','test','user@test.com','user',0,'76efa6d8e502e2bbdbd47ecba64c9f175c7decab'),(15,'Jan','Horak','test','sealcoi@maildrop.cc','user',0,'250e3bbc9a7a04b3cf9b2669eea24a369bfddaac');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-05  0:43:37
