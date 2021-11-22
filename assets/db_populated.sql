BEGIN TRANSACTION;
DROP TABLE IF EXISTS "User";
CREATE TABLE IF NOT EXISTS "User" (
	"id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"role"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"surname"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"phone"	TEXT NOT NULL,
	PRIMARY KEY("id")
);
DROP TABLE IF EXISTS "Farmer";
CREATE TABLE IF NOT EXISTS "Farmer" (
	"ref_user"	INTEGER NOT NULL,
	"address"	TEXT NOT NULL,
	"farm_name"	TEXT NOT NULL,
	FOREIGN KEY("ref_user") REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("ref_user")
);
DROP TABLE IF EXISTS "Basket";
CREATE TABLE IF NOT EXISTS "Basket" (
	"ref_client"	INTEGER NOT NULL,
	"ref_product"	INTEGER NOT NULL,
	"quantity"	REAL NOT NULL,
	FOREIGN KEY("ref_product") REFERENCES "Product"("id") ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY("ref_client") REFERENCES "Client"("ref_user") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("ref_client","ref_product")
);
DROP TABLE IF EXISTS "Prod_descriptor";
CREATE TABLE IF NOT EXISTS "Prod_descriptor" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	"category"	TEXT NOT NULL,
	"unit"	TEXT NOT NULL,
	"ref_farmer"	INTEGER NOT NULL,
	FOREIGN KEY("ref_farmer") REFERENCES "Farmer"("ref_user") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("id")
);
DROP TABLE IF EXISTS "Product";
CREATE TABLE IF NOT EXISTS "Product" (
	"ref_prod_descriptor"	INTEGER NOT NULL,
	"quantity"	REAL NOT NULL,
	"price"	REAL NOT NULL,
	"id"	INTEGER NOT NULL,
	"date"	TEXT NOT NULL,
	FOREIGN KEY("ref_prod_descriptor") REFERENCES "Prod_descriptor"("id") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "Client";
CREATE TABLE IF NOT EXISTS "Client" (
	"address"	TEXT NOT NULL,
	"balance"	REAL NOT NULL,
	"ref_user"	INTEGER NOT NULL,
	FOREIGN KEY("ref_user") REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("ref_user")
);
DROP TABLE IF EXISTS "Product_Request";
CREATE TABLE IF NOT EXISTS "Product_Request" (
	"ref_request"	INTEGER NOT NULL,
	"ref_product"	INTEGER NOT NULL,
	"quantity"	REAL NOT NULL,
	FOREIGN KEY("ref_product") REFERENCES "Product"("id") ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY("ref_request") REFERENCES "Request"("id") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("ref_request","ref_product")
);
DROP TABLE IF EXISTS "Request";
CREATE TABLE IF NOT EXISTS "Request" (
	"id"	INTEGER NOT NULL,
	"ref_client"	INTEGER NOT NULL,
	"status"	TEXT NOT NULL,
	"date"	TEXT NOT NULL,
	FOREIGN KEY("ref_client") REFERENCES "Client"("ref_user") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "User" ("id","username","password","role","name","surname","email","phone") VALUES (1,'pentolino','$2b$10$ttgWA6VKaIGnw.nR/Zmr.eFfGUTT70KM5ccLHtMT8ypvpBmiM9J9S','shop_employee','pentolino','de'' pentolini','giorgiomastrota@mail.com','3334445555'),
 (2,'teiera','$2b$10$Kly7Jc4NXQV.9dKrC8BUVegmEuscBejLjKl6Ly3Q9DcKuP/r3U6v6','client','Teiera','McTeapot','s287037@studenti.polito.it','3234558732'),
 (3,'nonnaPapera','$2b$10$/plohJw/N06P0BEfTsj8XeiRb9qzYDVlglK1Gi9uFrfvweTHZN/Fe','farmer','Elvira','Coot','elvira.coot43@mail.dck','3221115465'),
 (4,'iosonoironman','$2b$10$7aoRwiHpc/1UVc0xNGLuAuAo8Szna4PVClcT1uw0T0REk8rDhzqp.','client','Tony','Stark','tony.stark@starkinc.us','1231231233'),
 (5,'mario','$2b$10$fUKuZot4T581s/lB5DXMmOQBEc3bb8XkGgZFhICghEneaZAXUOwxe','client','Mario','Mario','mariomario@mail.msh','1240973444');
INSERT INTO "Farmer" ("ref_user","address","farm_name") VALUES (3,'Via dei Paperi, 5','Fattoria di Nonna Papera');
INSERT INTO "Prod_descriptor" ("id","name","description","category","unit","ref_farmer") VALUES (1,'Lemon','Lemon','fruits and vegetables','kg',3),
 (2,'Garlic','Garlic','fruits and vegetables','kg',3),
 (3,'Onion','Onion','fruits and vegetables','kg',3),
 (4,'Pistachio','Pistachio','fruits and vegetables','kg',3),
 (5,'Potato','Potato','fruits and vegetables','kg',3),
 (6,'Tomato','Tomato','fruits and vegetables','kg',3),
 (7,'Zucchini','Zucchini','fruits and vegetables','kg',3),
 (8,'Yogurt','Yogurt','dairy product','kg',3),
 (9,'Milk','Milk','dairy product','lt',3),
 (10,'Ricotta','Ricotta','dairy product','kg',3),
 (11,'Apple','Apple','fruits and vegetables','kg',3),
 (12,'Pear','Pear','fruits and vegetables','kg',3),
 (13,'Orange','Orange','fruits and vegetables','kg',3),
 (14,'Almond','Almond','fruits and vegetables','kg',3),
 (15,'Olives','Olives','fruits and vegetables','kg',3),
 (16,'Eggplant','Eggplant','fruits and vegetables','kg',3),
 (17,'Beans','Beans','fruits and vegetables','kg',3),
 (18,'Peas','Peas','fruits and vegetables','kg',3),
 (19,'Pepper','Pepper','food_items','kg',3),
 (20,'Mozzarella','Mozzarella','dairy product','kg',3),
 (21,'Gorgonzola','Gorgonzola','dairy product','kg',3),
 (22,'Pecorino','Pecorino','dairy product','kg',3),
 (23,'Butter','Butter','dairy product','kg',3),
 (24,'Cream','Cream','dairy product','kg',3),
 (25,'Hazelnuts','Hazelnuts','fruits and vegetables','kg',3),
 (26,'Chicken','Chicken meat','meats_cold_cuts','kg',3),
 (27,'Cow','Cow meat','meats_cold_cuts','kg',3),
 (28,'Rabbit','Rabbit meat','meats_cold_cuts','kg',3),
 (29,'Ham','Ham','meats_cold_cuts','kg',3),
 (30,'Cooked ham','Cooked ham','meats_cold_cuts','kg',3),
 (31,'Salami','Salami','meats_cold_cuts','kg',3),
 (32,'Hamburger','Beef burger','meats_cold_cuts','kg',3),
 (33,'Chicken hamburger','Chicken hamburger','meats_cold_cuts','kg',3),
 (34,'Pork loin','Pork loin','meats_cold_cuts','kg',3),
 (35,'Bacon','Pork bacon','meats_cold_cuts','kg',3),
 (36,'Linguine','Fresh linguine','pasta_and_rice','kg',3),
 (37,'Basmati rice','Basmati rice','pasta_and_rice','kg',3),
 (38,'Spaghetti','Spaghetti','pasta_and_rice','kg',3),
 (39,'Jasmine rice','Jasmine rice','pasta_and_rice','kg',3),
 (40,'White rice','White rice','pasta_and_rice','kg',3),
 (41,'Rigatoni','Rigatoni','pasta_and_rice','kg',3),
 (42,'Baguette','Baguette','bread','kg',3),
 (43,'Olive bread','Olive bread','bread','kg',3),
 (44,'Whole bread','Whole bread','bread','kg',3),
 (45,'Olive oil','Olive oil','food_items','lt',3),
 (46,'Apricot jam','Apricot jam','food_items','lt',3),
 (47,'Strawberry jam','Strawberry jam','food_items','lt',3),
 (48,'Porcini mushrooms','Porcini mushrooms','food_items','kg',3),
 (49,'Taralli','Taralli biscuits','food_items','kg',3),
 (50,'Breadsticks','Breadsticks','food_items','kg',3);
INSERT INTO "Product" ("ref_prod_descriptor","quantity","price","id","date") VALUES (1,50.0,1.2,1,'2021-11-20 12:00'),
 (2,30.0,2.5,2,'2021-11-20 12:00'),
 (3,27.0,0.6,3,'2021-11-20 12:00'),
 (4,90.0,12.0,4,'2021-11-20 12:00'),
 (5,37.2,0.4,5,'2021-11-20 12:00'),
 (6,42.9,1.4,6,'2021-11-20 12:00'),
 (7,78.1,1.2,7,'2021-11-20 12:00'),
 (8,15.7,2.9,8,'2021-11-20 12:00'),
 (9,120.1,1.0,9,'2021-11-20 12:00'),
 (10,45.5,5.6,10,'2021-11-20 12:00'),
 (11,70.0,0.8,11,'2021-11-20 12:00'),
 (12,70.0,1.5,12,'2021-11-20 12:00'),
 (13,56.7,2.5,13,'2021-11-20 12:00'),
 (14,30.3,1.5,14,'2021-11-20 12:00'),
 (15,23.6,5.5,15,'2021-11-20 12:00'),
 (16,100.0,0.7,16,'2021-11-20 12:00'),
 (17,123.7,5.6,17,'2021-11-20 12:00'),
 (18,72.7,4.7,18,'2021-11-20 12:00'),
 (19,97.0,0.8,19,'2021-11-20 12:00'),
 (20,53.6,25.5,20,'2021-11-20 12:00'),
 (21,23.2,9.8,21,'2021-11-20 12:00'),
 (22,48.2,19.9,22,'2021-11-20 12:00'),
 (23,12.7,4.0,23,'2021-11-20 12:00'),
 (24,8.3,7.1,24,'2021-11-20 12:00'),
 (25,12.8,3.0,25,'2021-11-20 12:00'),
 (26,5.5,11.0,26,'2021-11-20 12:00'),
 (27,8.6,12.0,27,'2021-11-20 12:00'),
 (28,4.2,11.0,28,'2021-11-20 12:00'),
 (29,5.6,10.5,29,'2021-11-20 12:00'),
 (30,5.7,10.5,30,'2021-11-20 12:00'),
 (31,4.6,11.6,31,'2021-11-20 12:00'),
 (32,3.5,14.9,32,'2021-11-20 12:00'),
 (33,3.6,15.4,33,'2021-11-20 12:00'),
 (34,7.3,12.6,34,'2021-11-20 12:00'),
 (35,5.9,13.7,35,'2021-11-20 12:00'),
 (36,1.2,0.9,36,'2021-11-20 12:00'),
 (37,2.0,1.0,37,'2021-11-20 12:00'),
 (38,3.0,0.8,38,'2021-11-20 12:00'),
 (39,2.0,1.0,39,'2021-11-20 12:00'),
 (40,2.5,1.0,40,'2021-11-20 12:00'),
 (41,2.4,1.0,41,'2021-11-20 12:00'),
 (42,0.9,0.6,42,'2021-11-20 12:00'),
 (43,1.2,1.5,43,'2021-11-20 12:00'),
 (44,2.0,0.7,44,'2021-11-20 12:00'),
 (45,2.5,2.5,45,'2021-11-20 12:00'),
 (46,1.0,4.5,46,'2021-11-20 12:00'),
 (47,0.8,4.5,47,'2021-11-20 12:00'),
 (48,1.0,14.9,48,'2021-11-20 12:00'),
 (49,0.25,14.0,49,'2021-11-20 12:00'),
 (50,0.25,18.0,50,'2021-11-20 12:00');
INSERT INTO "Client" ("address","balance","ref_user") VALUES ('Downing Street, 10',40.0,2),
 ('Palazzo San Paolo, 42',100000.0,4),
 ('Piazza Castello, 64',4.0,5);
INSERT INTO "Product_Request" ("ref_request","ref_product","quantity") VALUES (1,1,2.0),
 (1,2,3.0),
 (2,42,0.1),
 (3,13,0.5),
 (3,4,0.5);
INSERT INTO "Request" ("id","ref_client","status","date") VALUES (1,2,'confirmed','2021-11-16 12:11'),
 (2,4,'delivered','2021-11-16 12:11'),
 (3,4,'confirmed','2021-11-17 12:11');
COMMIT;
