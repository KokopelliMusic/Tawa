-- 
-- TABLES
-- 
CREATE TABLE public.new_session (
    id character varying NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

    PRIMARY KEY(id)
);

CREATE TABLE public.playlist (
    id bigint GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

    user_id uuid REFERENCES auth.users NOT NULL DEFAULT auth.uid(),

    name text NOT NULL,
    users uuid[],

    PRIMARY KEY(id)
);

CREATE TABLE public.song (
    id bigint GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

    added_by uuid REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
    playlist bigint NOT NULL,

    play_count smallint DEFAULT '0'::smallint NOT NULL,
    platform_id character varying NOT NULL,
    title character varying NOT NULL,
    song_type character varying NOT NULL,
    query_result jsonb NOT NULL,

    artist character varying,
    album character varying,
    length bigint,
    cover character varying,

    PRIMARY KEY(id),
    CONSTRAINT fk_playlist FOREIGN KEY (playlist) REFERENCES public.playlist(id) ON DELETE CASCADE
);

CREATE TABLE public.session (
    id character varying NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

    user_id uuid REFERENCES auth.users NOT NULL DEFAULT auth.uid(),

    playlist bigint NOT NULL,
    currently_playing bigint REFERENCES public.song,

    settings jsonb NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_playlist FOREIGN KEY (playlist) REFERENCES public.playlist(id)
);

CREATE TABLE public.spotify (
    id bigint GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

    user_id uuid REFERENCES auth.users NOT NULL DEFAULT auth.uid(),

    access_token character varying NOT NULL,
    refresh_token character varying NOT NULL,
    expires_at timestamp with time zone NOT NULL,

    PRIMARY KEY(id)
);

CREATE TABLE public.profile (
    id uuid REFERENCES auth.users NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

    username text NOT NULL,
    
    profile_picture text,

    PRIMARY KEY(id)
);


-- 
-- COMMENTS
-- 
COMMENT ON TABLE public.playlist IS 'Table that holds all playlists';
COMMENT ON TABLE public.song IS 'Table that holds all song information';
COMMENT ON TABLE public.session IS 'Table that holds session information';
COMMENT ON TABLE public.new_session IS 'Table that holds information about session that are not instansiated yet, but do have a session code';
COMMENT ON TABLE public.spotify IS 'Table that holds information about spotify sessions, this can only be queried by the owner.';
COMMENT ON TABLE public.profile IS 'Holds all extra information about users';

-- 
-- ROW LEVEL SECURITY 
-- 

ALTER TABLE public.song ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.new_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spotify ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- 
-- POLICIES
-- 

-- PLAYLIST
CREATE POLICY "Anyone can create playlists" ON public.playlist
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can select playlists" ON public.playlist
    FOR SELECT USING ( true );

CREATE POLICY "Users can only delete their own playlists" ON public.playlist 
    FOR DELETE USING ((auth.uid() = user_id));

CREATE POLICY "Any user can edit playlists" ON public.playlist
    FOR UPDATE WITH CHECK (auth.role() = 'authenticated');

-- SESSION
CREATE POLICY "Anyone can create a session" ON public.session
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can update a session" ON public.session
    FOR UPDATE USING (true);

CREATE POLICY "Enable access to everyone" ON public.session 
    FOR SELECT USING (true);


-- NEW SESSION
CREATE POLICY "Anyone can create a new session" ON public.new_session
    FOR INSERT WITH CHECK (true);

-- SONG
CREATE POLICY "Anyone can create a song" ON public.song
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "People can only delete their own songs" ON public.song
    FOR DELETE USING ((auth.uid() = added_by));

CREATE POLICY "Anyone can select a song" ON public.song
    FOR SELECT USING (true);

-- SPOTIFY
CREATE POLICY "Any user can make a new spotify session" ON public.spotify
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can update a spotify session" ON public.spotify
    FOR UPDATE USING ( true );

CREATE POLICY "Only users can select their own spotify sessions" ON public.spotify
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only users can delete their own spotify sessions" ON public.spotify
    FOR DELETE USING (auth.uid() = user_id);

-- PROFILE
CREATE POLICY "Public profiles are viewable by everyone." ON public.profile
  FOR SELECT USING ( true );

CREATE POLICY "Users can insert their own profile." ON public.profile
    FOR INSERT WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile." ON public.profile
  FOR UPDATE USING ( auth.uid() = id );

-- 
-- PL/pgSQL
-- 

-- Check if a user exists
CREATE OR REPLACE FUNCTION user_exists(user_id uuid) RETURNS boolean AS $$
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = user_id);
$$ LANGUAGE SQL;

-- Increment the play count of a song
CREATE OR REPLACE FUNCTION increment_play_count(song_id bigint) RETURNS void AS $$
    BEGIN
        UPDATE public.song
        SET play_count = play_count + 1
        WHERE id = song_id;
    END;
$$ LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reset_playlist(playlist_id bigint) RETURNS void AS $$
    BEGIN
        UPDATE public.song
        SET play_count = 0
        WHERE playlist = playlist_id;
    END;
$$ LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER;

-- Add user to the playlist as someone who has added the song
CREATE OR REPLACE FUNCTION add_user_to_playlist(playlist_id bigint, uid uuid) RETURNS void AS $$
    BEGIN
        UPDATE public.playlist
        SET users = array_append(users, uid)
        WHERE id = playlist_id
        AND uid != ANY(users);
    END;
$$ LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER;

CREATE OR REPLACE FUNCTION claim_session(session_id character varying, user_id uuid, playlist_id bigint, settings jsonb) RETURNS void AS $$ 
    DECLARE
        new_ses boolean;
    BEGIN
        SELECT EXISTS(
            SELECT 1 FROM public.new_session
            WHERE id = session_id)
        INTO new_ses;
        
        IF NOT new_ses THEN
            RAISE EXCEPTION 'Session does not exist';
        END IF;

        INSERT INTO public.session(id, user_id, playlist, settings)
        VALUES (session_id, user_id, playlist_id, settings);

        DELETE FROM public.new_session
        WHERE id = session_id;
    END;
$$ LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER;

CREATE OR REPLACE FUNCTION new_session() RETURNS character varying as $$
    DECLARE
        session_id character varying;
    BEGIN
        LOOP
            session_id = random_string(4);
            EXIT WHEN NOT EXISTS (SELECT id FROM public.new_session WHERE id = session_id);
        END LOOP;
        
        INSERT INTO public.new_session(id)
        VALUES (session_id);


        RETURN session_id;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_string(length integer) RETURNS character varying AS $$
    DECLARE
        r character varying;
    BEGIN
        r = array_to_string(array(select substr('ABCDEFGHKNPRSTUVXYZ',((random()*(19-1)+1)::integer),1) from generate_series(1,length)),'');
        RETURN r;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_spotify_token(token character varying, uid uuid, expire_date timestamp with time zone) RETURNS void AS $$
    BEGIN
        UPDATE public.spotify
        SET access_token = token, expires_at = expire_date
        WHERE user_id = uid;
    END;
$$ LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER;