--liquibase formatted sql

--changeset andras:create-polls-list-view runOnChange:true
DROP VIEW IF EXISTS api.poll_details;
CREATE VIEW api.poll_details AS

WITH upvotes_count AS (SELECT pv.poll_id,
                              COUNT(*) AS upvotes
                       FROM api.vote pv
                       WHERE pv.choice = TRUE
                       GROUP BY pv.poll_id),
     downvotes_count AS (SELECT pv.poll_id,
                                COUNT(*) AS downvotes
                         FROM api.vote pv
                         WHERE pv.choice = FALSE
                         GROUP BY pv.poll_id)
SELECT p.id,
       p.title,
       p.description,
       p.category_name,
       COALESCE(uc.upvotes, 0)                                               AS upvotes,
       COALESCE(dc.downvotes, 0)                                             AS downvotes,
       COALESCE(uc.upvotes, 0) + COALESCE(dc.downvotes, 0)                   AS total_votes,
       (COALESCE(uc.upvotes, 0)::DECIMAL / GREATEST(dc.downvotes, 1)::DECIMAL) /
       (COALESCE(uc.upvotes, 0) + COALESCE(dc.downvotes, 0))::DECIMAL        AS upvote_ratio,
       COALESCE(uc.upvotes, 0)::DECIMAL / GREATEST(dc.downvotes, 1)::DECIMAL AS approval_score
FROM api.poll p
         LEFT JOIN upvotes_count uc ON p.id = uc.poll_id
         LEFT JOIN downvotes_count dc ON p.id = dc.poll_id;

GRANT SELECT ON TABLE api.poll_details TO web_anon;
GRANT SELECT ON TABLE api.poll_details TO web_user;
