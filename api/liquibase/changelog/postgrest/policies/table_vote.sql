--liquibase formatted sql

--changeset andras:enable-row-level-security-vote-table runOnChange:true
ALTER TABLE api.vote
    ENABLE ROW LEVEL SECURITY;

--changeset andras:select-policy-vote-table runOnChange:true
GRANT SELECT ON TABLE api.vote TO web_anon;
DROP POLICY IF EXISTS public_select_policy ON api.vote;
CREATE POLICY public_select_policy ON api.vote FOR SELECT TO web_anon USING (true);

GRANT SELECT ON TABLE api.vote TO web_user;
DROP POLICY IF EXISTS user_select_policy ON api.vote;
CREATE POLICY user_select_policy ON api.vote FOR SELECT TO web_user USING (true);

--changeset andras:insert-policy-vote-table runOnChange:true
GRANT INSERT (poll_id, choice) ON TABLE api.vote TO web_user;
DROP POLICY IF EXISTS owner_insert_policy ON api.vote;
CREATE POLICY owner_insert_policy ON api.vote FOR INSERT TO web_user
    WITH CHECK (user_sub = jwt_sub());

--changeset andras:update-policy-vote-table runOnChange:true
GRANT UPDATE (choice) ON TABLE api.vote TO web_user;
DROP POLICY IF EXISTS owner_update_policy ON api.vote;
CREATE POLICY owner_update_policy ON api.vote FOR UPDATE TO web_user
    USING (user_sub = jwt_sub())
    WITH CHECK (user_sub = jwt_sub());

--changeset andras:delete-policy-vote-table runOnChange:true
GRANT DELETE ON TABLE api.vote TO web_user;
DROP POLICY IF EXISTS owner_delete_policy ON api.vote;
CREATE POLICY owner_delete_policy ON api.vote FOR DELETE TO web_user
    USING (user_sub = jwt_sub());


