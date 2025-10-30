--liquibase formatted sql

--changeset andras:before-poll-insert runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION on_poll_insert()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.title := html_escape(NEW.title);
    NEW.description := html_escape(NEW.description);
    NEW.search_vector := websearch_to_tsquery(concat_ws(' ', NEW.title, NEW.description));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_poll_insert
    BEFORE INSERT
    ON api.poll
    FOR EACH ROW
EXECUTE FUNCTION on_poll_insert();