CREATE DATABASE IF NOT EXISTS strafes_auth_users
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS strafes_globals
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'epicstrafe'@'%' IDENTIFIED BY 'epicstrafe_dev';
GRANT ALL PRIVILEGES ON strafes_auth_users.* TO 'epicstrafe'@'%';
GRANT ALL PRIVILEGES ON strafes_globals.* TO 'epicstrafe'@'%';
FLUSH PRIVILEGES;
