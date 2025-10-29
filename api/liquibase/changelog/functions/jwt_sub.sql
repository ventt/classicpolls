--liquibase formatted sql

--changeset andras:add-function-jwt_sub runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION jwt_sub() RETURNS BIGINT AS
$$
BEGIN
    RETURN CAST(current_setting('request.jwt.claims', true)::json ->> 'sub' AS BIGINT);
END;
$$ LANGUAGE plpgsql;