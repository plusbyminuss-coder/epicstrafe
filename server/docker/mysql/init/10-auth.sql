USE strafes_auth_users;

CREATE TABLE IF NOT EXISTS sessions (
    sessionHash CHAR(64) NOT NULL,
    refreshToken TEXT NOT NULL,
    accessToken TEXT NOT NULL,
    refreshExpiresAt DATETIME NOT NULL,
    accessExpiresAt DATETIME NOT NULL,
    userId BIGINT NOT NULL,
    PRIMARY KEY (sessionHash)
);

CREATE TABLE IF NOT EXISTS settings (
    userId BIGINT NOT NULL,
    theme ENUM('dark', 'light') NOT NULL,
    game SMALLINT NOT NULL,
    style SMALLINT NOT NULL,
    maxDaysRelative SMALLINT NOT NULL,
    countryCode VARCHAR(6),
    PRIMARY KEY (userId)
);
