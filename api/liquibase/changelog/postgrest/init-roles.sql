--liquibase formatted sql

--changeset andras:postgrest-add-roles
/*
 * The authenticator role is used by the PostgREST service to connect to the database.
 * It is granted the USAGE privilege on the api schema.
 * The password for this role should be changed in production.
 */
CREATE ROLE authenticator LOGIN PASSWORD 'postgrest' NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER;
GRANT USAGE ON SCHEMA api TO authenticator;

CREATE ROLE web_anon NOLOGIN;
GRANT web_anon TO authenticator;
GRANT USAGE ON SCHEMA api TO web_anon;

/*
 * Web Users Sharing Role
 * https://postgrest.org/en/v12/explanations/db_authz.html#web-users-sharing-role
 */
CREATE ROLE web_user NOLOGIN;
GRANT web_user TO authenticator;
GRANT USAGE ON SCHEMA api TO web_user;