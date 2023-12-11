-- MySQL dump 10.13  Distrib 8.2.0, for Linux (x86_64)
--
-- Host: localhost    Database: eshop
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cost` float NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_cart` (`user_id`),
  CONSTRAINT `fk_user_cart` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,'Johannes1',120,12),(2,'Johannes2',111,12),(3,'takamaki1',1244,12);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `counts` smallint NOT NULL,
  `cost` float NOT NULL,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Cart_Cartitem` (`cart_id`),
  KEY `fk_Product_Cartitem` (`product_id`),
  CONSTRAINT `fk_Cart_Cartitem` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_Product_Cartitem` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (1,2,234,2,1),(2,1,123,2,2),(3,23,525,2,5),(4,2,51,2,6),(5,2,123,1,5),(6,2,123,1,15);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL,
  `date` date DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `feedback_chk_1` CHECK (((`rating` >= 0) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'2023-12-09','its ok',3.2,1,11),(2,'2023-12-09','it\'s god awfull',1,5,11),(3,'2023-12-09','the best product ever made ',5,15,11),(4,'2023-12-09','its ok',2.5,48,11),(5,'2023-12-09','its ok',2.3,62,11),(6,'2023-12-09','its ok',4.2,1,12),(7,'2023-12-09','it\'s god awfull',0.4,5,15),(8,'2023-12-09','the best product ever made ',5,15,14),(9,'2023-12-09','its ok',2.8,48,12),(10,'2023-12-09','its ok',2.1,62,12),(11,'2023-12-09','its ok',2.7,62,14),(12,'2023-12-09','its ok',4.2,1,12),(13,'2023-12-09','it\'s god awfull',0,5,15),(14,'2023-12-09','the best product ever made ',4.7,15,14),(15,'2023-12-09','its ok',1,48,12),(16,'2023-12-09','its ok',3,62,12),(17,'2023-12-09','its ok',2.8,62,14);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderDate` date NOT NULL,
  `state` enum('Pending','Paid','Invoiced','In Delivery','Delivered','Canceled') NOT NULL DEFAULT 'Pending',
  `cost` float NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_User_order` (`user_id`),
  CONSTRAINT `fk_User_order` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,'2023-12-04','Pending',120,11),(2,'2023-12-05','Pending',111,12),(3,'2023-12-11','Pending',31.2,11);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_line`
--

DROP TABLE IF EXISTS `order_line`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_line` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cost` float NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_order_line` (`order_id`),
  KEY `fk_Product_order_line` (`product_id`),
  CONSTRAINT `fk_order_order_line` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_Product_order_line` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_line`
--

