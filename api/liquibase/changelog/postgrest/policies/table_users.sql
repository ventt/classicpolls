--liquibase formatted sql

--changeset andras:select-policy-users-table runOnChange:true
GRANT SELECT (sub, name) ON TABLE api.users TO web_anon;
GRANT SELECT (sub, name) ON TABLE api.users TO web_user;