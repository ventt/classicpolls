--liquibase formatted sql

--changeset andras:add-html-escape runOnChange:true splitStatements:false
CREATE OR REPLACE FUNCTION html_escape(text)
    RETURNS text AS
$$
SELECT replace(
               replace(
                       replace(
                               replace(
                                       replace($1, '&', '&amp;'),
                                       '<', '&lt;'),
                               '>', '&gt;'),
                       '"', '&quot;'),
               '''', '&#39;');
$$ LANGUAGE sql IMMUTABLE;