LOCK TABLES `order_line` WRITE;
/*!40000 ALTER TABLE `order_line` DISABLE KEYS */;
INSERT INTO `order_line` VALUES (1,123,1,5),(2,123,1,15),(3,234,2,1),(4,123,2,2),(5,525,2,5),(6,51,2,6),(7,7.5,3,1),(8,23.7,3,2);
/*!40000 ALTER TABLE `order_line` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `picture` varchar(50) DEFAULT NULL,
  `tags` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `deprecated` tinyint(1) DEFAULT NULL,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Sata Fé - Peru','Coffee from peru',NULL,'beans',NULL,7.5),(2,'Sata Fé - México','Coffee beans',NULL,'beans',NULL,7.9),(3,'Decaf Don Jebrile - México','Coffee beans',NULL,'beans, decaf',NULL,7.92),(4,'Decaf Chiapas - México','Coffee beans',NULL,'beans,decaf',NULL,7.95),(5,'Los Montres - Brazil','Coffee beans',NULL,'beans',NULL,8.47),(6,'Huila - Colombia','Coffee beans',NULL,'beans,decaf',NULL,8.69),(7,'Baho - Ruanda','Coffee beans',NULL,'beans',NULL,8.47),(8,'FEMALE PRODUCERS, HUEHUETENANGO - GUATEMALA','Coffee beans',NULL,'beans',NULL,8.95),(9,'NAZARETH´S FORMULA II - CARMO DE MINAS, BRAZIL','Coffee beans',NULL,'beans',NULL,9),(10,'CACAO BOMB - BRAZIL','Coffee beans',NULL,'beans,decaf',NULL,9.9),(11,'KETIARA WOMEN\'S COOPERATIVE - SUMATRA','Coffee beans',NULL,'beans,decaf',NULL,8.95),(12,'VALLE DEL MANTARO - PERU','Coffee beans',NULL,'beans',NULL,9.9),(13,'YELLOW CATURRA - COLOMBIA','Coffee beans',NULL,'beans,decaf',NULL,9.9),(14,'ZANCADA - BRAZIL','Coffee beans',NULL,'beans,decaf',NULL,9.9),(15,'SAN JOSÉ, INZA - COLOMBIA','Coffee beans',NULL,'beans',NULL,9.95),(16,'Espresso Machine','High-quality Espresso Maker',NULL,'espresso,machine',NULL,299.99),(17,'Coffee Grinder','Electric Coffee Grinder',NULL,'grinder,machine',NULL,49.99),(18,'French Press','Stainless Steel French Press',NULL,'french-press,machine',NULL,29.95),(19,'Moka Pot','Traditional Moka Pot',NULL,'moka-pot,machine',NULL,19.99),(20,'Pour-Over Set','Pour-Over Coffee Maker Set',NULL,'pour-over,machine',NULL,34.99),(21,'Aeropress','Portable Coffee Maker',NULL,'aeropress,machine',NULL,29.99),(22,'Cold Brew Maker','Glass Cold Brew Coffee Maker',NULL,'cold-brew,machine',NULL,39.99),(23,'Coffee Roaster','Home Coffee Roasting Machine',NULL,'roaster,machine',NULL,159.99),(24,'Coffee Scale','Digital Coffee Scale',NULL,'scale,accessory',NULL,24.99),(25,'Electric Kettle','Variable Temperature Electric Kettle',NULL,'kettle,accessory',NULL,49.99),(26,'Espresso Machine - Premium','Premium Stainless Steel Espresso Maker with Milk Frother',NULL,'espresso,machine,premium,stainless-steel,milk-frother',NULL,399.99),(27,'Espresso Machine - Compact','Compact Espresso Maker for Home Use',NULL,'espresso,machine,compact,home-use',NULL,279.99),(28,'Espresso Machine - Professional','Commercial Grade Espresso Machine with Dual Boiler',NULL,'espresso,machine,professional,dual-boiler',NULL,1499.99),(29,'Coffee Grinder - Electric','Electric Burr Grinder for Consistent Grind Size',NULL,'grinder,machine,electric,burr-grinder',NULL,89.99),(30,'Coffee Grinder - Manual','Hand Crank Coffee Grinder with Adjustable Settings',NULL,'grinder,machine,manual,adjustable',NULL,49.99),(31,'French Press - Stainless Steel','Double-Walled Stainless Steel French Press for Heat Retention',NULL,'french-press,machine,stainless-steel,double-walled',NULL,49.95),(32,'French Press - Glass','Classic Glass French Press with Bamboo Lid',NULL,'french-press,machine,glass,bamboo-lid',NULL,34.99),(33,'Moka Pot - Traditional','Traditional Aluminum Moka Pot for Authentic Italian Coffee',NULL,'moka-pot,machine,traditional,aluminum,italian-coffee',NULL,24.99),(34,'Moka Pot - Modern','Modern Design Stainless Steel Moka Pot for Stovetop Use',NULL,'moka-pot,machine,modern,stainless-steel,stovetop',NULL,34.99),(35,'Pour-Over Set - Starter Kit','Complete Ceramic Pour-Over Set with Dripper and Filters',NULL,'pour-over,machine,starter-kit,ceramic,filters',NULL,39.99),(36,'Pour-Over Set - Glass','Glass Pour-Over Set with Wooden Collar and Server',NULL,'pour-over,machine,glass,wooden-collar,server',NULL,29.99),(37,'Aeropress - Travel','Compact and Travel-Friendly Aeropress Kit for On-the-Go Brewing',NULL,'aeropress,machine,travel,portable',NULL,34.99),(38,'Aeropress - Starter Pack','Aeropress Starter Pack with Filters and Accessories',NULL,'aeropress,machine,starter-pack,filters,accessories',NULL,39.99),(39,'Cold Brew Maker - Large Capacity','Large Glass Cold Brew Maker with Stainless Steel Filter',NULL,'cold-brew,machine,glass,large-capacity,stainless-steel-filter',NULL,49.99),(40,'Cold Brew Maker - Portable','Compact Portable Cold Brew Maker for Outdoor Use',NULL,'cold-brew,machine,portable,outdoor',NULL,29.99),(41,'Coffee Roaster - Home Use','Electric Home Coffee Roaster with Roast Profile Settings',NULL,'roaster,machine,home-use,electric,roast-profile',NULL,199.99),(42,'Coffee Roaster - Professional','Commercial Coffee Roaster with Advanced Temperature Control',NULL,'roaster,machine,professional,commercial,temperature-control',NULL,999.99),(43,'Coffee Scale - Precision','Digital Coffee Scale with Precision Measurement and Timer',NULL,'scale,accessory,digital,precision-measurement,timer',NULL,29.99),(44,'Coffee Scale - Compact','Compact Manual Coffee Scale for Accurate Brewing',NULL,'scale,accessory,manual,compact,accurate-brewing',NULL,19.99),(45,'Electric Kettle - Variable Temperature','Stainless Steel Electric Kettle with Variable Temperature Settings',NULL,'kettle,accessory,variable-temperature,stainless-steel',NULL,69.99),(46,'Electric Kettle - Basic','Basic Plastic Electric Kettle for Everyday Use',NULL,'kettle,accessory,basic,plastic',NULL,24.99),(47,'Vintage Espresso Machine','Refurbished Vintage Espresso Machine with Brass Accents',NULL,'espresso,machine,vintage,refurbished,brass',NULL,499.99),(48,'Handcrafted Espresso Cups Set','Handmade Ceramic Espresso Cups Set of 2 with Artistic Designs',NULL,'espresso,cups,handcrafted,ceramic,artistic',NULL,59.99),(49,'Organic Espresso Beans','Small-Batch Organic Arabica Espresso Beans (1 lb)',NULL,'espresso,beans,organic,small-batch,arabica,decaf',NULL,19.99),(50,'Artisanal Espresso Tamper','Handcrafted Wooden Espresso Tamper with Custom Engraving',NULL,'espresso,tamper,artisanal,wooden,engraved',NULL,39.99),(51,'Vintage Espresso Spoon Set','Set of 4 Vintage Silver Espresso Spoons with Unique Patterns',NULL,'espresso,spoons,vintage,silver,unique-patterns',NULL,29.95),(52,'Retro Espresso Grinder','Retro-Styled Manual Espresso Grinder with Adjustable Ceramic Burrs',NULL,'espresso,grinder,retro,manual,ceramic-burrs',NULL,79.99),(53,'Hipster Espresso Kit','All-in-One Espresso Kit with Handmade Glass Cups, Grinder, and Beans',NULL,'espresso,kit,hipster,handmade,glass,grinder',NULL,129.99),(54,'Artistic Espresso Machine','Artisanal Espresso Maker with Limited Edition Painted Exterior',NULL,'espresso,machine,artistic,limited-edition,painted',NULL,699.99),(55,'Vintage Espresso Tamping Mat','Vintage-Inspired Espresso Tamping Mat with Leather Finish',NULL,'espresso,tamping-mat,vintage,leather',NULL,49.99),(56,'Handcrafted Espresso Pot','Handmade Copper Espresso Pot with Floral Engravings',NULL,'espresso,pot,handcrafted,copper,floral-engravings',NULL,149.99),(57,'Decaf Espresso Beans','Decaffeinated Espresso Beans',NULL,'beans,espresso,decaf',NULL,10.99),(58,'Decaf Ground Coffee','Decaffeinated Ground Coffee',NULL,'ground-coffee,decaf',NULL,8.99),(59,'Decaf Espresso Capsules','Decaffeinated Espresso Capsules - Pack of 20',NULL,'espresso,capsules,decaf',NULL,12.99),(60,'Decaf Single-Origin Beans','Decaffeinated Single-Origin Coffee Beans',NULL,'beans,single-origin,decaf',NULL,11.99),(61,'Decaf Cold Brew Concentrate','Decaffeinated Cold Brew Concentrate',NULL,'cold-brew,concentrate,decaf',NULL,14.99),(62,'Premium Ground Coffee','Premium Blend Ground Coffee',NULL,'ground-coffee,premium',NULL,9.99),(63,'Espresso Variety Pack Capsules','Variety Pack Espresso Capsules - Pack of 40',NULL,'espresso,capsules,variety-pack',NULL,18.99),(64,'Organic Instant Coffee','Organic Instant Coffee Powder - 200g',NULL,'instant-coffee,organic',NULL,7.49),(65,'Dark Roast Espresso Beans','Dark Roast Espresso Beans',NULL,'beans,espresso,dark-roast',NULL,12.99),(66,'Caramel Flavored Ground Coffee','Caramel Flavored Ground Coffee',NULL,'ground-coffee,flavored,caramel',NULL,11.49),(67,'Espresso Pods Sampler','Sampler Pack of Espresso Pods - Pack of 30',NULL,'espresso,pods,sampler',NULL,16.99),(68,'Cold Brew Maker Kit','Cold Brew Maker Kit with Accessories',NULL,'cold-brew,kit,accessories',NULL,29.99),(69,'Mild Roast Decaf Beans','Mild Roast Decaffeinated Coffee Beans',NULL,'beans,mild-roast,decaf',NULL,11.99),(70,'Vanilla Flavored Ground Coffee','Vanilla Flavored Ground Coffee',NULL,'ground-coffee,flavored,vanilla',NULL,10.99),(71,'Espresso Shot Glasses Set','Set of 4 Espresso Shot Glasses',NULL,'espresso,accessories,glasses',NULL,14.99),(72,'Iced Coffee Blend Beans','Blend for Iced Coffee Beans',NULL,'beans,iced-coffee,blend',NULL,13.49),(73,'Espresso Machine Cleaning Kit','Cleaning Kit for Espresso Machines',NULL,'espresso,cleaning,accessories',NULL,19.99),(74,'Hazelnut Flavored Ground Coffee','Hazelnut Flavored Ground Coffee',NULL,'ground-coffee,flavored,hazelnut',NULL,11.49),(75,'Decaf Mocha Espresso Beans','Decaffeinated Mocha Espresso Beans',NULL,'beans,espresso,decaf,mocha',NULL,12.99),(76,'Portable Espresso Maker','Portable Handheld Espresso Maker',NULL,'espresso,portable,maker',NULL,39.99),(77,'Espresso Machine Descaler','Descaler Solution for Espresso Machines',NULL,'espresso,descaler,accessories',NULL,8.99),(78,'Cinnamon Flavored Ground Coffee','Cinnamon Flavored Ground Coffee',NULL,'ground-coffee,flavored,cinnamon',NULL,10.99),(79,'Decaf Vanilla Latte Pods','Decaffeinated Vanilla Latte Pods - Pack of 20',NULL,'espresso,pods,decaf,vanilla-latte',NULL,14.99),(80,'French Press Coffee Maker','Stainless Steel French Press Coffee Maker',NULL,'french-press,maker',NULL,24.99),(81,'Decaf Cappuccino Capsules','Decaffeinated Cappuccino Capsules - Pack of 30',NULL,'espresso,pods,decaf,cappuccino',NULL,17.99),(82,'Espresso Cup and Saucer Set','Set of 2 Espresso Cups with Saucers',NULL,'espresso,cups,saucers',NULL,12.99),(83,'Decaf Caramel Macchiato Pods','Decaffeinated Caramel Macchiato Pods - Pack of 20',NULL,'espresso,pods,decaf,caramel-macchiato',NULL,14.99),(84,'Pour-Over Coffee Dripper','Ceramic Pour-Over Coffee Dripper',NULL,'pour-over,dripper',NULL,18.99),(85,'Decaf Peppermint Mocha Beans','Decaffeinated Peppermint Mocha Beans',NULL,'beans,decaf,peppermint-mocha',NULL,13.99),(86,'Espresso Machine Portafilter','Replacement Portafilter for Espresso Machines',NULL,'espresso,portafilter,replacement',NULL,24.99),(87,'Decaf Irish Cream Ground Coffee','Decaffeinated Irish Cream Ground Coffee',NULL,'ground-coffee,decaf,irish-cream',NULL,11.49),(88,'Cold Brew Coffee Tumbler','Insulated Cold Brew Coffee Tumbler',NULL,'cold-brew,tumbler,insulated',NULL,22.99),(89,'Decaf Pumpkin Spice Pods','Decaffeinated Pumpkin Spice Pods - Pack of 20',NULL,'espresso,pods,decaf,pumpkin-spice',NULL,14.99),(90,'Electric Milk Frother','Electric Milk Frother for Coffee and Espresso',NULL,'frother,electric,milk',NULL,34.99),(91,'Decaf Coconut Mocha Beans','Decaffeinated Coconut Mocha Beans',NULL,'beans,decaf,coconut-mocha',NULL,13.99),(92,'Espresso Knock Box','Espresso Grounds Knock Box',NULL,'espresso,knock-box,grounds',NULL,29.99),(93,'Decaf Almond Amaretto Pods','Decaffeinated Almond Amaretto Pods - Pack of 20',NULL,'espresso,pods,decaf,almond-amaretto',NULL,14.99),(94,'Manual Coffee Grinder','Manual Hand Crank Coffee Grinder',NULL,'grinder,manual,hand-crank',NULL,19);
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

-- Dump completed on 2023-12-11 12:36:22
