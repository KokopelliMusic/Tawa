package com.nierot.tawa;

import com.nierot.tawa.entity.Playlist;
import com.nierot.tawa.entity.Song;
import com.nierot.tawa.repository.PlaylistRepository;
import com.nierot.tawa.repository.SongRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Properties;

@SpringBootApplication
public class TawaApplication {

	private static final Logger log = LoggerFactory.getLogger(TawaApplication.class);

	public static Properties properties = new Properties();

	private void loadProperties() {
	}

	public static void main(String[] args) {
//		properties.load(new );
		SpringApplication.run(TawaApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(SongRepository repo) {
		return (args) -> {
			Song song = new Song("Rick Astley - Never Gonna Give You Up (Official Music Video)", "dQw4w9WgXcQ", Song.SongType.YouTube, "Niels");
			repo.save(song);
			log.info("----findAll() on SongRepository----");
			repo.findAll().forEach(s -> {
				log.info(s.toString());
			});
			log.info("----");
		};
	}

}
