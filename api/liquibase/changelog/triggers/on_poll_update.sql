--liquibase formatted sql

--changeset andras:on-poll-update runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION on_poll_update()
    RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.id <> OLD.id THEN
        RAISE EXCEPTION 'id cannot be changed';
    END IF;
    IF NEW.user_sub <> OLD.user_sub THEN
        RAISE EXCEPTION 'user_sub cannot be changed';
    END IF;
    NEW.title := html_escape(NEW.title);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_poll_update
    BEFORE INSERT
    ON api.poll
    FOR EACH ROW
EXECUTE FUNCTION on_poll_update();