--liquibase formatted sql

--changeset andras:add-users-table
CREATE TABLE api.users
(
    sub        VARCHAR(32) PRIMARY KEY,
    name       VARCHAR(32)                                        NOT NULL,
    image      VARCHAR(2083)                                      NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    enabled    BOOLEAN                  DEFAULT TRUE              NOT NULL
);

--changeset andras:add-categories-table
CREATE TABLE api.category
(
    name VARCHAR(50) PRIMARY KEY
);

--changeset andras:add-poll-table
CREATE TABLE api.poll
(
    id            uuid PRIMARY KEY                                         DEFAULT uuid_generate_v4(),
    user_sub      VARCHAR(32) REFERENCES api.users (sub) ON DELETE CASCADE DEFAULT jwt_sub(),
    title         VARCHAR(75)                                                                        NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP WITH TIME ZONE                                 DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category_name VARCHAR(50) REFERENCES api.category (name) ON DELETE RESTRICT
);

--changeset andras:add-vote-table
CREATE TABLE api.vote
(
    user_sub   VARCHAR(32) REFERENCES api.users (sub) ON DELETE CASCADE DEFAULT jwt_sub(),
    poll_id    UUID REFERENCES api.poll (id) ON DELETE CASCADE          DEFAULT uuid_generate_v4(),
    choice     BOOLEAN                                                                            NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE                                 DEFAULT CURRENT_TIMESTAMP NOT NULL,

    PRIMARY KEY (user_sub, poll_id)
);


--changeset andras:add-poll-report-table
CREATE TABLE api.poll_report
(
    user_sub   VARCHAR(32) REFERENCES api.users (sub) ON DELETE CASCADE DEFAULT jwt_sub(),
    poll_id    UUID REFERENCES api.poll (id) ON DELETE CASCADE,
    reason     VARCHAR(255)                                                                       NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE                                 DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed   BOOLEAN                                                  DEFAULT FALSE             NOT NULL,

    PRIMARY KEY (user_sub, poll_id)
);