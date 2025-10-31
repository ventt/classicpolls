--liquibase formatted sql

--changeset andras:enable-row-level-security-vote-table runOnChange:true
ALTER TABLE api.poll
    ENABLE ROW LEVEL SECURITY;

--changeset andras:select-policy-poll-table runOnChange:true
GRANT SELECT ON TABLE api.poll TO web_anon;
DROP POLICY IF EXISTS public_select_policy ON api.poll;
CREATE POLICY public_select_policy ON api.poll FOR SELECT TO web_anon
    USING (true);

GRANT SELECT ON TABLE api.poll TO web_user;
DROP POLICY IF EXISTS user_select_policy ON api.poll;
CREATE POLICY user_select_policy ON api.poll FOR SELECT TO web_user
    USING (true);


--changeset andras:insert-policy-poll-table runOnChange:true
GRANT INSERT (title, category_name, description) ON TABLE api.poll TO web_user;
DROP POLICY IF EXISTS user_insert_policy ON api.poll;
CREATE POLICY user_insert_policy ON api.poll FOR INSERT TO web_user
    WITH CHECK (user_sub = jwt_sub() AND LENGTH(description) <= 2000 AND LENGTH(title) >= 10);

--changeset andras:delete-policy-poll-table runOnChange:true
GRANT DELETE ON TABLE api.poll TO web_user;
DROP POLICY IF EXISTS owner_delete_policy ON api.poll;
CREATE POLICY owner_delete_policy ON api.poll FOR DELETE TO web_user
    USING (user_sub = jwt_sub());
