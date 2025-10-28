--liquibase formatted sql

--changeset andras:add-function-update_user runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION api.update_user()
    RETURNS VOID AS
$$
DECLARE
    jwt_sub  TEXT := current_setting('request.jwt.claims', true)::json ->> 'sub';
    jwt_name TEXT := current_setting('request.jwt.claims', true)::json ->> 'name';
BEGIN
    INSERT INTO api.users (sub, name)
    VALUES (jwt_sub, jwt_name)
    ON CONFLICT (sub) DO UPDATE
        SET name = jwt_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;