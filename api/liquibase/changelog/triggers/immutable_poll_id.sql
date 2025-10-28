--liquibase formatted sql

--changeset andras:immutable-looker-studio-reports-id unOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION immutable_poll_id()
    RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.id <> OLD.id THEN
        RAISE EXCEPTION 'id cannot be changed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER immutable_poll_id
    BEFORE UPDATE
    ON api.poll
    FOR EACH ROW
EXECUTE PROCEDURE immutable_poll_id();