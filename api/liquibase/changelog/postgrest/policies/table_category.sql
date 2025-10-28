--liquibase formatted sql

--changeset andras:select-policy-category-table runOnChange:true
GRANT SELECT ON TABLE api.category TO web_user;
GRANT SELECT ON TABLE api.category TO web_anon;
