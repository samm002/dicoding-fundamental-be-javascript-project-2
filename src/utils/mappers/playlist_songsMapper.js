/* eslint-disable camelcase */
const mapPlaylistSongsData = (data) => ({
  playlist: {
    id: data[0].playlistId,
    name: data[0].playlistName,
    username: data[0].userUsername,
    songs: data.map((row) => ({
      id: row.songId,
      title: row.songTitle,
      performer: row.songPerformer,
    })),
  },
});

module.exports = mapPlaylistSongsData;
