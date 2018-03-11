# Host: localhost  (Version: 5.5.53)
# Date: 2018-03-11 18:05:51
# Generator: MySQL-Front 5.3  (Build 4.234)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "nodejs"
#

DROP TABLE IF EXISTS `nodejs`;
CREATE TABLE `nodejs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

#
# Data for table "nodejs"
#

INSERT INTO `nodejs` VALUES (1,'zhangsan','男',18),(2,'zhangsan','男',12),(3,'zhangsan','男',15),(4,'李四','男',45),(5,'小红','女',18),(9,'asdf','女',12),(10,'asdf','男',0),(11,'adf','女',55),(12,'qqq','男',12),(14,'lisi','男',30);
