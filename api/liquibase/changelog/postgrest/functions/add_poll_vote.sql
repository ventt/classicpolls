--liquibase formatted sql

--changeset andras:add-function-vote runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION api.add_poll_vote(
    p_poll_id UUID,
    p_choice BOOLEAN
) RETURNS VOID AS
$$
INSERT INTO api.vote (poll_id, choice)
VALUES (p_poll_id, p_choice)
ON CONFLICT (user_sub, poll_id)
    DO UPDATE SET choice = p_choice;
$$
    LANGUAGE sql SECURITY DEFINER;
