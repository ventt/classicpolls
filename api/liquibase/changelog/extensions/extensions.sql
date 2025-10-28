--liquibase formatted sql

--changeset andras:add-uuid-extension runOnChange:true
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";