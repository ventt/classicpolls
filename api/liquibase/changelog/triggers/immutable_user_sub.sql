--liquibase formatted sql

--changeset andras:immutable-user-sub unOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION immutable_user_sub()
    RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.sub <> OLD.sub THEN
        RAISE EXCEPTION 'sub cannot be changed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER immutable_user_sub
    BEFORE UPDATE
    ON api.users
    FOR EACH ROW
EXECUTE PROCEDURE immutable_user_sub();