--liquibase formatted sql

--changeset andras:add-function-update_user runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION api.update_user()
    RETURNS VOID AS
$$
DECLARE
    jwt_sub   BIGINT := CAST(current_setting('request.jwt.claims', true)::json ->> 'sub' AS BIGINT);
    jwt_name  TEXT   := current_setting('request.jwt.claims', true)::json ->> 'name';
    jwt_image TEXT   := current_setting('request.jwt.claims', true)::json ->> 'image';
BEGIN
    INSERT INTO api.users (sub, name, image)
    VALUES (jwt_sub, jwt_name, jwt_image)
    ON CONFLICT (sub) DO UPDATE
        SET name  = jwt_name,
            image = jwt_image;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;