--liquibase formatted sql

--changeset andras:on-user-update runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION on_user_update()
    RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.sub <> OLD.sub THEN
        RAISE EXCEPTION 'sub cannot be changed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_user_update
    BEFORE UPDATE
    ON api.users
    FOR EACH ROW
EXECUTE FUNCTION on_user_update();