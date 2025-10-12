/*
 Navicat Premium Dump SQL

 Source Server         : 本地连接
 Source Server Type    : MySQL
 Source Server Version : 80406 (8.4.6)
 Source Host           : localhost:3306
 Source Schema         : gofly

 Target Server Type    : MySQL
 Target Server Version : 80406 (8.4.6)
 File Encoding         : 65001

 Date: 12/10/2025 18:16:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for about
-- ----------------------------
DROP TABLE IF EXISTS `about`;
CREATE TABLE `about`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title_cn` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `title_en` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `keywords_cn` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `keywords_en` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `desc_cn` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `desc_en` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `css_js` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `html_cn` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `html_en` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `page` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `page`(`page` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of about
-- ----------------------------
INSERT INTO `about` VALUES (1, '微任务平台客服系统管理后台', ' Live Chat', ' Live Chat', ' Live Chat', '微任务平台客服系统管理后台', 'live chat', '<style>body{color: #333;padding-left: 40px;}h1{font-size: 6em;}h2{font-size: 3em;font-weight: normal;}a{color: #333;}</style>', '<script src=\"/assets/js/gofly-front.js?v=1\"></script><script>\n    GOFLY.init({\n        GOFLY_URL:\"\",\n        GOFLY_KEFU_ID: \"kefu2\",\n        GOFLY_BTN_TEXT: \"在线客服!\",\n        GOFLY_LANG:\"cn\",\n    })\n</script>\n <h1>:)</h1><h2>你好，欢迎使用微任务平台客服系统管理后台 !</h2><h3><a href=\"/login\">Administrator</a>&nbsp;<a href=\"/index_en\">English</a>&nbsp;<a href=\"/index_cn\">中文</a></h3>', '<script src=\"/assets/js/gofly-front.js?v=1\"></script><script>\n    GOFLY.init({\n        GOFLY_URL:\"\",\n        GOFLY_KEFU_ID: \"kefu2\",\n        GOFLY_BTN_TEXT: \"LIVE CHAT!\",\n        GOFLY_LANG:\"en\",\n    })\n</script>\n <h1>:)</h1><h2>HELLO Welcome LIVE CHAT !</h2><h3><a href=\"/login\">Administrator</a>&nbsp;<a href=\"/index_en\">English</a>&nbsp;<a href=\"/index_cn\">中文</a></h3>', 'index');

-- ----------------------------
-- Table structure for config
-- ----------------------------
DROP TABLE IF EXISTS `config`;
CREATE TABLE `config`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `conf_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `conf_key` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `conf_value` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `conf_key`(`conf_key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of config
-- ----------------------------
INSERT INTO `config` VALUES (1, '是否开启Server酱微信提醒', 'NoticeServerJiang', 'false');
INSERT INTO `config` VALUES (2, 'Server酱API', 'ServerJiangAPI', '');
INSERT INTO `config` VALUES (3, '微信小程序Token', 'WeixinToken', '');
INSERT INTO `config` VALUES (4, '当前小程序审核状态', 'MiniAppAudit', 'no');
INSERT INTO `config` VALUES (5, '是否允许上传附件', 'SendAttachment', 'true');
INSERT INTO `config` VALUES (6, '发送通知邮件(SMTP地址)', 'NoticeEmailSmtp', '');
INSERT INTO `config` VALUES (7, '发送通知邮件(邮箱)', 'NoticeEmailAddress', '');
INSERT INTO `config` VALUES (8, '发送通知邮件(密码)', 'NoticeEmailPassword', '');
INSERT INTO `config` VALUES (9, 'App个推(Token)', 'GetuiToken', '');
INSERT INTO `config` VALUES (10, 'App个推(AppID)', 'GetuiAppID', '');
INSERT INTO `config` VALUES (11, 'App个推(AppKey)', 'GetuiAppKey', '');
INSERT INTO `config` VALUES (12, 'App个推(AppSecret)', 'GetuiAppSecret', '');
INSERT INTO `config` VALUES (13, 'App个推(AppMasterSecret)', 'GetuiMasterSecret', '');

-- ----------------------------
-- Table structure for ipblack
-- ----------------------------
DROP TABLE IF EXISTS `ipblack`;
CREATE TABLE `ipblack`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kefu_id` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ip`(`ip` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ipblack
-- ----------------------------

-- ----------------------------
-- Table structure for land_page
-- ----------------------------
DROP TABLE IF EXISTS `land_page`;
CREATE TABLE `land_page`  (
  `id` int NOT NULL,
  `title` varchar(125) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `language` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `page_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of land_page
-- ----------------------------

-- ----------------------------
-- Table structure for language
-- ----------------------------
DROP TABLE IF EXISTS `language`;
CREATE TABLE `language`  (
  `id` int NOT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `short_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT ''
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of language
-- ----------------------------
INSERT INTO `language` VALUES (1, '中文简体', 'zh-cn');
INSERT INTO `language` VALUES (2, '正體中文', 'zh-tw');
INSERT INTO `language` VALUES (3, 'English', 'en_us');
INSERT INTO `language` VALUES (4, '日本語', 'ja_jp');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `kefu_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `visitor_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `content` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `mes_type` enum('kefu','visitor') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'visitor',
  `status` enum('read','unread') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'unread',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `kefu_id`(`kefu_id` ASC) USING BTREE,
  INDEX `visitor_id`(`visitor_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES (1, 'kefu2', '43242248-9a47-4117-ba6d-6134e5e37cc8', '111', '2025-10-12 12:22:39', '2025-10-12 14:43:26', NULL, 'visitor', 'read');
INSERT INTO `message` VALUES (2, 'kefu2', '43242248-9a47-4117-ba6d-6134e5e37cc8', '你好', '2025-10-12 12:23:00', '2025-10-12 14:43:26', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (3, 'kefu2', '43242248-9a47-4117-ba6d-6134e5e37cc8', '在这里[官网]link[https://gofly.sopans.com]!', '2025-10-12 12:23:11', '2025-10-12 14:43:26', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (4, 'kefu2', '43242248-9a47-4117-ba6d-6134e5e37cc8', '测速', '2025-10-12 12:23:33', '2025-10-12 14:43:26', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (5, 'kefu2', '43242248-9a47-4117-ba6d-6134e5e37cc8', '测试', '2025-10-12 12:23:36', '2025-10-12 14:43:26', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (6, 'kefu2', '43242248-9a47-4117-ba6d-6134e5e37cc8', '测试快捷回复', '2025-10-12 12:23:42', '2025-10-12 14:43:26', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (7, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '你是谁', '2025-10-12 16:01:18', '2025-10-12 17:26:14', NULL, 'visitor', 'read');
INSERT INTO `message` VALUES (8, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '我暂时离线，请留言', '2025-10-12 16:01:19', '2025-10-12 17:26:14', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (9, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '你是谁', '2025-10-12 16:03:51', '2025-10-12 17:26:14', NULL, 'visitor', 'read');
INSERT INTO `message` VALUES (10, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '我暂时离线，请留言', '2025-10-12 16:03:52', '2025-10-12 17:26:14', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (11, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '你是谁', '2025-10-12 17:19:45', '2025-10-12 17:26:14', NULL, 'visitor', 'read');
INSERT INTO `message` VALUES (12, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '我暂时离线，请留言', '2025-10-12 17:19:46', '2025-10-12 17:26:14', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (13, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '你是谁', '2025-10-12 17:20:03', '2025-10-12 17:26:14', NULL, 'visitor', 'read');
INSERT INTO `message` VALUES (14, 'kefu2', 'a3fb3f01-d6ff-4cc0-b903-1c6573d936c8', '你好', '2025-10-12 17:20:20', '2025-10-12 17:20:20', NULL, 'visitor', 'unread');
INSERT INTO `message` VALUES (15, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '你好', '2025-10-12 17:22:05', '2025-10-12 17:26:14', NULL, 'visitor', 'read');
INSERT INTO `message` VALUES (16, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '我暂时离线，请留言', '2025-10-12 17:22:05', '2025-10-12 17:26:14', NULL, 'kefu', 'read');
INSERT INTO `message` VALUES (17, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '1', '2025-10-12 17:26:16', '2025-10-12 17:26:16', NULL, 'kefu', 'unread');
INSERT INTO `message` VALUES (18, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '你是谁', '2025-10-12 17:26:22', '2025-10-12 17:26:22', NULL, 'visitor', 'unread');
INSERT INTO `message` VALUES (19, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', 'face[微笑]', '2025-10-12 17:26:36', '2025-10-12 17:26:36', NULL, 'kefu', 'unread');
INSERT INTO `message` VALUES (20, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '这是用户端', '2025-10-12 17:26:43', '2025-10-12 17:26:43', NULL, 'visitor', 'unread');
INSERT INTO `message` VALUES (21, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '这是客服管理端', '2025-10-12 17:26:51', '2025-10-12 17:26:51', NULL, 'kefu', 'unread');
INSERT INTO `message` VALUES (22, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '1', '2025-10-12 17:42:41', '2025-10-12 17:42:41', NULL, 'visitor', 'unread');
INSERT INTO `message` VALUES (23, 'kefu2', '2c94f1cf-60cf-4896-baf9-050b547c6ee3', '我暂时离线，请留言', '2025-10-12 17:42:41', '2025-10-12 17:42:41', NULL, 'kefu', 'unread');

-- ----------------------------
-- Table structure for reply_group
-- ----------------------------
DROP TABLE IF EXISTS `reply_group`;
CREATE TABLE `reply_group`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reply_group
-- ----------------------------
INSERT INTO `reply_group` VALUES (1, '常见问题', 'kefu2');

-- ----------------------------
-- Table structure for reply_item
-- ----------------------------
DROP TABLE IF EXISTS `reply_item`;
CREATE TABLE `reply_item`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `group_id` int NOT NULL DEFAULT 0,
  `user_id` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `item_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `group_id`(`group_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reply_item
-- ----------------------------
INSERT INTO `reply_item` VALUES (1, '在这里[官网]link[https://gofly.sopans.com]!', 1, 'kefu2', '官方地址在哪?');
INSERT INTO `reply_item` VALUES (2, '测试快捷回复', 1, 'kefu2', '测试');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `method` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `path` varchar(2048) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, '普通客服', 'GET', 'GET:/kefuinfo,GET:/kefulist,GET:/roles,POST:/notice_save,POST:/notice');
INSERT INTO `role` VALUES (2, '管理员', '*', '*');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `password` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `nickname` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `avator` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'kefu2', '202cb962ac59075b964b07152d234b70', '小白菜', '2020-06-27 19:32:41', '2025-10-12 14:45:24', NULL, '/static/upload/2025October/8fbeae8482c821cc66e946b03ec9c8c8.jpg');
INSERT INTO `user` VALUES (2, 'kefu3', '202cb962ac59075b964b07152d234b70', '中白菜', '2020-07-02 14:36:46', '2020-07-05 08:46:57', NULL, '/static/images/11.jpg');
INSERT INTO `user` VALUES (3, 'kefu', '202cb962ac59075b964b07152d234b70', '测试客服', '2025-10-12 11:56:59', '2025-10-12 11:56:59', NULL, '/static/images/2.jpg');
INSERT INTO `user` VALUES (4, 'admin', '21232f297a57a5a743894a0e4a801fc3', '管理员', '2025-10-12 07:50:15', '2025-10-12 07:50:15', NULL, '/static/upload/2025October/8fbeae8482c821cc66e946b03ec9c8c8.jpg');

-- ----------------------------
-- Table structure for user_client
-- ----------------------------
DROP TABLE IF EXISTS `user_client`;
CREATE TABLE `user_client`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `kefu` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `client_id` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_user`(`kefu` ASC, `client_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_client
-- ----------------------------

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL DEFAULT 0,
  `role_id` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES (1, 1, 2);
INSERT INTO `user_role` VALUES (2, 2, 2);
INSERT INTO `user_role` VALUES (3, 3, 1);
INSERT INTO `user_role` VALUES (4, 4, 2);

-- ----------------------------
-- Table structure for visitor
-- ----------------------------
DROP TABLE IF EXISTS `visitor`;
CREATE TABLE `visitor`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `avator` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `source_ip` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `to_id` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `visitor_id` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `status` tinyint NOT NULL DEFAULT 0,
  `refer` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `city` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `client_ip` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `extra` varchar(2048) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `visitor_id`(`visitor_id` ASC) USING BTREE,
  INDEX `to_id`(`to_id` ASC) USING BTREE,
  INDEX `idx_update`(`updated_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of visitor
-- ----------------------------
INSERT INTO `visitor` VALUES (1, '匿名网友', '/static/images/4.jpg', '::1', 'kefu2', '2025-10-12 12:16:58', '2025-10-12 16:08:08', NULL, 'e1e407f5-809f-475f-901c-1f69a35c75f0', 0, '微任务平台客服系统管理后台', '未识别地区', '::1', 'eyJyZWZlciI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9sb2dpbiIsImhvc3QiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvbWFpbiJ9');
INSERT INTO `visitor` VALUES (2, '匿名网友', '/static/images/10.jpg', '::1', 'kefu2', '2025-10-12 12:22:36', '2025-10-12 12:32:39', NULL, '43242248-9a47-4117-ba6d-6134e5e37cc8', 0, '客服会话演示', '未识别地区', '::1', 'eyJyZWZlciI6IuaXoCIsImhvc3QiOiJmaWxlOi8vL0M6L1VzZXJzL0FkbWluaXN0cmF0b3IvRGVza3RvcC9nb2ZseWxpdmVjaGF0L2NoYXQtZGVtby5odG1sIn0');
INSERT INTO `visitor` VALUES (3, '匿名网友', '/static/images/1.jpg', '::1', 'kefu2', '2025-10-12 12:24:19', '2025-10-12 17:53:05', NULL, '2c94f1cf-60cf-4896-baf9-050b547c6ee3', 0, '微任务平台客服系统管理后台', '未识别地区', '::1', 'eyJyZWZlciI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9sb2dpbj9pZGVfd2Vidmlld19yZXF1ZXN0X3RpbWU9MTc2MDI2MTkxNzc5OCIsImhvc3QiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvbWFpbiJ9');
INSERT INTO `visitor` VALUES (4, '匿名网友', '/static/images/12.jpg', '::1', 'kefu2', '2025-10-12 17:19:38', '2025-10-12 17:22:16', NULL, 'a3fb3f01-d6ff-4cc0-b903-1c6573d936c8', 0, '微任务平台客服系统管理后台', '未识别地区', '::1', 'eyJyZWZlciI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MS9sb2dpbiIsImhvc3QiOiJodHRwOi8vbG9jYWxob3N0OjgwODEvbWFpbiJ9');

-- ----------------------------
-- Table structure for welcome
-- ----------------------------
DROP TABLE IF EXISTS `welcome`;
CREATE TABLE `welcome`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `keyword` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `content` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `is_default` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `keyword`(`keyword` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of welcome
-- ----------------------------
INSERT INTO `welcome` VALUES (1, 'kefu2', 'offline', '我暂时离线，请留言', 1, '2020-08-24 02:57:49');
INSERT INTO `welcome` VALUES (3, 'kefu2', 'welcome', '请输入您的问题。', 0, '2025-10-12 14:44:45');

SET FOREIGN_KEY_CHECKS = 1;
