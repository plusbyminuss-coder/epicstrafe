USE strafes_globals;

-- Core schema used by fiveman1/strafes-globals-db.
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT NOT NULL,
    username VARCHAR(64) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS maps (
    map_id BIGINT NOT NULL,
    name NVARCHAR(128) NOT NULL,
    creator NVARCHAR(256) NOT NULL,
    game SMALLINT NOT NULL,
    date DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    submitter BIGINT NOT NULL,
    small_thumb VARCHAR(256),
    large_thumb VARCHAR(256),
    asset_version BIGINT NOT NULL,
    load_count INT NOT NULL,
    modes SMALLINT NOT NULL,
    PRIMARY KEY (map_id)
);

CREATE TABLE IF NOT EXISTS globals (
    time_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    map_id BIGINT NOT NULL,
    game SMALLINT NOT NULL,
    style SMALLINT NOT NULL,
    course SMALLINT NOT NULL,
    date DATETIME NOT NULL,
    time INT NOT NULL,
    has_bot BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (time_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (map_id) REFERENCES maps(map_id),
    UNIQUE INDEX map_index (map_id, game, style, course),
    INDEX user_index (user_id)
);

CREATE TABLE IF NOT EXISTS tier_votes (
    id INT NOT NULL AUTO_INCREMENT,
    tier TINYINT UNSIGNED NOT NULL,
    map_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    weight TINYINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX map_voter_index (map_id, user_id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS replay_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    time_id BIGINT NOT NULL,
    user_id BIGINT,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARBINARY(16) NOT NULL,
    INDEX view_log_idx (time_id, viewed_at DESC, ip_address),
    INDEX recent_user_views_idx (user_id, viewed_at DESC)
);
