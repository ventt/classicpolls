CREATE OR REPLACE PROCEDURE public.merge_polls(original uuid, IN duplicate uuid)
    LANGUAGE sql
AS
$$
INSERT INTO api.vote (user_sub, poll_id, choice, created_at)
SELECT v.user_sub, original, v.choice, v.created_at
FROM api.vote v
WHERE v.poll_id = duplicate
ON CONFLICT (user_sub, poll_id) DO NOTHING;
DELETE
FROM api.poll
WHERE id = duplicate;
$$;