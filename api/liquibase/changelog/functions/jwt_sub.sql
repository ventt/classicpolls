--liquibase formatted sql

--changeset andras:add-function-jwt_sub runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION jwt_sub() RETURNS TEXT AS
$$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::json ->> 'sub';
END;
$$ LANGUAGE plpgsql;