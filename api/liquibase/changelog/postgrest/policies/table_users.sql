--liquibase formatted sql

--changeset andras:select-policy-users-table runOnChange:true
GRANT SELECT (sub, name, image) ON TABLE api.users TO web_anon;
GRANT SELECT (sub, name, image) ON TABLE api.users TO web_user;